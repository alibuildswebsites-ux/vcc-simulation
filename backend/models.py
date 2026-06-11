from pydantic import BaseModel
from typing import Literal
from enum import Enum


class LoadPattern(str, Enum):
    FLAT = "flat"
    STEP = "step"
    SPIKE = "spike"
    DIURNAL = "diurnal"
    RANDOM_WALK = "random_walk"
    CHAOTIC = "chaotic"
    EDOS = "edos"


class PredictorType(str, Enum):
    MOVING_AVERAGE = "moving_average"
    ARIMA = "arima"
    LSTM = "lstm"


class SimulationConfig(BaseModel):
    tick_interval: float = 1.0
    users_per_server: int = 100
    max_servers: int = 50
    min_servers: int = 1
    warm_pool_size: int = 2
    cold_start_base_delay: int = 5
    scale_up_threshold: float = 0.7
    scale_down_threshold: float = 0.3
    predictor_type: PredictorType = PredictorType.MOVING_AVERAGE
    cooldown_ticks: int = 2
    pattern: LoadPattern = LoadPattern.DIURNAL


class ScalingDecision(BaseModel):
    action: Literal["scale_up", "scale_down", "none"] = "none"
    count: int = 0


class ColdStartMetrics(BaseModel):
    total_cold_starts: int = 0
    avg_delay_ticks: float = 0.0
    current_ewma_delay: float = 0.0
    warm_pool_size: int = 0
    adaptive_horizon: int = 5


class ThrashState(BaseModel):
    is_thrashing: bool = False
    stabilization_mode: bool = False
    reversal_count: int = 0
    window_size: int = 0


class EDOSState(BaseModel):
    alert: bool = False
    scaling_frequency: float = 0.0
    confidence: float = 0.0


class SystemMetrics(BaseModel):
    cpu_percent: float = 0.0
    latency_ms: float = 0.0
    queue_depth: int = 0


class PredictionConfidence(BaseModel):
    avg_error: float = 0.0
    needs_retrain: bool = False


class DecisionFactors(BaseModel):
    user_util: float = 0.0
    cpu_signal: float = 0.0
    latency_signal: float = 0.0
    queue_signal: float = 0.0
    composite: float = 0.0


class SimulationState(BaseModel):
    timestamp: float = 0.0
    running: bool = False
    current_users: int = 0
    active_count: int = 0
    pending_count: int = 0
    warm_count: int = 0
    total_servers: int = 0
    load_history: list = []
    prediction: list[float] = []
    pattern: LoadPattern = LoadPattern.DIURNAL
    cold_start: ColdStartMetrics = ColdStartMetrics()
    scaling_decision: ScalingDecision = ScalingDecision()
    config: SimulationConfig = SimulationConfig()
    thrash: ThrashState = ThrashState()
    edos: EDOSState = EDOSState()
    system_metrics: SystemMetrics = SystemMetrics()
    prediction_confidence: PredictionConfidence = PredictionConfidence()
    decision_factors: DecisionFactors = DecisionFactors()
