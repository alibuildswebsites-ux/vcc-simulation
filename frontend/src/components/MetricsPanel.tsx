import { Activity } from 'lucide-react';
import { SimulationState } from '../types/api';

export const MetricsPanel = ({ state }: { state: SimulationState | null }) => {
  const metrics = [
    { label: 'CPU', value: `${(state?.system_metrics.cpu_percent ?? 0).toFixed(1)}%` },
    { label: 'Latency', value: `${(state?.system_metrics.latency_ms ?? 0).toFixed(0)}ms` },
    { label: 'Queue', value: String(state?.system_metrics.queue_depth ?? 0) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">System Metrics</h3>
          <p className="text-xs text-[#525252] mt-0.5">CPU, latency, queue pressure</p>
        </div>
        <Activity className="h-4 w-4 text-[#737373]" strokeWidth={1.5} />
      </div>
      <div className="grid gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-3">
            <div className="text-[10px] uppercase tracking-wider text-[#525252]">{metric.label}</div>
            <div className="stat-number text-xl font-bold text-white mt-1">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsPanel;
