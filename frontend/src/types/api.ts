export interface ScalingDecision {
  action: 'scale_up' | 'scale_down' | 'none';
  count: number;
}

export interface ColdStartMetrics {
  total_cold_starts: number;
  avg_delay_ticks: number;
  current_ewma_delay: number;
  warm_pool_size: number;
  adaptive_horizon: number;
}

export interface ThrashState {
  is_thrashing: boolean;
  stabilization_mode: boolean;
  reversal_count: number;
  window_size: number;
}

export interface EDOSState {
  alert: boolean;
  scaling_frequency: number;
  confidence: number;
}

export interface SystemMetrics {
  cpu_percent: number;
  latency_ms: number;
  queue_depth: number;
}

export interface PredictionConfidence {
  avg_error: number;
  needs_retrain: boolean;
}

export interface DecisionFactors {
  user_util: number;
  cpu_signal: number;
  latency_signal: number;
  queue_signal: number;
  composite: number;
}

export interface SimulationConfig {
  tick_interval: number;
  users_per_server: number;
  max_servers: number;
  min_servers: number;
  warm_pool_size: number;
  cold_start_base_delay: number;
  scale_up_threshold: number;
  scale_down_threshold: number;
  predictor_type: 'moving_average' | 'arima' | 'lstm';
  cooldown_ticks: number;
  pattern: LoadPattern;
}

export type LoadPattern = 
  | 'flat' 
  | 'step' 
  | 'spike' 
  | 'diurnal' 
  | 'random_walk' 
  | 'chaotic' 
  | 'edos';

export interface SimulationState {
  timestamp: number;
  running: boolean;
  current_users: number;
  active_count: number;
  pending_count: number;
  warm_count: number;
  total_servers: number;
  load_history: [number, number][];
  prediction: number[];
  pattern: LoadPattern;
  cold_start: ColdStartMetrics;
  scaling_decision: ScalingDecision;
  config: SimulationConfig;
  thrash: ThrashState;
  edos: EDOSState;
  system_metrics: SystemMetrics;
  prediction_confidence: PredictionConfidence;
  decision_factors: DecisionFactors;
}

export interface HealthResponse {
  status: string;
  simulation_running: boolean;
  uptime_ticks: number;
  version: string;
}