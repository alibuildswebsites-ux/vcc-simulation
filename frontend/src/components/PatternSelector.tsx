import { SimulationState, LoadPattern } from '../types/api';

const patterns: Array<{ id: LoadPattern; label: string; description: string }> = [
  { id: 'diurnal', label: 'Diurnal', description: 'Day-night rhythm with noise' },
  { id: 'step', label: 'Step', description: 'Sudden demand changes' },
  { id: 'spike', label: 'Spike', description: 'Short high-traffic bursts' },
  { id: 'random_walk', label: 'Random Walk', description: 'Unpredictable drift' },
  { id: 'chaotic', label: 'Chaotic', description: 'Mixed complex load' },
  { id: 'edos', label: 'EDoS', description: 'Adversarial boundary traffic' },
  { id: 'flat', label: 'Flat', description: 'Stable baseline load' },
];

export const PatternSelector = ({ state, onUpdateConfig }: { state: SimulationState | null; onUpdateConfig: (config: { pattern: LoadPattern }) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {patterns.map((pattern) => {
        const active = state?.pattern === pattern.id;
        return (
          <button
            key={pattern.id}
            onClick={() => onUpdateConfig({ pattern: pattern.id })}
            className={`text-left rounded-xl border p-4 transition-all duration-200 active:scale-[0.98] ${active ? 'border-white/30 bg-white/10 text-white' : 'border-[#1e1e1e] bg-[#0f0f0f] text-[#a1a1a1] hover:border-[#2a2a2a] hover:text-white'}`}
          >
            <div className="text-sm font-semibold">{pattern.label}</div>
            <div className="text-xs text-[#525252] mt-1">{pattern.description}</div>
          </button>
        );
      })}
    </div>
  );
};

export default PatternSelector;
