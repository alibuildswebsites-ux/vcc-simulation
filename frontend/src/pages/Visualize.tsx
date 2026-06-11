import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadChart } from '../components/LoadChart';
import { MetricsPanel } from '../components/MetricsPanel';
import { ServerRack } from '../components/ServerRack';
import { useSimulation } from '../hooks/useSimulation';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardWrap = (children: React.ReactNode) => (
  <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent h-full">
    <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-5 sm:p-6 h-full">
      {children}
    </div>
  </div>
);

export const Visualize: React.FC = () => {
  const { state } = useSimulation();
  const [isRunning, setIsRunning] = useState(false);
  const metricsHistory = useRef<{ cpu: number; latency: number; queue: number; tick: number }[]>([]);

  useEffect(() => {
    if (state) {
      setIsRunning(state.running);
      if (state.system_metrics && state.timestamp) {
        const entry = {
          cpu: state.system_metrics.cpu_percent,
          latency: state.system_metrics.latency_ms,
          queue: Math.min(state.system_metrics.queue_depth / 1000, 100),
          tick: Math.floor(state.timestamp),
        };
        metricsHistory.current = [...metricsHistory.current.slice(-49), entry];
      }
    }
  }, [state]);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] py-16 sm:py-24 px-2">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Simulation Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent"
        >
          <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-white animate-pulse' : 'bg-[#525252]'}`} />
              <h2 className="text-sm font-bold text-white tracking-tight">
                {isRunning ? 'LIVE SIMULATION' : 'SIMULATION PAUSED'}
              </h2>
            </div>
            <div className="text-xs text-[#525252] tabular-nums">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Server Rack - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-4"
          >
            {cardWrap(<ServerRack state={state} />)}
          </motion.div>

          {/* Load Chart - Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6"
          >
            {cardWrap(<LoadChart state={state} />)}
          </motion.div>

          {/* Metrics Panel - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            {cardWrap(<MetricsPanel state={state} />)}
          </motion.div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-12"
          >
            {cardWrap(
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">System Metrics Over Time</h3>
                  <div className="flex items-center gap-3 text-[10px] text-[#525252]">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white/60" /> CPU</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white/30" /> Latency</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white/10" /> Queue</span>
                  </div>
                </div>
                <div className="h-40">
                  {metricsHistory.current.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsHistory.current}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                        <XAxis dataKey="tick" tick={{ fontSize: 10, fill: '#525252' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#525252' }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip
                          contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }}
                          labelStyle={{ color: '#a1a1a1' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="cpu" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="latency" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="queue" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#525252]">
                      Waiting for data...
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Visualize;