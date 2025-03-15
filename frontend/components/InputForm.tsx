import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { FiZap, FiCpu, FiGlobe, FiSend } from 'react-icons/fi';

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
  const [llmProvider, setLlmProvider] = useState<'openai' | 'anthropic'>('openai');
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      llmProvider: 'openai'
    }
  });
  const [keyValidationStatus, setKeyValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    loading: boolean;
  } | null>(null);

  useEffect(() => {
    setValue('llmProvider', llmProvider);
  }, [llmProvider, setValue]);

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  // Function to validate API key
  const validateApiKey = async (provider: 'openai' | 'anthropic') => {
    try {
      setKeyValidationStatus({ isValid: false, message: 'Validating...', loading: true });
      
      // Get the current value of the API key field
      const apiKey = provider === 'openai' 
        ? watch('openaiApiKey') 
        : watch('anthropicApiKey');
      
      // Call the validation endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/validate-key`,
        { provider, apiKey }
      );
      
      if (response.data.valid) {
        setKeyValidationStatus({ 
          isValid: true, 
          message: response.data.message || 'API key is valid!', 
          loading: false 
        });
      } else {
        setKeyValidationStatus({ 
          isValid: false, 
          message: response.data.message || 'API key is invalid', 
          loading: false 
        });
      }
    } catch (error: any) {
      setKeyValidationStatus({ 
        isValid: false, 
        message: error.response?.data?.message || 'Error validating API key', 
        loading: false 
      });
    }
  };

  return (
    <motion.div 
      className="glass-effect w-full max-w-6xl mx-auto p-3 max-h-screen overflow-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Profile Section */}
          <div className="glass-effect-subtle p-3 rounded-xl">
            <h3 className="text-base font-medium text-cyan-300 mb-2">Profile Information</h3>
            
            <div className="space-y-2">
              <div>
                <label htmlFor="linkedinUrl" className="block text-xs font-medium text-cyan-200 mb-0.5">
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedinUrl"
                  type="url"
                  className="apple-input w-full py-1 px-2 text-sm"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  {...register("linkedinUrl", { 
                    required: "LinkedIn URL is required",
                    pattern: {
                      value: /linkedin\.com\/in\//i,
                      message: "Please enter a valid LinkedIn profile URL"
                    }
                  })}
                />
                {errors.linkedinUrl && <p className="mt-0.5 text-xs text-red-400">{errors.linkedinUrl.message}</p>}
              </div>
              
              <div>
                <label htmlFor="jobPostingUrl" className="block text-xs font-medium text-cyan-200 mb-0.5">
                  Job Posting URL
                </label>
                <input
                  id="jobPostingUrl"
                  type="url"
                  className="apple-input w-full py-1 px-2 text-sm"
                  placeholder="https://www.example.com/job/123"
                  {...register("jobPostingUrl", { 
                    required: "Job posting URL is required"
                  })}
                />
                {errors.jobPostingUrl && <p className="mt-0.5 text-xs text-red-400">{errors.jobPostingUrl.message}</p>}
              </div>
              
              <div>
                <label htmlFor="personalWriteup" className="block text-xs font-medium text-cyan-200 mb-0.5">
                  Personal Write-up (Professional Summary)
                </label>
                <textarea
                  id="personalWriteup"
                  rows={2}
                  className="apple-input w-full py-1 px-2 text-sm"
                  placeholder="Write a brief summary of your professional background, skills, and experience..."
                  {...register("personalWriteup", { 
                    required: "Personal write-up is required",
                    minLength: {
                      value: 50,
                      message: "Please provide at least 50 characters"
                    }
                  })}
                />
                {errors.personalWriteup && <p className="mt-0.5 text-xs text-red-400">{errors.personalWriteup.message}</p>}
              </div>
            </div>
          </div>
          
          {/* API Keys Section */}
          <div className="glass-effect-subtle p-3 rounded-xl">
            <h3 className="text-base font-medium text-yellow-300 mb-2">API Keys (Required)</h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <label className="text-xs font-medium text-yellow-200">
                  AI Provider
                </label>
                <div className="flex bg-gray-900/30 rounded-lg p-0.5">
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-1 py-0.5 px-2 rounded-md transition-all text-xs ${
                      llmProvider === 'openai'
                        ? 'bg-primary text-white'
                        : 'text-tertiary hover:text-secondary'
                    }`}
                    onClick={() => setLlmProvider('openai')}
                  >
                    <FiZap size={10} className={llmProvider === 'openai' ? 'text-yellow-300' : 'text-tertiary'} />
                    <span>OpenAI</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-1 py-0.5 px-2 rounded-md transition-all text-xs ${
                      llmProvider === 'anthropic'
                        ? 'bg-primary text-white'
                        : 'text-tertiary hover:text-secondary'
                    }`}
                    onClick={() => setLlmProvider('anthropic')}
                  >
                    <FiCpu size={10} className={llmProvider === 'anthropic' ? 'text-green-300' : 'text-tertiary'} />
                    <span>Anthropic</span>
                  </button>
                </div>
              </div>
              
              {/* API Key Input Fields */}
              {llmProvider === 'openai' ? (
                <div>
                  <label htmlFor="openaiApiKey" className="block text-xs font-medium text-yellow-200 mb-0.5">
                    OpenAI API Key <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="openaiApiKey"
                    type="password"
                    className="apple-input w-full py-1 px-2 text-sm"
                    placeholder="sk-..."
                    {...register("openaiApiKey", { 
                      required: llmProvider === 'openai' ? "OpenAI API key is required" : false,
                      pattern: {
                        value: /^sk-/,
                        message: "Please enter a valid OpenAI API key starting with 'sk-'"
                      }
                    })}
                  />
                  {errors.openaiApiKey && <p className="mt-0.5 text-xs text-red-400">{errors.openaiApiKey.message}</p>}
                  <p className="mt-0.5 text-xs text-lime-300">Get from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI</a></p>
                </div>
              ) : (
                <div>
                  <label htmlFor="anthropicApiKey" className="block text-xs font-medium text-yellow-200 mb-0.5">
                    Anthropic API Key <span className="text-red-400">*</span>
                  </label>
                  <div className="flex space-x-1">
                    <input
                      id="anthropicApiKey"
                      type="password"
                      className="apple-input w-full py-1 px-2 text-sm"
                      placeholder="sk_ant-..."
                      {...register("anthropicApiKey", { 
                        required: llmProvider === 'anthropic' ? "Anthropic API key is required" : false,
                        pattern: {
                          value: /^sk[-_]ant[-][a-zA-Z0-9]/,
                          message: "Please enter a valid Anthropic API key starting with 'sk_ant-'"
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="px-1 py-0.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                      onClick={() => validateApiKey('anthropic')}
                      disabled={keyValidationStatus?.loading}
                    >
                      {keyValidationStatus?.loading ? 'Checking...' : 'Validate'}
                    </button>
                  </div>
                  {errors.anthropicApiKey && <p className="mt-0.5 text-xs text-red-400">{errors.anthropicApiKey.message}</p>}
                  {keyValidationStatus && !keyValidationStatus.loading && (
                    <p className={`text-xs ${keyValidationStatus.isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {keyValidationStatus.message}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-lime-300">Get from <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Anthropic</a></p>
                </div>
              )}
              
              <div>
                <label htmlFor="serperApiKey" className="block text-xs font-medium text-yellow-200 mb-0.5">
                  Serper API Key <span className="text-red-400">*</span>
                </label>
                <input
                  id="serperApiKey"
                  type="password"
                  className="apple-input w-full py-1 px-2 text-sm"
                  placeholder="Your Serper API key"
                  {...register("serperApiKey", { 
                    required: "Serper API key is required"
                  })}
                />
                {errors.serperApiKey && <p className="mt-0.5 text-xs text-red-400">{errors.serperApiKey.message}</p>}
                <p className="mt-0.5 text-xs text-lime-300">Get from <a href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Serper</a></p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`apple-button apple-button-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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