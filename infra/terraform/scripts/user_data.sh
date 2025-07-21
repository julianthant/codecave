#!/bin/bash

# User data script for CodeCave production droplet initialization with Doppler
# This script runs when the droplet is first created

# Exit on any error for critical operations
set -e

# Don't exit on errors for non-critical operations
set +e

PROJECT_NAME="${project_name}"
ENVIRONMENT="${environment}"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a /var/log/codecave-setup.log
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

log "Starting CodeCave $ENVIRONMENT setup with Doppler integration"

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
  ufw \
  bc \
  jq; then
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

# Install Doppler CLI with enhanced retries and verification
log "Installing Doppler CLI with enhanced setup..."
for attempt in {1..3}; do
    log "Doppler installation attempt $attempt..."
    
    # Clear any previous failed installation
    rm -f /tmp/doppler-install.sh
    
    # Download and install Doppler
    if curl -Ls --retry 3 --retry-delay 5 https://cli.doppler.com/install.sh -o /tmp/doppler-install.sh && \
       chmod +x /tmp/doppler-install.sh && \
       /tmp/doppler-install.sh; then
        
        # Verify installation
        if command -v doppler >/dev/null 2>&1; then
            log "Doppler CLI installed and verified successfully"
            
            # Create Doppler configuration directory
            mkdir -p /root/.doppler
            chmod 700 /root/.doppler
            
            # Add Doppler to PATH for all users
            echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
            echo 'export PATH="/usr/local/bin:$PATH"' >> /root/.bashrc
            
            # Set up Doppler config directory environment variable
            echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /etc/profile
            echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /root/.bashrc
            
            log "Doppler CLI configuration completed"
            break
        else
            log "Doppler installation verification failed"
        fi
    else
        log "Doppler installation failed, attempt $attempt/3"
        if [ $attempt -eq 3 ]; then
            log "Doppler installation failed after 3 attempts, continuing without it"
        else
            sleep 5
        fi
    fi
done

# Create application directory structure
log "Setting up application directories..."
mkdir -p /root/codecave  # Main application directory
mkdir -p /opt/codecave/data
mkdir -p /opt/codecave/logs  
mkdir -p /opt/codecave/backups
mkdir -p /opt/codecave/doppler # Doppler configuration and secrets
mkdir -p /mnt/volume_nyc3_01/app-logs
mkdir -p /mnt/volume_nyc3_01/meilisearch
mkdir -p /mnt/volume_nyc3_01/rabbitmq
mkdir -p /mnt/volume_nyc3_01/redis
mkdir -p /mnt/volume_nyc3_01/kong-ssl

# Set proper permissions for application directories
chown -R root:root /opt/codecave
chmod -R 755 /opt/codecave
chmod 700 /opt/codecave/doppler # Secure Doppler directory

log "Application directories created with proper permissions"

# Install Doppler CLI with enhanced retries and verification
echo "Installing Doppler CLI with enhanced setup..."
for attempt in {1..3}; do
    echo "Doppler installation attempt $attempt..."
    
    # Clear any previous failed installation
    rm -f /tmp/doppler-install.sh
    
    # Download and install Doppler
    if curl -Ls --retry 3 --retry-delay 5 https://cli.doppler.com/install.sh -o /tmp/doppler-install.sh && \
       chmod +x /tmp/doppler-install.sh && \
       /tmp/doppler-install.sh; then
        
        # Verify installation
        if command -v doppler >/dev/null 2>&1; then
            echo "Doppler CLI installed and verified successfully"
            
            # Create Doppler configuration directory
            mkdir -p /root/.doppler
            chmod 700 /root/.doppler
            
            # Add Doppler to PATH for all users
            echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
            echo 'export PATH="/usr/local/bin:$PATH"' >> /root/.bashrc
            
            # Set up Doppler config directory environment variable
            echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /etc/profile
            echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /root/.bashrc
            
            echo "Doppler CLI configuration completed"
            break
        else
            echo "Doppler installation verification failed"
        fi
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
fi

# Set up basic firewall with Doppler API access
log "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
# Allow Doppler API access (HTTPS outbound is typically allowed by default)
ufw allow out 443 comment 'Doppler API access'

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

# Create deployment helper script with Doppler integration
cat > /root/codecave/quick-deploy.sh << 'EOF'
#!/bin/bash

# CodeCave Production Deployment Script with Doppler
# This script handles deployment with environment variable injection from Doppler

set -e

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting CodeCave production deployment..."

# Change to codecave directory
cd /root/codecave

# Pull latest changes
log "Pulling latest changes from repository..."
git pull origin main

# Make cleanup script executable
chmod +x scripts/cleanup-production.sh 2>/dev/null || log "cleanup-production.sh not found, skipping"

# Check if Doppler is configured
if command -v doppler >/dev/null 2>&1; then
    log "Doppler CLI detected"
    
    # Check if we have a valid configuration
    if doppler configure get 2>/dev/null | grep -q "project\|config"; then
        log "Using Doppler for environment variable injection"
        
        # Stop services with Doppler
        log "Stopping existing services..."
        doppler run -- docker-compose -f docker-compose.prod.yml down --remove-orphans || log "Services were not running"
        
        # Clean up Docker resources
        log "Cleaning up Docker resources..."
        docker system prune -f
        
        # Start services with Doppler
        log "Starting services with Doppler environment injection..."
        doppler run -- docker-compose -f docker-compose.prod.yml up -d --build
        
        log "Deployment completed with Doppler integration"
    else
        log "Doppler not configured - falling back to standard deployment"
        log "To configure Doppler run: doppler setup"
        
        # Fallback deployment without Doppler
        docker-compose -f docker-compose.prod.yml down --remove-orphans || log "Services were not running"
        docker system prune -f
        docker-compose -f docker-compose.prod.yml up -d --build
        
        log "Deployment completed (without Doppler)"
    fi
else
    log "Doppler CLI not found - using standard deployment"
    
    # Standard deployment without Doppler
    docker-compose -f docker-compose.prod.yml down --remove-orphans || log "Services were not running"
    docker system prune -f
    docker-compose -f docker-compose.prod.yml up -d --build
    
    log "Deployment completed (standard mode)"
fi

# Wait for services to be healthy
log "Waiting for services to be ready..."
sleep 30

# Check service health
log "Checking service health..."
docker-compose -f docker-compose.prod.yml ps

log "Deployment script completed"
EOF

chmod +x /root/codecave/quick-deploy.sh

log "CodeCave $ENVIRONMENT droplet initialization completed"
log "============================================"
log "Next steps for production deployment:"
log "1. SSH to server: ssh root@$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo 'IP_NOT_AVAILABLE')"
log "2. Configure Doppler (REQUIRED):"
log "   a. Set up project and config: cd /root/codecave && doppler setup"
log "   b. Choose project: codecave"
log "   c. Choose config: prd_all (or your production config)"
log "3. Run deployment: cd /root/codecave && ./quick-deploy.sh"
log "============================================"
log "Optional: Test Doppler configuration:"
log "   doppler secrets --only-names  # List available secrets"
log "   doppler run -- env | grep DOPPLER  # Test environment injection"
log "============================================"
log "For debugging:"
log "   Check logs: tail -f /var/log/codecave-setup.log"
log "   Check Docker: docker ps"
log "   Check services: docker-compose -f docker-compose.prod.yml ps"
log "============================================"

# Create completion marker for Terraform (always create this)
touch /tmp/user_data_complete
log "User data script completed successfully - marker file created" 