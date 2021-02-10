#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml --no-ansi"

cd /var/www/API/
$COMPOSE exec postgres_container bash -c 'pg_dumpall -c -U postgres' | gzip > ./sql/$(date +"%Y-%m-%d_%H_%M_%S").sql.gz

