import { BrainCircuit } from 'lucide-react';
import { SimulationState } from '../types/api';

export const PredictionConfidence = ({ state }: { state: SimulationState | null }) => {
  const error = state?.prediction_confidence.avg_error ?? 0;
  const accuracy = Math.max(0, 1 - error) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Prediction Health</h3>
          <p className="text-xs text-[#525252] mt-0.5">Rolling forecast quality</p>
        </div>
        <BrainCircuit className="h-4 w-4 text-[#737373]" strokeWidth={1.5} />
      </div>
      <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
        <div className="stat-number text-3xl font-bold text-white">{accuracy.toFixed(1)}%</div>
        <div className="text-xs text-[#737373] mt-1">Average error {error.toFixed(3)}</div>
        <div className={`badge mt-4 ${state?.prediction_confidence.needs_retrain ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' : 'text-green-400 bg-green-400/10 border-green-400/25'}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {state?.prediction_confidence.needs_retrain ? 'Retrain advised' : 'Model stable'}
        </div>
      </div>
    </div>
  );
};
