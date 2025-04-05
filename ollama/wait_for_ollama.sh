#!/bin/bash
# Start Ollama in the foreground
echo "🚀 Starting Ollama service..."
ollama serve &
# Record Process ID
pid=$!
# Wait for Ollama to start
sleep 10
echo "🔄 Checking Ollama service..."

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags >/dev/null; then
  echo "✅ Ollama service is running"
  
  # Pull the model in the background
  echo "🔴 Retrieving llama3.2 model..."
  ollama pull llama3.2 &
  pull_pid=$!
  
  # Wait for the model to be pulled
  wait $pull_pid
  echo "🟢 Model downloaded successfully!"
else
  echo "❌ Ollama service failed to start"
fi

# Keep the container running
echo "🔄 Ollama service is now available"
wait $pid
