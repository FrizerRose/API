#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml --no-ansi"
DOCKER="/usr/bin/docker"

cd /var/www/API/
$COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP webserver
$DOCKER system prune -af