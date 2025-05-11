#!/usr/bin/env bash
# scripts/run.sh
# ---------------
# Stop existing container (if any), then start a new one.

set -euo pipefail
CONTAINER=ivt-container

echo "Stopping any existing container..."
if docker ps -a --format '{{.Names}}' | grep -q "^$$CONTAINER$$"; then
  docker stop $$CONTAINER && docker rm $$CONTAINER
fi

echo "Running new container on port 8080..."
docker run -d --name $$CONTAINER -p 8080:80 image-video-tools:latest
echo "App is live at http://localhost:8080"
