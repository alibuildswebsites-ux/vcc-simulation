import { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationState, SimulationConfig, HealthResponse } from '../types/api';
import { useWebSocket } from './useWebSocket';

const API_BASE = '/api';
const disableWs = import.meta.env.VITE_DISABLE_WS === 'true';
const WS_URL = disableWs ? '' : `ws://${window.location.hostname}:8001/ws`;

export function useSimulation() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Health check failed:', err);
    }
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error('State fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchState();
    const hInterval = setInterval(fetchHealth, 5000);

    if (disableWs) {
      pollRef.current = setInterval(fetchState, 1000);
    }

    return () => {
      clearInterval(hInterval);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchHealth, fetchState]);

  const handleWsMessage = useCallback((wsState: SimulationState) => {
    setState(wsState);
  }, []);

  useWebSocket({
    url: WS_URL,
    onMessage: handleWsMessage,
  });

  const start = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/start`, { method: 'POST' });
      fetchState();
    } catch (err) {
      console.error('Start failed:', err);
    }
  }, [fetchState]);

  const stop = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/stop`, { method: 'POST' });
      fetchState();
    } catch (err) {
      console.error('Stop failed:', err);
    }
  }, [fetchState]);

  const updateConfig = useCallback(async (config: Partial<SimulationConfig>) => {
    try {
      const currentConfig = state?.config || {
        tick_interval: 1.0,
        users_per_server: 100,
        max_servers: 50,
        min_servers: 1,
        warm_pool_size: 2,
        cold_start_base_delay: 5,
        scale_up_threshold: 0.7,
        scale_down_threshold: 0.3,
        predictor_type: 'moving_average' as const,
        cooldown_ticks: 2,
        pattern: 'diurnal' as const,
      };

      const newConfig = { ...currentConfig, ...config };
      await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      fetchState();
    } catch (err) {
      console.error('Config update failed:', err);
    }
  }, [state?.config, fetchState]);

  return {
    state,
    health,
    loading,
    start,
    stop,
    updateConfig,
    refetch: fetchState,
  };
}
