import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'simulate', label: 'Simulate' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'insights', label: 'Insights' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#1e1e1e] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <button
          onClick={() => handleNav('overview')}
          className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
        >
          <div className="relative flex-shrink-0">
            <Activity className="h-5 w-5 text-white" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">Virtual Cloud Computing</span>
        </button>

        {/* Desktop tabs */}
        <div className="hidden sm:flex items-center gap-1 bg-[#111111] border border-[#1e1e1e] rounded-full px-1.5 py-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#737373] hover:text-[#a1a1a1]'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-[#1e1e1e] rounded-full border border-[#2a2a2a]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[#a1a1a1] hover:text-white transition-colors cursor-pointer p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="sm:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1e1e1e] text-white'
                    : 'text-[#737373] hover:text-white hover:bg-[#141414]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;