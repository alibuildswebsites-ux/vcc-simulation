import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Play } from 'lucide-react';
import { LoadChart } from '../components/LoadChart';
import { MetricsPanel } from '../components/MetricsPanel';
import { ServerRack } from '../components/ServerRack';
import { useSimulation } from '../hooks/useSimulation';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const Visualize: React.FC = () => {
  const { state } = useSimulation();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (state) {
      setIsRunning(state.running);
    }
  }, [state]);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] py-10 px-2">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Simulation Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg ${
            state?.running ? 'bg-[#111111]' : 'bg-[#0f0f0f]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {isRunning ? (
                <Play className="h-4 w-4 text-white" strokeWidth={2} />
              ) : (
                <Activity className="h-4 w-4 text-[#525252]" strokeWidth={1.5} />
              )}
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {isRunning ? 'LIVE SIMULATION' : 'SIMULATION PAUSED'}
            </h2>
          </div>
          <div className="text-xs text-[#525252]">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Server Rack - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-4 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <ServerRack state={state} />
          </motion.div>

          {/* Load Chart - Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <LoadChart state={state} />
          </motion.div>

          {/* Metrics Panel - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <MetricsPanel state={state} />
          </motion.div>
        </div>

        {/* Secondary Charts Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-12 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">System Metrics Over Time</h3>
              <div className="flex items-center gap-2 text-xs text-[#525252]">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-1">CPU • Latency • Queue</span>
                </div>
              </div>
            </div>
            <div className="relative h-40 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
              {/* Background patterns */}
              <div className="absolute inset-0 -z-10 bg-grid" />
              <div className="absolute inset-0 -z-10 bg-blob" />
              <div className="absolute inset-0 -z-10 bg-vignette" />

              <div className="absolute inset-0 p-2">
                {/* This would show a combined metrics chart - simplified for now */}
                <div className="flex h-full w-full items-center justify-center text-[#525252]">
                  Detailed metrics charts would appear here in a full implementation
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Visualize;