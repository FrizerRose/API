Production Setup:

1.) Install docker and docker-compose
2.) clone the repo
3.) run sudo /.init-letsencrypt.sh
4.) after it creates dummy certs it will fail and you should run 
sudo docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml run --rm --entrypoint "certbot certonly --manual -d *.frizerrose.info -d frizerrose.info --email juraj.markesic.dev@gmail.com --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory" certbot
4.) add "25 03 * * * /var/www/API/backup_pg.sh >> /var/log/cron.log 2>&1" to crontab (sudo crontab -e)
5.) add "30 03 * * * /var/www/API/ssl_renew.sh >> /var/log/cron.log 2>&1" to crontab (sudo crontab -e)

Import sql dump:
sudo gunzip < sql/2021-02-10_10_48_22.sql.gz | docker exec -i postgres_container psql -U postgres
