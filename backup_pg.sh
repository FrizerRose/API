#!/bin/bash

DOCKER="/usr/bin/docker"


$DOCKER exec postgres_container bash -c 'pg_dumpall -c -U postgres' | gzip > /var/www/API/sql/$(date +"%Y-%m-%d_%H_%M_%S").sql.gz

