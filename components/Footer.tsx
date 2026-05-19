import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-dim py-8 px-6 text-center bg-[#050a10]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#6a8099] grid grid-cols-2 gap-0.5 p-0.5 rounded-sm opacity-50">
            <div className="bg-[#6a8099] rounded-[1px]" />
            <div className="bg-[#6a8099] rounded-[1px]" />
            <div className="bg-[#6a8099]/40 rounded-[1px]" />
            <div className="bg-[#6a8099] rounded-[1px]" />
          </div>
          <span className="font-sans font-bold text-xs tracking-[0.2em] text-[#6a8099] uppercase">
            GRIDLOCK
          </span>
        </div>
        <p className="text-[#6a8099] text-[10px] font-bold uppercase tracking-widest">
          © 2026 Smart City OS Monitor — OS Concepts Project
        </p>
        <div className="flex items-center gap-6 text-[#6a8099] text-[10px] font-bold uppercase tracking-widest">
          <span className="opacity-50">University of Barrett Hodgson</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
