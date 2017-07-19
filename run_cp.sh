#!/bin/bash
temp="`docker inspect -f '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}' tapp_rails-app_1`"
echo "TAPP=$temp" > .env
docker-compose up
