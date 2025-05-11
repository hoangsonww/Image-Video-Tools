# Dockerfile
FROM nginx:stable-alpine

LABEL maintainer="Son Nguyen <hoangsonww@github.com>"

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy your entire site into nginx’s web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
