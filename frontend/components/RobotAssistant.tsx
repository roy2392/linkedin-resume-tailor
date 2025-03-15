import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RobotAssistantProps {
  isActive?: boolean;
}

const RobotAssistant: React.FC<RobotAssistantProps> = ({ isActive = true }) => {
  const [message, setMessage] = useState('Welcome! I\'ll help you tailor your resume.');
  const messages = [
    'Welcome! I\'ll help you tailor your resume.',
    'Just provide your LinkedIn URL and job posting!',
    'Don\'t forget to add your API keys!',
    'I\'ll create a personalized resume just for you!',
    'Need interview preparation? I can help with that too!',
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div 
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {/* Robot */}
        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-4 rounded-full w-24 h-24 flex items-center justify-center shadow-lg backdrop-blur-xl border border-white/10">
          <div className="relative">
            {/* Head */}
            <motion.div 
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl relative"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              {/* Eyes */}
              <div className="absolute flex space-x-2 top-3 left-1 right-1 justify-center">
                <motion.div 
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                />
              </div>
              
              {/* Mouth */}
              <motion.div 
                className="absolute bottom-3 left-3 right-3 h-1.5 bg-white rounded-full"
                animate={{ scaleX: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              
              {/* Antenna */}
              <motion.div 
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-300"
                animate={{ height: [4, 5, 4] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <motion.div 
                  className="w-2 h-2 bg-red-500 rounded-full -mt-1 -ml-0.5"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
            
            {/* Body */}
            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-700 rounded-md mx-auto -mt-1">
              {/* Button lights */}
              <div className="flex justify-center space-x-1.5 pt-1.5">
                <motion.div 
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-red-400 rounded-full"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Speech bubble */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/10 absolute top-2 right-24 p-3 rounded-xl max-w-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-cyan-300 font-medium">{message}</div>
          {/* Speech bubble pointer */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 
                         border-t-8 border-t-transparent 
                         border-l-8 border-l-white/10
                         border-b-8 border-b-transparent" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RobotAssistant; 