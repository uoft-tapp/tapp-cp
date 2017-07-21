#!/bin/bash
temp="`docker inspect -f '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}' tapp_rails-app_1`"
IFS=$'\r\n' GLOBIGNORE='*' command eval  'file=($(cat .env))'
file[6]="TAPP=$temp"
printf "%s\n" "${file[@]}" > .env
docker-compose up
