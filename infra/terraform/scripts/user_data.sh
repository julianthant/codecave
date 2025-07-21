#!/bin/bash

# User data script for CodeCave production droplet initialization
# This script runs when the drop# Install Doppler CLI with retries
log "# Clone the codecave repository with retries
log "Cloning CodeCave repository..."
cd /root
if [ ! -d "codecave" ]; then
    for attempt in {1..3}; do
        log "Git clone attempt $attempt..."
        if git clone https://github.com/julianthant/codecave.git; then
            log "Repository cloned successfully"
            break
        else
            log "Git clone failed, attempt $attempt/3"
            if [ $attempt -eq 3 ]; then
                log "Git clone failed after 3 attempts, continuing without repository"
            else
                sleep 5
                rm -rf codecave 2>/dev/null || true
            fi
        fi
    done
fi
cd codecave 2>/dev/null || cd /root

# Create swap space for builds
log "Creating swap space..."
if fallocate -l 2G /swapfile; then
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap space created successfully"
else
    log "Failed to create swap space"
fiLI..."
for attempt in {1..3}; do
    log "Doppler installation attempt $attempt..."
    if curl -Ls https://cli.doppler.com/install.sh | sh; then
        log "Doppler CLI installed successfully"
        break
    else
        log "Doppler installation failed, attempt $attempt/3"
        if [ $attempt -eq 3 ]; then
            log "Doppler installation failed after 3 attempts, continuing without it"
        else
            sleep 5
        fi
    fi
done

# Add Doppler to PATH for all users
echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
echo 'export PATH="/usr/local/bin:$PATH"' >> /root/.bashrc
log "Doppler PATH configuration added"on't exit on errors for non-critical operations
set +e

PROJECT_NAME="${project_name}"
ENVIRONMENT="${environment}"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to wait for network connectivity
wait_for_network() {
    log "Waiting for network connectivity..."
    for i in {1..30}; do
        if curl -s --connect-timeout 5 http://checkip.amazonaws.com > /dev/null 2>&1; then
            log "Network connectivity established"
            return 0
        fi
        log "Attempt $i: Waiting for network..."
        sleep 10
    done
    log "Network connectivity timeout"
    return 1
}

# Function to retry commands
retry_command() {
    local retries=3
    local count=0
    until [ $count -ge $retries ]; do
        if "$@"; then
            return 0
        fi
        count=$((count + 1))
        log "Command failed. Retry $count/$retries..."
        sleep 5
    done
    log "Command failed after $retries attempts"
    return 1
}

log "Starting CodeCave $ENVIRONMENT setup"

# Wait for network before proceeding
wait_for_network

# Update system with retries
log "Updating system packages..."
if retry_command apt-get update -y; then
    log "Package index updated successfully"
else
    log "Failed to update package index, continuing anyway"
fi

if retry_command apt-get upgrade -y; then
    log "System packages upgraded successfully"
else
    log "Failed to upgrade system packages, continuing anyway"
fi

# Install essential packages with retries
log "Installing essential packages..."
if retry_command apt-get install -y \
  curl \
  wget \
  git \
  unzip \
  htop \
  nginx \
  certbot \
  python3-certbot-nginx \
  fail2ban \
  ufw; then
    log "Essential packages installed successfully"
else
    log "Failed to install some packages, continuing anyway"
fi

# Docker should already be installed in the image, but ensure it's running
log "Setting up Docker..."
systemctl enable docker || log "Failed to enable Docker service"
systemctl start docker || log "Failed to start Docker service"

# Install Docker Compose v2 with retries
log "Installing Docker Compose..."
if retry_command curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose; then
    chmod +x /usr/local/bin/docker-compose
    log "Docker Compose installed successfully"
else
    log "Failed to install Docker Compose"
fi

# Create application directory structure
log "Setting up application directories..."
mkdir -p /root/codecave  # Main application directory
mkdir -p /opt/codecave/data
mkdir -p /opt/codecave/logs  
mkdir -p /opt/codecave/backups
mkdir -p /mnt/volume_nyc3_01/app-logs
mkdir -p /mnt/volume_nyc3_01/meilisearch
mkdir -p /mnt/volume_nyc3_01/rabbitmq
mkdir -p /mnt/volume_nyc3_01/redis
mkdir -p /mnt/volume_nyc3_01/kong-ssl
log "Application directories created"

# Install Doppler CLI with retries
echo "Installing Doppler CLI..."
for attempt in {1..3}; do
    echo "Doppler installation attempt $attempt..."
    if curl -Ls https://cli.doppler.com/install.sh | sh; then
        echo "Doppler CLI installed successfully"
        break
    else
        echo "Doppler installation failed, attempt $attempt/3"
        if [ $attempt -eq 3 ]; then
            echo "Doppler installation failed after 3 attempts, continuing without it"
        else
            sleep 5
        fi
    fi
done

# Add Doppler to PATH for all users
echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
echo 'export PATH="/usr/local/bin:$PATH"' >> /root/.bashrc

# Clone the codecave repository with retries
echo "Cloning CodeCave repository..."
cd /root
if [ ! -d "codecave" ]; then
    for attempt in {1..3}; do
        echo "Git clone attempt $attempt..."
        if git clone https://github.com/julianthant/codecave.git; then
            echo "Repository cloned successfully"
            break
        else
            echo "Git clone failed, attempt $attempt/3"
            if [ $attempt -eq 3 ]; then
                echo "Git clone failed after 3 attempts, continuing without repository"
            else
                sleep 5
                rm -rf codecave 2>/dev/null || true
            fi
        fi
    done
fi
cd codecave 2>/dev/null || cd /root

# Create swap space for builds
echo "Creating swap space..."
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Set up basic firewall
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https

# Configure fail2ban for SSH protection
systemctl enable fail2ban
systemctl start fail2ban

# Set up log rotation
cat > /etc/logrotate.d/codecave << EOF
/opt/codecave/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

# Create basic nginx configuration
cat > /etc/nginx/sites-available/codecave << EOF
server {
    listen 80;
    server_name ${project_name}.tech api.${project_name}.tech;
    
    location / {
        proxy_pass http://localhost:8000;  # Kong gateway
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Enable nginx site
ln -sf /etc/nginx/sites-available/codecave /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Set up automatic security updates
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades
systemctl enable unattended-upgrades

# Create a basic monitoring script
cat > /opt/codecave/monitor.sh << 'EOF'
#!/bin/bash
# Basic monitoring script

LOG_FILE="/opt/codecave/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if Docker containers are running
if ! docker-compose -f /opt/codecave/docker-compose.yml ps | grep -q "Up"; then
    echo "$DATE - WARNING: Some containers are not running" >> $LOG_FILE
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$DATE - WARNING: Disk usage is at $DISK_USAGE%" >> $LOG_FILE
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100.0}')
if (( $(echo "$MEM_USAGE > 90" | bc -l) )); then
    echo "$DATE - WARNING: Memory usage is at $MEM_USAGE%" >> $LOG_FILE
fi
EOF

chmod +x /opt/codecave/monitor.sh

# Set up cron job for monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/codecave/monitor.sh") | crontab -

# Set up backup script
cat > /opt/codecave/backup.sh << 'EOF'
#!/bin/bash
# Database backup script

BACKUP_DIR="/opt/codecave/backups"
DATE=$(date '+%Y%m%d_%H%M%S')
LOG_FILE="/opt/codecave/logs/backup.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting backup" >> $LOG_FILE

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup application data volume
if [ -d "/mnt/volume_nyc3_01" ]; then
    tar -czf "$BACKUP_DIR/app_data_$DATE.tar.gz" -C /mnt/volume_nyc3_01 .
    echo "$(date '+%Y-%m-%d %H:%M:%S') - App data backup completed" >> $LOG_FILE
fi

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date '+%Y-%m-%d %H:%M:%S') - Backup completed" >> $LOG_FILE
EOF

chmod +x /opt/codecave/backup.sh

# Set up daily backup
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/codecave/backup.sh") | crontab -

# Create deployment helper script
cat > /root/codecave/quick-deploy.sh << 'EOF'
#!/bin/bash
cd /root/codecave
git pull origin main
chmod +x scripts/cleanup-production.sh
./scripts/cleanup-production.sh
doppler run --config=prd_all --project=codecave -- docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f
doppler run --config=prd_all --project=codecave -- docker-compose -f docker-compose.prod.yml up -d --build
EOF

chmod +x /root/codecave/quick-deploy.sh

log "CodeCave $ENVIRONMENT droplet initialization completed"
log "Next steps:"
log "1. SSH to server: ssh root@$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo 'IP_NOT_AVAILABLE')"
log "2. Configure Doppler: doppler configure set token <your-token>"
log "3. Configure Doppler project: cd /root/codecave && doppler configure set project codecave config prd_all"
log "4. Run deployment: ./quick-deploy.sh"

# Create completion marker for Terraform (always create this)
touch /tmp/user_data_complete
log "User data script completed successfully - marker file created" 