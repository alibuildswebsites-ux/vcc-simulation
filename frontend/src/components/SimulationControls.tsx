import { Play, Square } from 'lucide-react';
import { SimulationState } from '../types/api';

export const SimulationControls = ({ state, onStart, onStop }: { state: SimulationState | null; onStart: () => void; onStop: () => void }) => {
  const running = !!state?.running;

  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Simulation Control</h3>
          <p className="text-xs text-[#525252] mt-0.5">{running ? 'Running' : 'Stopped'} · {state?.current_users ?? 0} users</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onStart} disabled={running} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-30 active:scale-[0.98]">
            <Play className="inline h-3.5 w-3.5 mr-1" /> Start
          </button>
          <button onClick={onStop} disabled={!running} className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-semibold text-[#a1a1a1] disabled:opacity-30 active:scale-[0.98]">
            <Square className="inline h-3.5 w-3.5 mr-1" /> Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
