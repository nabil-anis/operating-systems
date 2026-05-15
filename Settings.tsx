
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 pb-20 pt-10 border-t border-white/5">
      <div className="flex flex-col lg:flex-row gap-12 justify-center items-start max-w-5xl mx-auto">
        
        {/* Left: About / Context */}
        <div className="flex-1 space-y-8">
           <h3 className="text-2xl font-outfit font-bold text-white mb-2">Platform Context</h3>
           <p className="text-gray-400 leading-relaxed text-sm">
             Voicemail Automation needed a way to scale their outreach without hiring a call center. 
             This solution integrates standard business tools (Google Sheets) with advanced automation (Slybroadcast/n8n) 
             to create a "set and forget" outbound engine.
           </p>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Architecture</p>
                 <p className="text-xl font-bold text-white">Low-Code</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                 <p className="text-xl font-bold text-white">Live Operations</p>
              </div>
           </div>
        </div>

        {/* Right: Tech Stack */}
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-outfit font-bold text-white mb-8">Technology Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Google Sheets', desc: 'Database & Command', icon: 'fa-table', color: 'text-green-400' },
              { name: 'n8n', desc: 'Automation Logic', icon: 'fa-microchip', color: 'text-blue-400' },
              { name: 'Slybroadcast', desc: 'Voicemail Delivery', icon: 'fa-paper-plane', color: 'text-orange-400' },
              { name: 'IF Nodes', desc: 'Conditional Gates', icon: 'fa-code-branch', color: 'text-purple-400' },
            ].map((tech) => (
              <div key={tech.name} className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
                 <div className={`w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center ${tech.color} border border-white/5 group-hover:border-${tech.color.split('-')[1]}-500/30 transition-colors`}>
                    <i className={`fas ${tech.icon}`}></i>
                 </div>
                 <div>
                    <p className="font-bold text-white text-sm">{tech.name}</p>
                    <p className="text-[10px] text-gray-500">{tech.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
