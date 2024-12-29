# Use an official Python runtime as the base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the Docker container
WORKDIR /

# Copy requirements and install Python dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django application into the container
COPY . .


ENV DJANGO_SETTINGS_MODULE=backend.settings

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]