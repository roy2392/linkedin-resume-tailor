import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  return (
    <motion.div
      className="glass-effect w-full max-w-4xl mx-auto p-8 md:p-10 mt-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-70 animate-pulse"></div>
          <div className="absolute inset-1 rounded-full bg-black"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        </div>
        
        <div className="text-center space-y-4">
          <h3 className="text-xl font-medium text-cyan-300">Creating Your Tailored Resume</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs text-white">1</span>
              </div>
              <p className="text-cyan-200">Analyzing job requirements...</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shimmer">
                <span className="text-xs text-white">2</span>
              </div>
              <p className="text-cyan-200/60">Creating professional profile...</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
              <p className="text-cyan-200/60">Tailoring resume...</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-white">4</span>
              </div>
              <p className="text-cyan-200/60">Preparing interview materials...</p>
            </div>
          </div>
        </div>
        
        <p className="text-cyan-200/80 text-sm mt-6 max-w-lg text-center">
          This may take several minutes to complete. Our AI agents are working to create the best tailored resume 
          and interview preparation materials for you.
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingState; 