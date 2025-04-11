#!/bin/bash
echo "🚀 Starting the Microservices Symphony Portfolio application..."

# Kill any existing node processes to avoid port conflicts
echo "Cleaning up any existing Node.js processes..."
pkill -f "node" || true
pkill -f "tsx" || true
sleep 1

# Configuration
export PORT=5000
export HOST="0.0.0.0"
export NODE_ENV=development

echo "Running with:"
echo "- PORT: $PORT"
echo "- HOST: $HOST"
echo "- NODE_ENV: $NODE_ENV"

# Run with tsx directly for better error output
echo "Starting server with tsx..."
npx tsx server/index.ts

# The script will continue to run as tsx keeps the process active
# No need for wait command as tsx will be in the foreground