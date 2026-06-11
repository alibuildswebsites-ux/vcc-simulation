import { motion } from 'framer-motion';
import { Activity, BrainCircuit, BarChart3, ArrowRight, Shield, Zap, Target } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

export const Overview: React.FC = () => {
  const { state, start, stop } = useSimulation();

  const accuracy = state?.prediction_confidence?.avg_error != null
    ? Math.max(0, Math.min(99.9, (1 - state.prediction_confidence.avg_error) * 100)).toFixed(1)
    : '—';

  const stats = [
    {
      icon: Activity,
      value: state?.current_users ?? 0,
      label: 'Current Users',
      sub: 'Simulated load',
    },
    {
      icon: Target,
      value: `${accuracy}%`,
      label: 'Prediction Accuracy',
      sub: 'Higher is better',
    },
    {
      icon: BrainCircuit,
      value: `${state?.prediction_confidence?.avg_error ?? 0}`.replace(/0+$/, '').replace(/\.$/, '') || '0',
      label: 'Prediction Error',
      sub: 'Lower is better',
    },
    {
      icon: BarChart3,
      value: state?.active_count ?? 0,
      label: 'Active Servers',
      sub: 'Currently serving load',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'ML-Based Prediction',
      desc: 'Uses Moving Average, ARIMA, or LSTM to forecast load and scale proactively',
    },
    {
      icon: Shield,
      title: 'Thrash & EDoS Protection',
      desc: 'Detects oscillation patterns and potential economic denial of service attacks',
    },
    {
      icon: BrainCircuit,
      title: 'Adaptive Cold Start Modeling',
      desc: 'Learns actual provisioning times and optimizes warm pool size',
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] py-16 sm:py-24 px-2">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#222222] text-xs font-medium text-[#737373] mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          SimuScale
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-white">Virtual Cloud </span>
          <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Computing Simulator
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-[#737373] max-w-xl leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Experience ML-driven auto-scaling with realistic load patterns, predictive scaling, and advanced threat detection. Watch as the system learns, adapts, and protects itself from scaling oscillations and economic attacks.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button
            onClick={start}
            disabled={state?.running}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-[#e5e5e5] text-black font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            Start Simulation
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={stop}
            disabled={!state?.running}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-transparent border border-[#262626] text-[#a1a1a1] hover:text-white hover:border-[#3a3a3a] font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-30"
          >
            Stop Simulation
          </button>
        </motion.div>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto w-full mt-16"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent"
            >
              <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#0a0a0a] p-5 h-full hover:bg-[#0c0c0c] transition-colors duration-300 cursor-default">
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon className="h-5 w-5 text-white mb-3" strokeWidth={1.5} />
                <div className="stat-number text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-sm font-medium text-[#a1a1a1]">{s.label}</div>
                <div className="text-xs text-[#525252] mt-0.5">{s.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature list */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full mt-4"
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent"
            >
              <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-5 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-white" strokeWidth={1.5} />
                  <span className="text-sm font-semibold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Overview;