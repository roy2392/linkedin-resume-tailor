'use client';

import { useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import InputForm, { FormData } from '@/components/InputForm';
import OutputDisplay from '@/components/OutputDisplay';
import LoadingState from '@/components/LoadingState';
import RobotAssistant from '@/components/RobotAssistant';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    tailoredResume: string;
    interviewMaterials: string;
    provider: 'openai' | 'anthropic';
  } | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the payload with only the required API key based on provider selection
      const payload = {
        serperApiKey: data.serperApiKey,
        linkedinUrl: data.linkedinUrl,
        jobPostingUrl: data.jobPostingUrl,
        personalWriteup: data.personalWriteup,
        llmProvider: data.llmProvider,
      };
      
      // Add the appropriate API key based on selected provider
      if (data.llmProvider === 'openai') {
        Object.assign(payload, { openaiApiKey: data.openaiApiKey });
      } else if (data.llmProvider === 'anthropic') {
        Object.assign(payload, { anthropicApiKey: data.anthropicApiKey });
      }
      
      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/generate-resume`,
        payload
      );
      
      setResults({
        tailoredResume: response.data.tailoredResume,
        interviewMaterials: response.data.interviewMaterials,
        provider: response.data.provider as 'openai' | 'anthropic'
      });
    } catch (err: any) {
      console.error('Error generating resume:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while generating your resume. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <ThemeToggle />
      <RobotAssistant />
      
      {!results && !isLoading && (
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
      
      {isLoading && <LoadingState />}
      
      {error && !isLoading && (
        <div className="glass-effect max-w-4xl mx-auto p-8 mt-10 text-center">
          <h3 className="text-xl font-medium text-red-400 mb-2">Error</h3>
          <p className="text-cyan-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="apple-button mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Try Again
          </button>
        </div>
      )}
      
      {results && !isLoading && (
        <OutputDisplay
          tailoredResume={results.tailoredResume}
          interviewMaterials={results.interviewMaterials}
          provider={results.provider}
        />
      )}
    </main>
  );
} 