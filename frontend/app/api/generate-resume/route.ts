import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract API keys, URLs and LLM provider
    const llmProvider = data.llmProvider || 'openai'; // Default to OpenAI if not specified
    const openaiApiKey = data.openaiApiKey;
    const anthropicApiKey = data.anthropicApiKey;
    const serperApiKey = data.serperApiKey;
    const jobPostingUrl = data.jobPostingUrl;
    const linkedinUrl = data.linkedinUrl;
    const personalWriteup = data.personalWriteup;
    
    // Validate inputs
    if (!serperApiKey || !jobPostingUrl || !linkedinUrl || !personalWriteup) {
      return NextResponse.json({
        error: "Missing required fields", 
        message: "Please provide all required information"
      }, { status: 400 });
    }
    
    // Validate that the appropriate API key is provided based on provider
    if (llmProvider === 'openai' && !openaiApiKey) {
      return NextResponse.json({
        error: "Missing OpenAI API key", 
        message: "Please provide an OpenAI API key"
      }, { status: 400 });
    } else if (llmProvider === 'anthropic' && !anthropicApiKey) {
      return NextResponse.json({
        error: "Missing Anthropic API key", 
        message: "Please provide an Anthropic API key"
      }, { status: 400 });
    }
    
    // Use direct API call - currently only supporting Anthropic
    // OpenAI would be implemented similarly or using the OpenAI SDK
    if (llmProvider === 'anthropic') {
      const result = await generateResumeWithAnthropic(
        anthropicApiKey,
        jobPostingUrl,
        linkedinUrl,
        personalWriteup
      );
      return NextResponse.json(result);
    } else {
      // For OpenAI we would implement similar direct API call
      return NextResponse.json({
        error: "Unsupported provider", 
        message: "Currently only Anthropic is supported for direct API calls"
      }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Error generating resume:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx range
      return NextResponse.json({
        error: "API Error",
        message: error.response.data?.error?.message || "Error from LLM provider API"
      }, { status: 500 });
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json({
        error: "Network Error",
        message: "No response received from LLM provider. Please check your internet connection."
      }, { status: 500 });
    } else {
      // Something happened in setting up the request
      return NextResponse.json({
        error: "Request Error",
        message: error.message || "An error occurred while generating the resume"
      }, { status: 500 });
    }
  }
}

function cleanUrl(url: string | null): string {
  if (url === null) {
    return "";
  }
  // Remove any @ prefix from the URL
  if (url.startsWith('@')) {
    url = url.substring(1);
  }
  return url.trim();
}

async function generateResumeWithAnthropic(
  apiKey: string,
  jobPostingUrl: string,
  linkedinUrl: string,
  personalWriteup: string
) {
  try {
    // Clean URLs
    jobPostingUrl = cleanUrl(jobPostingUrl);
    linkedinUrl = cleanUrl(linkedinUrl);
    
    console.log(`Using cleaned job URL: ${jobPostingUrl}`);
    console.log(`Using cleaned LinkedIn URL: ${linkedinUrl}`);
    
    const headers = {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    };
    
    // For LLM Engineer role at Torq, specifically tailored prompt
    const prompt = `
    I need to create a tailored resume for an LLM Engineer job application. Please help me optimize my resume based on the following information:

    JOB POSTING: This is for an LLM Engineer position at Torq. The job involves designing and developing Agent and LLM-based features, crafting high-quality prompts, building datasets and benchmarks for evaluating LLM applications, and staying current with state-of-the-art research. The role requires experience with LLM application concepts like RAG, embeddings, CoT prompting, and hands-on experience with developing datasets and benchmarks. They prefer someone with experience in LangGraph or similar frameworks, and someone who can quickly bring solutions into production.

    MY LINKEDIN PROFILE: ${linkedinUrl}

    MY PERSONAL WRITEUP:
    ${personalWriteup}

    I want you to:
    1. Create a tailored resume that highlights my LLM and GenAI infrastructure skills and experiences relevant to this LLM Engineer position
    2. Emphasize my experience with pipelines for large language models, generative AI, containerized applications, and MLOps solutions
    3. Structure the resume with clear sections: Summary, Skills, Experience, Education (if relevant)
    4. Also generate a list of potential interview questions I should prepare for this specific LLM Engineer role

    Please format your response as:
    
    ## TAILORED RESUME
    [The complete tailored resume in markdown format]
    
    ## INTERVIEW PREPARATION
    [List of interview questions and talking points I should prepare]
    `;
    
    console.log("Sending request to Anthropic API...");
    
    // Make the API request
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        "model": "claude-3-haiku-20240307",  // Using haiku instead of opus for faster response
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}]
      },
      { 
        headers,
        timeout: 180000  // 3-minute timeout (in milliseconds)
      }
    );
    
    console.log(`Anthropic API Response Status for resume generation: ${response.status}`);
    
    if (response.status === 200) {
      const result = response.data;
      const content = result.content || [];
      let responseText = "";
      
      // Extract text from the response
      for (const item of content) {
        if (item.type === 'text') {
          responseText += item.text || '';
        }
      }
      
      console.log(`Response length: ${responseText.length} characters`);
      
      // Split the response
      const parts = responseText.split('## INTERVIEW PREPARATION');
      
      if (parts.length === 2) {
        const tailoredResume = parts[0].replace('## TAILORED RESUME', '').trim();
        const interviewMaterials = parts[1].trim();
        
        console.log("Successfully parsed both resume and interview materials");
        
        return {
          status: "success",
          tailoredResume,
          interviewMaterials,
          provider: 'anthropic'
        };
      } else {
        console.warn(`Failed to split response into two parts. Found ${parts.length} parts`);
        // Try a more lenient approach
        if (responseText.includes('# INTERVIEW PREPARATION')) {
          const altParts = responseText.split('# INTERVIEW PREPARATION');
          if (altParts.length === 2) {
            const tailoredResume = altParts[0]
              .replace('# TAILORED RESUME', '')
              .replace('## TAILORED RESUME', '')
              .trim();
            const interviewMaterials = altParts[1].trim();
            
            console.log("Successfully parsed with alternate format");
            
            return {
              status: "success",
              tailoredResume,
              interviewMaterials,
              provider: 'anthropic'
            };
          }
        }
        
        // Return the full text if we can't parse it properly
        console.warn("Could not parse response into resume and interview sections. Returning full text.");
        return {
          status: "partial_success",
          message: "Response format was unexpected, returning full text",
          tailoredResume: responseText,
          interviewMaterials: "Could not parse interview materials.",
          provider: 'anthropic'
        };
      }
    } else {
      // Handle non-200 responses
      console.error(`Error from Anthropic API: ${response.status} ${response.statusText}`);
      
      try {
        const errorData = response.data;
        const errorType = errorData?.error?.type || 'unknown_error';
        const errorMessage = errorData?.error?.message || 'Unknown error from Anthropic API';
        
        return {
          status: "error",
          error: errorType,
          message: errorMessage,
          provider: 'anthropic'
        };
      } catch (jsonError) {
        return {
          status: "error",
          error: "parse_error",
          message: `Failed to parse error response: ${response.statusText}`,
          provider: 'anthropic'
        };
      }
    }
  } catch (error: any) {
    console.error(`Exception in generateResumeWithAnthropic: ${error.message}`);
    
    // Re-throw the error to be handled by the main try-catch block
    throw error;
  }
}

export const dynamic = 'force-dynamic'; 