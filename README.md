Production Setup:

1.) Install docker and docker-compose
2.) clone the repo
3.) run sudo ./init-letsencrypt.sh
4.) after it creates dummy certs it will fail and you should run 
sudo docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml run --rm --entrypoint "certbot certonly --manual -d *.admin.dolazim.hr -d *.dolazim.hr -d dolazim.hr --email juraj.markesic.dev@gmail.com --agree-tos --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory" certbot
5.) Follow the instructions and create a DNS TXT entry
6.) add "25 03 * * * /var/www/API/backup_pg.sh >> /var/log/cron.log 2>&1" to crontab (sudo crontab -e)
7.) add "30 03 * * * /var/www/API/ssl_renew.sh >> /var/log/cron.log 2>&1" to crontab (sudo crontab -e)
8.) Add basic auth user/password sudo htpasswd -c /etc/apache2/.htpasswd primrose
9.) git clone, npm install, npm run build - landing/booking/dashboard

Import sql dump:
sudo gunzip < sql/2021-02-10_10_48_22.sql.gz | docker exec -i postgres_container psql -U postgres

Migrations:
1.) Change entity
2.) Run "npm run migration-generate <migration_name>" inside the api container
3.) Test it out with "npm run migration-run", customize the migration if needed
4.) Push to master, exec into the api container shell there and run "npm run migration-run"

Server shell aliases:
alias api-up="sudo docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up --build -d"
alias api-down="docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml down" 
alias api-logs="docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml logs --tail=50" 
alias api-execute="docker-compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml exec" 
alias api-up-server="api-up --no-deps api_container"