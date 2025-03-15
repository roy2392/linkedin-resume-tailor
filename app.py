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
                
                print(f"OpenAI API Error Message: {error_message}")
                
                return False, error_message
            except Exception as json_error:
                print(f"Error parsing JSON response: {str(json_error)}")
                return False, f"Error validating API key: {response.text}"
    except Exception as e:
        print(f"Exception in validate_openai_key: {str(e)}")
        return False, f"Error validating API key: {str(e)}"

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
        
        # Extract key provider information
        llm_provider = data.get('llmProvider', 'openai')  # Default to OpenAI if not specified
        anthropic_api_key = data.get('anthropicApiKey')
        openai_api_key = data.get('openaiApiKey')
        
        # Log the selected provider for debugging
        print(f"Selected LLM provider: {llm_provider}")
        
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
        
        # Additional validation for Anthropic
        if llm_provider == 'anthropic':
            is_valid, error_message = validate_anthropic_key(anthropic_api_key)
            if not is_valid:
                return jsonify({
                    "error": "Invalid API key",
                    "message": error_message
                }), 400
            
            return jsonify({
                "error": "Provider not fully supported",
                "message": "The application is currently being updated to support Anthropic as a provider. Your API key is valid, but we can't generate resumes with Anthropic yet. Please use OpenAI provider instead, or check back later for Anthropic support."
            }), 400
        elif llm_provider == 'openai':
            # Perform validation for OpenAI if needed
            is_valid, error_message = validate_openai_key(openai_api_key)
            if not is_valid:
                return jsonify({
                    "error": "Invalid API key",
                    "message": error_message
                }), 400
                
            return jsonify({
                "error": "System under maintenance",
                "message": "The resume generation system is currently under maintenance to fix issues with LLM integration. Your OpenAI API key is valid, but we can't generate resumes at the moment. Please try again later."
            }), 503
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