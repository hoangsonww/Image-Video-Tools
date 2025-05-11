#!/usr/bin/env bash
# scripts/stop.sh
# ----------------
# Stop and remove the running container.

set -euo pipefail
CONTAINER=ivt-container

echo "Stopping container $$CONTAINER..."
docker stop $$CONTAINER && docker rm $$CONTAINER
echo "Stopped."
