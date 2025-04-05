#!/bin/bash

# Navigate to the backend directory
cd backend

# Make migrations for the resume app
echo "Making migrations for the resume app..."
python manage.py makemigrations resume

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

# Import the sample lecture
echo "Importing sample lecture..."
python manage.py import_sample_lecture ../sample_lecture.md

# Create a superuser (optional, will prompt for credentials)
echo "Would you like to create a superuser? (y/n)"
read create_superuser

if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

# Go back to the root directory
cd ..

echo "Setup complete! You can now start the development server."
echo "Run 'docker-compose up' to start all services."