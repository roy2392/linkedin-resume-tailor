# LinkedIn Resume Tailor

A modern web application that uses AI agents to create tailored resumes and interview preparation materials based on your LinkedIn profile and job descriptions.

## 🌟 Features

- **Job Analysis**: Analyzes job descriptions to extract key requirements and qualifications
- **Profile Compilation**: Extracts information from your LinkedIn profile and personal write-up
- **Resume Tailoring**: Creates a tailored resume that aligns with the job requirements
- **Interview Preparation**: Generates potential interview questions and talking points
- **Sleek UI**: Modern Apple-inspired interface with smooth animations and glass effects

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- OpenAI API Key (GPT-4 recommended for best results)
- [Serper API Key](https://serper.dev/) for web search capabilities

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linkedin-resume-tailor.git
   cd linkedin-resume-tailor
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

4. Input your LinkedIn profile URL, job posting URL, and personal write-up

5. Provide your API keys (these are never stored on our servers)

6. Get your tailored resume and interview preparation materials!

### Running Without Docker

#### Backend (Python)

1. Install Python 3.10 or later
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend:
   ```bash
   python app.py
   ```

#### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Privacy & Security

- Your API keys are used only for the current session and are never stored on our servers
- Your data is processed locally and not stored beyond the current session
- The application uses secure HTTPS connections

## 🛠️ Technology Stack

- **Backend**: Python, Flask, crewAI, langchain
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Infrastructure**: Docker, Docker Compose

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Based on the crewAI framework created by Joāo Moura
- Inspired by the DeepLearning.AI course on crewAI
- UI inspired by Apple and Claude interfaces 