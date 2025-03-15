import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { FiZap, FiCpu } from 'react-icons/fi';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export interface FormData {
  linkedinUrl: string;
  jobPostingUrl: string;
  personalWriteup: string;
  openaiApiKey: string;
  serperApiKey: string;
  anthropicApiKey: string;
  llmProvider: 'openai' | 'anthropic';
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [expandedSection, setExpandedSection] = useState<'profile' | 'api' | null>(null);
  const [llmProvider, setLlmProvider] = useState<'openai' | 'anthropic'>('openai');
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      llmProvider: 'openai'
    }
  });

  useEffect(() => {
    setValue('llmProvider', llmProvider);
  }, [llmProvider, setValue]);

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="glass-effect w-full max-w-4xl mx-auto p-8 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Profile Info Section */}
        <motion.div 
          className="glass-effect-subtle p-6 rounded-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'profile' ? null : 'profile')}
          >
            <h3 className="text-xl font-medium text-cyan-300">Profile Information</h3>
            <div className="text-cyan-300 text-2xl">
              {expandedSection === 'profile' ? '−' : '+'}
            </div>
          </div>
          
          {(expandedSection === 'profile' || expandedSection === null) && (
            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-cyan-200 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedinUrl"
                  type="url"
                  className="apple-input w-full"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  {...register("linkedinUrl", { 
                    required: "LinkedIn URL is required",
                    pattern: {
                      value: /linkedin\.com\/in\//i,
                      message: "Please enter a valid LinkedIn profile URL"
                    }
                  })}
                />
                {errors.linkedinUrl && <p className="mt-1 text-sm text-red-400">{errors.linkedinUrl.message}</p>}
              </div>
              
              <div>
                <label htmlFor="jobPostingUrl" className="block text-sm font-medium text-cyan-200 mb-1">
                  Job Posting URL
                </label>
                <input
                  id="jobPostingUrl"
                  type="url"
                  className="apple-input w-full"
                  placeholder="https://www.example.com/job/123"
                  {...register("jobPostingUrl", { 
                    required: "Job posting URL is required"
                  })}
                />
                {errors.jobPostingUrl && <p className="mt-1 text-sm text-red-400">{errors.jobPostingUrl.message}</p>}
              </div>
              
              <div>
                <label htmlFor="personalWriteup" className="block text-sm font-medium text-cyan-200 mb-1">
                  Personal Write-up (Professional Summary)
                </label>
                <textarea
                  id="personalWriteup"
                  rows={5}
                  className="apple-input w-full"
                  placeholder="Write a brief summary of your professional background, skills, and experience..."
                  {...register("personalWriteup", { 
                    required: "Personal write-up is required",
                    minLength: {
                      value: 50,
                      message: "Please provide at least 50 characters"
                    }
                  })}
                />
                {errors.personalWriteup && <p className="mt-1 text-sm text-red-400">{errors.personalWriteup.message}</p>}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* API Keys Section */}
        <motion.div 
          className="glass-effect-subtle p-6 rounded-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'api' ? null : 'api')}
          >
            <h3 className="text-xl font-medium text-yellow-300">API Keys (Required)</h3>
            <div className="text-yellow-300 text-2xl">
              {expandedSection === 'api' ? '−' : '+'}
            </div>
          </div>
          
          {(expandedSection === 'api' || expandedSection === null) && (
            <div className="mt-4 space-y-5">
              <p className="text-lime-300 mb-4">
                Please provide your API keys. These are required to generate tailored content.
                Your keys are never stored on our servers and are only used for this specific request.
              </p>
              
              {/* LLM Provider Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-yellow-200 mb-2">
                  Select AI Provider
                </label>
                <div className="flex bg-gray-900/30 rounded-lg p-1 max-w-xs">
                  <button
                    type="button"
                    className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
                      llmProvider === 'openai'
                        ? 'bg-primary text-white'
                        : 'text-tertiary hover:text-secondary'
                    }`}
                    onClick={() => setLlmProvider('openai')}
                  >
                    <FiZap className={llmProvider === 'openai' ? 'text-yellow-300' : 'text-tertiary'} />
                    <span>OpenAI</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
                      llmProvider === 'anthropic'
                        ? 'bg-primary text-white'
                        : 'text-tertiary hover:text-secondary'
                    }`}
                    onClick={() => setLlmProvider('anthropic')}
                  >
                    <FiCpu className={llmProvider === 'anthropic' ? 'text-green-300' : 'text-tertiary'} />
                    <span>Anthropic</span>
                  </button>
                </div>
              </div>
              
              {/* Conditional API Key Input Fields */}
              {llmProvider === 'openai' ? (
                <div>
                  <label htmlFor="openaiApiKey" className="block text-sm font-medium text-yellow-200 mb-1">
                    OpenAI API Key <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="openaiApiKey"
                    type="password"
                    className="apple-input w-full"
                    placeholder="sk-..."
                    {...register("openaiApiKey", { 
                      required: llmProvider === 'openai' ? "OpenAI API key is required" : false,
                      pattern: {
                        value: /^sk-/,
                        message: "Please enter a valid OpenAI API key starting with 'sk-'"
                      }
                    })}
                  />
                  {errors.openaiApiKey && <p className="mt-1 text-sm text-red-400">{errors.openaiApiKey.message}</p>}
                  <p className="mt-1 text-xs text-lime-300">Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI</a></p>
                </div>
              ) : (
                <div>
                  <label htmlFor="anthropicApiKey" className="block text-sm font-medium text-yellow-200 mb-1">
                    Anthropic API Key <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="anthropicApiKey"
                    type="password"
                    className="apple-input w-full"
                    placeholder="sk_ant-..."
                    {...register("anthropicApiKey", { 
                      required: llmProvider === 'anthropic' ? "Anthropic API key is required" : false,
                      pattern: {
                        value: /^sk_ant-/,
                        message: "Please enter a valid Anthropic API key starting with 'sk_ant-'"
                      }
                    })}
                  />
                  {errors.anthropicApiKey && <p className="mt-1 text-sm text-red-400">{errors.anthropicApiKey.message}</p>}
                  <p className="mt-1 text-xs text-lime-300">Get your API key from <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Anthropic</a></p>
                </div>
              )}
              
              <div>
                <label htmlFor="serperApiKey" className="block text-sm font-medium text-yellow-200 mb-1">
                  Serper API Key <span className="text-red-400">*</span>
                </label>
                <input
                  id="serperApiKey"
                  type="password"
                  className="apple-input w-full"
                  placeholder="Your Serper API key"
                  {...register("serperApiKey", { 
                    required: "Serper API key is required"
                  })}
                />
                {errors.serperApiKey && <p className="mt-1 text-sm text-red-400">{errors.serperApiKey.message}</p>}
                <p className="mt-1 text-xs text-lime-300">Get your API key from <a href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Serper</a></p>
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`apple-button apple-button-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              'Generate Resume'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default InputForm; 