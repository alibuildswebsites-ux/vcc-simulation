import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, RefreshCw, Timer, Users, Server } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ColdStartTimeline } from '../components/ColdStartTimeline';
import { DecisionLog } from '../components/DecisionLog';
import { EDOSAlert } from '../components/EDOSAlert';
import { PredictionConfidence } from '../components/PredictionConfidence';
import { ThrashAlert } from '../components/ThrashAlert';
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

export const Insights: React.FC = () => {
  const { state } = useSimulation();
  const userHistory = useRef<{ users: number; active: number; tick: number }[]>([]);

  useEffect(() => {
    if (state && state.timestamp !== undefined) {
      userHistory.current = [
        ...userHistory.current.slice(-49),
        { users: state.current_users ?? 0, active: state.active_count ?? 0, tick: Math.floor(state.timestamp) },
      ];
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
        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <ThrashAlert state={state} />
          <EDOSAlert state={state} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cold Start Timeline - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-4"
          >
            {cardWrap(<ColdStartTimeline state={state} />)}
          </motion.div>

          {/* Decision Log - Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6"
          >
            {cardWrap(<DecisionLog state={state} />)}
          </motion.div>

          {/* Prediction Confidence - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            {cardWrap(<PredictionConfidence state={state} />)}
          </motion.div>
        </div>

        {/* Detailed Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7"
          >
            {cardWrap(
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Users & Servers Over Time</h3>
                  <div className="flex items-center gap-3 text-[10px] text-[#525252]">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white/60" /> Users</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white/20" /> Servers</span>
                  </div>
                </div>
                <div className="h-40">
                  {userHistory.current.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userHistory.current}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                        <XAxis dataKey="tick" tick={{ fontSize: 10, fill: '#525252' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#525252' }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip
                          contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }}
                          labelStyle={{ color: '#a1a1a1' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="rgba(255,255,255,0.6)" fill="rgba(255,255,255,0.06)" strokeWidth={1.5} dot={false} />
                        <Area type="monotone" dataKey="active" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.03)" strokeWidth={1.5} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#525252]">Waiting for data...</div>
                  )}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            {cardWrap(
              <>
                <h3 className="text-sm font-semibold text-white mb-3">System Status</h3>
                <div className="space-y-3">
                  <StatusRow icon={Activity} label="Status" value={state?.running ? 'RUNNING' : 'STOPPED'} valueClass={state?.running ? 'text-white' : 'text-[#525252]'} />
                  <StatusRow icon={Timer} label="Uptime" value={`${Math.floor((state?.timestamp ?? 0) / 60)}m ${Math.floor((state?.timestamp ?? 0) % 60)}s`} />
                  <StatusRow icon={Users} label="Users / Servers" value={`${state?.current_users ?? 0} / ${state?.active_count ?? 0}`} />
                  <StatusRow icon={Server} label="Warm Pool" value={`${state?.warm_count ?? 0} servers`} />
                  <StatusRow icon={RefreshCw} label="Predictor" value={state?.config?.predictor_type ?? 'ma'} />
                  <StatusRow icon={ShieldAlert} label="Thrash / EDoS" value={`${state?.thrash?.is_thrashing ? '⚠' : '✓'} / ${state?.edos?.alert ? '⚠' : '✓'}`} />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const StatusRow = ({ icon: Icon, label, value, valueClass }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2 text-xs text-[#525252]">
      <Icon className="h-3 w-3" strokeWidth={1.5} />
      {label}
    </div>
    <span className={`text-xs tabular-nums ${valueClass ?? 'text-[#a1a1a1]'}`}>{value}</span>
  </div>
);

export default Insights;