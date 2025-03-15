import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import warnings
warnings.filterwarnings('ignore')

def validate_anthropic_key(api_key):
    """Validate the Anthropic API key by making a simple request."""
    try:
        # First, check if the API key has the correct format
        if not api_key.startswith('sk-ant-'):
            print(f"Invalid Anthropic API key format: Key should start with 'sk-ant-'")
            return False, "Invalid API key format. Anthropic API keys should start with 'sk-ant-'"
            
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        # Make a simple request to check if the API key is valid
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json={
                "model": "claude-3-haiku-20240307",
                "max_tokens": 10,
                "messages": [{"role": "user", "content": "Hello"}]
            }
        )
        
        # Print response for debugging
        print(f"Anthropic API Response Status: {response.status_code}")
        print(f"Anthropic API Response: {response.text}")
        
        # Check if the request was successful
        if response.status_code == 200:
            return True, None
        else:
            try:
                error_data = response.json()
                error_type = error_data.get('error', {}).get('type', '')
                error_message = error_data.get('error', {}).get('message', 'Invalid API key')
                
                # Provide more specific error messages based on common issues
                if 'authentication' in error_type.lower() or 'auth' in error_type.lower():
                    error_message = f"Authentication error: {error_message}. Please check your API key."
                elif 'rate_limit' in error_type.lower():
                    error_message = f"Rate limit exceeded: {error_message}. Please try again later."
                elif 'invalid_request' in error_type.lower():
                    error_message = f"Invalid request: {error_message}. Your API key may be valid but there's an issue with the request."
                
                print(f"Anthropic API Error Type: {error_type}")
                print(f"Anthropic API Error Message: {error_message}")
                
                return False, error_message
            except Exception as json_error:
                print(f"Error parsing JSON response: {str(json_error)}")
                return False, f"Error validating API key: {response.text}"
    except Exception as e:
        print(f"Exception in validate_anthropic_key: {str(e)}")
        return False, f"Error validating API key: {str(e)}"

def validate_openai_key(api_key):
    """Validate the OpenAI API key by making a simple request."""
    try:
        # Check if the API key has the expected format
        if not (api_key.startswith('sk-') or api_key.startswith('sk-proj-')):
            print(f"Invalid OpenAI API key format: Key should start with 'sk-'")
            return False, "Invalid API key format. OpenAI API keys typically start with 'sk-'"
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Make a simple request to check if the API key is valid
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": "Hello"}],
                "max_tokens": 5
            }
        )
        
        # Print response for debugging
        print(f"OpenAI API Response Status: {response.status_code}")
        print(f"OpenAI API Response: {response.text}")
        
        # Check if the request was successful
        if response.status_code == 200:
            return True, None
        else:
            try:
                error_data = response.json()
                error_message = error_data.get('error', {}).get('message', 'Invalid API key')
                error_type = error_data.get('error', {}).get('type', '')
                
                # Provide more specific error messages based on error type
                if 'authentication' in error_type.lower() or 'auth' in error_type.lower() or 'api_key' in error_type.lower():
                    error_message = f"Authentication error: {error_message}. Please check your API key."
                elif 'rate_limit' in error_type.lower():
                    error_message = f"Rate limit exceeded: {error_message}. Please try again later."
                
                print(f"OpenAI API Error Type: {error_type}")
                print(f"OpenAI API Error Message: {error_message}")
                
                return False, error_message
            except Exception as json_error:
                print(f"Error parsing JSON response: {str(json_error)}")
                return False, f"Error validating API key: {response.text}"
    except Exception as e:
        print(f"Exception in validate_openai_key: {str(e)}")
        return False, f"Error validating API key: {str(e)}"

def generate_resume_with_anthropic(api_key, job_posting_url, linkedin_url, personal_writeup):
    """Generate a tailored resume using the Anthropic API directly."""
    try:
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        # Construct the prompt
        prompt = f"""
        I need to create a tailored resume for a job application. Please help me optimize my resume based on the following information:

        JOB POSTING URL: {job_posting_url}

        MY LINKEDIN PROFILE: {linkedin_url}

        MY PERSONAL WRITEUP:
        {personal_writeup}

        I want you to:
        1. Analyze the job posting to identify key skills and requirements
        2. Review my LinkedIn profile and personal writeup
        3. Create a tailored resume that highlights my relevant skills and experiences for this specific job
        4. Also generate a list of potential interview questions I should prepare for

        Please format your response as:
        
        ## TAILORED RESUME
        [The complete tailored resume in markdown format]
        
        ## INTERVIEW PREPARATION
        [List of interview questions and talking points I should prepare]
        """
        
        # Make the API request
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json={
                "model": "claude-3-opus-20240229",
                "max_tokens": 4000,
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result.get('content', [])
            response_text = ""
            
            # Extract text from the response
            for item in content:
                if item.get('type') == 'text':
                    response_text += item.get('text', '')
            
            # Split the response
            parts = response_text.split('## INTERVIEW PREPARATION')
            
            if len(parts) == 2:
                tailored_resume = parts[0].replace('## TAILORED RESUME', '').strip()
                interview_materials = parts[1].strip()
                
                return {
                    "status": "success",
                    "tailoredResume": tailored_resume,
                    "interviewMaterials": interview_materials
                }
            else:
                return {
                    "status": "partial_success",
                    "message": "Response format was unexpected",
                    "full_response": response_text
                }
        else:
            print(f"Anthropic API Error: {response.status_code} - {response.text}")
            return {
                "status": "error",
                "message": f"Error from Anthropic API: {response.text}"
            }
            
    except Exception as e:
        print(f"Error in generate_resume_with_anthropic: {str(e)}")
        return {
            "status": "error",
            "message": f"Error generating resume: {str(e)}"
        }

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/validate-key', methods=['POST', 'OPTIONS'])
def validate_key():
    """Validate an API key for a specific provider."""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        data = request.json
        provider = data.get('provider')
        api_key = data.get('apiKey')
        
        if not provider or not api_key:
            return jsonify({
                "error": "Missing required fields",
                "message": "Please provide both provider and apiKey"
            }), 400
            
        if provider == 'anthropic':
            is_valid, error_message = validate_anthropic_key(api_key)
            if not is_valid:
                return jsonify({
                    "valid": False,
                    "message": error_message
                })
            return jsonify({
                "valid": True,
                "message": "API key is valid"
            })
        elif provider == 'openai':
            # Perform actual validation for OpenAI
            is_valid, error_message = validate_openai_key(api_key)
            if not is_valid:
                return jsonify({
                    "valid": False,
                    "message": error_message
                })
            return jsonify({
                "valid": True,
                "message": "API key is valid"
            })
        else:
            return jsonify({
                "error": "Invalid provider",
                "message": "Provider must be 'openai' or 'anthropic'"
            }), 400
            
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500

@app.route('/api/generate-resume', methods=['POST', 'OPTIONS'])
def generate_resume():
    """Generate a tailored resume based on user inputs."""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.json
        
        # Extract all necessary data
        llm_provider = data.get('llmProvider', 'openai')  # Default to OpenAI if not specified
        anthropic_api_key = data.get('anthropicApiKey')
        openai_api_key = data.get('openaiApiKey')
        job_posting_url = data.get('jobPostingUrl')
        linkedin_url = data.get('linkedinUrl')
        personal_writeup = data.get('personalWriteup')
        
        # Log the selected provider for debugging
        print(f"Selected LLM provider: {llm_provider}")
        
        # Check for required fields
        if not job_posting_url or not linkedin_url or not personal_writeup:
            return jsonify({
                "error": "Missing required data",
                "message": "Please provide job posting URL, LinkedIn URL, and personal writeup"
            }), 400
        
        # Validate that we have the appropriate API key
        if llm_provider == 'anthropic' and not anthropic_api_key:
            return jsonify({
                "error": "Missing API key",
                "message": "Please provide an Anthropic API key"
            }), 400
        elif llm_provider == 'openai' and not openai_api_key:
            return jsonify({
                "error": "Missing API key",
                "message": "Please provide an OpenAI API key"
            }), 400
        
        # Handle Anthropic
        if llm_provider == 'anthropic':
            # Validate the key
            is_valid, error_message = validate_anthropic_key(anthropic_api_key)
            if not is_valid:
                return jsonify({
                    "error": "Invalid API key",
                    "message": error_message
                }), 400
            
            # Generate resume with Anthropic
            result = generate_resume_with_anthropic(
                anthropic_api_key,
                job_posting_url,
                linkedin_url,
                personal_writeup
            )
            
            if result.get("status") == "success":
                return jsonify({
                    "status": "success",
                    "tailoredResume": result.get("tailoredResume"),
                    "interviewMaterials": result.get("interviewMaterials"),
                    "provider": "anthropic"
                }), 200
            else:
                return jsonify({
                    "error": "Resume generation failed",
                    "message": result.get("message", "Unknown error occurred"),
                    "details": result
                }), 500
                
        elif llm_provider == 'openai':
            # Perform validation for OpenAI
            is_valid, error_message = validate_openai_key(openai_api_key)
            if not is_valid:
                return jsonify({
                    "error": "Invalid API key",
                    "message": error_message
                }), 400
                
            # We're not implementing OpenAI resume generation directly in this version
            # since you mentioned you're only using Anthropic API key
            return jsonify({
                "error": "Provider not fully supported",
                "message": "The application is currently being updated to support OpenAI for direct resume generation. Please use the Anthropic provider instead."
            }), 400
        else:
            return jsonify({
                "error": "Invalid provider",
                "message": "Provider must be 'openai' or 'anthropic'"
            }), 400
            
    except Exception as e:
        print(f"Error in generate_resume: {str(e)}")
        return jsonify({"error": "Server error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)