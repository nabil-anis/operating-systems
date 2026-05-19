
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SimulationLog as LogType } from '../../types';

interface SystemLogProps {
  logs: LogType[];
}

const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white/[0.02] border border-white/10 p-6 h-64 flex flex-col gap-3 relative overflow-hidden rounded-[32px] backdrop-blur-2xl">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_#007AFF] animate-pulse" />
          <span className="font-sans text-xs text-white/50 font-bold uppercase tracking-widest">Monitor</span>
        </div>
        <span className="font-sans text-xs text-white/30 uppercase font-bold tracking-tight">Activity</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto font-mono text-[11px] space-y-2 custom-scrollbar"
      >
        {logs.length === 0 && (
          <div className="text-slate-600 font-medium italic">Waiting to begin...</div>
        )}
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 items-start"
          >
            <span className="text-slate-600 whitespace-nowrap font-mono text-[10px] pt-0.5">[{log.timestamp}]</span>
            <span className={
              log.type === 'error' ? 'text-secondary' : 
              log.type === 'warning' ? 'text-amber-400' : 
              log.type === 'success' ? 'text-emerald-400' : 
              'text-slate-300'
            }>
              {log.message}
            </span>
          </motion.div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SystemLog;
