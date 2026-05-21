import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-dim/40 py-8 px-6 text-center bg-[#f5f5f7]/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-[18px] h-[18px] border border-neutral-400 grid grid-cols-2 gap-[1px] p-[1.5px] rounded-[4px] opacity-70">
            <div className="bg-neutral-500 rounded-[1px]" />
            <div className="bg-neutral-500 rounded-[1px]" />
            <div className="bg-neutral-500/40 rounded-[1px]" />
            <div className="bg-neutral-500 rounded-[1px]" />
          </div>
          <span className="font-sans font-semibold text-xs text-neutral-500">
            Gridlock
          </span>
        </div>
        <p className="text-[#86868b] text-[11px] font-normal">
          &copy; 2026 Smart City OS Monitor — OS Concepts Project
        </p>
        <div className="flex items-center gap-6 text-[#86868b] text-[11px] font-normal">
          <span className="opacity-80">Barrett Hodgson University</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
