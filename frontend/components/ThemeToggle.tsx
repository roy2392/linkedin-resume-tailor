'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/providers';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r theme-toggle-bg shadow-lg"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute inset-0 rounded-full opacity-30 theme-toggle-glow"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      {theme === 'dark' ? (
        <FiSun className="w-6 h-6 text-yellow-300" />
      ) : (
        <FiMoon className="w-6 h-6 text-blue-700" />
      )}
    </motion.button>
  );
};

export default ThemeToggle; 