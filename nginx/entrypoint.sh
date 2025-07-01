#!/bin/sh

# Path to the runtime config.js file
CONFIG_FILE=/usr/share/nginx/html/config.js

# Replace placeholders in config.js with environment variables
echo "Generating runtime configuration in $CONFIG_FILE"
cat <<EOF > $CONFIG_FILE
window.config = {
    VITE_ENV_NAME: "${VITE_ENV_NAME:-}"
    VITE_GREDOR_BACKEND_BASEURL: "${VITE_GREDOR_BACKEND_BASEURL:-}"
};
EOF

# Start Nginx
echo "Starting nginx"
nginx -g "daemon off;"
