### Installing necessary packages
sudo apt update
sudo apt install nginx
sudo apt install certbot python3-certbot-nginx

### Deploying certificate
sudo certbot certonly --standalone -d www.tectho.com
sudo certbot certonly --standalone -d api.tectho.com

<!-- 
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.tectho.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/api.tectho.com/privkey.pem
 -->

## Automate Certificate Renewal:
Open crontab for editing:
sudo crontab -e

Add the following line to renew the certificates and reload Nginx:
0 3 * * * certbot renew --quiet && systemctl reload nginx

### Create a new configuration file for your frontend:
sudo vim /etc/nginx/sites-available/frontend

# past the following configuration
server {
    listen 80;
    server_name www.tectho.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name www.tectho.com;

    ssl_certificate /etc/letsencrypt/live/www.tectho.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.tectho.com/privkey.pem;

    # Other SSL settings (you can modify this as needed)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';

    location / {
        proxy_pass http://167.71.208.204:4173;  # Frontend container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

### Create a new configuration file for your backend:
sudo vim /etc/nginx/sites-available/backend

# paste this configuration
server {
    listen 80;
    server_name api.tectho.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.tectho.com;

    ssl_certificate /etc/letsencrypt/live/api.tectho.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tectho.com/privkey.pem;

    # Other SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';

    location / {
        proxy_pass http://167.71.208.204:3001;  # Backend container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


### Enable the Configuration
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t  # Test for syntax errors
sudo systemctl restart nginx  # Restart Nginx