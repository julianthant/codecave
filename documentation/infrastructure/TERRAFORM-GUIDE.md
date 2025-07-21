# Terraform Infrastructure Guide

This guide explains how to set up and manage the CodeCave infrastructure on Digital Ocean using Terraform.

## 🏗️ **Infrastructure Architecture**

The infrastructure is designed as a production-ready environment with the following components:

- **VPC Network** - Secure private networking for internal services
- **Droplet** - Ubuntu 20.04 server with Docker (2 vCPUs, 4GB RAM)
- **Managed PostgreSQL** - Production database cluster
- **Volume Storage** - 50GB persistent storage for application data
- **Firewall** - Security rules with least-privilege access
- **DNS & CDN** - Domain configuration and content delivery network
- **SSL Certificates** - Automated HTTPS with Let's Encrypt
- **Monitoring** - Built-in health checks & logging
- **Backups** - Automated daily backups

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
├── .terraform-version       # Version pinning
├── README.md                # Complete documentation
└── scripts/
    └── user_data.sh         # Server initialization script
```

## 🚀 **Getting Started**

### Prerequisites

1. **Digital Ocean Account** with API token
2. **Doppler** configured for secure environment variables
3. **Terraform** installed (version 1.0+)
4. **Domain Name** registered (optional for production setup)

### Installation

```bash
# macOS (using Homebrew)
brew install terraform

# Ubuntu/Debian
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt update
sudo apt install terraform

# Verify installation
terraform version
```

### Configuration

1. **Set up variables**:
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit your variables**:
   ```
   # terraform.tfvars
   do_token       = "your_digital_ocean_api_token"  # From Doppler
   region         = "nyc1"                          # Digital Ocean region
   droplet_size   = "s-2vcpu-4gb"                   # Server size
   domain         = "codecave.tech"                 # Your domain name
   ssh_public_key = "~/.ssh/id_rsa.pub"             # Path to SSH public key
   ```

3. **Initialize Terraform**:
   ```bash
   terraform init
   ```

## 🛠️ **Using the Makefile**

The project includes a Makefile for simplified operations:

```bash
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

## 🚀 **Deployment Workflow**

### First-Time Deployment

```bash
# Configure Doppler for secure access to variables
doppler configure set project codecave config prd_all

# Deploy with Doppler-provided variables
doppler run -- make deploy
```

### Making Changes

1. **Edit Terraform files** as needed
2. **Run plan** to preview changes:
   ```bash
   make plan
   ```
3. **Apply changes** if they look correct:
   ```bash
   make apply
   ```

## 🔧 **Infrastructure Components**

### VPC Network

```hcl
# vpc.tf
resource "digitalocean_vpc" "codecave_vpc" {
  name     = "codecave-network-${var.environment}"
  region   = var.region
  ip_range = "10.0.0.0/16"
}
```

### Application Server

```hcl
# droplet.tf
resource "digitalocean_droplet" "app_server" {
  name      = "codecave-app-${var.environment}"
  size      = var.droplet_size
  image     = "ubuntu-20-04-x64"
  region    = var.region
  vpc_uuid  = digitalocean_vpc.codecave_vpc.id
  ssh_keys  = [digitalocean_ssh_key.terraform.id]
  user_data = file("${path.module}/scripts/user_data.sh")
  
  # Additional configuration
}

# Volume for persistent storage
resource "digitalocean_volume" "app_data" {
  name                    = "codecave-data-${var.environment}"
  region                  = var.region
  size                    = 50  # GB
  initial_filesystem_type = "ext4"
}

# Attach volume to server
resource "digitalocean_volume_attachment" "app_data" {
  droplet_id = digitalocean_droplet.app_server.id
  volume_id  = digitalocean_volume.app_data.id
}
```

### Database

```hcl
# database.tf
resource "digitalocean_database_cluster" "postgres" {
  name       = "codecave-db-${var.environment}"
  engine     = "pg"
  version    = "15"
  size       = var.db_size
  region     = var.region
  node_count = 1
  
  # Connect to VPC
  private_network_uuid = digitalocean_vpc.codecave_vpc.id
}

# Create database
resource "digitalocean_database_db" "codecave_db" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "codecave"
}
```

### Firewall

```hcl
# firewall.tf
resource "digitalocean_firewall" "web" {
  name = "codecave-firewall-${var.environment}"
  
  # Allow web traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
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
  
  # Apply to our droplets
  droplet_ids = [digitalocean_droplet.app_server.id]
}
```

### DNS and Domain

```hcl
# domain.tf
resource "digitalocean_domain" "codecave" {
  name = var.domain
}

# Create A record
resource "digitalocean_record" "www" {
  domain = digitalocean_domain.codecave.name
  type   = "A"
  name   = "www"
  value  = digitalocean_droplet.app_server.ipv4_address
}

# Create root record
resource "digitalocean_record" "root" {
  domain = digitalocean_domain.codecave.name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.app_server.ipv4_address
}
```

## 🔐 **Security Considerations**

### SSH Key Management

```hcl
# Import SSH key to Digital Ocean
resource "digitalocean_ssh_key" "terraform" {
  name       = "Terraform Deployment Key"
  public_key = file(var.ssh_public_key)
}
```

### Secure the Server

The `user_data.sh` script configures the server with security best practices:

```bash
#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install essential tools
apt-get install -y fail2ban ufw docker.io docker-compose

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Set up fail2ban for SSH protection
systemctl enable fail2ban
systemctl start fail2ban

# Configure automatic security updates
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Mount volume
mkdir -p /mnt/app_data
mount -o discard,defaults,noatime /dev/disk/by-id/scsi-0DO_Volume_codecave-data /mnt/app_data
echo '/dev/disk/by-id/scsi-0DO_Volume_codecave-data /mnt/app_data ext4 defaults,nofail,discard 0 0' >> /etc/fstab
```

## 💻 **Accessing Your Infrastructure**

### SSH Access

```bash
# Using the Makefile
make ssh

# Manual SSH
ssh root@$(terraform output -raw droplet_ip)
```

### Database Access

The database is accessible only through the private network. You can connect via the application server:

```bash
# SSH to the server first
make ssh

# Then connect to the database
psql postgresql://doadmin:${DB_PASSWORD}@${DB_HOST}:25060/codecave?sslmode=require
```

## 📈 **Monitoring and Management**

### Infrastructure Monitoring

Digital Ocean provides built-in monitoring for all resources. Additional monitoring can be set up using:

1. **Prometheus** for metrics collection
2. **Grafana** for visualization
3. **Alertmanager** for notifications

### Logs Management

Configure centralized logging with:

1. **Filebeat** to collect logs
2. **Elasticsearch** for storage and search
3. **Kibana** for visualization

## 💰 **Cost Management**

### Estimated Costs

- **Droplet** (s-2vcpu-4gb): ~$24/month
- **Database** (db-s-1vcpu-1gb): ~$15/month
- **Volume** (50GB): ~$5/month
- **Total**: ~$44/month

### Cost Optimization Tips

1. **Start small** and scale as needed
2. **Use reserved instances** for long-term savings
3. **Monitor resource usage** and adjust accordingly
4. **Set up billing alerts** to prevent surprises

## 🚨 **Troubleshooting**

### Common Issues

1. **Authentication Failed**
   - Verify DO_TOKEN in environment variables
   - Check API token permissions on Digital Ocean

2. **Resource Creation Failed**
   - Check region availability
   - Verify resource limits on your account

3. **SSH Connection Issues**
   - Verify firewall rules
   - Check SSH key configuration

### Useful Commands

```bash
# Check Terraform state
terraform state list

# Inspect a specific resource
terraform state show digitalocean_droplet.app_server

# Refresh state
terraform refresh

# Import existing resources
terraform import digitalocean_droplet.app_server 12345678
```

## 🚀 **Next Steps**

After deploying the infrastructure:

1. **Configure CI/CD** for automated deployments
2. **Set up monitoring** and alerting
3. **Configure backups** for critical data
4. **Document operations procedures** for your team

---

**Last Updated**: July 30, 2025 