import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Simulate from './pages/Simulate';
import Visualize from './pages/Visualize';
import Insights from './pages/Insights';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col pt-14 overflow-x-hidden">
      {/* Background: perspective grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" />
      {/* Background: central glow blob */}
      <motion.div
        className="bg-blob pointer-events-none fixed inset-0 z-0"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Background: corner vignette for depth */}
      <div className="bg-vignette pointer-events-none fixed inset-0 z-0" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" {...pageTransition}>
              <Overview />
            </motion.div>
          )}
          {activeTab === 'simulate' && (
            <motion.div key="simulate" {...pageTransition}>
              <Simulate />
            </motion.div>
          )}
          {activeTab === 'visualize' && (
            <motion.div key="visualize" {...pageTransition}>
              <Visualize />
            </motion.div>
          )}
          {activeTab === 'insights' && (
            <motion.div key="insights" {...pageTransition}>
              <Insights />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
