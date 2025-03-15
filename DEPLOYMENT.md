# Deployment Guide for LinkedIn Resume Tailor (SSR Edition)

This guide outlines how to deploy the LinkedIn Resume Tailor application as a single unified application using server-side rendering (SSR) on Vercel.

## Prerequisites

Before deploying, ensure you have:

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/signup)
- API keys for:
  - Anthropic (preferred) or OpenAI
  - SerperDev (for search capabilities)

## Cleaning the Repository

Before deploying, make sure to clean the repository of any sensitive information:

1. Remove any hardcoded API keys in the codebase
2. Update the `.gitignore` file to exclude sensitive files and debug logs
3. Clear any personal data or test files from the repository

If you accidentally committed sensitive information:

```bash
# Install BFG Repo-Cleaner if using Java
cd /tmp
curl -Lo bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Create a file with sensitive data patterns
echo "your-api-key-pattern" > sensitive.txt

# Run BFG to clean history (from repo root)
java -jar /tmp/bfg.jar --replace-text /tmp/sensitive.txt

# Clean up refs and optimize repository
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Deployment to Vercel

### 1. Prepare the Application

The application has been restructured as a single Next.js application with:
- Frontend components in `frontend/`
- API routes in `frontend/app/api/` (replacing the separate backend)
- Shared dependencies in `requirements.txt`

### 2. Deploy to Vercel

1. **Connect your GitHub repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Select the root directory as the source directory (not just the frontend)

2. **Configure the deployment**:
   - Framework Preset: Next.js
   - Root Directory: `./` (root of the repository)
   - Build Command: Override with `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/.next`
   - Install Command: `cd frontend && npm install && pip install -r ../requirements.txt`

3. **Set up environment variables**:
   - `NODE_ENV`: `production`
   
   *You don't need to add API keys to environment variables as they will be provided by users in the application*

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### 3. Test the Deployment

1. Access your deployed application using the Vercel URL
2. Test the API validation endpoint by entering an API key
3. Try generating a resume using the form

## Troubleshooting

### API Issues
- Check Vercel logs if API routes are failing
- Verify that your API routes return proper error responses
- Make sure your API route timeouts are configured to handle LLM response times

### Python Package Issues
- If you encounter Python package installation failures, try updating the Vercel build command
- Consider using a `runtime.txt` file to specify the Python version

### API Key Issues
- If API validation fails, check the browser console for error messages
- Verify that the API key format validation in the frontend matches the backend requirements

## Security Considerations

- Never commit API keys to the repository
- The application doesn't store user API keys on the server
- User API keys are only used for the duration of the request
- All API requests should use HTTPS

## Monitoring and Maintenance

- Set up monitoring using Vercel Analytics
- Check Vercel logs periodically for errors
- Keep dependencies updated to address security vulnerabilities

---

For any deployment issues, please open an issue in the GitHub repository. 