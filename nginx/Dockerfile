FROM nginx

# New default conf containing the proxy config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Backend not found html response
COPY nginx/backend-not-found.html /var/www/html/backend-not-found.html

# Nginx Proxy and SSL shared configs
COPY nginx/includes/ /etc/nginx/includes/

# Proxy SSL certs
COPY nginx/ssl/ /etc/ssl/certs/nginx/
