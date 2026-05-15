
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Presentation as PresentationIcon, 
  Download, 
  FileText, 
  ChevronRight,
  TrendingDown,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  PieChart,
  ExternalLink
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const StatBox = ({ label, value, trend, icon: Icon }: any) => (
  <div className="hyper-card p-10 bg-white/[0.02] border border-white/10 rounded-[40px] hover:bg-white/[0.05] transition-all group backdrop-blur-3xl shadow-3xl">
     <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-[22px] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 shadow-primary/10">
           <Icon className="text-primary w-7 h-7 shadow-[0_0_15px_#FF6700]" />
        </div>
        <div className="text-[10px] font-black text-success flex items-center gap-2 italic uppercase tracking-widest opacity-60">
           {trend} <TrendingDown className="w-4 h-4 rotate-180" />
        </div>
     </div>
     <div className="text-5xl font-display font-black text-white mb-2 italic tracking-tighter">{value}</div>
     <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic">{label}</div>
  </div>
);

const Presentation: React.FC = () => {
  return (
    <PageWrapper>
      <div className="relative">
        <div className="fixed inset-0 grid-overlay opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-40 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left: Branding & Overview */}
            <div className="lg:col-span-12 mb-16 lg:mb-32">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6 lg:space-y-10 max-w-5xl"
               >
                 <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-black uppercase tracking-[0.6em] italic opacity-80">
                    Analytical Ledger // v4.Kernel
                 </div>
                 <h1 className="font-display font-black text-6xl md:text-8xl lg:text-[140px] text-white tracking-[-0.06em] uppercase leading-[0.8] italic break-words">
                   Systemic <br className="hidden md:block" /> 
                   <span className="text-transparent border-text block mt-4 lg:mt-8">Audit.Report</span>
                 </h1>
                 <p className="text-slate-200 text-xl lg:text-3xl font-light leading-relaxed font-sans max-w-3xl border-l-[4px] border-primary pl-8 lg:pl-12 italic opacity-95">
                   Visualizing the systemic risks of resource contention in next-gen smart infrastructures 
                   through the lens of Operating System deadlock theory.
                 </p>
               </motion.div>
            </div>

            {/* Mid: Key Metrics Portfolio */}
            <div className="lg:col-span-8 space-y-8 lg:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                   <StatBox label="System Collision Risk" value="14.2%" trend="+2.4%" icon={Activity} />
                   <StatBox label="Optimization Index" value="98.1" trend="-0.5%" icon={ShieldCheck} />
                   <StatBox label="Deadlock Responsetime" value="42ms" trend="+8.1%" icon={Zap} />
                </div>

                <div className="hyper-card p-2 lg:p-3 bg-white/[0.03] border border-white/10 rounded-[40px] lg:rounded-[56px] shadow-3xl backdrop-blur-3xl">
                   <div className="bg-black/40 rounded-[32px] lg:rounded-[48px] p-8 lg:p-16">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-12 lg:mb-16 gap-8">
                         <div>
                            <h3 className="text-white font-display font-black text-3xl lg:text-4xl uppercase tracking-tighter italic text-center md:text-left">Grid Matrix</h3>
                            <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.4em] italic mt-2 text-center md:text-left">Simulated vs Actual Collision Data</p>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-12 h-1 bg-primary rounded-full shadow-[0_0_10px_#FF6700]" />
                            <div className="w-12 h-1 bg-white/10 rounded-full" />
                         </div>
                      </div>

                      <div className="aspect-video lg:aspect-[21/9] w-full bg-black/40 rounded-[32px] lg:rounded-[40px] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-inner">
                         <div className="absolute inset-0 grid-overlay opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <PieChart className="w-32 h-32 text-primary/10 animate-pulse" />
                         </div>
                         <div className="relative text-center space-y-6">
                            <div className="w-32 h-32 rounded-full border-[6px] border-dashed border-primary/40 flex items-center justify-center animate-spin-slow">
                               <PresentationIcon className="w-12 h-12 text-white rotate-0 group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                            <div className="text-[11px] font-black text-primary uppercase tracking-[0.6em] italic opacity-60">Analytics Ready</div>
                         </div>
                      </div>

                      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <div className="text-white/60 font-black text-[11px] tracking-[0.4em] uppercase italic opacity-60 flex justify-between">
                              Systemic Stability
                              <span className="text-primary tracking-tighter italic font-black text-sm">85%</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-primary rounded-full shadow-[0_0_15px_#FF6700]" />
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div className="text-white/60 font-black text-[11px] tracking-[0.4em] uppercase italic opacity-60 flex justify-between">
                              Recovery Efficiency
                              <span className="text-secondary tracking-tighter italic font-black text-sm">62%</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '62%' }} className="h-full bg-secondary rounded-full shadow-[0_0_15px_#f43f5e]" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Technical Details & Assets */}
             <div className="lg:col-span-4 h-full">
                <div className="hyper-card p-12 bg-white/[0.02] border border-white/10 rounded-[56px] shadow-3xl backdrop-blur-3xl h-full flex flex-col justify-between">
                   <div>
                      <div className="flex items-center gap-4 mb-16">
                         <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                           <FileText className="text-primary w-6 h-6" />
                         </div>
                         <h3 className="text-white font-black text-[11px] uppercase tracking-[0.5em] italic opacity-60">Case Meta</h3>
                      </div>

                      <div className="space-y-8">
                         {[
                           { label: 'Project Name', val: 'GRIDLOCK' },
                           { label: 'Core Engine', val: 'Vite/Antigravity' },
                           { label: 'Algorithm', val: 'Banker\'s OS v4' },
                           { label: 'Region', val: 'Smart District 7' },
                           { label: 'Status', val: 'Verified Safe' }
                         ].map((item, i) => (
                           <div key={i} className="flex justify-between items-end border-b border-white/5 pb-6 last:border-0 hover:bg-white/5 px-4 transition-all duration-500 group rounded-2xl">
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic group-hover:text-primary transition-colors">{item.label}</span>
                              <span className="text-sm font-black text-white italic tracking-tighter">{item.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-16 space-y-4">
                      <button className="w-full btn-primary h-20 text-[10px] font-black tracking-[0.5em] uppercase italic flex items-center justify-center gap-4 group rounded-[32px] shadow-2xl shadow-primary/20">
                         <Download className="w-5 h-5 group-hover:-translate-y-2 transition-transform duration-500" />
                         Download Audit PDF
                      </button>
                      <button className="w-full h-20 rounded-[32px] border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-white/5 hover:text-white transition-all italic">
                         <ExternalLink className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                         Source Artifacts
                      </button>
                   </div>
                </div>
             </div>

              {/* Bottom: Final Callout */}
              <div className="lg:col-span-12 mt-20 lg:mt-40">
                 <div className="hyper-card p-10 lg:p-16 bg-primary/5 border border-primary/20 rounded-[40px] lg:rounded-[56px] relative overflow-hidden group shadow-3xl shadow-primary/5 backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                       <div className="space-y-6 lg:space-y-8 max-w-2xl px-2">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                               <Globe className="text-primary w-5 h-5 shadow-[0_0_10px_#FF6700]" />
                             </div>
                             <span className="text-primary font-mono text-[12px] font-black uppercase tracking-[0.6em] italic opacity-80">Future Strategy</span>
                          </div>
                          <h2 className="text-white font-display font-black text-4xl md:text-6xl uppercase tracking-tighter italic leading-none">Scalable Grid <br/> <span className="text-primary">Intelligence</span></h2>
                          <p className="text-slate-200 text-lg lg:text-xl font-light italic leading-relaxed opacity-95">
                            The GRIDLOCK engine is designed to handle up to 4,096 concurrent resource nodes, 
                            mapping real-time IoT data into our safety verification logic.
                          </p>
                       </div>
                       <div className="shrink-0 w-48 h-48 lg:w-60 lg:h-60 rounded-full border-[3px] border-primary/20 flex items-center justify-center animate-spin-slow relative">
                          <div className="absolute inset-0 rounded-full border-[3px] border-primary/40 border-dashed animate-reverse-spin" />
                          <Zap className="w-12 h-12 lg:w-16 lg:h-16 text-primary shadow-[0_0_30px_#FF6700]" />
                       </div>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Presentation;
