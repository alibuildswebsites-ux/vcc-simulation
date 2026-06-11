import { Activity } from 'lucide-react';
import { SimulationState } from '../types/api';

export const ThrashAlert = ({ state }: { state: SimulationState | null }) => {
  if (!state?.thrash.is_thrashing) return null;

  return (
    <div className="rounded-xl border border-yellow-400/35 bg-yellow-400/10 p-4">
      <div className="flex gap-3">
        <Activity className="h-5 w-5 text-yellow-400 flex-shrink-0" strokeWidth={1.8} />
        <div>
          <h3 className="text-sm font-semibold text-yellow-400">Scaling Thrash Detected</h3>
          <p className="text-xs text-yellow-200/80 mt-1 leading-relaxed">
            {state.thrash.reversal_count} reversals observed across {state.thrash.window_size} recent actions. Stabilization mode is {state.thrash.stabilization_mode ? 'active' : 'warming'}.
          </p>
        </div>
      </div>
    </div>
  );
};
