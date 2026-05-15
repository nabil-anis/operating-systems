
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock, LayoutGrid } from 'lucide-react';
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
    { name: 'Case Study', path: '/analysis' },
  ];

  return (
    <nav className="fixed top-6 inset-x-0 z-[100] px-6 flex justify-center pointer-events-none">
      <div className="max-w-5xl w-full h-16 hyper-card glass-blur flex items-center justify-between px-8 pointer-events-auto border-white/20 shadow-2xl">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-full h-full text-white" />
          </div>
          <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic hidden sm:block">
            Grid<span className="text-primary not-italic">Lock</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "font-sans font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:text-primary relative py-2",
                  isActive ? "text-primary" : "text-white/60"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-line"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden sm:block">
           <NavLink to="/simulator" className="btn-primary py-2 px-5 text-[9px] rounded-2xl">
              Hub
           </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-[110%] inset-x-6 hyper-card glass-blur border-white/20 p-8 z-[200]"
          >
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "text-3xl font-display font-black uppercase tracking-tight italic",
                      isActive ? "text-primary" : "text-white/40"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
