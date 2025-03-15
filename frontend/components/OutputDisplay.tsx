import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface OutputDisplayProps {
  tailoredResume: string;
  interviewMaterials: string;
  provider?: 'openai' | 'anthropic';
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  tailoredResume,
  interviewMaterials,
  provider = 'openai',
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'interview'>('resume');

  return (
    <motion.div
      className="glass-effect w-full max-w-4xl mx-auto p-8 md:p-10 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="glass-effect-subtle inline-flex rounded-full p-1">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'resume'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-cyan-300 hover:text-white'
            }`}
          >
            Tailored Resume
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'interview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-cyan-300 hover:text-white'
            }`}
          >
            Interview Preparation
          </button>
        </div>
        
        <div className="flex items-center text-xs">
          <span className="text-tertiary mr-2">Generated with:</span>
          <span className={`px-2 py-1 rounded-md ${
            provider === 'anthropic' 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-blue-900/30 text-blue-300'
          }`}>
            {provider === 'anthropic' ? 'Anthropic Claude' : 'OpenAI GPT'}
          </span>
        </div>
      </div>

      <div className="bg-black bg-opacity-40 rounded-xl p-6 max-h-[70vh] overflow-y-auto">
        {activeTab === 'resume' ? (
          <div className="prose prose-invert max-w-none prose-headings:text-cyan-200 prose-a:text-blue-400 prose-strong:text-yellow-200">
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {tailoredResume}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-headings:text-cyan-200 prose-a:text-blue-400 prose-strong:text-yellow-200">
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {interviewMaterials}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => {
            const content = activeTab === 'resume' ? tailoredResume : interviewMaterials;
            const element = document.createElement('a');
            const file = new Blob([content], { type: 'text/markdown' });
            element.href = URL.createObjectURL(file);
            element.download = activeTab === 'resume' ? 'tailored_resume.md' : 'interview_materials.md';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="apple-button flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download
        </button>
        <button
          onClick={() => {
            const content = activeTab === 'resume' ? tailoredResume : interviewMaterials;
            navigator.clipboard.writeText(content);
            alert(`${activeTab === 'resume' ? 'Resume' : 'Interview materials'} copied to clipboard!`);
          }}
          className="apple-button flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
          </svg>
          Copy
        </button>
      </div>
    </motion.div>
  );
};

export default OutputDisplay; 