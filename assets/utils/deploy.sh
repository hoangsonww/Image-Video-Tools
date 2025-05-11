#!/usr/bin/env bash
# scripts/deploy.sh
# -----------------
# Quick “build + run” in one command.

set -euo pipefail

./scripts/build.sh
./scripts/run.sh
echo "App is live at http://localhost:8080"
echo "Deployment complete."
echo "You can stop the container with ./scripts/stop.sh"
