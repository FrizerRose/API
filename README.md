Production Setup:

1.) Install docker and docker-compose
2.) clone the repo
3.) run sudo /.init-letsencrypt.sh
4.) add "30 03 * * * /var/www/API/ssl_renew.sh >> /var/log/cron.log 2>&1" to crontab (sudo crontab -e)