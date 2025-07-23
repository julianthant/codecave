# CodeCave.tech Terraform Infrastructure

This directory contains the Terraform configuration for deploying CodeCave.tech production infrastructure on DigitalOcean.

## 🏗️ **Infrastructure Overview**

The Terraform configuration creates:

### **Core Infrastructure**

- **VPC Network** - Private network for secure communication
- **Droplet** - Ubuntu 20.04 application server with Docker
- **Volume** - 50GB persistent storage for application data
- **Firewall** - Security rules for web traffic and services
- **SSH Key** - Secure access to the server

### **Managed Services**

- **PostgreSQL Cluster** - Managed database with automated backups
- **Database** - Application database with dedicated user
- **Database Firewall** - Restricts access to VPC only

### **Security Features**

- Private networking for internal services
- Firewall rules with least-privilege access
- Automated security updates
- SSL/TLS termination with Let's Encrypt
- Rate limiting and DDoS protection

## 🚀 **Quick Start**

### **Prerequisites**

1. **DigitalOcean Account** with API token
2. **Terraform** installed (>= 1.0)
3. **SSH Key Pair** for server access
4. **Doppler CLI** for environment variables

### **Setup Steps**

1. **Configure Variables**

   ```bash
   # Copy example variables
   cp terraform.tfvars.example terraform.tfvars

   # Edit with your values
   vim terraform.tfvars
   ```

2. **Initialize Terraform**

   ```bash
   cd infra/terraform
   terraform init
   ```

3. **Plan Deployment**

   ```bash
   # Use Doppler for do_token
   doppler run -- terraform plan

   # Or export manually
   export do_token="your_token_here"
   terraform plan
   ```

4. **Deploy Infrastructure**
   ```bash
   doppler run -- terraform apply
   ```

## 📝 **Configuration Files**

### **Core Files**

- `versions.tf` - Terraform and provider versions
- `variables.tf` - Input variable definitions
- `providers.tf` - DigitalOcean provider configuration
- `outputs.tf` - Output values (IPs, connection strings, etc.)

### **Infrastructure Files**

- `vpc.tf` - Virtual Private Cloud network
- `firewall.tf` - Security rules and access control
- `droplet.tf` - Application server and storage
- `database.tf` - Managed PostgreSQL cluster

### **Supporting Files**

- `scripts/user_data.sh` - Server initialization script
- `terraform.tfvars.example` - Example configuration
- `README.md` - This documentation

## 🔧 **Configuration Options**

### **Droplet Sizes**

| Size          | vCPUs | RAM | Storage | Monthly Cost |
| ------------- | ----- | --- | ------- | ------------ |
| `s-1vcpu-2gb` | 1     | 2GB | 50GB    | ~$12         |
| `s-2vcpu-4gb` | 2     | 4GB | 80GB    | ~$24         |
| `s-4vcpu-8gb` | 4     | 8GB | 160GB   | ~$48         |

### **Database Sizes**

| Size             | vCPUs | RAM | Storage | Monthly Cost |
| ---------------- | ----- | --- | ------- | ------------ |
| `db-s-1vcpu-1gb` | 1     | 1GB | 10GB    | ~$15         |
| `db-s-2vcpu-2gb` | 2     | 2GB | 38GB    | ~$30         |
| `db-s-4vcpu-4gb` | 4     | 4GB | 76GB    | ~$60         |

### **Regions**

- `nyc1`, `nyc3` - New York
- `sfo2`, `sfo3` - San Francisco
- `tor1` - Toronto
- `lon1` - London
- `fra1` - Frankfurt
- `sgp1` - Singapore

## 🔐 **Security Configuration**

### **Firewall Rules**

- **SSH (22)** - World accessible for management
- **HTTP (80)** - World accessible, redirects to HTTPS
- **HTTPS (443)** - World accessible for web traffic
- **API (3001)** - World accessible for direct API access
- **API (3001)** - Load balancer accessible for API
- **Database (5432)** - VPC only
- **Redis (6379)** - VPC only
- **RabbitMQ (5672, 15672)** - VPC only
- **Meilisearch (7700)** - VPC only

### **Best Practices**

- All internal services accessible only via VPC
- Automated security updates enabled
- Fail2ban configured for SSH protection
- SSL certificates via Let's Encrypt
- Regular backups enabled

## 📊 **Outputs**

After deployment, Terraform provides:

### **Connection Information**

- `droplet_ip` - Public IP address
- `ssh_connection` - SSH command
- `api_url` - Application URL

### **Database Information**

- `database_host` - Database host (sensitive)
- `database_connection_string` - Full connection string (sensitive)
- `database_name` - Database name

### **Infrastructure Details**

- `vpc_id` - VPC identifier
- `data_volume_id` - Storage volume ID

## 🔄 **Management Commands**

### **Check Infrastructure**

```bash
# View current state
terraform show

# List resources
terraform state list

# Check outputs
terraform output
```

### **Updates**

```bash
# Plan changes
terraform plan

# Apply changes
terraform apply

# Force refresh
terraform refresh
```

### **Cleanup**

```bash
# Destroy infrastructure (be careful!)
terraform destroy
```

## 🚀 **Post-Deployment Steps**

1. **Configure DNS**

   ```bash
   # Point your domain to the droplet IP
   # A record: codecave.tech -> droplet_ip
   # A record: api.codecave.tech -> droplet_ip
   ```

2. **Set Up SSL**

   ```bash
   # SSH to server
   ssh root@<droplet_ip>

   # Generate certificates
   certbot --nginx -d codecave.tech -d api.codecave.tech
   ```

3. **Configure Environment**

   ```bash
   # Create .env file on server
   scp .env root@<droplet_ip>:/opt/codecave/
   ```

4. **Start Application**
   ```bash
   # SSH to server and start services
   systemctl start codecave
   docker-compose -f /opt/codecave/docker-compose.yml logs -f
   ```

## 🔍 **Monitoring**

### **Health Checks**

- Application: `https://api.codecave.tech/health`
- API Direct: `http://<droplet_ip>:3001`
- RabbitMQ: `http://<droplet_ip>:15672`

### **Logs**

```bash
# Application logs
docker-compose -f /opt/codecave/docker-compose.yml logs -f

# System logs
journalctl -u codecave -f

# Nginx logs
tail -f /var/log/nginx/access.log
```

### **Monitoring Scripts**

- `/opt/codecave/monitor.sh` - System monitoring
- `/opt/codecave/backup.sh` - Database backups

## 🆘 **Troubleshooting**

### **Common Issues**

**SSH Connection Refused**

```bash
# Check firewall
ufw status

# Check SSH service
systemctl status ssh
```

**Database Connection Issues**

```bash
# Check database cluster status in DO dashboard
# Verify firewall rules allow droplet access
# Check connection string in outputs
```

**SSL Certificate Issues**

```bash
# Check nginx configuration
nginx -t

# Renew certificates
certbot renew --dry-run
```

**Application Not Starting**

```bash
# Check Docker containers
docker ps -a

# Check logs
docker-compose logs api

# Check environment variables
cat /opt/codecave/.env
```

## 💰 **Cost Estimation**

Monthly costs for default configuration:

- Droplet (s-2vcpu-4gb): ~$24
- Database (db-s-1vcpu-1gb): ~$15
- Volume (50GB): ~$5
- **Total: ~$44/month**

## 🔄 **Backup & Recovery**

### **Automated Backups**

- Database: Managed service handles backups
- Volume: Daily snapshots via cron job
- Configuration: Version controlled in Git

### **Recovery Procedures**

1. Re-run Terraform to recreate infrastructure
2. Restore data from volume snapshots
3. Restore database from managed service backups
4. Redeploy application code

---

For questions or issues, refer to the main project documentation or create an issue in the repository.
