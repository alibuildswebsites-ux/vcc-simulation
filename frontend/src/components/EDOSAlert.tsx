import { ShieldAlert } from 'lucide-react';
import { SimulationState } from '../types/api';

export const EDOSAlert = ({ state }: { state: SimulationState | null }) => {
  if (!state?.edos.alert) return null;

  return (
    <div className="rounded-xl border border-[#e7000b]/35 bg-[#e7000b]/10 p-4">
      <div className="flex gap-3">
        <ShieldAlert className="h-5 w-5 text-[#e7000b] flex-shrink-0" strokeWidth={1.8} />
        <div>
          <h3 className="text-sm font-semibold text-[#e7000b]">Potential EDoS Attack Detected</h3>
          <p className="text-xs text-[#e7000b]/80 mt-1 leading-relaxed">
            Scaling frequency is {(state.edos.scaling_frequency * 100).toFixed(1)}% with {(state.edos.confidence * 100).toFixed(1)}% confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
