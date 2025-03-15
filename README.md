# LinkedIn Resume Tailor

A modern web application that uses AI agents to create tailored resumes and interview preparation materials based on your LinkedIn profile and job descriptions.

## 🌟 Features

- **Job Analysis**: Analyzes job descriptions to extract key requirements and qualifications
- **Profile Compilation**: Extracts information from your LinkedIn profile and personal write-up
- **Resume Tailoring**: Creates a tailored resume that aligns with the job requirements
- **Interview Preparation**: Generates potential interview questions and talking points
- **Sleek UI**: Modern interface with smooth animations and glass effects
- **Dark/Light Mode**: Supports both dark and light themes for comfortable viewing
- **AI Provider Options**: Use either OpenAI or Anthropic (Claude) for resume generation

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (for containerized deployment)
- OpenAI API Key or Anthropic API Key
- [Serper API Key](https://serper.dev/) for web search capabilities
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Project Structure

```
linkedin-resume-tailor/
├── backend/                 # Flask backend
│   ├── app/                 # Application package
│   │   ├── __init__.py
│   │   ├── app.py           # Main Flask app
│   │   ├── config.py        # Configuration
│   │   ├── models.py        # Agent models
│   │   └── routes.py        # API routes
│   ├── __init__.py
│   ├── run.py               # Entry point
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/                # Next.js frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── ...
│   └── Dockerfile           # Frontend container
├── docker-compose.yml       # Docker Compose config
└── start-dev.sh             # Developer startup script
```

### Running the Application

#### Using Docker Compose (Recommended for Production)

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

#### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linkedin-resume-tailor.git
   cd linkedin-resume-tailor
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Set up environment variables:
   ```bash
   # Create .env.local in the frontend directory
   echo "BACKEND_URL=http://localhost:5001" > frontend/.env.local
   ```

5. Start both servers with a single command:
   ```bash
   ./start-dev.sh
   ```
   
   Or run them separately:
   
   ```bash
   # Terminal 1 - Backend
   cd backend
   python run.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🔒 Privacy & Security

- Your API keys are used only for the current session and are never stored on our servers
- Your data is processed locally and not stored beyond the current session
- The application uses secure HTTPS connections

## 🛠️ Technology Stack

- **Backend**: Python, Flask, crewAI, langchain
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Infrastructure**: Docker, Docker Compose

## 🔧 Troubleshooting

### Port Conflicts

- **Backend**: If port 5001 is in use, you can change the port in `backend/app/config.py`
- **Frontend**: If port 3000 is in use, Next.js will automatically try the next available port

### Dependency Issues

If you're experiencing issues with dependencies, try cleaning your environment:

```bash
# Frontend
cd frontend
npm run dev:clean

# Backend
cd backend
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

### Theme Issues

If the theme is not switching properly, clear your browser's local storage.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Based on the crewAI framework created by Joāo Moura
- Inspired by the DeepLearning.AI course on crewAI
- UI inspired by Apple and Claude interfaces 