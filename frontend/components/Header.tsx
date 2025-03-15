import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-4 pt-2"
    >
      <div className="text-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          LinkedIn Resume Tailor
        </motion.h1>
        <motion.p 
          className="mt-1 text-sm md:text-base text-secondary max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Transform your LinkedIn profile into a tailored resume for your dream job
        </motion.p>
      </div>
    </motion.header>
  );
};

export default Header; 