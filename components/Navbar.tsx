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
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] bg-white/80 backdrop-blur-xl border-b border-border-dim/50 px-6 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-2 group">
        <div className="w-[24px] h-[24px] border-2 border-primary grid grid-cols-2 gap-[2px] p-[2.5px] rounded-[6px] bg-transparent transition-all group-hover:scale-105">
          <span className="bg-primary rounded-[1px] block" />
          <span className="bg-primary rounded-[1px] block" />
          <span className="bg-primary/40 rounded-[1px] block" />
          <span className="bg-primary rounded-[1px] block" />
        </div>
        <span className="font-sans font-semibold text-[1.1rem] tracking-tight text-[#1d1d1f] hidden sm:block">
          Gridlock
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
                "px-3 py-1.5 rounded-full text-[0.78rem] font-medium transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10 font-semibold" 
                  : "text-[#515154] hover:text-[#1d1d1f] hover:bg-neutral-100"
              )
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button 
        className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("block w-[20px] h-[2px] bg-[#1d1d1f] rounded-[2px] transition-all", isOpen && "translate-y-[7px] rotate-45")} />
        <span className={cn("block w-[20px] h-[2px] bg-[#1d1d1f] rounded-[2px] transition-all", isOpen && "opacity-0")} />
        <span className={cn("block w-[20px] h-[2px] bg-[#1d1d1f] rounded-[2px] transition-all", isOpen && "translate-y-[-7px] rotate-[-45deg]")} />
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-[60px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border-dim/80 p-4 flex flex-col gap-1 shadow-lg"
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-xl text-sm font-medium tracking-tight text-left transition-colors",
                    isActive ? "text-primary bg-primary/10 font-semibold" : "text-[#1d1d1f] hover:bg-neutral-100"
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
