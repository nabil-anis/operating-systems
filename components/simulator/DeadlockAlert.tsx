
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Terminal, RefreshCw, ZapOff } from 'lucide-react';

interface DeadlockAlertProps {
  isVisible: boolean;
  onTerminate: () => void;
  onPreempt: () => void;
  onRestart: () => void;
}

const DeadlockAlert: React.FC<DeadlockAlertProps> = ({ isVisible, onTerminate, onPreempt, onRestart }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 inset-x-0 z-[110] px-6"
        >
          <div className="max-w-4xl mx-auto bg-danger/90 backdrop-blur-xl border border-red-500/50 rounded-xl p-4 shadow-[0_0_50px_rgba(255,68,68,0.3)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
                <ZapOff className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg leading-tight">TOTAL BLACKOUT IMMINENT</h3>
                <p className="text-white/80 text-xs font-mono uppercase tracking-widest">Deadlock detected in city grid — circular wait confirmed</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onTerminate}
                className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg text-xs font-heading font-semibold flex items-center gap-2 transition-all"
              >
                <Terminal className="w-4 h-4" />
                Terminate Process
              </button>
              <button 
                onClick={onPreempt}
                className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg text-xs font-heading font-semibold flex items-center gap-2 transition-all"
              >
                <AlertCircle className="w-4 h-4" />
                Preempt Resource
              </button>
              <button 
                onClick={onRestart}
                className="px-4 py-2 bg-white text-danger rounded-lg text-xs font-heading font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Restart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeadlockAlert;
