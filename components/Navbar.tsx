import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Detect & Fix', path: '/detect' },
    { name: 'Learn', path: '/learn' },
    { name: 'Presentation', path: '/presentation' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] bg-[#050a10]/90 backdrop-blur-xl border-b border-border-dim px-6 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-3 group">
        <div className="w-[26px] h-[26px] border-2 border-primary grid grid-cols-2 gap-[2px] p-[3px] rounded-[4px] bg-transparent">
          <span className="bg-primary rounded-[1px] block" />
          <span className="bg-primary rounded-[1px] block" />
          <span className="bg-primary/40 rounded-[1px] block" />
          <span className="bg-primary rounded-[1px] block" />
        </div>
        <span className="font-sans font-extrabold text-[1.15rem] tracking-[0.15em] text-primary hidden sm:block uppercase">
          GRIDLOCK
        </span>
      </NavLink>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                "px-[11px] py-[6px] rounded-[6px] text-[0.72rem] font-bold uppercase tracking-[0.07em] transition-all",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-[#6a8099] hover:text-white hover:bg-white/5"
              )
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button 
        className="md:hidden flex flex-col gap-[5px] p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("block w-[22px] h-[2px] bg-[#6a8099] rounded-[2px] transition-all", isOpen && "translate-y-[7px] rotate-45")} />
        <span className={cn("block w-[22px] h-[2px] bg-[#6a8099] rounded-[2px] transition-all", isOpen && "opacity-0")} />
        <span className={cn("block w-[22px] h-[2px] bg-[#6a8099] rounded-[2px] transition-all", isOpen && "translate-y-[-7px] rotate-[-45deg]")} />
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-[60px] left-0 right-0 bg-[#050a10]/97 backdrop-blur-xl border-b border-border-dim p-4 flex flex-col gap-1"
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-[0.07em] text-left",
                    isActive ? "text-primary bg-primary/10" : "text-[#6a8099]"
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
