#!/bin/bash

echo "Setting up the project..."

# Ensure the lectures directory exists
mkdir -p lectures/Web_Development/Frontend lectures/Web_Development/Backend lectures/AI_and_ML

# Create README files if they don't exist
if [ ! -f lectures/Web_Development/README.md ]; then
  echo "# Web Development

This folder contains lectures on various web development topics, including frontend and backend technologies." > lectures/Web_Development/README.md
fi

if [ ! -f lectures/Web_Development/Frontend/README.md ]; then
  echo "# Frontend Development

This folder contains lectures on frontend web development topics, including HTML, CSS, JavaScript, and modern frameworks." > lectures/Web_Development/Frontend/README.md
fi

if [ ! -f lectures/Web_Development/Backend/README.md ]; then
  echo "# Backend Development

This folder contains lectures on backend web development topics, including server-side programming, databases, and APIs." > lectures/Web_Development/Backend/README.md
fi

if [ ! -f lectures/AI_and_ML/README.md ]; then
  echo "# Artificial Intelligence and Machine Learning

This folder contains lectures on artificial intelligence and machine learning topics, including neural networks, deep learning, and natural language processing." > lectures/AI_and_ML/README.md
fi

# Copy sample lectures if they don't exist
if [ ! -f lectures/AI_and_ML/introduction_to_llms.md ]; then
  cp backend/sample_lecture.md lectures/AI_and_ML/introduction_to_llms.md
fi

# Check if we're running in Docker
if command -v python3 &>/dev/null; then
  # Navigate to the backend directory
  cd backend

  # Make migrations for all apps
  echo "Creating migrations..."
  python3 manage.py makemigrations

  # Apply migrations
  echo "Applying migrations..."
  python3 manage.py migrate
  
  cd ..
else
  echo "Python not found. Skipping database migrations."
  echo "To run migrations inside Docker container, use:"
  echo "  docker-compose exec backend python manage.py makemigrations"
  echo "  docker-compose exec backend python manage.py migrate"
fi

echo "Setup complete!"
echo "You can now start the development server with: docker-compose up"