import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import warnings
warnings.filterwarnings('ignore')

from crewai import Agent, Task, Crew
from crewai_tools import (
    FileReadTool,
    ScrapeWebsiteTool,
    MDXSearchTool,
    SerperDevTool
)

def validate_anthropic_key(api_key):
    """Validate the Anthropic API key by making a simple request."""
    try:
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
            # Future implementation for OpenAI key validation
            return jsonify({
                "valid": True, 
                "message": "OpenAI validation not yet implemented"
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

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        
        # Extract API keys, URLs and LLM provider
        llm_provider = data.get('llmProvider', 'openai')  # Default to OpenAI if not specified
        openai_api_key = data.get('openaiApiKey')
        anthropic_api_key = data.get('anthropicApiKey')
        serper_api_key = data.get('serperApiKey')
        job_posting_url = data.get('jobPostingUrl')
        linkedin_url = data.get('linkedinUrl')
        personal_writeup = data.get('personalWriteup')
        
        # Validate inputs
        if not serper_api_key or not job_posting_url or not linkedin_url or not personal_writeup:
            return jsonify({
                "error": "Missing required fields", 
                "message": "Please provide all required information"
            }), 400
            
        # Validate that the appropriate API key is provided based on provider
        if llm_provider == 'openai' and not openai_api_key:
            return jsonify({
                "error": "Missing OpenAI API key", 
                "message": "Please provide an OpenAI API key"
            }), 400
        elif llm_provider == 'anthropic' and not anthropic_api_key:
            return jsonify({
                "error": "Missing Anthropic API key", 
                "message": "Please provide an Anthropic API key"
            }), 400
            
        # Validate Anthropic API key if selected
        if llm_provider == 'anthropic':
            is_valid, error_message = validate_anthropic_key(anthropic_api_key)
            if not is_valid:
                return jsonify({
                    "error": "Invalid Anthropic API key",
                    "message": error_message
                }), 400
            
        # Set environment variables based on provider
        if llm_provider == 'openai':
            os.environ["OPENAI_API_KEY"] = openai_api_key
            os.environ["OPENAI_MODEL_NAME"] = 'gpt-4-turbo'
        elif llm_provider == 'anthropic':
            os.environ["ANTHROPIC_API_KEY"] = anthropic_api_key
            
        os.environ["SERPER_API_KEY"] = serper_api_key
        
        # Create temporary directory to store resume file
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create temporary resume file
            resume_path = os.path.join(temp_dir, 'resume.md')
            with open(resume_path, 'w') as f:
                f.write(personal_writeup)
            
            # Initialize tools
            search_tool = SerperDevTool()
            scrape_tool = ScrapeWebsiteTool()
            read_resume = FileReadTool(file_path=resume_path)
            semantic_search_resume = MDXSearchTool(mdx=resume_path)
            
            # Create agents with the specified LLM provider
            researcher = Agent(
                role="Tech Job Researcher",
                goal="Make sure to do amazing analysis on job posting to help job applicants",
                tools=[scrape_tool, search_tool],
                verbose=True,
                llm_provider=llm_provider,  # Set LLM provider
                backstory=(
                    "As a Job Researcher, your prowess in navigating and extracting critical "
                    "information from job postings is unmatched. Your skills help pinpoint the necessary "
                    "qualifications and skills sought by employers, forming the foundation for "
                    "effective application tailoring."
                )
            )
            
            profiler = Agent(
                role="Personal Profiler for Engineers",
                goal="Do increditble research on job applicants to help them stand out in the job market",
                tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
                verbose=True,
                llm_provider=llm_provider,  # Set LLM provider
                backstory=(
                    "Equipped with analytical prowess, you dissect and synthesize information "
                    "from diverse sources to craft comprehensive personal and professional profiles, "
                    "laying the groundwork for personalized resume enhancements."
                )
            )
            
            resume_strategist = Agent(
                role="Resume Strategist for Engineers",
                goal="Find all the best ways to make a resume stand out in the job market.",
                tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
                verbose=True,
                llm_provider=llm_provider,  # Set LLM provider
                backstory=(
                    "With a strategic mind and an eye for detail, you excel at refining resumes "
                    "to highlight the most relevant skills and experiences, ensuring they "
                    "resonate perfectly with the job's requirements."
                )
            )
            
            interview_preparer = Agent(
                role="Engineering Interview Preparer",
                goal="Create interview questions and talking points based on the resume and job requirements",
                tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
                verbose=True,
                llm_provider=llm_provider,  # Set LLM provider
                backstory=(
                    "Your role is crucial in anticipating the dynamics of interviews. "
                    "With your ability to formulate key questions and talking points, "
                    "you prepare candidates for success, ensuring they can confidently "
                    "address all aspects of the job they are applying for."
                )
            )
            
            # Create tasks
            research_task = Task(
                description=(
                    f"Analyze the job posting URL provided ({job_posting_url}) "
                    "to extract key skills, experiences, and qualifications required. "
                    "Use the tools to gather content and identify and categorize the requirements."
                ),
                expected_output=(
                    "A structured list of job requirements, including necessary skills, "
                    "qualifications, and experiences."
                ),
                agent=researcher,
                async_execution=True
            )
            
            profile_task = Task(
                description=(
                    f"Compile a detailed personal and professional profile using the "
                    f"LinkedIn profile ({linkedin_url}), and personal write-up. "
                    "Utilize tools to extract and synthesize information from these sources."
                ),
                expected_output=(
                    "A comprehensive profile document that includes skills, project experiences, "
                    "contributions, interests, and communication style."
                ),
                agent=profiler,
                async_execution=True
            )
            
            # Create tasks with context
            tailored_resume_path = os.path.join(temp_dir, 'tailored_resume.md')
            resume_strategy_task = Task(
                description=(
                    "Using the profile and job requirements obtained from previous tasks, "
                    "tailor the resume to highlight the most relevant areas. Employ tools "
                    "to adjust and enhance the resume content. Make sure this is the best "
                    "resume even but don't make up any information. Update every section, "
                    "including the initial summary, work experience, skills, and education. "
                    "All to better reflect the candidates abilities and how it matches the job posting."
                ),
                expected_output=(
                    "An updated resume that effectively highlights the candidate's "
                    "qualifications and experiences relevant to the job."
                ),
                output_file=tailored_resume_path,
                context=[research_task, profile_task],
                agent=resume_strategist
            )
            
            interview_materials_path = os.path.join(temp_dir, 'interview_materials.md')
            interview_preparation_task = Task(
                description=(
                    "Create a set of potential interview questions and talking points "
                    "based on the tailored resume and job requirements. Utilize tools to "
                    "generate relevant questions and discussion points. Make sure to use "
                    "these question and talking points to help the candidate highlight the "
                    "main points of the resume and how it matches the job posting."
                ),
                expected_output=(
                    "A document containing key questions and talking points that the "
                    "candidate should prepare for the initial interview."
                ),
                output_file=interview_materials_path,
                context=[research_task, profile_task, resume_strategy_task],
                agent=interview_preparer
            )
            
            # Create and run crew
            job_application_crew = Crew(
                agents=[researcher, profiler, resume_strategist, interview_preparer],
                tasks=[research_task, profile_task, resume_strategy_task, interview_preparation_task],
                verbose=True
            )
            
            # Execute crew with inputs
            job_application_inputs = {
                'job_posting_url': job_posting_url,
                'github_url': linkedin_url,  # Using LinkedIn URL as GitHub URL for compatibility
                'personal_writeup': personal_writeup
            }
            
            result = job_application_crew.kickoff(inputs=job_application_inputs)
            
            # Read output files
            with open(tailored_resume_path, 'r') as f:
                tailored_resume = f.read()
                
            with open(interview_materials_path, 'r') as f:
                interview_materials = f.read()
            
            # Return results
            return jsonify({
                "status": "success",
                "tailoredResume": tailored_resume,
                "interviewMaterials": interview_materials,
                "provider": llm_provider
            }), 200
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Server error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port) 