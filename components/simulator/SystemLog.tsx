
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
    <div className="glass-panel p-4 h-64 flex flex-col gap-2 relative overflow-hidden bg-black/80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] text-primary uppercase tracking-widest">System Monitor</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500 uppercase">Live Output</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto font-mono text-[11px] space-y-1 custom-scrollbar"
      >
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Initialize simulation to see logs...</div>
        )}
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <span className="text-slate-600 whitespace-nowrap">[{log.timestamp}]</span>
            <span className={
              log.type === 'error' ? 'text-danger' : 
              log.type === 'warning' ? 'text-yellow-400' : 
              log.type === 'success' ? 'text-success' : 
              'text-primary'
            }>
              {log.type === 'error' ? '🔴 ' : log.type === 'warning' ? '⚠ ' : log.type === 'success' ? '✔ ' : ''}
              {log.message}
            </span>
          </motion.div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 245, 255, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SystemLog;
