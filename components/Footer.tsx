
import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-40 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="md:col-span-2 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[20px] bg-primary flex items-center justify-center p-2 shadow-2xl shadow-primary/20">
                <LayoutGrid className="w-full h-full text-white" />
              </div>
              <span className="font-display font-black text-3xl tracking-[0.1em] text-white uppercase italic">
                Grid<span className="text-primary not-italic">Lock</span>
              </span>
            </div>
            <p className="text-slate-400 text-xl font-light leading-relaxed max-w-md italic opacity-80">
              The definitive topography for analyzing kernel contention and deadlock dynamics.
              Built for the Smart City Gridlock Engine.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.4em] italic opacity-40">The Minds</h4>
            <div className="space-y-4">
               <div className="text-white font-display font-black text-2xl uppercase tracking-widest italic leading-tight">Muhammad Nabeel</div>
               <div className="text-white font-display font-black text-2xl uppercase tracking-widest italic leading-tight">Usaid Owais</div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.4em] italic opacity-40">System Core</h4>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.5em] leading-loose italic font-black">
              HyperOS v4.0.2<br/>
              Distributed Node v7<br/>
              Safe State Kernel
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-20 border-t border-white/5">
           <div className="text-slate-600 font-mono text-[9px] uppercase tracking-[0.5em] italic font-black">
             © 2026 GridLock Logic Kernel. All Rights Reserved.
           </div>
           <div className="flex gap-8">
              {['Twitter', 'Github', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-white/20 hover:text-primary transition-all font-mono text-[9px] font-black uppercase tracking-widest italic">{social}</a>
              ))}
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
