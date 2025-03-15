import requests
import json

# API endpoint
url = "http://localhost:5001/api/generate-resume"

# Test data
data = {
    "llmProvider": "anthropic",
    "anthropicApiKey": "sk-ant-YOUR_KEY_HERE",  # Replace with your Anthropic API key
    "jobPostingUrl": "https://www.linkedin.com/jobs/view/software-engineer-at-example-3824271371",
    "linkedinUrl": "https://www.linkedin.com/in/johndoe/",
    "personalWriteup": """
I am a software engineer with 5 years of experience in web development.
My expertise includes:
- Frontend: React, Angular, Vue.js
- Backend: Node.js, Python, Java
- Database: MongoDB, PostgreSQL, MySQL
- DevOps: Docker, Kubernetes, AWS

I have worked on various projects including:
1. E-commerce platform with 1M+ users
2. Real-time analytics dashboard
3. Payment processing system

I am passionate about building scalable and efficient applications.
"""
}

# Set headers
headers = {
    "Content-Type": "application/json"
}

# Make the request
try:
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    # Print the status code and response
    print(f"Status Code: {response.status_code}")
    print("Response:")
    
    # Try to parse and print the JSON response
    try:
        json_response = response.json()
        print(json.dumps(json_response, indent=2))
        
        # If successful, save the tailored resume and interview materials
        if "status" in json_response and json_response["status"] == "success":
            with open("tailored_resume.md", "w") as f:
                f.write(json_response["tailoredResume"])
            with open("interview_materials.md", "w") as f:
                f.write(json_response["interviewMaterials"])
            print("\nSaved resume and interview materials to files.")
    except json.JSONDecodeError:
        print("Response is not valid JSON")
        print(response.text)
except Exception as e:
    print(f"Error making request: {e}") 