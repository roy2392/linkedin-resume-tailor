#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# Start the frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to handle program exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Register the cleanup function for program exit
trap cleanup INT TERM

echo "Both servers are running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for user to press Ctrl+C
wait 