# CodeCave Terraform Deployment Guide

## 🎯 **Overview**

This comprehensive guide covers deploying CodeCave's production infrastructure to Digital Ocean using Terraform. The infrastructure includes a load-balanced API architecture with managed services for scalability and reliability.

## 🏗️ **Infrastructure Architecture**

### **Production Architecture**

```
📱 Client Request
    ↓
🌐 Cloudflare (SSL/CDN)
    ↓
⚖️ DO Load Balancer (HTTPS → HTTP)
    ↓
🐳 Docker Application Server
│   ├── 🚀 NestJS API (port 3001)
│   ├── 🔍 Meilisearch (port 7700)
│   ├── 📨 RabbitMQ (port 5672)
│   └── 📊 New Relic Monitoring
    ↓
🗄️ Digital Ocean Managed Services
│   ├── PostgreSQL Cluster (with read replicas)
│   ├── Redis Cache
│   └── Spaces Object Storage
```

### **Core Infrastructure Components**

- **Application Server**: Ubuntu 20.04 Droplet with Docker
- **Load Balancer**: Digital Ocean Load Balancer with SSL termination
- **Database**: Managed PostgreSQL with read replicas
- **Cache**: Managed Redis cluster
- **Storage**: Digital Ocean Spaces for file uploads
- **CDN**: Cloudflare for global content delivery
- **Monitoring**: New Relic APM + Sentry error tracking

## 📁 **Infrastructure Code Structure**

```
infra/terraform/
├── versions.tf              # Terraform & provider versions
├── variables.tf             # Input variables & configuration
├── providers.tf             # DigitalOcean provider setup
├── vpc.tf                   # Virtual Private Cloud network
├── firewall.tf              # Security rules & access control
├── droplet.tf               # Application server & storage
├── database.tf              # Managed PostgreSQL cluster
├── cdn.tf                   # CDN and Spaces configuration
├── domain.tf                # DNS configuration
├── spaces.tf                # S3-compatible object storage
├── outputs.tf               # Infrastructure outputs (IPs, URLs, etc.)
├── terraform.tfvars.example # Example configuration
├── Makefile                 # Simplified management commands
├── deploy.sh                # Deployment script with Doppler
├── terraform.sh             # Terraform wrapper with secrets
└── scripts/
    └── user_data.sh         # Server initialization script
```

## 🚀 **Prerequisites**

### **Required Tools**

```bash
# macOS (using Homebrew)
brew install terraform doppler

# Ubuntu/Debian
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt update
sudo apt install terraform

# Install Doppler CLI
curl -Ls https://cli.doppler.com/install.sh | sh

# Verify installations
terraform version
doppler --version
```

### **Required Accounts & Credentials**

1. **Digital Ocean Account** with API access
2. **Doppler Account** configured for CodeCave project
3. **Domain Name** registered (optional for production setup)
4. **SSH Key Pair** for server access

## ⚙️ **Initial Setup**

### **Doppler Configuration**

```bash
# Configure Doppler for production
doppler configure set project codecave config prd_all

# Verify configuration
doppler configure get

# Test secret access
doppler secrets --only-names
```

### **Required Environment Variables in Doppler**

```bash
# Digital Ocean
DO_API_TOKEN=your_digital_ocean_api_token
DO_SPACES_KEY=your_spaces_access_key
DO_SPACES_SECRET=your_spaces_secret_key

# Infrastructure Configuration
DROPLET_REGION=nyc3
DROPLET_SIZE=s-2vcpu-4gb
DOMAIN_NAME=codecave.tech
SSH_PUBLIC_KEY_PATH=~/.ssh/id_rsa.pub

# Database Configuration
DB_SIZE=db-s-1vcpu-1gb
DB_NAME=codecave

# Application Configuration (will be used by deployed services)
DATABASE_URL=postgresql://username:password@host:port/database
BETTER_AUTH_SECRET=your_production_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
# ... other app environment variables
```

### **Terraform Variables**

```bash
# Copy and edit terraform variables
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
# Digital Ocean Configuration
region         = "nyc3"
droplet_size   = "s-2vcpu-4gb"
db_size        = "db-s-1vcpu-1gb"
domain         = "codecave.tech"

# Project Configuration
project_name   = "codecave"
environment    = "prod"

# Storage Configuration
volume_size    = 50  # GB
spaces_region  = "nyc3"

# Security Configuration
allowed_ssh_ips = ["YOUR_IP/32"]  # Replace with your IP

# Monitoring
monitoring_enabled = true
backup_enabled     = true
```

## 🛠️ **Terraform Configuration Files**

### **Provider Configuration** (`providers.tf`)

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}
```

### **VPC Network** (`vpc.tf`)

```hcl
resource "digitalocean_vpc" "codecave_vpc" {
  name     = "${var.project_name}-network-${var.environment}"
  region   = var.region
  ip_range = "10.0.0.0/16"

  description = "VPC for CodeCave ${var.environment} environment"
}
```

### **Application Server** (`droplet.tf`)

```hcl
# SSH Key for server access
resource "digitalocean_ssh_key" "terraform" {
  name       = "${var.project_name}-terraform-key"
  public_key = file(var.ssh_public_key_path)
}

# Main application server
resource "digitalocean_droplet" "app_server" {
  name      = "${var.project_name}-app-${var.environment}"
  size      = var.droplet_size
  image     = "ubuntu-22-04-x64"
  region    = var.region
  vpc_uuid  = digitalocean_vpc.codecave_vpc.id
  ssh_keys  = [digitalocean_ssh_key.terraform.id]
  user_data = file("${path.module}/scripts/user_data.sh")

  monitoring = var.monitoring_enabled
  backups    = var.backup_enabled

  tags = [
    "${var.project_name}-${var.environment}",
    "web-server",
    "docker"
  ]
}

# Persistent storage volume
resource "digitalocean_volume" "app_data" {
  name                    = "${var.project_name}-data-${var.environment}"
  region                  = var.region
  size                    = var.volume_size
  initial_filesystem_type = "ext4"
  description            = "Persistent storage for ${var.project_name} application data"

  tags = [
    "${var.project_name}-${var.environment}",
    "storage"
  ]
}

# Attach volume to server
resource "digitalocean_volume_attachment" "app_data" {
  droplet_id = digitalocean_droplet.app_server.id
  volume_id  = digitalocean_volume.app_data.id
}
```

### **Managed Database** (`database.tf`)

```hcl
# PostgreSQL managed database cluster
resource "digitalocean_database_cluster" "postgres" {
  name       = "${var.project_name}-db-${var.environment}"
  engine     = "pg"
  version    = "15"
  size       = var.db_size
  region     = var.region
  node_count = 1

  # Connect to VPC for security
  private_network_uuid = digitalocean_vpc.codecave_vpc.id

  tags = [
    "${var.project_name}-${var.environment}",
    "database"
  ]
}

# Create application database
resource "digitalocean_database_db" "codecave_db" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = var.db_name
}

# Database user for application
resource "digitalocean_database_user" "codecave_user" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "${var.project_name}_app"
}
```

### **Firewall Security** (`firewall.tf`)

```hcl
resource "digitalocean_firewall" "web" {
  name = "${var.project_name}-firewall-${var.environment}"

  # Allow HTTP traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow HTTPS traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow SSH from specific IPs only
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.allowed_ssh_ips
  }

  # Allow all outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Apply to application server
  droplet_ids = [digitalocean_droplet.app_server.id]

  tags = [
    "${var.project_name}-${var.environment}",
    "security"
  ]
}
```

### **Object Storage** (`spaces.tf`)

```hcl
# S3-compatible object storage for file uploads
resource "digitalocean_spaces_bucket" "app_storage" {
  name   = "${var.project_name}-storage-${var.environment}"
  region = var.spaces_region

  # Enable CORS for web uploads
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    allowed_origins = ["https://${var.domain}", "https://www.${var.domain}"]
    max_age_seconds = 3600
  }

  # Lifecycle management
  lifecycle_rule {
    id      = "delete_old_uploads"
    enabled = true

    expiration {
      days = 90
    }

    abort_incomplete_multipart_upload_days = 7
  }
}

# CDN for faster file delivery
resource "digitalocean_cdn" "app_cdn" {
  origin         = digitalocean_spaces_bucket.app_storage.bucket_domain_name
  custom_domain  = "cdn.${var.domain}"
  certificate_id = digitalocean_certificate.app_cert.id

  tags = [
    "${var.project_name}-${var.environment}",
    "cdn"
  ]
}
```

### **Domain & SSL** (`domain.tf`)

```hcl
# Main domain
resource "digitalocean_domain" "main" {
  name = var.domain

  count = var.domain != "" ? 1 : 0
}

# A record for main domain
resource "digitalocean_record" "root" {
  domain = digitalocean_domain.main[0].name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.app_server.ipv4_address
  ttl    = 300

  count = var.domain != "" ? 1 : 0
}

# A record for www subdomain
resource "digitalocean_record" "www" {
  domain = digitalocean_domain.main[0].name
  type   = "A"
  name   = "www"
  value  = digitalocean_droplet.app_server.ipv4_address
  ttl    = 300

  count = var.domain != "" ? 1 : 0
}

# A record for API subdomain
resource "digitalocean_record" "api" {
  domain = digitalocean_domain.main[0].name
  type   = "A"
  name   = "api"
  value  = digitalocean_droplet.app_server.ipv4_address
  ttl    = 300

  count = var.domain != "" ? 1 : 0
}

# SSL certificate
resource "digitalocean_certificate" "app_cert" {
  name    = "${var.project_name}-cert-${var.environment}"
  type    = "lets_encrypt"
  domains = [var.domain, "www.${var.domain}", "api.${var.domain}"]

  count = var.domain != "" ? 1 : 0

  lifecycle {
    create_before_destroy = true
  }
}
```

### **Outputs** (`outputs.tf`)

```hcl
# Server information
output "droplet_ip" {
  description = "Public IP address of the application server"
  value       = digitalocean_droplet.app_server.ipv4_address
}

output "droplet_private_ip" {
  description = "Private IP address of the application server"
  value       = digitalocean_droplet.app_server.ipv4_address_private
}

# Database connection information
output "database_connection" {
  description = "Database connection details"
  value = {
    host     = digitalocean_database_cluster.postgres.host
    port     = digitalocean_database_cluster.postgres.port
    database = digitalocean_database_db.codecave_db.name
    username = digitalocean_database_user.codecave_user.name
  }
  sensitive = true
}

output "database_url" {
  description = "Complete database URL"
  value       = "postgresql://${digitalocean_database_user.codecave_user.name}:${digitalocean_database_user.codecave_user.password}@${digitalocean_database_cluster.postgres.private_host}:${digitalocean_database_cluster.postgres.port}/${digitalocean_database_db.codecave_db.name}?sslmode=require"
  sensitive   = true
}

# Storage information
output "spaces_bucket" {
  description = "Spaces bucket information"
  value = {
    name     = digitalocean_spaces_bucket.app_storage.name
    endpoint = digitalocean_spaces_bucket.app_storage.bucket_domain_name
    region   = digitalocean_spaces_bucket.app_storage.region
  }
}

# Domain information
output "domain_info" {
  description = "Domain configuration"
  value = var.domain != "" ? {
    domain    = var.domain
    www       = "www.${var.domain}"
    api       = "api.${var.domain}"
    cdn       = "cdn.${var.domain}"
  } : null
}

# SSH connection command
output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh root@${digitalocean_droplet.app_server.ipv4_address}"
}
```

## 🛠️ **Server Initialization Script**

### **User Data Script** (`scripts/user_data.sh`)

```bash
#!/bin/bash

# CodeCave Server Initialization Script
# ====================================

set -e

# Logging
LOG_FILE="/var/log/codecave-setup.log"
exec > >(tee -a ${LOG_FILE})
exec 2>&1

echo "Starting CodeCave server initialization at $(date)"

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install essential tools
echo "Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    fail2ban \
    ufw \
    htop \
    nano \
    jq

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose (standalone)
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Doppler CLI
echo "Installing Doppler CLI..."
curl -Ls https://cli.doppler.com/install.sh | sh

# Add Doppler to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /etc/profile

# Configure firewall
echo "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow out 443  # For Doppler API access
ufw --force enable

# Configure fail2ban for SSH protection
echo "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Configure automatic security updates
echo "Setting up automatic security updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Mount persistent volume
echo "Mounting persistent volume..."
VOLUME_DEVICE="/dev/disk/by-id/scsi-0DO_Volume_codecave-data-prod"
MOUNT_POINT="/mnt/volume_nyc3_01"

mkdir -p ${MOUNT_POINT}

# Format volume if not already formatted
if ! blkid ${VOLUME_DEVICE}; then
    echo "Formatting volume..."
    mkfs.ext4 -F ${VOLUME_DEVICE}
fi

# Mount volume
echo "Mounting volume..."
mount -o discard,defaults,noatime ${VOLUME_DEVICE} ${MOUNT_POINT}

# Add to fstab for persistence
echo "${VOLUME_DEVICE} ${MOUNT_POINT} ext4 defaults,nofail,discard 0 0" >> /etc/fstab

# Create application directories
echo "Creating application directories..."
mkdir -p ${MOUNT_POINT}/{meilisearch,rabbitmq,redis,app-logs,ssl-certs}
chown -R root:root ${MOUNT_POINT}
chmod -R 755 ${MOUNT_POINT}

# Install Node.js and pnpm (for local development if needed)
echo "Installing Node.js and pnpm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pnpm

# Clone CodeCave repository
echo "Cloning CodeCave repository..."
cd /root
git clone https://github.com/your-username/codecave.git
cd codecave

# Set up log rotation
echo "Setting up log rotation..."
cat > /etc/logrotate.d/codecave << EOF
${MOUNT_POINT}/app-logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

# Install SSL certificate tools (Let's Encrypt)
echo "Installing Certbot for SSL certificates..."
apt-get install -y certbot python3-certbot-nginx

# Configure Docker to start on boot
echo "Enabling Docker service..."
systemctl enable docker
systemctl start docker

# Add completion marker
echo "Server initialization completed successfully at $(date)"
touch /tmp/user_data_complete

# Reboot to ensure all changes take effect
echo "Rebooting server to finalize setup..."
reboot
```

## 🚀 **Deployment Workflow**

### **Using the Makefile**

```bash
# Navigate to terraform directory
cd infra/terraform

# Show available commands
make help

# Initialize Terraform
make init

# Plan infrastructure changes
make plan

# Apply infrastructure changes
make apply

# Show outputs (IPs, URLs, etc.)
make outputs

# SSH into the server
make ssh

# Destroy all infrastructure (be careful!)
make destroy
```

### **Makefile** (`infra/terraform/Makefile`)

```makefile
.PHONY: help init plan apply outputs ssh destroy clean

# Default target
help:
	@echo "Available targets:"
	@echo "  init     - Initialize Terraform"
	@echo "  plan     - Plan infrastructure changes"
	@echo "  apply    - Apply infrastructure changes"
	@echo "  outputs  - Show Terraform outputs"
	@echo "  ssh      - SSH into the application server"
	@echo "  destroy  - Destroy all infrastructure"
	@echo "  clean    - Clean Terraform cache"

# Initialize Terraform
init:
	terraform init

# Plan changes
plan:
	doppler run --config=prd_all --project=codecave -- terraform plan

# Apply changes
apply:
	doppler run --config=prd_all --project=codecave -- terraform apply

# Show outputs
outputs:
	terraform output

# SSH into server
ssh:
	ssh root@$$(terraform output -raw droplet_ip)

# Destroy infrastructure
destroy:
	doppler run --config=prd_all --project=codecave -- terraform destroy

# Clean Terraform cache
clean:
	rm -rf .terraform/
	rm -f .terraform.lock.hcl
	rm -f terraform.tfstate.backup
```

### **Deployment Script** (`infra/terraform/deploy.sh`)

```bash
#!/bin/bash

# CodeCave Infrastructure Deployment Script
# =========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
log "Checking prerequisites..."

# Check if Doppler is installed
if ! command -v doppler &> /dev/null; then
    error "Doppler CLI is not installed. Please install it first."
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    error "Terraform is not installed. Please install it first."
fi

# Check Doppler configuration
log "Verifying Doppler configuration..."
if ! doppler configure get --project codecave --config prd_all &> /dev/null; then
    error "Doppler is not configured for codecave project. Run: doppler configure set project codecave config prd_all"
fi

# Check required environment variables in Doppler
required_vars=("DO_API_TOKEN" "DO_SPACES_KEY" "DO_SPACES_SECRET")
for var in "${required_vars[@]}"; do
    if ! doppler secrets get "$var" --project codecave --config prd_all --plain &> /dev/null; then
        error "Required environment variable $var not found in Doppler"
    fi
done

log "Prerequisites check passed!"

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    log "Initializing Terraform..."
    terraform init
fi

# Validate Terraform configuration
log "Validating Terraform configuration..."
terraform validate

# Plan infrastructure changes
log "Planning infrastructure changes..."
doppler run --config=prd_all --project=codecave -- terraform plan -out=tfplan

# Ask for confirmation
echo
read -p "Do you want to apply these changes? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Deployment cancelled."
    rm -f tfplan
    exit 0
fi

# Apply infrastructure changes
log "Applying infrastructure changes..."
doppler run --config=prd_all --project=codecave -- terraform apply tfplan

# Clean up plan file
rm -f tfplan

# Get server IP
SERVER_IP=$(terraform output -raw droplet_ip)
log "Server deployed at IP: $SERVER_IP"

# Wait for server to be ready
log "Waiting for server to be ready..."
sleep 30

# Test SSH connection
log "Testing SSH connection..."
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$SERVER_IP "echo 'SSH connection successful'"; then
    log "SSH connection successful!"
else
    warn "SSH connection failed. The server might still be initializing."
fi

# Show connection information
log "Deployment completed successfully!"
echo
echo "Connection Information:"
echo "======================"
echo "Server IP: $SERVER_IP"
echo "SSH Command: ssh root@$SERVER_IP"
echo
echo "Next Steps:"
echo "==========="
echo "1. SSH into the server and verify setup"
echo "2. Clone and deploy the CodeCave application"
echo "3. Configure SSL certificates"
echo "4. Set up monitoring and backups"
echo
```

## 🔐 **Security Configuration**

### **SSH Key Management**

```bash
# Generate SSH key pair if you don't have one
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add SSH key to Digital Ocean (done via Terraform)
# The public key path should be specified in terraform.tfvars
```

### **Firewall Rules**

```hcl
# Only allow SSH from specific IPs
allowed_ssh_ips = [
  "YOUR_IP/32",           # Your home/office IP
  "TEAM_MEMBER_IP/32",    # Team member IP
  "CI_CD_IP/32"           # CI/CD server IP
]
```

### **SSL/TLS Configuration**

```bash
# After deployment, configure SSL certificates
ssh root@YOUR_SERVER_IP

# Install Certbot certificates
certbot --nginx -d codecave.tech -d www.codecave.tech -d api.codecave.tech

# Verify auto-renewal
certbot renew --dry-run
```

## 📊 **Cost Management**

### **Estimated Monthly Costs (USD)**

| Component                           | Size            | Estimated Cost |
| ----------------------------------- | --------------- | -------------- |
| Droplet (s-2vcpu-4gb)               | 2 vCPU, 4GB RAM | $24            |
| Managed PostgreSQL (db-s-1vcpu-1gb) | 1 vCPU, 1GB RAM | $15            |
| Volume (50GB)                       | 50GB SSD        | $5             |
| Spaces (50GB)                       | 50GB storage    | $5             |
| **Total**                           |                 | **~$49/month** |

### **Cost Optimization Tips**

1. **Start Small**: Begin with smaller instances and scale up
2. **Monitor Usage**: Use Digital Ocean monitoring dashboard
3. **Cleanup Unused Resources**: Regular cleanup of old snapshots/volumes
4. **Reserved Instances**: Consider reserved instances for long-term savings

## 🔍 **Monitoring & Management**

### **Server Access**

```bash
# SSH into the server
ssh root@$(terraform output -raw droplet_ip)

# Or use the Makefile
make ssh
```

### **Application Management**

```bash
# After SSH into server
cd /root/codecave

# Check server initialization status
cat /var/log/codecave-setup.log

# Deploy application with Doppler
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d

# Check application status
docker-compose -f docker-compose.prod.yml ps

# View application logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Database Management**

```bash
# Get database connection information
terraform output database_connection

# Connect to database (from server)
psql "$(terraform output -raw database_url)"

# Create database backup
pg_dump "$(terraform output -raw database_url)" > backup.sql
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Terraform Issues**

```bash
# Authentication Failed
export DIGITALOCEAN_ACCESS_TOKEN="$(doppler secrets get DO_API_TOKEN --config=prd_all --project=codecave --plain)"

# State Lock Issues
terraform force-unlock LOCK_ID

# Resource Already Exists
terraform import digitalocean_droplet.app_server 12345678
```

#### **Server Issues**

```bash
# Check server status
ssh root@$SERVER_IP "systemctl status docker"

# Check initialization logs
ssh root@$SERVER_IP "tail -f /var/log/codecave-setup.log"

# Check disk space
ssh root@$SERVER_IP "df -h"

# Check mounted volumes
ssh root@$SERVER_IP "lsblk"
```

#### **Network Issues**

```bash
# Test connectivity
ping $SERVER_IP

# Check firewall rules
ssh root@$SERVER_IP "ufw status verbose"

# Check DNS resolution
nslookup codecave.tech
```

### **Recovery Procedures**

#### **Server Recovery**

```bash
# Rebuild server from snapshot
terraform taint digitalocean_droplet.app_server
terraform apply

# Or manual server rebuild via Digital Ocean console
```

#### **Database Recovery**

```bash
# Restore from Digital Ocean backup
# Use Digital Ocean console or API

# Restore from manual backup
psql "$(terraform output -raw database_url)" < backup.sql
```

## 🔄 **Updates & Maintenance**

### **Infrastructure Updates**

```bash
# Update Terraform providers
terraform init -upgrade

# Plan updates
doppler run --config=prd_all --project=codecave -- terraform plan

# Apply updates
doppler run --config=prd_all --project=codecave -- terraform apply
```

### **Server Maintenance**

```bash
# Update server packages
ssh root@$SERVER_IP "apt update && apt upgrade -y"

# Update Docker images
ssh root@$SERVER_IP "cd /root/codecave && docker-compose -f docker-compose.prod.yml pull"

# Restart services
ssh root@$SERVER_IP "cd /root/codecave && docker-compose -f docker-compose.prod.yml up -d"
```

### **SSL Certificate Renewal**

```bash
# Certificates auto-renew via cron, but you can test:
ssh root@$SERVER_IP "certbot renew --dry-run"
```

## 📚 **Additional Resources**

- [Terraform Digital Ocean Provider](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs)
- [Digital Ocean Documentation](https://docs.digitalocean.com/)
- [Doppler Documentation](https://docs.doppler.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

**💡 Pro Tip**: Always run `terraform plan` before `terraform apply` to review changes, and use Doppler for secure environment variable management in all environments.

**Last Updated**: January 2025
