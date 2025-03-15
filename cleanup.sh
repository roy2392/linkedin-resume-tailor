#!/bin/bash

# Cleanup script to remove sensitive files and debug artifacts

echo "Cleaning up repository..."

# Remove debug and test files
echo "Removing debug and test files..."
rm -f debug_resume.py
rm -f debug_resume_with_details.py
rm -f debug_resume.log
rm -f test_api_key.py
rm -f test_server.py
rm -f test_validation.html
rm -f test_anthropic_resume.py

# Remove generated output
echo "Removing generated output files..."
rm -f tailored_*.md
rm -f *_interview_prep.md
rm -f *.log

# Remove DB directory
echo "Removing database files..."
rm -rf db/

echo "Cleanup complete!"
echo "Use 'git status' to verify the files have been removed." 