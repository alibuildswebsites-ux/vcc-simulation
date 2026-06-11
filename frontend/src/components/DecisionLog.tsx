import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { SimulationState } from '../types/api';

interface DecisionLogProps {
  state: SimulationState | null;
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ state }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">Recent Scaling Decisions</h3>
        <div className="flex items-center gap-2 text-xs text-[#525252]">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-[#525252]" strokeWidth={1.5} />
            <span className="ml-1">ML-informed</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
        <div className="space-y-3">
          {/* Latest decision */}
          {state && state.scaling_decision && state.scaling_decision.action !== 'none' && (
            <div className="flex items-start gap-3 mb-3 p-3 bg-[#111111] border border-[#222222] rounded-lg">
              <div className="flex-shrink-0">
                {state.scaling_decision.action === 'scale_up' ? (
                  <TrendingUp className="h-4 w-4 text-[#e7000b]" strokeWidth={2} />
                ) : (
                  <TrendingDown className="h-4 w-4 text-white" strokeWidth={2} />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-white mb-1">
                  {state.scaling_decision.action === 'scale_up' ? 'SCALE UP' : 'SCALE DOWN'}
                </p>
                <p className="text-sm text-white">
                  {Math.abs(state.scaling_decision.count)} server{Math.abs(state.scaling_decision.count) !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-[#737373] mt-1">
                  at {new Date(state.timestamp * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}

          {/* Decision factors breakdown */}
          <div className="border-t border-[#1e1e1e] pt-3">
            <p className="text-xs font-medium text-[#737373] mb-2">Contributing Factors</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span>User Load:</span>
                <span className="font-mono">{state?.decision_factors?.user_util?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CPU Signal:</span>
                <span className="font-mono">{state?.decision_factors?.cpu_signal?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latency Signal:</span>
                <span className="font-mono">{state?.decision_factors?.latency_signal?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Queue Signal:</span>
                <span className="font-mono">{state?.decision_factors?.queue_signal?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Composite Score:</span>
                <span className="font-mono">{state?.decision_factors?.composite?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Threshold:</span>
                <span className="font-mono">0.70</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thrash detection status */}
      {state?.thrash?.is_thrashing && (
        <div className="bg-[#e7000b]/20 border border-[#e7000b]/40 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Activity className="h-4 w-4 text-[#e7000b]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#e7000b] mb-1">
                Scaling Thrash Detected
              </p>
              <p className="text-xs text-[#e7000b]">
                Entering stabilization mode • Reversals: {state.thrash.reversal_count}/{state.thrash.window_size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};