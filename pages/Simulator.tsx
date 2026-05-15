
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings2, 
  Layout, 
  Table as TableIcon,
  Activity,
  Zap,
  Info,
  ChevronDown,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import CityMap from '../components/simulator/CityMap';
import SystemLog from '../components/simulator/SystemLog';
import DeadlockAlert from '../components/simulator/DeadlockAlert';
import { GridNode, GridEdge, SimulationLog, ScenarioPreset, AlgorithmType } from '../types';

const ALGO_EXPLAINERS = {
  detection: {
    title: "Detection & Recovery",
    desc: "Initializes without restriction. Monolith monitors the Resource Allocation Graph for cycles. If found, recovery triggers.",
    safety: "Reactive"
  },
  prevention: {
    title: "Total Ordering",
    desc: "Strict resource hierarchy (R1 < R2 < R3). Circular wait is mathematically erased by preventing back-order requests.",
    safety: "Proactive"
  },
  avoidance: {
    title: "Banker's Algorithm",
    desc: "Every request undergoes a virtual safety simulation. If no safe sequence exists, the system blocks the request.",
    safety: "Predictive"
  }
};

const INITIAL_NODES: GridNode[] = [
  { id: 'P1', type: 'process', label: 'Hospital AI', x: 100, y: 100, status: 'normal', color: '#00f5ff' },
  { id: 'P2', type: 'process', label: 'Power Grid', x: 400, y: 100, status: 'normal', color: '#6c63ff' },
  { id: 'P3', type: 'process', label: 'Metro Train', x: 400, y: 400, status: 'normal', color: '#00e676' },
  { id: 'P4', type: 'process', label: 'Traffic Hub', x: 100, y: 400, status: 'normal', color: '#ff4444' },
  { id: 'R1', type: 'resource', label: 'Primary Power', x: 250, y: 50, status: 'normal' },
  { id: 'R2', type: 'resource', label: 'Network BW', x: 450, y: 250, status: 'normal' },
  { id: 'R3', type: 'resource', label: 'Emergency Ch', x: 250, y: 450, status: 'normal' },
  { id: 'R4', type: 'resource', label: 'Data Bus', x: 50, y: 250, status: 'normal' },
];

const SCENARIO_DATA = {
  scenario1: {
    title: "The 2-Way Conflict",
    description: "Hospital AI holds Power but wants Network. Power Grid holds Network but wants Power.",
    algoNote: "Analysis: This forms a direct cycle (P1 → R2 → P2 → R1 → P1). Cyclical wait condition met."
  },
  scenario2: {
    title: "3-Way System Cycle",
    description: "A cascade involving Metro Trains, Traffic Hubs, and Power Distribution.",
    algoNote: "Analysis: Complex cycle where dependencies are chained across three separate systems."
  }
};

const Simulator: React.FC = () => {
  const [nodes, setNodes] = useState<GridNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GridEdge[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [scenario, setScenario] = useState<ScenarioPreset>('scenario1');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('detection');
  const [showTable, setShowTable] = useState(true);
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [showTheoreticalExp, setShowTheoreticalExp] = useState(true);
  const [algoStepInfo, setAlgoStepInfo] = useState<string>('');

  const addLog = useCallback((message: string, type: SimulationLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { id: Math.random().toString(), timestamp, message, type }]);
  }, []);

  const reset = () => {
    setNodes(INITIAL_NODES);
    setEdges([]);
    setLogs([]);
    setIsPlaying(false);
    setIsDeadlocked(false);
    setStep(0);
    setAlgoStepInfo('');
    addLog(`System recalibrated. Ready for ${ALGO_EXPLAINERS[algorithm].title}.`, 'info');
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setStep(s => s + 1);
      
      const newEdges = [...edges];
      const newNodes = [...nodes];

      // Scenarios driven by Algorithm
      if (algorithm === 'detection') {
        if (scenario === 'scenario1') {
          if (step === 0) {
            newEdges.push({ id: 'e1', from: 'R1', to: 'P1', type: 'holds', status: 'active' });
            newNodes[0].status = 'running';
            setAlgoStepInfo('PROCESS(P1) ACQUIRES RESOURCE(R1). STATE = RUNNING.');
          } else if (step === 1) {
            newEdges.push({ id: 'e2', from: 'R2', to: 'P2', type: 'holds', status: 'active' });
            newNodes[1].status = 'running';
            setAlgoStepInfo('PROCESS(P2) ACQUIRES RESOURCE(R2). STATE = RUNNING.');
          } else if (step === 2) {
            newEdges.push({ id: 'e3', from: 'P1', to: 'R2', type: 'requests', status: 'waiting' });
            newNodes[0].status = 'waiting';
            setAlgoStepInfo('P1 REQUESTS R2 (HELD BY P2). P1 BLOCKED.');
          } else if (step === 3) {
            newEdges.push({ id: 'e4', from: 'P2', to: 'R1', type: 'requests', status: 'waiting' });
            newNodes[1].status = 'waiting';
            setAlgoStepInfo('P2 REQUESTS R1 (HELD BY P1). P2 BLOCKED. CYCLE CLOSED.');
          } else if (step === 4) {
            setIsDeadlocked(true);
            setIsPlaying(false);
            newNodes[0].status = 'deadlocked';
            newNodes[1].status = 'deadlocked';
            newEdges.forEach(e => e.status = 'deadlocked');
            setAlgoStepInfo('DEADLOCK DETECTED: CIRCULAR WAIT [P1 ↔ P2]. RECOVERY NECESSARY.');
          }
        }
      } else if (algorithm === 'prevention') {
        if (scenario === 'scenario1') {
          if (step === 0) {
            newEdges.push({ id: 'e1', from: 'R1', to: 'P1', type: 'holds', status: 'active' });
            newNodes[0].status = 'running';
            setAlgoStepInfo('P1 ACQUIRES R1. ORDERING: R1 = 1.');
          } else if (step === 1) {
            newEdges.push({ id: 'e2', from: 'R2', to: 'P2', type: 'holds', status: 'active' });
            newNodes[1].status = 'running';
            setAlgoStepInfo('P2 ACQUIRES R2. ORDERING: R2 = 2.');
          } else if (step === 2) {
            newEdges.push({ id: 'e3', from: 'P1', to: 'R2', type: 'requests', status: 'waiting' });
            newNodes[0].status = 'waiting';
            setAlgoStepInfo('P1 REQUESTS R2. ALLOWED: INDEX(R2) > INDEX(R1).');
          } else if (step === 3) {
            setAlgoStepInfo('REQUEST DENIED: P2 ATTEMPTS R1. BLOCKED BY TOTAL ORDERING [2 > 1]. CYCLE AVERTED.');
            addLog('Prevention Logic: Disallowed out-of-order request from P2.', 'success');
            setIsPlaying(false);
          }
        }
      } else if (algorithm === 'avoidance') {
        if (scenario === 'scenario1') {
          if (step === 0) {
            newEdges.push({ id: 'e1', from: 'R1', to: 'P1', type: 'holds', status: 'active' });
            newNodes[0].status = 'running';
            setAlgoStepInfo('BANKER SAFETY TEST: ALLOCATING R1 TO P1 IS SAFE.');
          } else if (step === 1) {
            newEdges.push({ id: 'e2', from: 'R2', to: 'P2', type: 'holds', status: 'active' });
            newNodes[1].status = 'running';
            setAlgoStepInfo('BANKER SAFETY TEST: ALLOCATING R2 TO P2 IS SAFE.');
          } else if (step === 2) {
            newNodes[0].status = 'waiting';
            setAlgoStepInfo('ALLOCATION BLOCKED: GRANTING R2 TO P1 WOULD LEAD TO AN UNSAFE STATE.');
            addLog('Banker Algorithm: Resource request postponed for safety.', 'warning');
            setIsPlaying(false);
          }
        }
      }

      setEdges(newEdges);
      setNodes(newNodes);
    }, 1500 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, step, speed, scenario, algorithm, edges, nodes, addLog]);

  return (
    <PageWrapper>
      <DeadlockAlert 
        isVisible={isDeadlocked}
        onRestart={reset}
        onTerminate={() => {
          setIsDeadlocked(false);
          addLog('Recovery Triggered: Terminating P2 to break cycle.', 'warning');
          setEdges(prev => prev.filter(e => e.from !== 'P2' && e.to !== 'P2'));
          setNodes(prev => prev.map(n => n.id === 'P2' ? { ...n, status: 'normal' } : n));
        }}
        onPreempt={() => {
          setIsDeadlocked(false);
          addLog('Resource Preemption: Forcing P1 to release R1.', 'warning');
          setEdges(prev => prev.map(e => (e.id === 'e1' ? { ...e, from: 'R1', to: 'P2', type: 'holds', status: 'active' } : e)));
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid lg:grid-cols-12 gap-10 relative z-10">
          
          {/* Header Area */}
          <div className="lg:col-span-12 mb-8 lg:mb-12">
             <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
             >
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-black tracking-[0.4em] uppercase mb-2 italic opacity-60">
                    Diagnostic Lab // v4.Kernel
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white tracking-tighter flex flex-wrap items-center gap-x-8 uppercase leading-none italic">
                    Grid
                    <span className="text-transparent border-text italic">Simulator</span>
                  </h1>
                  <p className="text-slate-500 font-mono text-[10px] mt-4 tracking-[0.3em] uppercase font-black italic opacity-40">HyperOS v4.0.2 // SMART CITY GRIDLOCK ENGINE</p>
               </div>
               <div className="flex items-center gap-6 w-full md:w-auto mt-6 md:mt-0">
                  <div className={`flex-grow md:flex-grow-0 px-8 py-5 lg:px-12 lg:py-8 rounded-[28px] lg:rounded-[40px] border flex items-center justify-center gap-6 text-[9px] lg:text-[11px] font-black uppercase tracking-[0.3em] italic transition-all duration-700 shadow-2xl ${isDeadlocked ? 'bg-secondary/10 border-secondary/50 text-secondary shadow-secondary/20 scale-105' : 'bg-primary/20 border-primary/50 text-primary shadow-primary/20'}`}>
                    <div className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full shadow-lg ${isDeadlocked ? 'bg-secondary animate-pulse shadow-secondary' : 'bg-primary shadow-primary'}`} />
                    {isDeadlocked ? 'Critical Breach' : 'System Healthy'}
                  </div>
               </div>
             </motion.div>
          </div>

          {/* Left Panel: Simulation Canvas */}
          <div className="lg:col-span-8 space-y-12">
            <div className="hyper-card p-2 lg:p-4 bg-white/[0.03] border border-white/10 rounded-[44px] lg:rounded-[64px] shadow-3xl backdrop-blur-3xl overflow-hidden relative group">
              <div className="bg-black/40 rounded-[36px] lg:rounded-[56px] p-8 lg:p-16 min-h-[500px] lg:min-h-[800px] flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 gap-8">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[28px] lg:rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                        <Layout className="w-8 h-8 lg:w-10 lg:h-10 text-primary shadow-[0_0_15px_#FF6700]" />
                      </div>
                      <div>
                        <span className="text-white font-black text-xs lg:text-sm uppercase tracking-[0.4em] block italic">Topology Hub</span>
                        <span className="text-white/30 text-[10px] lg:text-[11px] uppercase font-black italic tracking-[0.2em] mt-2">Resource Allocation Graph // Real-time</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setShowTheoreticalExp(!showTheoreticalExp)} 
                        className={`text-[10px] font-black uppercase tracking-[0.5em] px-10 py-5 rounded-full border transition-all italic shadow-2xl ${showTheoreticalExp ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-white/30 hover:text-white hover:border-white/20'}`}
                      >
                        {showTheoreticalExp ? 'Hide Insights' : 'Kernel Insights'}
                      </button>
                   </div>
                </div>

                <div className="flex-grow flex items-center justify-center relative min-h-[400px] lg:min-h-[500px]">
                  <CityMap nodes={nodes} edges={edges} isDeadlocked={isDeadlocked} />
                </div>

                <AnimatePresence>
                  {showTheoreticalExp && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 48 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="p-8 lg:p-12 rounded-[32px] lg:rounded-[48px] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-3xl z-20 overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                        <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4 italic leading-none opacity-60">
                          <Info className="w-5 h-5 shadow-[0_0_15px_#FF6700]" />
                          Kernel Strategy: {ALGO_EXPLAINERS[algorithm].title}
                        </h4>
                        <div className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">
                          Mode: {ALGO_EXPLAINERS[algorithm].safety}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <p className="text-lg lg:text-xl text-white/90 font-black italic leading-tight tracking-tight uppercase border-l-[3px] border-primary/30 pl-6 lg:pl-10">
                          {ALGO_EXPLAINERS[algorithm].desc}
                        </p>
                        <div className="bg-white/5 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-white/10 shadow-inner">
                           <div className="text-[10px] font-black text-primary/60 uppercase tracking-[0.5em] mb-4 italic">Live Cycle Analysis</div>
                           <div className="text-white font-mono text-xs font-bold leading-relaxed min-h-[4em] opacity-80">
                             {algoStepInfo || 'AWAITING KERNEL_CYCLE EXECUTION...'}
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <SystemLog logs={logs} />
          </div>

          {/* Right Panel: Controllers */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-10">
            <div className="hyper-card p-8 lg:p-12 space-y-10 lg:space-y-12 bg-white/[0.02] border border-white/10 rounded-[32px] lg:rounded-[48px] backdrop-blur-3xl shadow-3xl">
              <div className="space-y-8 lg:space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[24px] lg:rounded-[28px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
                    <Settings2 className="w-6 h-6 lg:w-8 lg:h-8 text-primary shadow-[0_0_15px_#FF6700]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-xs lg:text-sm uppercase tracking-[0.4em] italic opacity-60">Control Unit</h2>
                    <p className="text-primary text-[9px] lg:text-[10px] font-mono font-black italic">KERNEL_SYS_v4</p>
                  </div>
                </div>

                 <div className="space-y-6 lg:space-y-8">
                    <div className="space-y-3 lg:space-y-4">
                      <label className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2 italic">Algorithm Strategy</label>
                      <div className="relative group">
                        <select 
                           className="w-full bg-white/5 border border-white/10 rounded-[20px] lg:rounded-[28px] p-4 lg:p-6 text-[10px] lg:text-[11px] text-white font-black uppercase tracking-widest focus:border-primary transition-all appearance-none cursor-pointer italic"
                           value={algorithm}
                           onChange={(e) => {
                             setAlgorithm(e.target.value as AlgorithmType);
                             reset();
                           }}
                           disabled={isPlaying}
                         >
                           <option value="detection">Detection & Recovery</option>
                           <option value="prevention">Prevention (Ordering)</option>
                           <option value="avoidance">Avoidance (Banker's)</option>
                         </select>
                         <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                   <div className="space-y-3 lg:space-y-4">
                      <label className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2 italic">Scenario Selection</label>
                     <div className="relative group">
                       <select 
                          className="w-full bg-white/5 border border-white/10 rounded-[20px] lg:rounded-[28px] p-4 lg:p-6 text-[10px] lg:text-[11px] text-white font-black uppercase tracking-widest focus:border-primary transition-all appearance-none cursor-pointer italic"
                          value={scenario}
                          onChange={(e) => {
                            setScenario(e.target.value as ScenarioPreset);
                            reset();
                          }}
                          disabled={isPlaying}
                        >
                          <option value="scenario1">2-Way Conflict (Standard)</option>
                          <option value="scenario2">3-Way Gridlock (Advanced)</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
                     </div>
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={isDeadlocked}
                        className={`flex-grow h-16 lg:h-20 rounded-[20px] lg:rounded-[32px] font-black text-[10px] lg:text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 lg:gap-6 transition-all italic shadow-2xl ${
                          isPlaying 
                          ? 'bg-secondary text-white shadow-secondary/20' 
                          : 'btn-primary'
                        } disabled:opacity-30 disabled:grayscale`}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 lg:w-6 lg:h-6" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6 text-white" />}
                        {isPlaying ? 'ABORT' : 'Execute'}
                      </button>
                      <button 
                         onClick={reset}
                         className="w-16 h-16 lg:w-20 lg:h-20 rounded-[20px] lg:rounded-[32px] border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white/20 hover:text-white shadow-2xl"
                      >
                        <RotateCcw className="w-6 h-6 lg:w-8 lg:h-8" />
                      </button>
                   </div>

                   <div className="pt-6 lg:pt-8 space-y-4 lg:space-y-6">
                      <div className="flex justify-between items-end px-2">
                         <div>
                            <div className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">Logic Clock</div>
                            <div className="text-3xl lg:text-4xl font-display font-black text-white mt-1 italic">{speed}<span className="text-primary text-xs lg:text-sm ml-2">MHz</span></div>
                         </div>
                      </div>
                      <div className="px-2">
                        <input 
                          type="range" min="0.5" max="3" step="0.5" 
                          value={speed} 
                          onChange={(e) => setSpeed(parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 lg:pt-12 border-t border-white/10 space-y-6 lg:space-y-8">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[10px] lg:text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4 italic leading-none">
                       <TableIcon className="w-5 h-5 text-primary opacity-60" />
                       Grid Statistics
                    </h3>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#FF6700] animate-pulse" />
                 </div>
                 <div className="rounded-[24px] lg:rounded-[32px] overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                    <div className="p-6 lg:p-8 overflow-x-auto">
                      <table className="w-full text-left font-sans text-[10px] lg:text-[11px] min-w-[200px]">
                        <thead>
                          <tr className="text-white/30 uppercase font-black tracking-[0.4em] italic">
                            <th className="pb-4 lg:pb-6">SYS_ID</th>
                            <th className="pb-4 lg:pb-6">HOLD</th>
                            <th className="pb-4 lg:pb-6">PEND</th>
                          </tr>
                        </thead>
                        <tbody className="text-white font-black italic">
                          {['P1', 'P2', 'P3', 'P4'].map(pId => {
                            const held = edges.filter(e => e.to === pId && e.type === 'holds').map(e => e.from).join(',') || '-';
                            const req = edges.filter(e => e.from === pId && e.type === 'requests').map(e => e.to).join(',') || '-';
                            return (
                              <tr key={pId} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 lg:py-5 text-primary tracking-widest">{pId}</td>
                                <td className="py-4 lg:py-5 opacity-60 group-hover:opacity-100 transition-opacity">{held}</td>
                                <td className="py-4 lg:py-5 text-secondary opacity-60 group-hover:opacity-100 transition-opacity">{req}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </div>
            </div>

            <div className="hyper-card p-8 lg:p-12 bg-primary/5 border border-primary/20 rounded-[32px] lg:rounded-[48px] relative overflow-hidden group shadow-3xl shadow-primary/5">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
               <h4 className="text-[10px] lg:text-[11px] font-black text-primary uppercase tracking-[0.6em] mb-8 lg:mb-10 flex items-center gap-4 italic opacity-60">
                  <Cpu className="w-5 h-5 shadow-[0_0_15px_#FF6700]" />
                  Kernel Spec
               </h4>
               <ul className="space-y-4 lg:space-y-6 text-xs lg:text-sm text-white/60 font-black italic relative z-10">
                  <li className="flex justify-between items-center border-b border-white/5 pb-4 tracking-tighter">
                    <span className="text-white/30 uppercase text-[9px] lg:text-[10px] tracking-[0.3em]">Concurrency</span>
                    <span className="text-white uppercase text-[11px] lg:text-sm">Active_Load</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-4 tracking-tighter">
                    <span className="text-white/30 uppercase text-[9px] lg:text-[10px] tracking-[0.3em]">Preemption</span>
                    <span className="text-secondary uppercase text-[11px] lg:text-sm">Surgical_Lock</span>
                  </li>
                  <li className="flex justify-between items-center tracking-tighter">
                    <span className="text-white/30 uppercase text-[9px] lg:text-[10px] tracking-[0.3em]">Logic_Hub</span>
                    <span className="text-white uppercase text-[11px] lg:text-sm">Hyper_OS_v4</span>
                  </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Simulator;
