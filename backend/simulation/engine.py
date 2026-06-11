import asyncio
import time
import logging

from models import (
    SimulationConfig, SimulationState, ColdStartMetrics,
    LoadPattern, PredictorType,
)
from simulation.load_generator import LoadGenerator
from ml.base import BasePredictor
from ml.moving_average import MovingAveragePredictor
from ml.arima_predictor import ARIMAPredictor
from ml.lstm_predictor import LSTMPredictor
from scaler.cold_start import ColdStartManager
from scaler.decision_engine import DecisionEngine
from scaler.thrash_detector import ThrashDetector
from scaler.edos_detector import EDOSDetector
from metrics.collector import MetricsCollector

logger = logging.getLogger("vcc.engine")


class SimulationEngine:
    def __init__(self):
        self.config = SimulationConfig()
        self.state = SimulationState(config=self.config)
        self.load_gen = LoadGenerator()
        self.cold_start = ColdStartManager(
            base_delay=self.config.cold_start_base_delay,
            warm_pool_target=self.config.warm_pool_size,
        )
        self.decision_engine = DecisionEngine(
            scale_up_threshold=self.config.scale_up_threshold,
            scale_down_threshold=self.config.scale_down_threshold,
            cooldown_ticks=self.config.cooldown_ticks,
        )
        self.predictor: BasePredictor = self._create_predictor()
        self.thrash_detector = ThrashDetector()
        self.edos_detector = EDOSDetector()
        self.metrics_collector = MetricsCollector()
        self.running = False
        self._task = None
        self.listeners = []

    def _create_predictor(self) -> BasePredictor:
        t = self.config.predictor_type
        if t == PredictorType.ARIMA:
            return ARIMAPredictor()
        elif t == PredictorType.LSTM:
            return LSTMPredictor()
        return MovingAveragePredictor(window=10)

    def add_listener(self, callback):
        self.listeners.append(callback)

    def remove_listener(self, callback):
        if callback in self.listeners:
            self.listeners.remove(callback)

    async def _notify_listeners(self):
        for cb in self.listeners:
            try:
                await cb(self.state)
            except Exception:
                pass

    async def start(self):
        if self.running:
            return
        self.running = True
        self.state.running = True
        self._task = asyncio.create_task(self._run())
        logger.info("Simulation started")

    async def stop(self):
        self.running = False
        self.state.running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None
        logger.info("Simulation stopped")

    def update_config(self, config: SimulationConfig):
        current_type = PredictorType.MOVING_AVERAGE
        if isinstance(self.predictor, ARIMAPredictor):
            current_type = PredictorType.ARIMA
        elif isinstance(self.predictor, LSTMPredictor):
            current_type = PredictorType.LSTM

        self.config = config
        self.load_gen.set_pattern(config.pattern.value)
        self.cold_start.base_delay = config.cold_start_base_delay
        self.cold_start.warm_pool_target = config.warm_pool_size
        self.decision_engine.scale_up_threshold = config.scale_up_threshold
        self.decision_engine.scale_down_threshold = config.scale_down_threshold
        self.decision_engine.base_cooldown = config.cooldown_ticks

        if current_type != config.predictor_type:
            self.predictor = self._create_predictor()
            logger.info("Switched predictor", extra={"type": config.predictor_type.value})

        self.state.config = config
        self.state.pattern = config.pattern

    def _predict(self, history: list[float]) -> list[float]:
        if len(history) >= 10:
            try:
                predictions = self.predictor.predict(history, horizon=5)
                return [float(v) for v in predictions]
            except Exception as e:
                logger.warning("Prediction failed", extra={"error": str(e)})
        return []

    def _update_state(self):
        self.state.active_count = len(self.cold_start.active_servers)
        self.state.pending_count = len(self.cold_start.pending)
        self.state.warm_count = len(self.cold_start.warm_pool)
        self.state.total_servers = (
            self.state.active_count + self.state.pending_count + self.state.warm_count
        )
        self.state.cold_start = self.cold_start.get_metrics()
        self.state.pattern = self.config.pattern
        self.state.timestamp = time.time()
        self.state.thrash = self.thrash_detector.get_state()
        self.state.edos = self.edos_detector.check()
        self.state.system_metrics = self.metrics_collector.get_state()
        self.state.prediction_confidence = self.decision_engine.get_prediction_confidence()
        self.state.decision_factors = self.decision_engine.get_last_factors()

    async def _run(self):
        logger.info("Simulation loop started",
                    extra={"pattern": self.config.pattern.value, "predictor": self.config.predictor_type.value})

        while self.running:
            tick_start = time.time()

            users = self.load_gen.get_load()
            self.state.current_users = users

            self.state.load_history.append([time.time() * 1000, users])
            if len(self.state.load_history) > 200:
                self.state.load_history = self.state.load_history[-200:]

            self.metrics_collector.update(
                users, len(self.cold_start.active_servers), self.config.users_per_server
            )

            history = [float(h[1]) for h in self.state.load_history[-50:]]
            predictions = self._predict(history)
            self.state.prediction = predictions

            self.decision_engine.record_prediction_accuracy(predictions, users)

            horizon = self.cold_start.get_adaptive_horizon()

            decision = self.decision_engine.evaluate(
                current_users=users,
                active_servers=len(self.cold_start.active_servers),
                pending_servers=len(self.cold_start.pending),
                warm_servers=len(self.cold_start.warm_pool),
                predictions=predictions,
                metrics=self.metrics_collector.get_state(),
                users_per_server=self.config.users_per_server,
                adaptive_horizon=horizon,
            )
            self.state.scaling_decision = decision

            self.thrash_detector.record_decision(decision)
            cooldown_mult = self.thrash_detector.get_cooldown_multiplier(decision.action)
            self.decision_engine.set_cooldown(cooldown_mult)
            self.thrash_detector.tick()

            self.edos_detector.record_decision(decision)

            if decision.action == "scale_up":
                for _ in range(decision.count):
                    self.cold_start.scale_up()
            elif decision.action == "scale_down":
                self.cold_start.scale_down(decision.count)

            self.cold_start.tick()

            pred_conf = self.decision_engine.get_prediction_confidence()
            self.cold_start.adjust_warm_pool_target(pred_conf.avg_error)

            self._update_state()
            await self._notify_listeners()

            elapsed = time.time() - tick_start
            await asyncio.sleep(max(0, self.config.tick_interval - elapsed))
