import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { SimulationState } from '../types/api';

interface ServerRackProps {
  state: SimulationState | null;
}

type ServerUnit = { id: string; status: 'active' | 'pending' | 'warm' };

export const ServerRack: React.FC<ServerRackProps> = ({ state }) => {
  const units: ServerUnit[] = [
    ...Array.from({ length: state?.active_count ?? 0 }, (_, i) => ({ id: `active-${i}`, status: 'active' as const })),
    ...Array.from({ length: state?.pending_count ?? 0 }, (_, i) => ({ id: `pending-${i}`, status: 'pending' as const })),
    ...Array.from({ length: state?.warm_count ?? 0 }, (_, i) => ({ id: `warm-${i}`, status: 'warm' as const })),
  ];

  const statusClass = {
    active: 'bg-white border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]',
    pending: 'bg-yellow-400/80 border-yellow-300/40 shadow-[0_0_0_1px_rgba(234,179,8,0.18)]',
    warm: 'bg-[#525252] border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Server Cluster</h3>
          <p className="text-xs text-[#525252] mt-0.5">Active, warming, and pre-warmed capacity</p>
        </div>
        <Cpu className="h-4 w-4 text-[#737373]" strokeWidth={1.5} />
      </div>

      <div className="min-h-56 rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4 overflow-hidden">
        {units.length ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2">
            <AnimatePresence initial={false}>
              {units.slice(0, 60).map((unit) => (
                <motion.div
                  key={unit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.72, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.72, y: -10 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className={`aspect-square rounded-md border ${statusClass[unit.status]}`}
                  title={unit.status}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-[#525252]">No simulated servers yet.</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <Metric label="Active" value={state?.active_count ?? 0} />
        <Metric label="Pending" value={state?.pending_count ?? 0} />
        <Metric label="Warm" value={state?.warm_count ?? 0} />
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2">
    <div className="text-[10px] uppercase tracking-wider text-[#525252]">{label}</div>
    <div className="stat-number text-lg font-bold text-white">{value}</div>
  </div>
);

export default ServerRack;
