
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
          className="fixed top-28 inset-x-0 z-[110] px-6"
        >
          <div className="max-w-5xl mx-auto bg-secondary/20 backdrop-blur-3xl border border-secondary/50 rounded-[32px] p-8 shadow-[0_0_80px_rgba(244,63,94,0.4)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-secondary/20 rounded-[20px] flex items-center justify-center animate-pulse border border-secondary/30">
                <ZapOff className="text-secondary w-8 h-8 drop-shadow-[0_0_10px_#f43f5e]" />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-3xl uppercase tracking-tighter italic leading-none">Total System Gridlock</h3>
                <p className="text-white/80 text-[11px] font-mono uppercase tracking-[0.3em] font-black italic mt-3">Circular wait confirmed // Kernel intervention required</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button 
                onClick={onTerminate}
                className="px-8 py-4 bg-black/60 hover:bg-black/80 text-white rounded-[20px] text-[11px] font-mono font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-white/10 italic"
              >
                <Terminal className="w-5 h-5 text-secondary" />
                Kill Process
              </button>
              <button 
                onClick={onPreempt}
                className="px-8 py-4 bg-black/60 hover:bg-black/80 text-white rounded-[20px] text-[11px] font-mono font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-white/10 italic"
              >
                <AlertCircle className="w-5 h-5 text-secondary" />
                Preempt
              </button>
              <button 
                onClick={onRestart}
                className="px-10 py-5 bg-white text-secondary rounded-[24px] text-[12px] font-display font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 italic shadow-2xl"
              >
                <RefreshCw className="w-5 h-5" />
                Reboot Grid
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeadlockAlert;
