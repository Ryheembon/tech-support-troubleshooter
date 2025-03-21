#!/bin/bash

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Install Tailwind CSS plugins
echo "Installing Tailwind CSS plugins..."
npm install -D @tailwindcss/typography @tailwindcss/forms

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Create Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install Python dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install fastapi==0.109.0 uvicorn==0.27.0 pydantic==2.5.3

echo "Setup complete! To start the application:"
echo "1. In one terminal: source venv/bin/activate && uvicorn main:app --reload"
echo "2. In another terminal: npm run dev" 