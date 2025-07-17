#!/bin/bash

# Production setup script for CodeCave
# This script sets up the production environment after Terraform provisioning

set -e

echo "Starting CodeCave production setup..."

# Check if we're running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

# Set up environment variables
export ENVIRONMENT=${ENVIRONMENT:-production}
export PROJECT_NAME=${PROJECT_NAME:-codecave}

# Create necessary directories
mkdir -p /mnt/volume_nyc3_01/{meilisearch,rabbitmq,redis,app-logs,static}
mkdir -p /opt/codecave/{kong,nginx/sites}

# Set proper permissions
chown -R root:root /opt/codecave
chmod -R 755 /opt/codecave

# Create Kong configuration
cat > /opt/codecave/kong/kong.yml << 'EOF'
_format_version: "3.0"
_transform: true

services:
  - name: codecave-api
    url: http://api:3001
    routes:
      - name: api-route
        paths:
          - /api
        strip_path: true
      - name: health-route
        paths:
          - /health
        strip_path: false

  - name: codecave-web
    url: http://host.docker.internal:3000  # Next.js dev server or Vercel
    routes:
      - name: web-route
        paths:
          - /
        strip_path: false
        
plugins:
  - name: cors
    config:
      origins:
        - "https://codecave.tech"
        - "https://api.codecave.tech"
        - "http://localhost:3000"
      methods:
        - GET
        - POST
        - PUT
        - DELETE
        - OPTIONS
      headers:
        - Accept
        - Content-Type
        - Authorization
      exposed_headers:
        - X-Auth-Token
      credentials: true
      max_age: 3600

  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
      policy: local
EOF

# Create Nginx configuration
cat > /opt/codecave/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml;

    # Include site configurations
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Create site configuration
cat > /opt/codecave/nginx/sites/codecave.conf << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Upstream servers
upstream kong_upstream {
    server gateway:8000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name codecave.tech api.codecave.tech;
    
    # Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name codecave.tech api.codecave.tech;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/codecave.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codecave.tech/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/codecave.tech/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://kong_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://kong_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        access_log off;
    }

    # Static files
    location /static/ {
        root /var/www;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # Default location
    location / {
        proxy_pass http://kong_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Mount the volume if not already mounted
if ! mountpoint -q /mnt/volume_nyc3_01; then
    echo "Mounting data volume..."
    mkdir -p /mnt/volume_nyc3_01
    
    # Find the volume device (this may vary)
    VOLUME_DEVICE=$(lsblk -o NAME,MOUNTPOINT | grep -v "/" | grep -E "sd[b-z]" | head -1 | awk '{print $1}')
    
    if [ -n "$VOLUME_DEVICE" ]; then
        mount /dev/$VOLUME_DEVICE /mnt/volume_nyc3_01
        echo "/dev/$VOLUME_DEVICE /mnt/volume_nyc3_01 ext4 defaults,nofail,discard 0 2" >> /etc/fstab
        echo "Volume mounted successfully"
    else
        echo "Warning: Could not find volume device"
    fi
fi

# Set up SSL certificates (placeholder - you'll need to run this manually)
echo "Setting up SSL certificates..."
echo "Note: You'll need to run 'certbot --nginx -d codecave.tech -d api.codecave.tech' manually after DNS is configured"

# Create systemd service for CodeCave
cat > /etc/systemd/system/codecave.service << 'EOF'
[Unit]
Description=CodeCave Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/codecave
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable codecave.service

echo "Production setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure DNS to point to this server's IP"
echo "2. Run SSL certificate setup: certbot --nginx -d codecave.tech -d api.codecave.tech"
echo "3. Set up environment variables in /opt/codecave/.env"
echo "4. Start the application: systemctl start codecave"
echo ""
echo "Monitoring:"
echo "- Application logs: docker-compose -f /opt/codecave/docker-compose.yml logs -f"
echo "- System monitoring: /opt/codecave/monitor.sh"
echo "- Backups: /opt/codecave/backup.sh" 