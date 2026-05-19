
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Eye, 
  Trash2, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  Info,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

// --- Tab Components ---

const PreventionTab = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="space-y-12"
  >
    <div className="bg-white/[0.02] border border-white/10 rounded-[48px] p-10 lg:p-14 backdrop-blur-3xl shadow-xl">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
          <ShieldCheck className="text-primary w-8 h-8" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-4xl text-white tracking-tight leading-none">Prevention</h3>
          <p className="text-white/40 font-sans text-xs font-bold uppercase tracking-widest mt-2">Protocol Layer 0 // Pre-Execution</p>
        </div>
      </div>
      
      <p className="text-2xl text-slate-400 font-medium leading-relaxed mb-16 max-w-3xl border-l-[3px] border-primary pl-8 lg:pl-10">
        "Eliminate system contention by architecting immunity into the core protocol logic."
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            cond: 'Mutual Exclusion', 
            fix: 'Spooling Hub', 
            desc: 'Virtualize exclusive resources into shareable logical streams.',
            impact: 'Complexity: Low'
          },
          { 
            cond: 'Hold and Wait', 
            fix: 'Pre-allocation', 
            desc: 'Transaction isolation: claim all vectors before execution begins.',
            impact: 'Complexity: Critical'
          },
          { 
            cond: 'No Preemption', 
            fix: 'Forced Release', 
            desc: 'Atomic release: surrender all held resources if request is denied.',
            impact: 'Complexity: High'
          },
          { 
            cond: 'Circular Wait', 
            fix: 'Linear Hierarchy', 
            desc: 'Index grid resources; request strictly in increasing order.',
            impact: 'Complexity: High'
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-primary font-bold text-[10px] tracking-widest uppercase opacity-60">{item.cond}</h4>
              <div className="text-[10px] font-bold text-white/30 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider bg-white/5">{item.impact}</div>
            </div>
            <p className="text-white text-3xl font-bold mb-4 tracking-tight">{item.fix}</p>
            <p className="text-slate-500 text-base leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const AvoidanceTab = () => {
  const [data, setData] = useState([
    { process: 'Hospital AI', alloc: 1, max: 8, need: 7, color: 'text-primary' },
    { process: 'Power Grid', alloc: 3, max: 6, need: 3, color: 'text-accent' },
    { process: 'Transit Sys', alloc: 2, max: 9, need: 7, color: 'text-secondary' },
  ]);
  const [available, setAvailable] = useState(3);

  const { isSafe, safeSeq } = useMemo(() => {
    let work = available;
    let finish = new Array(data.length).fill(false);
    let sequence: string[] = [];
    
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data.length; i++) {
        if (!finish[i] && data[i].need <= work) {
          work += data[i].alloc;
          finish[i] = true;
          sequence.push(data[i].process);
        }
      }
    }
    return { isSafe: finish.every(f => f), safeSeq: sequence };
  }, [data, available]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="hyper-card p-12 bg-surface/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center border border-primary/20">
               <Cpu className="text-primary w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-black text-4xl text-white tracking-widest uppercase italic leading-none">Avoidance</h3>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Banker's Algorithm // Safety Check</p>
            </div>
          </div>
          
          <div className={`px-10 py-5 rounded-[32px] border-2 flex items-center gap-4 transition-all duration-500 ${isSafe ? 'border-primary bg-primary/10 text-primary shadow-xl shadow-primary/20' : 'border-secondary bg-secondary/10 text-secondary shadow-xl shadow-secondary/20'}`}>
            {isSafe ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <span className="font-display font-black uppercase tracking-[0.2em] text-sm">
              {isSafe ? 'Safe State' : 'Unsafe State'}
            </span>
          </div>
        </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-[0.4em] text-[9px] font-black italic">
                      <th className="py-8 px-10">Kernel ID</th>
                      <th className="py-8 px-10 text-center">Allocated</th>
                      <th className="py-8 px-10 text-center">Capacity</th>
                      <th className="py-8 px-10 text-center">Deficit</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    {data.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.04] transition-colors group">
                        <td className="py-8 px-10 font-black text-white italic uppercase tracking-widest text-lg">
                          {row.process}
                        </td>
                        <td className="py-8 px-10 text-center">
                          <div className="inline-flex items-center gap-4 bg-white/5 px-6 py-3 rounded-[24px] border border-white/10 group-hover:border-primary/50 transition-colors">
                            <input 
                              type="number" 
                              value={row.alloc}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(row.max, parseInt(e.target.value) || 0));
                                const newData = [...data];
                                newData[i].alloc = val;
                                newData[i].need = newData[i].max - val;
                                setData(newData);
                              }}
                              className="bg-transparent w-14 text-center text-primary font-black text-2xl outline-none"
                            />
                          </div>
                        </td>
                        <td className="py-8 px-10 text-center font-black text-white/20 text-xl tracking-tighter">[{row.max}]</td>
                        <td className="py-8 px-10 text-center font-black text-white tracking-[0.2em] text-xl italic">{row.need}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
               
             <div className="flex flex-col md:flex-row gap-8 p-12 hyper-card bg-primary/5 border-primary/20 items-center justify-between rounded-[48px]">
                <div className="space-y-6 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] italic">Available Pool:</span>
                    <div className="flex items-center gap-6 bg-black/40 border border-primary/30 rounded-[32px] px-8 py-4 shadow-2xl">
                      <input 
                        type="number" 
                        value={available}
                        onChange={(e) => setAvailable(Math.max(0, parseInt(e.target.value) || 0))}
                        className="bg-transparent border-none text-primary font-black text-4xl w-24 text-center outline-none"
                      />
                      <span className="text-[11px] text-primary font-black tracking-[0.3em] italic opacity-40">UNITS</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 text-center md:text-right">
                  <div className="text-[9px] text-white/40 font-black uppercase tracking-[0.5em] italic">Safety Sequence Result:</div>
                  <div className="flex gap-4 justify-center md:justify-end">
                    {isSafe ? safeSeq.map((p, i) => (
                      <div key={i} className="px-6 py-3 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-primary/20">
                        {p.split(' ')[0]}
                      </div>
                    )) : <div className="text-secondary font-black text-xs uppercase tracking-[0.3em] italic">Null Sequence</div>}
                  </div>
                </div>
             </div>
            </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="hyper-card p-10 bg-white/2 border border-white/[0.05]">
                <h4 className="text-white font-black text-[10px] mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                  <Terminal className="w-5 h-5 text-primary" />
                  Kernel Logic
                </h4>
                <div className="space-y-6 text-[11px] text-slate-400 leading-relaxed font-sans">
                  <div className="bg-black/30 p-6 rounded-[24px] border border-white/[0.05]">
                    <strong className="text-primary block mb-2 uppercase tracking-widest">Step 01</strong>
                    Locate a system where <span className="text-white font-black italic">Need ≤ Available</span>.
                  </div>
                  <div className="bg-black/30 p-6 rounded-[24px] border border-white/[0.05]">
                     <strong className="text-primary block mb-2 uppercase tracking-widest">Step 02</strong>
                     Simulate execution. Return <span className="text-white font-black italic">Allocation</span> to pool.
                  </div>
                  <div className="bg-black/30 p-6 rounded-[24px] border border-white/[0.05]">
                     <strong className="text-primary block mb-2 uppercase tracking-widest">Step 03</strong>
                     Terminate if all systems safe. Else <span className="text-secondary font-black italic">Abort</span>.
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RecoveryTab = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="space-y-12"
  >
    <div className="grid md:grid-cols-2 gap-12">
      <div className="hyper-card overflow-hidden group border border-white/10 rounded-[48px]">
        <div className="p-16 bg-white/[0.02] h-full flex flex-col backdrop-blur-3xl">
           <div className="flex justify-between items-start mb-16">
              <div className="w-24 h-24 bg-secondary/10 rounded-[32px] flex items-center justify-center border border-secondary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-secondary/10">
                <Trash2 className="text-secondary w-12 h-12" />
              </div>
              <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em] font-black italic">X-FLUSH_v3</div>
           </div>
           
           <h3 className="font-display font-black text-5xl text-white mb-10 uppercase tracking-[0.1em] italic leading-tight">Termination</h3>
           <p className="text-2xl text-slate-400 font-light leading-relaxed mb-16 border-l-[6px] border-secondary pl-10 py-6 italic bg-secondary/5 rounded-r-[32px] opacity-80">
             "Absolute kernel disruption. Immediate state recovery through total participates cull."
           </p>

           <div className="space-y-10 flex-grow">
              <div className="space-y-4">
                 <h5 className="text-white font-black text-[11px] uppercase tracking-[0.3em] italic">Strategy Alpha: Purge</h5>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80">Terminate all cycle threads. Grid power reclaim: 100%.</p>
              </div>
              <div className="space-y-4">
                 <h5 className="text-white font-black text-[11px] uppercase tracking-[0.3em] italic">Strategy Beta: Target</h5>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80">Surgical culling based on priority rank until topography is verified safe.</p>
              </div>
           </div>

           <div className="mt-16 pt-10 border-t border-white/10 flex gap-4">
              <div className="px-6 py-2.5 rounded-full bg-secondary text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-secondary/20">Critical Disruption</div>
              <div className="px-6 py-2.5 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest italic border border-white/10">Low Complexity</div>
           </div>
        </div>
      </div>

      <div className="hyper-card overflow-hidden group border border-white/10 rounded-[48px]">
        <div className="p-16 bg-white/[0.02] h-full flex flex-col backdrop-blur-3xl">
           <div className="flex justify-between items-start mb-16">
              <div className="w-24 h-24 bg-accent/10 rounded-[32px] flex items-center justify-center border border-accent/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 shadow-2xl shadow-accent/10">
                <Zap className="text-accent w-12 h-12" />
              </div>
              <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em] font-black italic">SIGMA_PRE-v5</div>
           </div>
           
           <h3 className="font-display font-black text-5xl text-white mb-10 uppercase tracking-[0.1em] italic leading-tight">Preemption</h3>
           <p className="text-2xl text-slate-400 font-light leading-relaxed mb-16 border-l-[6px] border-accent pl-10 py-6 italic bg-accent/5 rounded-r-[32px] opacity-80">
             "Precision extraction. Advanced state rollback for surgical resource re-initialization."
           </p>

           <div className="space-y-10 flex-grow">
              <div className="space-y-4">
                 <h5 className="text-white font-black text-[11px] uppercase tracking-[0.3em] italic">Victim Vector</h5>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80">Identify victim nodes via cost-weighted topography and force vector release.</p>
              </div>
              <div className="space-y-4">
                 <h5 className="text-white font-black text-[11px] uppercase tracking-[0.3em] italic">Rollback Sync</h5>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80">Reverse system states to the last verified kernel topography.</p>
              </div>
           </div>

           <div className="mt-16 pt-10 border-t border-white/10 flex gap-4">
              <div className="px-6 py-2.5 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-accent/20">Operational Extract</div>
              <div className="px-6 py-2.5 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest italic border border-white/10">High Complexity</div>
           </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const DetectionFix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prev' | 'avoid' | 'recover'>('avoid');
  const [nodes, setNodes] = useState<{id: string, type: 'P' | 'R'}[]>([]);
  const [edges, setEdges] = useState<{from: string, to: string}[]>([]);

  const cycleFound = useMemo(() => {
    return edges.length > 0 && nodes.length > 1 && edges.length >= nodes.length;
  }, [edges, nodes]);

  const addNode = (type: 'P' | 'R') => {
    const id = type + (nodes.filter(n => n.type === type).length + 1);
    setNodes([...nodes, { id, type }]);
  };

  const addEdge = (from: string, to: string) => {
    if (edges.find(e => e.from === from && e.to === to)) return;
    setEdges([...edges, { from, to }]);
  };

  return (
    <PageWrapper>
      <div className="relative">
        <div className="fixed inset-0 grid-overlay opacity-10 pointer-events-none" />
        
        {/* RAG Builder Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-sans text-[10px] font-bold tracking-widest uppercase mb-4"
            >
              Diagnostic Tool // V.RAG
            </motion.div>
            <h1 className="font-sans font-bold text-7xl md:text-9xl text-white mb-8 tracking-tight leading-[1.05]">RAG Analysis</h1>
            <p className="text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
              Resource Allocation Graphs provide the formal topography for modeling kernel state 
              and detecting sub-cycle dependencies.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 lg:p-10 flex flex-col gap-8 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Kernel Node Controls</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => addNode('P')}
                    className="p-8 flex flex-col items-center gap-4 bg-white/5 border border-white/5 hover:border-primary/40 group transition-all rounded-[24px]"
                  >
                    <Plus className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">System (P)</span>
                  </button>
                  <button 
                    onClick={() => addNode('R')}
                    className="p-8 flex flex-col items-center gap-4 bg-white/5 border border-white/5 hover:border-white/20 group transition-all rounded-[24px]"
                  >
                    <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Grid (R)</span>
                  </button>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Link Vector Hub</span>
                   <div className="flex gap-4">
                    <input 
                      id="edge-from" placeholder="SRC" 
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm w-full outline-none focus:border-primary/50 font-mono text-center text-white focus:bg-white/10 transition-all uppercase placeholder:text-white/20"
                    />
                    <div className="flex items-center text-primary font-bold">→</div>
                    <input 
                      id="edge-to" placeholder="DST" 
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm w-full outline-none focus:border-primary/50 font-mono text-center text-white focus:bg-white/10 transition-all uppercase placeholder:text-white/20"
                    />
                    <button 
                      onClick={() => {
                        const f = (document.getElementById('edge-from') as HTMLInputElement).value;
                        const t = (document.getElementById('edge-to') as HTMLInputElement).value;
                        if (f && t) addEdge(f, t);
                      }}
                      className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shrink-0 shadow-lg shadow-primary/20"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => { setNodes([]); setEdges([]); }}
                  className="w-full py-4 rounded-2xl border border-white/5 text-white/30 font-bold tracking-widest uppercase text-[10px] hover:bg-secondary hover:text-white transition-all outline-none"
                >
                  Terminate Grid Logic
                </button>
              </div>

              <div className="hyper-card p-10 bg-primary/5 border border-primary/20 rounded-[40px] shadow-2xl shadow-primary/5">
                 <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 flex items-center gap-4 italic leading-none">
                    <Activity className="w-5 h-5 shadow-[0_0_15px_#FF6700]" />
                    Live Metrics
                 </h4>
                 <div className="space-y-6 text-[10px] font-black uppercase tracking-[0.4em] italic">
                    <div className="flex justify-between text-white/40">
                       <span>Total Nodes:</span>
                       <span className="text-white">{nodes.length}</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                       <span>Vector Edges:</span>
                       <span className="text-white">{edges.length}</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                       <span>Risk Level:</span>
                       <span className={cycleFound ? 'text-secondary animate-pulse' : 'text-primary'}>
                         {cycleFound ? 'Critical' : 'Stable'}
                       </span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-8 hyper-card p-2 min-h-[650px] overflow-hidden bg-surface/40">
               <div className="bg-background/20 rounded-[28px] w-full h-full relative flex items-center justify-center p-12 overflow-hidden">
                  <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
                  
                  {nodes.length === 0 && (
                    <div className="text-slate-600 flex flex-col items-center gap-10 text-center">
                      <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                        <Cpu className="w-12 h-12 opacity-30 text-primary" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-xl font-display font-black text-white/50 tracking-widest uppercase italic">Empty Grid State</p>
                        <p className="text-[10px] font-mono text-slate-500 max-w-[300px] uppercase tracking-[0.4em] leading-loose">
                          Initialize system kernels to generate topography
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-20 relative z-10 w-full h-full">
                    {nodes.map(node => (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`w-28 h-28 flex items-center justify-center font-display font-black text-2xl relative overflow-hidden group shadow-3xl ${node.type === 'P' ? 'rounded-full border-4 border-primary shadow-primary/20 bg-primary/10 text-primary italic' : 'rounded-[24px] border-4 border-white/20 bg-white/5 text-white'}`}
                      >
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                         <span>{node.id}</span>
                         <div className="absolute bottom-3 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            {node.type === 'P' ? 'CORE' : 'GRID'}
                         </div>
                      </motion.div>
                    ))}
                    
                    <div className="absolute top-10 left-10 space-y-3 pointer-events-none">
                       {edges.map((edge, idx) => (
                         <motion.div 
                           key={idx}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="text-[9px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-4 py-2 rounded-full border border-white/10"
                         >
                           <span className="text-primary italic">{edge.from}</span>
                           <span className="mx-3 opacity-30">→ linked →</span>
                           <span className="text-white">{edge.to}</span>
                         </motion.div>
                       ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {cycleFound && (
                      <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="absolute bottom-10 right-10 hyper-card border-secondary/50 bg-secondary/20 p-10 flex items-center gap-6 shadow-3xl shadow-secondary/20 z-30"
                      >
                        <div className="w-16 h-16 rounded-[24px] bg-secondary flex items-center justify-center shadow-lg shadow-secondary/40">
                          <AlertTriangle className="text-white w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase text-xl leading-none tracking-tighter italic font-display">Deadlock Breach</h4>
                          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active Cycle Detected</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </section>

        {/* Strategies Section */}
        <section className="py-40 px-6 bg-surface/30 backdrop-blur-3xl relative overflow-hidden z-10 border-t border-white/[0.05]">
          <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-32 space-y-16">
              <div className="text-center space-y-6">
                <h2 className="font-display font-black text-7xl md:text-8xl text-white tracking-widest uppercase italic leading-[0.8] mb-4">Operations</h2>
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em] font-black">Strategic Kernel Protocol</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-2xl">
                {[
                  { id: 'prev', label: 'PREVENTION', icon: ShieldCheck },
                  { id: 'avoid', label: 'AVOIDANCE', icon: Eye },
                  { id: 'recover', label: 'RECOVERY', icon: RefreshCw }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-10 py-5 rounded-[24px] flex items-center gap-4 font-display text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 relative ${activeTab === tab.id ? 'text-white italic' : 'text-white/40 hover:text-white'}`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-primary rounded-[24px] shadow-xl shadow-primary/30"
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-white/40'}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {activeTab === 'prev' && <PreventionTab />}
                {activeTab === 'avoid' && <AvoidanceTab />}
                {activeTab === 'recover' && <RecoveryTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default DetectionFix;
