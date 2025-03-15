import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { provider, apiKey } = data;
    
    if (!provider || !apiKey) {
      return NextResponse.json({
        error: "Missing required fields",
        message: "Please provide both provider and apiKey"
      }, { status: 400 });
    }
    
    if (provider === 'anthropic') {
      const [isValid, errorMessage] = await validateAnthropicKey(apiKey);
      if (!isValid) {
        return NextResponse.json({
          valid: false,
          message: errorMessage
        });
      }
      return NextResponse.json({
        valid: true,
        message: "API key is valid"
      });
    } else if (provider === 'openai') {
      const [isValid, errorMessage] = await validateOpenAIKey(apiKey);
      if (!isValid) {
        return NextResponse.json({
          valid: false,
          message: errorMessage
        });
      }
      return NextResponse.json({
        valid: true,
        message: "API key is valid"
      });
    } else {
      return NextResponse.json({
        error: "Invalid provider",
        message: "Provider must be 'openai' or 'anthropic'"
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error validating API key:', error);
    return NextResponse.json({
      error: "Server error",
      message: error.message || "An error occurred while validating the API key"
    }, { status: 500 });
  }
}

async function validateAnthropicKey(apiKey: string): Promise<[boolean, string | null]> {
  try {
    // First, check if the API key has the correct format
    if (!apiKey.startsWith('sk-ant-')) {
      console.warn("Invalid Anthropic API key format: Key should start with 'sk-ant-'");
      return [false, "Invalid API key format. Anthropic API keys should start with 'sk-ant-'"];
    }
    
    const headers = {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    };
    
    // Make a simple request to check if the API key is valid
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        "model": "claude-3-haiku-20240307",
        "max_tokens": 10,
        "messages": [{"role": "user", "content": "Hello"}]
      },
      { headers }
    );
    
    // Check if the request was successful
    if (response.status === 200) {
      return [true, null];
    } else {
      try {
        const errorData = response.data;
        const errorType = errorData?.error?.type || '';
        const errorMessage = errorData?.error?.message || 'Invalid API key';
        
        // Provide more specific error messages based on common issues
        if (errorType.toLowerCase().includes('authentication') || errorType.toLowerCase().includes('auth')) {
          return [false, `Authentication error: ${errorMessage}. Please check your API key.`];
        } else if (errorType.toLowerCase().includes('rate_limit')) {
          return [false, `Rate limit exceeded: ${errorMessage}. Please try again later.`];
        } else if (errorType.toLowerCase().includes('invalid_request')) {
          return [false, `Invalid request: ${errorMessage}. Your API key may be valid but there's an issue with the request.`];
        }
        
        return [false, errorMessage];
      } catch (jsonError) {
        return [false, `Error validating API key: ${response.statusText}`];
      }
    }
  } catch (error: any) {
    console.error(`Exception in validateAnthropicKey: ${error.message}`);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      try {
        const errorData = error.response.data;
        const errorType = errorData?.error?.type || '';
        const errorMessage = errorData?.error?.message || 'Invalid API key';
        
        if (errorType.toLowerCase().includes('authentication') || errorType.toLowerCase().includes('auth')) {
          return [false, `Authentication error: ${errorMessage}. Please check your API key.`];
        }
        
        return [false, errorMessage];
      } catch (e) {
        return [false, `Error: ${error.response.statusText}`];
      }
    } else if (error.request) {
      // The request was made but no response was received
      return [false, "No response received from API. Please check your internet connection."];
    } else {
      // Something happened in setting up the request
      return [false, `Error: ${error.message}`];
    }
  }
}

async function validateOpenAIKey(apiKey: string): Promise<[boolean, string | null]> {
  try {
    // Check if the API key has the expected format
    if (!apiKey.startsWith('sk-')) {
      console.warn("Invalid OpenAI API key format: Key should start with 'sk-'");
      return [false, "Invalid API key format. OpenAI API keys typically start with 'sk-'"];
    }
    
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    
    // Make a simple request to check if the API key is valid
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello"}],
        "max_tokens": 5
      },
      { headers }
    );
    
    // Check if the request was successful
    if (response.status === 200) {
      return [true, null];
    } else {
      try {
        const errorData = response.data;
        const errorMessage = errorData?.error?.message || 'Invalid API key';
        const errorType = errorData?.error?.type || '';
        
        // Provide more specific error messages based on error type
        if (errorType.toLowerCase().includes('authentication') || errorType.toLowerCase().includes('auth') || errorType.toLowerCase().includes('api_key')) {
          return [false, `Authentication error: ${errorMessage}. Please check your API key.`];
        } else if (errorType.toLowerCase().includes('rate_limit')) {
          return [false, `Rate limit exceeded: ${errorMessage}. Please try again later.`];
        }
        
        return [false, errorMessage];
      } catch (jsonError) {
        return [false, `Error validating API key: ${response.statusText}`];
      }
    }
  } catch (error: any) {
    console.error(`Exception in validateOpenAIKey: ${error.message}`);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      try {
        const errorData = error.response.data;
        const errorMessage = errorData?.error?.message || 'Invalid API key';
        const errorType = errorData?.error?.type || '';
        
        if (errorType.toLowerCase().includes('authentication') || errorType.toLowerCase().includes('auth')) {
          return [false, `Authentication error: ${errorMessage}. Please check your API key.`];
        }
        
        return [false, errorMessage];
      } catch (e) {
        return [false, `Error: ${error.response.statusText}`];
      }
    } else if (error.request) {
      // The request was made but no response was received
      return [false, "No response received from API. Please check your internet connection."];
    } else {
      // Something happened in setting up the request
      return [false, `Error: ${error.message}`];
    }
  }
}

export const dynamic = 'force-dynamic';

// Disable authentication for this API route
export const config = {
  api: {
    bodyParser: true,
  },
}; 