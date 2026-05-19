
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
        <>
          {/* Full-screen Alert Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-secondary/5 pointer-events-none"
          >
            <motion.div 
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-[20px] border-secondary/20"
            />
          </motion.div>

          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            className="fixed top-12 inset-x-0 z-[110] px-6"
          >
            <div className="max-w-5xl mx-auto bg-black/80 backdrop-blur-3xl border-b-4 border-secondary rounded-[40px] p-8 lg:p-12 shadow-[0_20px_100px_rgba(244,63,94,0.3)] flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/30 relative">
                  <motion.div 
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-secondary rounded-full"
                  />
                  <ZapOff className="text-secondary w-12 h-12 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-sans font-black text-white text-4xl lg:text-5xl tracking-tighter uppercase text-secondary">RED ALERT: Circular Wait</h3>
                  <p className="text-white/60 text-lg font-medium tracking-tight max-w-2xl">
                    Grid integrity compromised. Forensic analysis has identified an illegal resource loop across the Smart City infrastructure.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:px-20">
                <button 
                  onClick={onTerminate}
                  className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl text-sm font-bold tracking-tight flex items-center justify-center gap-3 transition-all border border-white/5 group"
                >
                  <Terminal className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                  Kill Process
                </button>
                <button 
                  onClick={onPreempt}
                  className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl text-sm font-bold tracking-tight flex items-center justify-center gap-3 transition-all border border-white/5 group"
                >
                  <AlertCircle className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                  Preempt Resource
                </button>
                <button 
                  onClick={onRestart}
                  className="px-8 py-5 bg-secondary text-white rounded-3xl text-sm font-bold tracking-tight flex items-center justify-center gap-3 transition-all hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-secondary/20"
                >
                  <RefreshCw className="w-5 h-5" />
                  Full System Reset
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeadlockAlert;
