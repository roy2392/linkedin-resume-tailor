"""API routes for the LinkedIn Resume Tailor application."""
import os
import tempfile
from flask import request, jsonify
from crewai import Crew
from crewai_tools import (
    FileReadTool,
    ScrapeWebsiteTool,
    MDXSearchTool,
    SerperDevTool
)
from .models import (
    create_researcher_agent, 
    create_profiler_agent,
    create_resume_strategist_agent,
    create_interview_preparer_agent,
    create_research_task,
    create_profile_task,
    create_resume_strategy_task,
    create_interview_preparation_task
)

def register_routes(app):
    """Register the API routes with the Flask app."""
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({"status": "healthy"}), 200

    @app.route('/api/generate-resume', methods=['POST'])
    def generate_resume():
        """Generate a tailored resume based on user inputs."""
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
                
                # Create agents
                researcher = create_researcher_agent(scrape_tool, search_tool, llm_provider)
                profiler = create_profiler_agent(scrape_tool, search_tool, read_resume, semantic_search_resume, llm_provider)
                resume_strategist = create_resume_strategist_agent(scrape_tool, search_tool, read_resume, semantic_search_resume, llm_provider)
                interview_preparer = create_interview_preparer_agent(scrape_tool, search_tool, read_resume, semantic_search_resume, llm_provider)
                
                # Create tasks
                research_task = create_research_task(researcher, job_posting_url)
                profile_task = create_profile_task(profiler, linkedin_url)
                
                # Create tasks with context
                tailored_resume_path = os.path.join(temp_dir, 'tailored_resume.md')
                resume_strategy_task = create_resume_strategy_task(
                    resume_strategist, 
                    research_task, 
                    profile_task, 
                    tailored_resume_path
                )
                
                interview_materials_path = os.path.join(temp_dir, 'interview_materials.md')
                interview_preparation_task = create_interview_preparation_task(
                    interview_preparer,
                    research_task,
                    profile_task,
                    resume_strategy_task,
                    interview_materials_path
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

    return app 