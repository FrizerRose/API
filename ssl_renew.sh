#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml --no-ansi"
DOCKER="/usr/bin/docker"

cd /var/www/API/
$COMPOSE run certbot renew --noninteractive && $COMPOSE restart nginx_container
$DOCKER system prune -af