import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { 
  Zap, 
  Lock, 
  Hand, 
  ShieldAlert, 
  RefreshCw, 
  ArrowRight,
  LayoutGrid
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 border border-border-dim/60 rounded-full px-4 py-1.5 text-[0.68rem] tracking-wide text-primary uppercase mb-8 bg-primary/[0.04]"
        >
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(52,199,89,0.4)]" />
          Smart City OS Monitor — Live
        </motion.div>
        
        <motion.h1 
          className="font-extrabold text-[#1d1d1f] leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-[#1d1d1f] block text-4xl sm:text-6xl md:text-8xl">The City Is Thinking.</span>
          <span className="text-primary block text-4xl sm:text-6xl md:text-8xl mt-2">Two Systems Just Froze.</span>
        </motion.h1>

        <motion.p 
          className="text-[#86868b] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          GRIDLOCK visualises OS deadlocks through a Smart City where every system competes for survival. Watch it happen. Understand why. Learn to fix it.
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center">
          <Link to="/simulator" className="btn-primary flex items-center gap-2 px-8 py-4">
            Launch Simulator
          </Link>
          <Link to="/learn" className="btn-ghost flex items-center gap-2 px-8 py-4">
            What is a Deadlock?
          </Link>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-16 w-full px-4">
          {[
            { val: '4', label: 'Coffman Conditions' },
            { val: '3', label: 'Fix Strategies' },
            { val: '∞', label: 'City Scenarios' },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 border-border-dim/50 bg-white shadow-sm">
              <span className="text-3xl font-bold text-primary block">{stat.val}</span>
              <span className="text-[0.68rem] text-[#86868b] uppercase tracking-wider mt-1 block font-semibold">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-[0.68rem] uppercase tracking-wider text-primary mb-4 font-bold">// The Smart City at Risk</div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl text-[#1d1d1f] font-bold tracking-tight leading-tight">When Systems Fight for the Same Resource</h2>
            <p className="text-[#86868b] text-sm md:text-base leading-relaxed">Hospital AI grabs Primary Power first. Power Grid grabs Network Bandwidth first. Now each waits for what the other holds. Neither yields. The city freezes — this is a deadlock.</p>
          </div>
          <div className="glass-panel p-8 bg-white shadow-sm">
            <VisualSimulationGraphic />
          </div>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border-dim/50">
        <div className="text-[0.68rem] uppercase tracking-wider text-primary mb-4 font-bold">// Four Coffman Conditions</div>
        <h2 className="text-3xl text-[#1d1d1f] font-bold mb-2">All Four Must Be Present</h2>
        <p className="text-[#86868b] text-base mb-12">Remove even one and the city stays online.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: '01', icon: Lock, title: 'Mutual Exclusion', desc: 'A resource can only be held by one system at a time. The Hospital AI cannot share the Emergency Channel.' },
            { id: '02', icon: Hand, title: 'Hold and Wait', desc: 'A system holds one resource while waiting for another. The Train holds Data Bus but waits for Bandwidth.' },
            { id: '03', icon: ShieldAlert, title: 'No Preemption', desc: 'Resources cannot be forcibly taken. Only the holding system can release them voluntarily.' },
            { id: '04', icon: RefreshCw, title: 'Circular Wait', desc: 'A closed chain: P1 waits for P2\'s resource, P2 waits for P1\'s. The loop never resolves.' },
          ].map((cond, i) => (
            <div key={i} className="glass-panel p-8 bg-white hover:border-primary/40 transition-all duration-300 group">
              <div className="text-[0.62rem] text-primary/70 font-mono mb-4">CONDITION {cond.id}</div>
              <cond.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-105 transition-transform" />
              <h3 className="text-[#1d1d1f] font-semibold text-sm mb-2 tracking-tight">{cond.title}</h3>
              <p className="text-[#86868b] text-xs leading-relaxed">{cond.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

const VisualSimulationGraphic = () => (
  <svg viewBox="0 0 320 270" className="w-full h-auto">
    <defs>
      <marker id="mh" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#34c759"/></marker>
      <marker id="mr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ff3b30"/></marker>
    </defs>
    <rect x="18" y="18" width="112" height="52" rx="12" fill="rgba(0,113,227,0.04)" stroke="#0071e3" strokeWidth="1.5"/>
    <text x="74" y="40" textAnchor="middle" className="font-sans text-[10px] fill-[#0071e3] font-bold">P1</text>
    <text x="74" y="56" textAnchor="middle" className="font-sans text-[8px] fill-[#86868b]">Hospital AI</text>
    
    <rect x="190" y="18" width="112" height="52" rx="12" fill="rgba(0,113,227,0.04)" stroke="#0071e3" strokeWidth="1.5"/>
    <text x="246" y="40" textAnchor="middle" className="font-sans text-[10px] fill-[#0071e3] font-bold">P2</text>
    <text x="246" y="56" textAnchor="middle" className="font-sans text-[8px] fill-[#86868b]">Power Grid</text>
    
    <rect x="80" y="128" width="64" height="44" rx="8" fill="rgba(88,86,214,0.06)" stroke="#5856d6" strokeWidth="1.5"/>
    <text x="112" y="148" textAnchor="middle" className="font-mono text-[9px] fill-[#5856d6] font-bold">R1</text>
    <text x="112" y="162" textAnchor="middle" className="font-sans text-[7px] fill-[#86868b]">Power</text>
    
    <rect x="176" y="128" width="64" height="44" rx="8" fill="rgba(88,86,214,0.06)" stroke="#5856d6" strokeWidth="1.5"/>
    <text x="208" y="148" textAnchor="middle" className="font-mono text-[9px] fill-[#5856d6] font-bold">R2</text>
    <text x="208" y="162" textAnchor="middle" className="font-sans text-[7px] fill-[#86868b]">Bandwidth</text>
    
    <path d="M 74 70 L 112 128" stroke="#34c759" strokeWidth="1.5" markerEnd="url(#mh)" fill="none" />
    <path d="M 246 70 L 208 128" stroke="#34c759" strokeWidth="1.5" markerEnd="url(#mh)" fill="none" />
    <path d="M 96 46 L 178 140" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#mr)" fill="none" />
    <path d="M 222 46 L 144 140" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#mr)" fill="none" />
    
    <text x="160" y="210" textAnchor="middle" className="font-sans text-[9px] fill-[#ff3b30] font-bold animate-pulse">CIRCULAR WAIT DETECTED</text>
    
    <g transform="translate(18, 240)">
      <line x1="0" y1="0" x2="22" y2="0" stroke="#34c759" strokeWidth="1.5" markerEnd="url(#mh)"/>
      <text x="28" y="4" className="font-sans text-[8px] fill-[#86868b]">Holds</text>
    </g>
    <g transform="translate(92, 240)">
      <line x1="0" y1="0" x2="22" y2="0" stroke="#ff3b30" strokeWidth="1.5" markerEnd="url(#mr)" strokeDasharray="4,2"/>
      <text x="28" y="4" className="font-sans text-[8px] fill-[#86868b]">Waiting</text>
    </g>
  </svg>
);

export default Home;
