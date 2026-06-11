import { Timer } from 'lucide-react';
import { SimulationState } from '../types/api';

export const ColdStartTimeline = ({ state }: { state: SimulationState | null }) => {
  const metrics = state?.cold_start;
  const progress = Math.min(100, ((metrics?.avg_delay_ticks ?? 0) / Math.max(1, metrics?.adaptive_horizon ?? 1)) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Cold Start Control</h3>
          <p className="text-xs text-[#525252] mt-0.5">Adaptive horizon and warm pool</p>
        </div>
        <Timer className="h-4 w-4 text-[#737373]" strokeWidth={1.5} />
      </div>
      <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
        <div className="h-2 rounded-full bg-[#1e1e1e] overflow-hidden">
          <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <Metric label="Cold starts" value={metrics?.total_cold_starts ?? 0} />
          <Metric label="EWMA delay" value={`${(metrics?.current_ewma_delay ?? 0).toFixed(1)}t`} />
          <Metric label="Avg delay" value={`${(metrics?.avg_delay_ticks ?? 0).toFixed(1)}t`} />
          <Metric label="Horizon" value={`${metrics?.adaptive_horizon ?? 0}t`} />
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2">
    <div className="text-[10px] uppercase tracking-wider text-[#525252]">{label}</div>
    <div className="stat-number text-base font-bold text-white mt-1">{value}</div>
  </div>
);

export default ColdStartTimeline;
