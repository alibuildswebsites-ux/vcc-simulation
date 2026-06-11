import logging
from models import ScalingDecision, DecisionFactors, SystemMetrics, PredictionConfidence

logger = logging.getLogger("vcc.decision")


class DecisionEngine:
    def __init__(self, scale_up_threshold=0.7, scale_down_threshold=0.3, cooldown_ticks=2):
        self.scale_up_threshold = scale_up_threshold
        self.scale_down_threshold = scale_down_threshold
        self.base_cooldown = cooldown_ticks
        self.effective_cooldown = cooldown_ticks
        self.ticks_since_decision = 0
        self.prediction_errors = []
        self.avg_prediction_error = 0.0
        self.last_factors = DecisionFactors()

    def set_cooldown(self, multiplier: int):
        self.effective_cooldown = self.base_cooldown * multiplier

    def record_prediction_accuracy(self, predicted: list[float], actual: int):
        if predicted:
            avg_pred = sum(predicted) / len(predicted)
            error = abs(avg_pred - actual) / max(actual, 1)
            self.prediction_errors.append(error)
            if len(self.prediction_errors) > 20:
                self.prediction_errors.pop(0)
            self.avg_prediction_error = sum(self.prediction_errors) / len(self.prediction_errors)

    def get_prediction_confidence(self) -> PredictionConfidence:
        return PredictionConfidence(
            avg_error=round(self.avg_prediction_error, 4),
            needs_retrain=self.avg_prediction_error > 0.3,
        )

    def get_last_factors(self) -> DecisionFactors:
        return self.last_factors

    def evaluate(self, current_users, active_servers, pending_servers, warm_servers,
                 predictions, metrics: SystemMetrics = None,
                 users_per_server=100, adaptive_horizon=5) -> ScalingDecision:
        self.ticks_since_decision += 1

        if self.ticks_since_decision < self.effective_cooldown:
            return ScalingDecision(action="none")

        total_available = active_servers + pending_servers
        current_capacity = max(1, active_servers) * users_per_server
        total_capacity = max(1, total_available) * users_per_server

        user_util = current_users / current_capacity

        if metrics:
            cpu_signal = metrics.cpu_percent / 100.0
            latency_signal = min(1.0, metrics.latency_ms / 500.0)
            queue_signal = min(1.0, metrics.queue_depth / max(1, users_per_server * 2))
        else:
            cpu_signal = user_util
            latency_signal = 0.0
            queue_signal = 0.0

        composite = (
            0.30 * user_util +
            0.30 * cpu_signal +
            0.25 * latency_signal +
            0.15 * queue_signal
        )

        predicted_max = max(predictions) if predictions else current_users
        predicted_util = predicted_max / total_capacity if total_capacity > 0 else 1.0

        self.last_factors = DecisionFactors(
            user_util=round(user_util, 3),
            cpu_signal=round(cpu_signal, 3),
            latency_signal=round(latency_signal, 3),
            queue_signal=round(queue_signal, 3),
            composite=round(composite, 3),
        )

        if composite > self.scale_up_threshold or predicted_util > self.scale_up_threshold:
            target_users = max(current_users, predicted_max)
            needed_servers = max(1, target_users // users_per_server + 1)
            deficit = needed_servers - total_available
            if deficit > 0:
                self.ticks_since_decision = 0
                return ScalingDecision(action="scale_up", count=deficit)

        if composite < self.scale_down_threshold and active_servers > 1:
            needed = max(1, current_users // users_per_server)
            if predictions:
                needed = max(needed, int(max(predictions) // users_per_server) + 1)
            excess = active_servers - needed
            if excess > 0:
                self.ticks_since_decision = 0
                return ScalingDecision(action="scale_down", count=excess)

        return ScalingDecision(action="none")
