
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  GitMerge,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Home: React.FC = () => {
  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[160px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[160px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-48 pb-40 relative z-10">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary font-mono text-[10px] font-black tracking-[0.3em] uppercase mb-10 backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#FF6700]" />
                HyperOS Core // V.3.0
              </div>
              <h1 className="font-display font-black text-7xl md:text-9xl text-white tracking-widest mb-10 uppercase leading-[0.8] italic">
                Grid <br/>
                <span className="text-primary not-italic drop-shadow-[0_0_40px_rgba(255,103,0,0.3)]">Lock</span>
              </h1>
              <p className="text-2xl text-slate-400 font-light leading-relaxed mb-12 max-w-lg font-sans italic opacity-80">
                The definitive topography for analyzing kernel contention and deadlock dynamics.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/simulator" className="btn-primary px-12 group">
                   Launch Grid
                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/analysis" className="btn-secondary px-12">
                   Case Study
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square"
            >
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
               <div className="relative w-full h-full p-1 bg-gradient-to-tr from-white/20 to-transparent rounded-[80px] rotate-3 shadow-3xl">
                  <div className="w-full h-full bg-black/60 backdrop-blur-3xl rounded-[78px] flex items-center justify-center -rotate-3 border border-white/20 shadow-inner relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />
                     <div className="relative z-10 text-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                          className="w-56 h-56 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center p-10 mb-8 mx-auto"
                        >
                           <ShieldAlert className="w-24 h-24 text-primary" />
                        </motion.div>
                        <div className="font-display font-black text-5xl text-white uppercase tracking-[0.1em] italic">Safe State</div>
                        <div className="font-mono text-[10px] text-primary font-black uppercase mt-6 tracking-[0.5em]">Kernel Monitoring Active</div>
                     </div>
                     {/* Decorative Elements */}
                     <div className="absolute top-16 right-16 w-4 h-4 bg-primary rounded-full shadow-[0_0_25px_#FF6700]" />
                     <div className="absolute bottom-16 left-16 w-4 h-4 bg-accent rounded-full animate-ping" />
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "RAG Engine", 
                desc: "Real-time Resource Allocation Graph visualization with cycle detection logic.",
                icon: GitMerge,
                color: "text-primary"
              },
              { 
                title: "Banker's Logic", 
                desc: "Simulated resource pre-allocation using safety state heuristics.",
                icon: ShieldCheck,
                color: "text-accent"
              },
              { 
                title: "Grid Analysis", 
                desc: "Comprehensive deadlock metrics for large-scale distributed clusters.",
                icon: Cpu,
                color: "text-secondary"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hyper-card hyper-card-hover p-12 group border-white/10"
              >
                <div className={`w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                  <f.icon className={`w-10 h-10 ${f.color}`} />
                </div>
                <h3 className="text-4xl font-display font-black text-white uppercase mb-6 tracking-widest italic">{f.title}</h3>
                <p className="text-slate-400 text-xl font-light leading-relaxed">{f.desc}</p>
                <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-3 text-primary font-mono text-[11px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  Initialize <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
