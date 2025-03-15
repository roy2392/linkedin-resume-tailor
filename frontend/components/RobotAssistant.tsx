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
    'You can use either OpenAI or Anthropic API keys!',
    'Don\'t forget to add your API keys!',
    'I\'ll create a personalized resume just for you!',
    'Need interview preparation? I can help with that too!',
    'Try both OpenAI and Anthropic to see which works best for you!',
    'You can switch between light and dark mode for better visibility!'
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
      className="fixed top-4 right-4 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div 
        className="relative"
        animate={{ y: [0, -5, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {/* Robot */}
        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-xl border border-white/10">
          <div className="relative">
            {/* Head */}
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              {/* Eyes */}
              <div className="absolute flex space-x-1 top-1.5 left-0.5 right-0.5 justify-center">
                <motion.div 
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                />
              </div>
              
              {/* Mouth */}
              <motion.div 
                className="absolute w-3 h-1 bg-white rounded-lg bottom-1.5 left-2.5"
                animate={{ width: [3, 4, 3] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Message bubble */}
        <motion.div 
          className="absolute bottom-0 right-14 bg-glass-background-subtle backdrop-blur-md p-2 rounded-2xl rounded-tr-none shadow-lg max-w-xs text-xs"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white">{message}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RobotAssistant; 