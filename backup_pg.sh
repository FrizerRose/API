#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml --no-ansi"

cd /var/www/API/
$COMPOSE exec postgres_container pg_dumpall -c -U postgres | gzip > /var/lib/postgresql/backup/$(date +"%Y-%m-%d_%H_%M_%S").sql.gz


