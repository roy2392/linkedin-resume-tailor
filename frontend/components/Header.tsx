import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-10 pt-6"
    >
      <div className="text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          LinkedIn Resume Tailor
        </motion.h1>
        <motion.p 
          className="mt-3 text-base md:text-lg text-cyan-300 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Transform your LinkedIn profile into a tailored resume and interview preparation for your dream job
        </motion.p>
      </div>
    </motion.header>
  );
};

export default Header; 