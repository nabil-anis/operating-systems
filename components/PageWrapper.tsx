
import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-[calc(100vh-64px)] pt-24 lg:pt-32"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
