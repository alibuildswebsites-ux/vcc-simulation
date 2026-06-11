import { motion } from 'framer-motion';
import { Activity, Settings } from 'lucide-react';
import PatternSelector from '../components/PatternSelector';
import SimulationControls from '../components/SimulationControls';
import { useSimulation } from '../hooks/useSimulation';

export const Simulate = () => {
  const { state, start, stop, updateConfig } = useSimulation();

  return (
    <div className="py-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#222222] bg-[#111111] px-3 py-1 text-xs text-[#737373] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> workload lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">Simulate demand shifts.</h1>
          <p className="text-sm text-[#737373] mt-3 max-w-xl">Change traffic patterns and scaler parameters while the backend streams live state.</p>
        </div>
        <Settings className="hidden sm:block h-6 w-6 text-[#525252]" strokeWidth={1.5} />
      </motion.div>

      <SimulationControls state={state} onStart={start} onStop={stop} />

      <section className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Load Pattern</h2>
            <p className="text-xs text-[#525252]">Current: {state?.pattern ?? 'loading'}</p>
          </div>
        </div>
        <PatternSelector state={state} onUpdateConfig={updateConfig} />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Param label="Users/server" value={state?.config.users_per_server ?? 100} onMinus={() => updateConfig({ users_per_server: Math.max(20, (state?.config.users_per_server ?? 100) - 20) })} onPlus={() => updateConfig({ users_per_server: (state?.config.users_per_server ?? 100) + 20 })} />
        <Param label="Cold start" value={`${state?.config.cold_start_base_delay ?? 5}t`} onMinus={() => updateConfig({ cold_start_base_delay: Math.max(1, (state?.config.cold_start_base_delay ?? 5) - 1) })} onPlus={() => updateConfig({ cold_start_base_delay: (state?.config.cold_start_base_delay ?? 5) + 1 })} />
        <Param label="Warm pool" value={state?.config.warm_pool_size ?? 2} onMinus={() => updateConfig({ warm_pool_size: Math.max(0, (state?.config.warm_pool_size ?? 2) - 1) })} onPlus={() => updateConfig({ warm_pool_size: (state?.config.warm_pool_size ?? 2) + 1 })} />
      </section>
    </div>
  );
};

const Param = ({ label, value, onMinus, onPlus }: { label: string; value: string | number; onMinus: () => void; onPlus: () => void }) => (
  <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent">
    <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-4">
      <div className="text-[10px] uppercase tracking-wider text-[#525252] mb-2">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <button onClick={onMinus} className="h-8 w-8 rounded-lg border border-[#262626] text-[#a1a1a1] hover:text-white hover:border-[#3a3a3a] transition-colors cursor-pointer flex items-center justify-center text-sm">−</button>
        <div className="stat-number text-xl font-bold text-white tabular-nums">{value}</div>
        <button onClick={onPlus} className="h-8 w-8 rounded-lg border border-[#262626] text-[#a1a1a1] hover:text-white hover:border-[#3a3a3a] transition-colors cursor-pointer flex items-center justify-center text-sm">+</button>
      </div>
    </div>
  </div>
);

export default Simulate;
