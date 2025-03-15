import requests
import json
import sys
import time
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('debug_resume.log')
    ]
)
logger = logging.getLogger(__name__)

# Set environment variables for Anthropic API
if 'OPENAI_API_KEY' in os.environ:
    logger.info("Removing OPENAI_API_KEY from environment as we're using Anthropic")
    del os.environ['OPENAI_API_KEY']

# API endpoint - using port 5003 which we know is running
base_url = "http://localhost:"
ports_to_try = [5001, 5002, 5003, 5004, 5005]
url = None

# Test data with your actual information
data = {
    "llmProvider": "anthropic",
    "anthropicApiKey": "***REMOVED***",
    "jobPostingUrl": "https://www.linkedin.com/jobs/view/4127872826",
    "linkedinUrl": "http://linkedin.com/in/roey-zalta",
    "personalWriteup": "I'm a LLMOps and GenAI Infrastructure Engineer with over three years of experience building scalable AI systems. I specialize in designing and optimizing pipelines for large language models and generative AI, deploying containerized applications on AWS and Kubernetes, and implementing robust MLOps solutions to ensure smooth, secure, and efficient model operations. My work drives innovation and delivers actionable business insights."
}

# Set headers
headers = {
    "Content-Type": "application/json"
}

# Try to find a working server port
for port in ports_to_try:
    try:
        logger.info(f"Testing port {port}...")
        health_response = requests.get(f"{base_url}{port}/api/health", timeout=2)
        if health_response.status_code == 200:
            logger.info(f"Server is running on port {port}")
            url = f"{base_url}{port}/api/generate-resume"
            break
    except Exception as e:
        logger.warning(f"Server not available on port {port}: {e}")

if url is None:
    logger.error("No server found on any port.")
    
    # Try starting our own server on port 5003
    logger.info("Attempting to start server on port 5003...")
    try:
        import subprocess
        
        # Kill any existing processes first
        subprocess.run(["pkill", "-f", "python app.py"], stderr=subprocess.PIPE)
        
        # Start a new server
        env = os.environ.copy()
        env["PORT"] = "5003"
        
        # Start in a separate process so it doesn't block
        process = subprocess.Popen(["python", "app.py"], env=env, 
                                stdout=subprocess.PIPE, 
                                stderr=subprocess.PIPE)
        
        # Wait for server to start
        logger.info("Waiting for server to start...")
        time.sleep(5)
        
        # Check if server is running
        try:
            health_response = requests.get(f"{base_url}5003/api/health", timeout=2)
            if health_response.status_code == 200:
                logger.info("Successfully started server on port 5003")
                url = f"{base_url}5003/api/generate-resume"
            else:
                logger.error(f"Server started but health check failed: {health_response.status_code}")
                sys.exit(1)
        except Exception as e:
            logger.error(f"Failed to connect to newly started server: {e}")
            # Get any output from the process
            stdout, stderr = process.communicate(timeout=1)
            logger.error(f"Server stdout: {stdout.decode() if stdout else 'None'}")
            logger.error(f"Server stderr: {stderr.decode() if stderr else 'None'}")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

# Validate the API key first
try:
    logger.info("Validating Anthropic API key before proceeding...")
    validate_url = url.replace("generate-resume", "validate-key")
    validate_data = {
        "provider": "anthropic",
        "apiKey": data["anthropicApiKey"]
    }
    
    validate_response = requests.post(
        validate_url, 
        headers=headers, 
        data=json.dumps(validate_data),
        timeout=30
    )
    
    if validate_response.status_code == 200:
        validate_result = validate_response.json()
        if validate_result.get("valid"):
            logger.info("API key validation successful")
        else:
            logger.error(f"API key validation failed: {validate_result.get('message')}")
            sys.exit(1)
    else:
        logger.error(f"API key validation request failed: {validate_response.status_code}")
        logger.error(f"Response: {validate_response.text}")
        sys.exit(1)
except Exception as e:
    logger.error(f"Error during API key validation: {e}")
    sys.exit(1)

# Enable verbose debugging
logger.info(f"\nMaking request to: {url}")
logger.info(f"Data: {json.dumps(data, indent=2)}")

# Make the request
try:
    logger.info("\nSending request to generate resume. This may take a minute or two...")
    response = requests.post(url, headers=headers, data=json.dumps(data), timeout=300)
    
    # Print the status code and response
    logger.info(f"\nStatus Code: {response.status_code}")
    
    # Try to parse and print the JSON response
    try:
        json_response = response.json()
        logger.info("\nResponse received! Processing...")
        
        if "error" in json_response:
            logger.error(f"Error: {json_response.get('error')}")
            logger.error(f"Message: {json_response.get('message')}")
            if "details" in json_response:
                logger.error(f"Details: {json_response.get('details')}")
            sys.exit(1)
            
        # If successful, save the tailored resume and interview materials
        if "status" in json_response and json_response["status"] == "success":
            # Save to files with descriptive names
            with open("tailored_llm_engineer_resume.md", "w") as f:
                f.write(json_response["tailoredResume"])
            with open("llm_engineer_interview_prep.md", "w") as f:
                f.write(json_response["interviewMaterials"])
            
            logger.info("\n✅ Success! Saved resume and interview materials to files.")
            logger.info("- Resume saved to: tailored_llm_engineer_resume.md")
            logger.info("- Interview preparation saved to: llm_engineer_interview_prep.md")
            
            # Print a preview of the resume (first 500 chars)
            resume_preview = json_response["tailoredResume"][:500] + "..." if len(json_response["tailoredResume"]) > 500 else json_response["tailoredResume"]
            logger.info("\nResume Preview:")
            logger.info("-" * 80)
            logger.info(resume_preview)
            logger.info("-" * 80)
        else:
            logger.warning("\nUnexpected response format:")
            logger.warning(json.dumps(json_response, indent=2))
    except json.JSONDecodeError:
        logger.error("Response is not valid JSON")
        logger.error(f"Raw response: {response.text}")
except Exception as e:
    logger.error(f"Error making request: {e}") 