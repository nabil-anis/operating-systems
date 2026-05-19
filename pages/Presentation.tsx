import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  BarChart, 
  BookOpen, 
  Presentation as PresIcon, 
  Map as MapIcon, 
  ShieldAlert, 
  RefreshCw, 
  Database,
  Download,
  ExternalLink
} from 'lucide-react';

const Presentation: React.FC = () => {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Project Presentation</h1>
          <p className="text-[#6a8099] text-base md:text-lg font-light tracking-tight">GRIDLOCK — Smart City Deadlock Visualizer</p>
        </div>

        {/* Metadata Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'University', val: 'Barrett Hodgson University' },
            { label: 'Course', val: 'Operating Systems' },
            { label: 'Topic', val: 'Deadlock Control' },
            { label: 'Tools', val: 'React · Framer · Canvas' },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-6 border-border-dim bg-primary/[0.03] text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6a8099] block mb-2">{item.label}</span>
              <span className="text-xs font-bold text-white block leading-tight">{item.val}</span>
            </div>
          ))}
        </div>

        {/* Slides Embed Placeholder */}
        <div className="glass-panel p-2 md:p-4 border-2 border-dashed border-primary/30 bg-primary/[0.02] mb-12 aspect-video flex flex-col items-center justify-center text-center">
          <div className="space-y-6 max-w-sm">
            <PresIcon className="w-16 h-16 text-primary/30 mx-auto" />
            <div>
              <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Slide Deck Host</h3>
              <p className="text-xs text-[#6a8099] leading-relaxed">Embed your Google Slides or PowerPoint deck here for the final presentation.</p>
            </div>
            <div className="text-[10px] bg-primary/10 border border-primary/20 rounded-lg p-3 text-[#6a8099] font-mono leading-relaxed">
              Google Slides: File → Share → Publish → Embed
            </div>
          </div>
        </div>

        {/* Features Coverage */}
        <div className="space-y-8 mb-24">
          <h3 className="text-white font-bold text-lg uppercase tracking-widest border-b border-border-dim pb-4 flex items-center gap-3">
            <BarChart className="w-5 h-5 text-primary" /> Core Module Coverage
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: ShieldAlert, title: 'Deadlock Scenarios', desc: 'Real-time city simulations covering 2-way and multi-sector circular waits.' },
              { icon: MapIcon, title: 'RAG Builder (RAG)', desc: 'Interactive graph constructor with automated DFS-based cycle detection.' },
              { icon: Database, title: 'Banker\'s Monitor', desc: 'Resource management table calculating Safe Sequences and grid limits.' },
              { icon: RefreshCw, title: 'Recovery Units', desc: 'Modelling the cost and logic of Termination vs Preemption strategies.' },
              { icon: BookOpen, title: 'Theoretical Audit', desc: 'Detailed reference deck for OS concepts and famous historical failures.' },
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-6 flex gap-5 border-border-dim hover:bg-primary/[0.05] transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-tight mb-2">{feature.title}</h4>
                  <p className="text-xs text-[#6a8099] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Learnings */}
        <div className="glass-panel p-8 md:p-12 border-accent/20 bg-accent/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><RefreshCw className="w-40 h-40 text-accent animate-spin-slow" /></div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-accent font-black text-xl uppercase tracking-tighter">Diagnostic Summary</h3>
            <div className="space-y-6">
              {[
                { n: '01', text: 'Deadlock is a systems-level emergent problem — perfect logic in isolation can still lead to failure at scale.' },
                { n: '02', text: 'Coffman Conditions are the "Anatomy of Failure" — breaking single constraints secures the entire system.' },
                { n: '03', text: 'Avoidance (Banker\'s) is safer but requires total future knowledge of system requests.' },
                { n: '04', text: 'Detection and Recovery is the industry default, though it accepts data loss during termination.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="font-mono text-accent/50 text-xs font-bold mt-1 tracking-widest">{item.n}</span>
                  <p className="text-white/80 text-[13px] md:text-sm leading-relaxed font-light">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap gap-4 mt-12 justify-center">
          <button className="btn-ghost flex items-center gap-2 group">
            <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> Download PDF Report
          </button>
          <button className="btn-primary flex items-center gap-2 group">
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" /> Full Screen View
          </button>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Presentation;
