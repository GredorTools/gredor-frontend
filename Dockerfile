FROM node:lts-alpine AS build-stage

# Install git
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the Vue.js app
RUN npm run build

# Production Stage
FROM nginxinc/nginx-unprivileged:stable-alpine AS production-stage

# Set working directory in Nginx container
WORKDIR /usr/share/nginx/html

# Copy built files from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Add runtime configuration script
COPY --chmod=755 nginx/entrypoint.sh /entrypoint.sh

EXPOSE 8080

CMD ["/entrypoint.sh"]
