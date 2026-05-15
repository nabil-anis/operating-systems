
import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Cpu, 
  Activity, 
  Shield, 
  Workflow,
  ChevronRight,
  Code2,
  Terminal,
  Grid3X3,
  Network
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const VisualizationPlaceholder = () => {
  const [activeAlgo, setActiveAlgo] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlgo(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const algos = [
    { title: 'DETECTION', subtitle: 'Graph Cycle Tracing', color: 'text-primary' },
    { title: 'PREVENTION', subtitle: 'Hierarchical Locking', color: 'text-secondary' },
    { title: 'AVOIDANCE', subtitle: 'Banker Safety Check', color: 'text-accent' }
  ];

  return (
    <div className="relative aspect-video lg:aspect-[21/9] bg-black/60 rounded-[40px] lg:rounded-[64px] border border-white/5 overflow-hidden group shadow-inner">
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
           <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#00f5ff] ${algos[activeAlgo].color === 'text-primary' ? 'bg-primary' : algos[activeAlgo].color === 'text-secondary' ? 'bg-secondary' : 'bg-accent'}`} />
           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic font-mono">
             CORE_ENGINE_STATE: <span className={algos[activeAlgo].color}>{algos[activeAlgo].title}</span>
           </span>
        </div>
        <div className="hidden md:flex gap-4">
           {[0, 1, 2].map(i => (
             <div key={i} className={`h-1 w-12 rounded-full transition-all duration-700 ${i === activeAlgo ? 'bg-primary w-24' : 'bg-white/10'}`} />
           ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-24">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeAlgo}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {/* Algorithm Specific Visualization */}
            {activeAlgo === 0 && (
              <div className="relative w-full h-full flex items-center justify-center">
                 <div className="grid grid-cols-3 gap-12 lg:gap-24">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="relative">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="w-24 h-24 lg:w-32 lg:h-32 rounded-[32px] border-2 border-primary/20 border-dashed"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center">
                             <span className="text-primary font-black italic">P{i}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path 
                      d="M 30% 50% Q 50% 10% 70% 50% T 30% 50%" 
                      stroke="url(#grad1)" 
                      strokeWidth="3" 
                      fill="none" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <defs>
                      <linearGradient id="grad1"><stop offset="0%" stopColor="#00f5ff" /><stop offset="100%" stopColor="#6c63ff" /></linearGradient>
                    </defs>
                 </svg>
              </div>
            )}

            {activeAlgo === 1 && (
               <div className="flex flex-col items-center justify-center gap-12">
                  <div className="flex gap-4">
                     {[1, 2, 3, 4].map(i => (
                       <motion.div 
                         key={i}
                         animate={{ y: [0, -20, 0] }}
                         transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                         className="w-16 h-24 lg:w-20 lg:h-28 rounded-2xl bg-secondary/10 border border-secondary/40 flex items-end justify-center p-4"
                       >
                         <div className="w-full bg-secondary h-1/2 rounded-lg shadow-[0_0_15px_#6c63ff]" />
                       </motion.div>
                     ))}
                  </div>
                  <div className="text-secondary font-mono text-[9px] uppercase tracking-[0.6em] font-black italic opacity-40">ENFORCING_STRICT_TOTAL_ORDER</div>
               </div>
            )}

            {activeAlgo === 2 && (
              <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
                 <div className="absolute inset-0 border-[3px] border-accent/20 rounded-[48px] overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent w-full h-full"
                    />
                 </div>
                 <div className="flex flex-col items-center gap-8 relative z-10">
                    <Shield className="w-20 h-20 text-accent animate-pulse" />
                    <div className="px-10 py-5 rounded-full bg-accent/20 border border-accent/40 text-accent font-black italic uppercase tracking-widest">
                       SAFETY_SEQ: FOUND
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Monitor */}
      <div className="absolute right-12 bottom-12 w-64 p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl z-20">
         <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">{algos[activeAlgo].subtitle}</span>
            <div className={`w-2 h-2 rounded-full shadow-lg ${algos[activeAlgo].color === 'text-primary' ? 'bg-primary' : algos[activeAlgo].color === 'text-secondary' ? 'bg-secondary' : 'bg-accent'}`} />
         </div>
         <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div className={`h-full bg-primary`} animate={{ width: ['20%', '85%', '45%'] }} transition={{ duration: 5, repeat: Infinity }} />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div className={`h-full bg-secondary`} animate={{ width: ['70%', '35%', '95%'] }} transition={{ duration: 4, repeat: Infinity }} />
            </div>
         </div>
      </div>
      
      <div className="absolute bottom-12 left-12 z-20">
        <div className="flex items-center gap-4 px-8 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-black uppercase tracking-[0.4em] italic opacity-60 backdrop-blur-md">
           MODULE_BOOT: 0xHYPER_V4
        </div>
      </div>
    </div>
  );
};

const Section = ({ id, title, subtitle, icon: Icon, children, index }: any) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      id={id} 
      className="py-12 lg:py-20 relative"
    >
      <div className="absolute -left-12 top-48 w-px h-full bg-gradient-to-b from-primary/30 to-transparent hidden lg:block" />
      
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-10 mb-10 lg:mb-16">
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[28px] lg:rounded-[32px] bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 shadow-3xl backdrop-blur-3xl group">
          <Icon className="text-primary w-8 h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <div className="text-primary font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.5em] mb-3 lg:mb-4 font-black italic opacity-60">{subtitle}</div>
          <h2 className="font-display font-black text-4xl md:text-7xl text-white tracking-tighter uppercase leading-none italic">{title}</h2>
        </div>
      </div>

      <div className="hyper-card p-8 lg:p-20 bg-white/[0.02] border border-white/10 rounded-[40px] lg:rounded-[56px] shadow-3xl backdrop-blur-3xl">
        <div className="prose prose-invert max-w-none text-slate-400 font-sans text-lg lg:text-xl leading-relaxed italic opacity-80">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

const Learn: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <PageWrapper>
      <div ref={containerRef} className="relative min-h-screen">
        <div className="fixed inset-0 grid-overlay opacity-10 pointer-events-none" />
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full" />
        </div>

        <div className="fixed left-8 top-1/2 -translate-y-1/2 w-px h-64 bg-white/5 z-50 hidden xl:block">
           <motion.div 
             className="w-full bg-primary origin-top shadow-[0_0_15px_#00f5ff]"
             style={{ scaleY }}
           />
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary font-mono uppercase tracking-widest vertical-text">
             Progress
           </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
          {/* Header */}
          <div className="mb-24">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-4 text-primary mb-10"
            >
              <FileText className="w-8 h-8" />
              <span className="font-mono text-xs uppercase tracking-[0.6em] font-black underline underline-offset-[12px] decoration-primary italic opacity-60">Technical.Audit</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="font-display font-black text-6xl md:text-[140px] text-white mb-8 lg:mb-12 tracking-[-0.06em] uppercase leading-[0.8] italic"
            >
              OS <br/> 
              <span className="text-transparent border-text block mt-4">Case Study</span>
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-12 items-start mt-20">
               <div className="space-y-6 flex-grow">
                 <p className="text-slate-500 text-2xl md:text-3xl font-light leading-relaxed font-sans italic opacity-80">
                    A comprehensive investigation into Deadlock Management Systems within Smart City infrastructures.
                 </p>
                 <div className="flex items-center gap-6 pt-10">
                    <div className="flex -space-x-4">
                       <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary italic text-xl">MN</div>
                       <div className="w-14 h-14 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center font-black text-secondary italic text-xl">UO</div>
                    </div>
                    <div>
                       <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] block italic">Research Lead</span>
                       <span className="text-white text-lg font-black italic uppercase tracking-tighter">Muhammad Nabeel & Usaid Owais</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-20 lg:mb-32">
             {[
               { id: 'overview', label: 'Overview', icon: Users },
               { id: 'architecture', label: 'Logic', icon: Cpu },
               { id: 'visualization', label: 'Topology', icon: Network },
               { id: 'conclusion', label: 'Outcome', icon: Shield }
             ].map((item, i) => (
               <a key={i} href={`#${item.id}`} className="hyper-card p-6 lg:p-10 bg-white/[0.02] border border-white/10 rounded-[28px] lg:rounded-[32px] hover:border-primary/50 transition-all group backdrop-blur-3xl">
                 <item.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary mb-4 lg:mb-6 group-hover:scale-125 transition-transform duration-500 shadow-2xl" />
                 <div className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.3em] italic opacity-60 group-hover:opacity-100 transition-opacity">{item.label}</div>
               </a>
             ))}
          </div>

          <Section id="overview" title="The Project" subtitle="01. Authorship" icon={Users} index={0}>
             <div className="space-y-8">
               <p>
                 Developed as a flagship <span className="text-white font-black italic">Operating Systems Project</span> by <span className="text-primary font-black italic">Muhammad Nabeel</span> and <span className="text-secondary font-black italic">Usaid Owais</span>, 
                 this application serves as a high-fidelity simulator for Deadlock Detection, Prevention, and Avoidance strategies.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10">
                     <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 italic flex items-center gap-3">
                       <Terminal className="w-5 h-5 text-primary" />
                       Core Objective
                     </h4>
                     <p className="text-slate-400 text-sm leading-relaxed">
                       To bridge the gap between abstract OS theory and practical urban infrastructure management through interactive graph-based logic.
                     </p>
                  </div>
                  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10">
                     <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 italic flex items-center gap-3">
                       <Grid3X3 className="w-5 h-5 text-secondary" />
                       Systems Scope
                     </h4>
                     <p className="text-slate-400 text-sm leading-relaxed">
                       Implementing Banker's Algorithm, Resource Allocation Graphs, and Total Ordering hierarchies in a real-time environment.
                     </p>
                  </div>
               </div>
             </div>
          </Section>

          <Section id="architecture" title="Kernel Logic" subtitle="02. Implementation" icon={Cpu} index={1}>
             <div className="space-y-10">
               <p>
                 Our implementation focuses on the <span className="text-white font-black italic">HyperOS Kernel v4</span>, which utilizes three distinct strategies for resource safety:
               </p>
               <div className="space-y-6">
                 {[
                   { title: 'Detection & Recovery', desc: 'Active monitoring of RAG cycles using graph traversal algorithms. Triggers preemption protocols upon cycle detection.' },
                   { title: 'Prevention Hierarchy', desc: 'Eliminating circular wait via resource index ordering. Forces processes to request resources in a strict monotonic sequence.' },
                   { title: 'Predictive Avoidance', desc: "Safe state simulation based on processes' maximum claims. Grants requests only if a guaranteed sequence to completion exists." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-8 p-10 rounded-[40px] bg-black/40 border border-white/10 hover:bg-black/60 transition-all items-center">
                     <span className="text-5xl font-display font-black italic text-primary/10">{i + 1}</span>
                     <div>
                       <h5 className="text-white font-black uppercase text-lg italic tracking-tight">{item.title}</h5>
                       <p className="text-slate-500 text-sm italic">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </Section>

          <Section id="visualization" title="Topology" subtitle="03. Visualization" icon={Network} index={2}>
             <p className="mb-12">
               The following model illustrates the <span className="text-white font-black italic">Resource Allocation Graph</span> architecture used to identify systemic gridlocks in our project simulation.
             </p>
             <VisualizationPlaceholder />
             <div className="mt-12 p-10 rounded-[40px] bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-3xl shadow-primary/20 shrink-0">
                  <Workflow className="text-primary w-10 h-10" />
                </div>
                <div>
                   <h4 className="text-white font-black text-sm uppercase italic tracking-widest mb-2 font-mono">Sim_Logic_Flow</h4>
                   <p className="text-slate-400 text-sm leading-relaxed italic">
                     By mapping processes (Nodes) and resources (Edges) as a mathematical set, we leverage Boolean satisfaction logic to ensure zero-collision throughput.
                   </p>
                </div>
             </div>
          </Section>

          <Section id="conclusion" title="Outcome" subtitle="04. Evaluation" icon={Shield} index={3}>
             <div className="space-y-8">
               <p className="text-2xl text-white/90 font-black italic leading-tight tracking-tight uppercase border-l-[3px] border-primary/30 pl-10">
                 The Case Study confirms that while Detection is cost-effective, Avoidance (Banker's) provides the highest systemic reliability for critical urban services.
               </p>
               <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 space-y-6">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic font-mono">Stability_Score</span>
                    <span className="text-primary font-black text-2xl italic tracking-tighter">99.8%</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic font-mono">Logic_Execution</span>
                    <span className="text-secondary font-black text-2xl italic tracking-tighter">OMNICHANNEL</span>
                 </div>
               </div>
             </div>
          </Section>

          <div className="py-32 text-center space-y-12">
             <div className="w-px h-32 bg-gradient-to-b from-primary to-transparent mx-auto opacity-50" />
             <h2 className="font-display font-black text-6xl md:text-8xl text-white uppercase tracking-tighter italic">Experience <span className="text-primary mt-2 block">Their Logic.</span></h2>
             <p className="text-white/40 text-xl font-black uppercase tracking-[0.4em] italic leading-tight">Proceed to the interactive simulation hub to test the implementation.</p>
             <div className="pt-10">
               <button className="btn-primary px-12 py-6 text-[10px] font-black tracking-[0.5em] uppercase italic group relative flex items-center gap-4 mx-auto">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-4">
                    LAUNCH SIMULATOR
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Learn;
