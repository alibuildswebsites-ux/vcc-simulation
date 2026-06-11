import { motion } from 'framer-motion';
import { Activity, BrainCircuit, BarChart3, Shield, Zap, Timer, Cpu, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

const sections = [
  {
    id: 'overview',
    icon: Activity,
    title: 'Overview Dashboard',
    desc: 'Real-time view of the simulated cloud environment. Shows current user load, active server count, and prediction accuracy at a glance. The auto-scaling engine continuously evaluates demand and adjusts capacity.',
    items: [
      'Current Users — simulated concurrent traffic',
      'Active Servers — instances currently serving requests',
      'Prediction Error — rolling forecast accuracy metric',
    ],
  },
  {
    id: 'simulate',
    icon: Zap,
    title: 'Simulation Control',
    desc: 'Interactive environment to test different load patterns and scaling parameters. Change traffic behavior, adjust cold start delays, and resize the warm pool in real-time.',
    items: [
      '7 load patterns: Flat, Step, Spike, Diurnal, Random Walk, Chaotic, EDoS',
      'Real-time parameter tuning: users-per-server, cold start delay, warm pool size',
      'Start/stop simulation with instant feedback',
    ],
  },
  {
    id: 'visualize',
    icon: BarChart3,
    title: 'Visualization Suite',
    desc: 'Live charts and server rack visualization showing cluster state, load forecasts, and system metrics. Updates every second via WebSocket streaming.',
    items: [
      'Server Rack — animated grid of active, pending, and warm servers',
      'Load Forecast — actual vs predicted demand over time',
      'System Metrics — CPU, latency, and queue depth gauges',
    ],
  },
  {
    id: 'insights',
    icon: BrainCircuit,
    title: 'Analytics & Security',
    desc: 'Deep visibility into scaling decisions, cold start performance, prediction health, and security threat detection.',
    items: [
      'Cold Start Timeline — adaptive EWMA-based provisioning delay',
      'Decision Log — factor breakdown of every scaling action',
      'Thrash Detection — oscillation pattern recognition',
      'EDoS Detection — economic denial of service alerting',
    ],
  },
];

const backendFeatures = [
  {
    icon: BrainCircuit,
    title: 'ML Predictors',
    subtitle: '3 hot-swappable models',
    desc: 'Moving Average — simple rolling window forecast. ARIMA — statistical time-series model with differencing. LSTM — deep learning with sequential memory. Switch predictors at runtime via API without restart.',
  },
  {
    icon: Timer,
    title: 'Cold Start Manager',
    subtitle: 'Adaptive warm pool',
    desc: 'Uses Exponentially Weighted Moving Average (EWMA) to learn actual provisioning latency. Adjusts warm pool size based on prediction uncertainty. Pre-warms servers to eliminate cold start delay during traffic spikes.',
  },
  {
    icon: TrendingUp,
    title: 'Decision Engine',
    subtitle: 'Composite scoring',
    desc: 'Weighs 4 signals (user utilization 30%, CPU 30%, latency 25%, queue depth 15%) into a composite score. Applies configurable thresholds and cooldown periods to prevent flapping. Supports asymmetric scale-up/down behavior.',
  },
  {
    icon: Shield,
    title: 'Thrash Detector',
    subtitle: 'Oscillation prevention',
    desc: 'Tracks scaling direction reversals in a sliding window. When reversals exceed threshold, enters stabilization mode with extended cooldowns (3x for scale-down, 2x for scale-up). Prevents resource waste from rapid scale-up/down cycles.',
  },
  {
    icon: AlertTriangle,
    title: 'EDoS Detector',
    subtitle: 'Economic attack protection',
    desc: 'Monitors scaling frequency in a sliding window. Alerts when frequency exceeds 60% threshold, indicating potential economic denial of service. Helps distinguish organic spikes from adversarial boundary traffic.',
  },
  {
    icon: RefreshCw,
    title: '7 Load Patterns',
    subtitle: 'Realistic traffic simulation',
    desc: 'Flat — constant baseline. Step — sudden demand shifts. Spike — short high-traffic bursts. Diurnal — day-night rhythm. Random Walk — unpredictable drift. Chaotic — mixed complex load. EDoS — adversarial boundary oscillation.',
  },
  {
    icon: Cpu,
    title: 'Metrics Collector',
    subtitle: 'System simulation',
    desc: 'Models CPU utilization, latency, and queue depth based on load-to-capacity ratios. Queue depth grows under pressure and drains proportionally. Latency follows quadratic models above saturation. All metrics feed the decision engine.',
  },
  {
    icon: BarChart3,
    title: 'Simulation Engine',
    subtitle: 'Async event loop',
    desc: 'Configurable tick interval (default 1s). Run loop: generate load → collect metrics → predict → evaluate → decide → scale → tick cold starts → notify listeners. Full state broadcast via WebSocket to all connected clients.',
  },
];

export const About: React.FC = () => {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] py-16 sm:py-24 px-2">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#222222] bg-[#111111] px-3 py-1 text-xs text-[#737373] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none mb-4">
            How VCC Works
          </h1>
          <p className="text-sm text-[#737373] leading-relaxed max-w-xl">
            Virtual Cloud Computing Simulator — a full-stack simulation of ML-driven auto-scaling with predictive analytics, cold start optimization, and security threat detection.
          </p>
        </motion.div>

        {/* Frontend Pages */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 bg-white rounded-full" />
            <h2 className="text-sm font-semibold text-white tracking-widest uppercase">Frontend Pages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent">
                  <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-5 sm:p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed mb-3">{s.desc}</p>
                    <ul className="space-y-1">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#525252]">
                          <span className="h-1 w-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Backend Architecture */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 bg-white rounded-full" />
            <h2 className="text-sm font-semibold text-white tracking-widest uppercase">Backend Architecture</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {backendFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent">
                  <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-5 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-white" strokeWidth={1.5} />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                        <p className="text-[10px] text-[#525252] tracking-wider uppercase">{f.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 bg-white rounded-full" />
            <h2 className="text-sm font-semibold text-white tracking-widest uppercase">Technology Stack</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TechPillar title="Frontend" items={['React 18 + TypeScript', 'Vite + Tailwind CSS', 'Framer Motion, Recharts', 'Lucide Icons, Geist Font', 'Vercel Deployment']} />
            <TechPillar title="Backend" items={['Python 3.12 + FastAPI', 'Async Simulation Engine', 'WebSocket Broadcasting', 'Pydantic Models', 'Systemd Service']} />
            <TechPillar title="ML & Analytics" items={['Moving Average Predictor', 'ARIMA (Statsmodels)', 'LSTM (NumPy Only)', 'EWMA Cold Start', 'Composite Decision Logic']} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const TechPillar = ({ title, items }: { title: string; items: string[] }) => (
  <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/8 to-transparent">
    <div className="rounded-[calc(2rem-1px)] bg-[#0f0f0f] p-5">
      <h3 className="text-xs font-semibold text-white tracking-widest uppercase mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-[#737373]">
            <span className="h-1 w-1 rounded-full bg-white/20" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default About;
