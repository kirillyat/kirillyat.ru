# Personal Resume Website with LLM Integration

This project is a personal resume website with LLM integration, markdown lectures, and a mentoring program. It's built using React for the frontend and Django for the backend, with Ollama for LLM capabilities.

## Features

- **Resume Page**: Display professional experience, education, projects, and skills
- **Lectures**: Share knowledge through markdown-formatted lectures
- **Mentoring Program**: Allow visitors to book mentoring sessions
- **AI Chat**: Interact with an AI assistant powered by Ollama

## Tech Stack

### Frontend
- React
- React Router
- React Markdown
- CSS3

### Backend
- Django
- Django REST Framework
- SQLite

### AI Integration
- Ollama
- LLaMA 3.2

### Deployment
- Docker
- Docker Compose
- Nginx

## Project Structure

```
kirillyat.ru/
├── backend/               # Django backend
│   ├── chat/              # Chat app for LLM integration
│   ├── feed/              # Feed app for blog posts
│   ├── resume/            # Resume app for resume, lectures, and mentoring
│   └── backend/           # Django project settings
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       └── styles/        # CSS files
└── ollama/                # Ollama configuration
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/kirillyat/kirillyat.ru.git
   cd kirillyat.ru
   ```

2. Run the setup script to initialize the database and import sample data:
   ```
   ./setup_resume_site.sh
   ```

3. Start the development environment:
   ```
   docker-compose up
   ```

4. Access the website at http://localhost:3000

## Development

### Backend

The backend is built with Django and provides API endpoints for:
- Resume data
- Lectures
- Mentoring sessions
- Chat with LLM

### Frontend

The frontend is built with React and includes pages for:
- Resume
- Lectures
- Mentoring
- Chat
- About

## License

This project is licensed under the MIT License - see the LICENSE file for details.