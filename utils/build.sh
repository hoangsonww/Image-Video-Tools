#!/usr/bin/env bash
# scripts/build.sh
# ----------------
# Build the Docker image.

set -euo pipefail
echo "Building Docker image..."
docker build -t image-video-tools:latest .
echo "Done."
