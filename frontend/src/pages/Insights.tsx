import { motion } from 'framer-motion';
import { Activity, ShieldAlert, RefreshCw } from 'lucide-react';
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

export const Insights: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] py-10 px-2">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <ThrashAlert state={state} />
          <EDOSAlert state={state} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cold Start Timeline - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-4 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <ColdStartTimeline state={state} />
          </motion.div>

          {/* Decision Log - Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <DecisionLog state={state} />
          </motion.div>

          {/* Prediction Confidence - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <PredictionConfidence state={state} />
          </motion.div>
        </div>

        {/* Detailed Analytics Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-12 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">System Health & Performance</h3>
              <div className="flex items-center gap-2 text-xs text-[#525252]">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-1">Health Overview</span>
                </div>
              </div>
            </div>
            <div className="relative h-40 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
              {/* Background patterns */}
              <div className="absolute inset-0 -z-10 bg-grid" />
              <div className="absolute inset-0 -z-10 bg-blob" />
              <div className="absolute inset-0 -z-10 bg-vignette" />

              <div className="absolute inset-0 p-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        System Status
                      </p>
                      <p className="text-xs text-[#737373]">
                        {state?.running ? 'RUNNING' : 'STOPPED'} •
                        Uptime: {Math.floor((state?.timestamp ?? 0) / 60)}m {Math.floor((state?.timestamp ?? 0) % 60)}s
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#1e1e1e] pt-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <RefreshCw className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Model Performance
                        </p>
                        <p className="text-xs text-[#737373]">
                          Error: {(state?.prediction_confidence?.avg_error ?? 0).toFixed(3)} •
                          Retrain: {state?.prediction_confidence?.needs_retrain ? 'YES' : 'NO'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#1e1e1e] pt-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <ShieldAlert className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Security Status
                        </p>
                        <p className="text-xs text-[#737373]">
                          Thrash Detection: {state?.thrash?.is_thrashing ? 'ACTIVE' : 'NORMAL'} •
                          EDoS Detection: {state?.edos?.alert ? 'ALERT' : 'NORMAL'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;