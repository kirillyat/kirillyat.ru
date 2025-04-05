#!/bin/bash

echo "Waiting for Ollama service to start..."
until curl -s http://localhost:11434/api/tags > /dev/null; do
  echo "Ollama service not ready yet, waiting..."
  sleep 5
done

echo "Ollama service is up and running!"
echo "Pulling llama3.2 model..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "llama3.2"}'
echo "Model pull request sent. This may take a while depending on your internet connection."
echo "You can check the status by running: curl http://localhost:11434/api/tags"
