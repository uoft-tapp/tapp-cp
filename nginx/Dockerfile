FROM nginx

# New default conf containing the proxy config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Backend not found html response
COPY nginx/backend-not-found.html /var/www/html/backend-not-found.html

# Nginx Proxy and SSL shared configs
COPY nginx/includes/ /etc/nginx/includes/

# sample kept certs in github. they're supposed to be private, eh?
#COPY nginx/ssl/ /etc/ssl/certs/nginx/

# Proxy SSL certs from private place
# this will only work on sleepy, but that's where the cert lives for now.
# do NOT push these certs into github!

COPY /etc/ssl/certs/sleepy_u.crt /etc/ssl/certs/nginx/
COPY /etc/ssl/certs/sleepy_u.key /etc/ssl/certs/nginx/
