# Use the official Node.js image as the base
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:14

# Install required dependencies
RUN apt-get update && apt-get install -y \
  curl \
  git \
  build-essential \
  python3 \
  python3-pip

# Set working directory
WORKDIR /workspace

# Copy your app's code into the container (optional, depending on your workflow)
# COPY . /workspace

# Install npm dependencies
RUN npm install

# Expose the app port (default is 8080)
EXPOSE 8080

# Run app by default
CMD ["npm", "start"]
