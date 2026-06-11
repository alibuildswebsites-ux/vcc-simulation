// Mock data for initial rendering
export const mockInitialState = {
  timestamp: Date.now() / 1000,
  running: false,
  current_users: 0,
  active_count: 0,
  pending_count: 0,
  warm_count: 2,
  total_servers: 2,
  load_history: [],
  prediction: [],
  pattern: 'diurnal',
  cold_start: {
    total_cold_starts: 0,
    avg_delay_ticks: 0.0,
    current_ewma_delay: 5.0,
    warm_pool_size: 2,
    adaptive_horizon: 8
  },
  scaling_decision: {
    action: 'none',
    count: 0
  },
  config: {
    tick_interval: 1.0,
    users_per_server: 100,
    max_servers: 50,
    min_servers: 1,
    warm_pool_size: 2,
    cold_start_base_delay: 5,
    scale_up_threshold: 0.7,
    scale_down_threshold: 0.3,
    predictor_type: 'moving_average',
    cooldown_ticks: 2,
    pattern: 'diurnal'
  },
  thrash: {
    is_thrashing: false,
    stabilization_mode: false,
    reversal_count: 0,
    window_size: 0
  },
  edos: {
    alert: false,
    scaling_frequency: 0.0,
    confidence: 0.0
  },
  system_metrics: {
    cpu_percent: 0.0,
    latency_ms: 0.0,
    queue_depth: 0
  },
  prediction_confidence: {
    avg_error: 0.0,
    needs_retrain: false
  },
  decision_factors: {
    user_util: 0.0,
    cpu_signal: 0.0,
    latency_signal: 0.0,
    queue_signal: 0.0,
    composite: 0.0
  }
};

export default mockInitialState;