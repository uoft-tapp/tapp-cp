#!/bin/sh

# meant to run from cron as a user that can write /var/data/tapp eg: pocadmin

docker exec -t tappcp_postgres_1 pg_dumpall -U postgres > /var/data/tapp/tapp.production.`date +\%y\%m\%d\%H\%M`.sql
