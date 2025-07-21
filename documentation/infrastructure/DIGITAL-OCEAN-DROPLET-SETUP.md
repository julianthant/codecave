# Digital Ocean Droplet Setup Guide for CodeCave

## Overview

This guide provides comprehensive instructions for setting up a Digital Ocean droplet for CodeCave production deployment with Doppler integration for secure environment variable management.

## Prerequisites

- Digital Ocean account with API access
- Terraform installed locally
- Access to CodeCave Doppler project
- SSH key configured with Digital Ocean

## Infrastructure Overview

### Droplet Configuration

- **Size**: s-2vcpu-4gb (scalable based on needs)
- **Image**: Ubuntu 22.04 LTS with Docker pre-installed
- **Region**: NYC3 (configurable)
- **Storage**: 50GB attached volume for persistent data
- **Networking**: VPC with proper security groups

### Services Architecture

```
┌─────────────────────────────────────────┐
│             Digital Ocean Droplet       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │    Kong     │  │   NestJS    │      │
│  │  (Gateway)  │  │    (API)    │      │
│  │   Port:80   │  │  Port:3001  │      │
│  │   Port:443  │  │             │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ Meilisearch │  │  RabbitMQ   │      │
│  │ Port:7700   │  │ Port:5672   │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │    Redis    │  │   Doppler   │      │
│  │ Port:6379   │  │ (Env Vars)  │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  External: Managed PostgreSQL DB       │
└─────────────────────────────────────────┘
```

## Setup Process

### 1. Infrastructure Deployment

#### Using Terraform

1. **Configure Terraform Variables**

   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars**

   ```hcl
   # Digital Ocean Configuration
   droplet_region = "nyc3"
   droplet_size = "s-2vcpu-4gb"
   project_name = "codecave"
   environment = "prod"

   # Enable monitoring and backups
   monitoring_enabled = true
   backup_enabled = true

   # SSH Key
   ssh_public_key_path = "~/.ssh/id_rsa.pub"
   ssh_private_key_path = "~/.ssh/id_rsa"
   ```

3. **Deploy Infrastructure**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

#### Manual Droplet Creation

If not using Terraform, create a droplet with:

- Ubuntu 22.04 LTS with Docker
- Minimum 2 vCPUs, 4GB RAM
- 50GB+ disk space
- VPC networking
- SSH key authentication

### 2. Initial Server Configuration

#### Connect to Droplet

```bash
# Get droplet IP from Terraform output or Digital Ocean console
ssh root@YOUR_DROPLET_IP
```

#### Verify Initial Setup

The user_data script should have automatically:

- Installed Docker and Docker Compose
- Installed Doppler CLI
- Cloned the CodeCave repository
- Set up basic security (firewall, fail2ban)
- Created application directories

#### Check Setup Status

```bash
# Check if user_data script completed
ls -la /tmp/user_data_complete

# Check setup logs
tail -f /var/log/codecave-setup.log

# Verify Docker installation
docker --version
docker-compose --version

# Verify Doppler installation
doppler --version
```

### 3. Doppler Configuration

#### Option A: Service Token (Recommended for Production)

1. **Create Service Token**
   - Go to https://dashboard.doppler.com
   - Navigate to: CodeCave project → prd_all config → Access
   - Create a new Service Token with read permissions
   - Copy the token (starts with `dp.st.prd.`)

2. **Configure on Server**

   ```bash
   cd /root/codecave
   ./scripts/setup-doppler.sh
   ```

3. **Set Service Token**
   ```bash
   export DOPPLER_TOKEN="dp.st.prd.your-token-here"
   echo 'export DOPPLER_TOKEN="dp.st.prd.your-token-here"' >> /root/.bashrc
   ```

#### Option B: Interactive Setup (Development)

```bash
cd /root/codecave
doppler setup
# Select project: codecave
# Select config: prd_all
```

#### Verify Doppler Configuration

```bash
# Test configuration
doppler configure get

# Test secret access
doppler secrets --only-names

# Test environment injection
doppler run -- env | grep DATABASE_URL
```

### 4. Environment Variables Setup

#### Required Environment Variables in Doppler

Ensure these secrets are configured in your Doppler `prd_all` config:

**Core Application**

```bash
NODE_ENV=production
FRONTEND_URL=https://codecave.tech
DATABASE_URL=postgresql://username:password@host:port/database
```

**Authentication (Better Auth)**

```bash
BETTER_AUTH_SECRET=your-32-character-secret
BETTER_AUTH_URL=https://codecave.tech
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Infrastructure Services**

```bash
MEILI_MASTER_KEY=your-meilisearch-key
RABBITMQ_USER=codecave_prod
RABBITMQ_PASS=secure-rabbitmq-password
REDIS_PASSWORD=secure-redis-password
```

**External Services**

```bash
DO_SPACES_KEY=your-do-spaces-key
DO_SPACES_SECRET=your-do-spaces-secret
DO_SPACES_BUCKET=codecave-production-storage
DO_SPACES_REGION=nyc3
SENTRY_DSN_API=your-sentry-dsn
STRIPE_SECRET_KEY=sk_live_your-stripe-key
```

### 5. Application Deployment

#### Initial Deployment

```bash
cd /root/codecave
./scripts/deploy-production.sh
```

#### Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check service health
./scripts/health-check.sh

# Test API endpoint
curl http://localhost:3001/health

# Check logs
docker-compose -f docker-compose.prod.yml logs api
```

### 6. SSL/HTTPS Setup

#### Using Let's Encrypt

```bash
# Install Certbot (should already be installed)
apt install certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d codecave.tech -d api.codecave.tech

# Verify auto-renewal
certbot renew --dry-run
```

#### Configure Nginx

```nginx
server {
    listen 80;
    server_name codecave.tech api.codecave.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name codecave.tech api.codecave.tech;

    ssl_certificate /etc/letsencrypt/live/codecave.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codecave.tech/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;  # Kong gateway
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring and Maintenance

### Health Monitoring

```bash
# Run comprehensive health check
./scripts/health-check.sh

# Check system resources
htop

# Check disk usage
df -h

# Check service logs
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Backup Strategy

```bash
# Manual backup
./scripts/backup.sh

# Automated backups are configured via cron
crontab -l
```

### Updates and Maintenance

```bash
# Update application
cd /root/codecave
git pull origin main
./scripts/deploy-production.sh

# Update system packages
apt update && apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
```

## Security Considerations

### Firewall Configuration

```bash
# Check firewall status
ufw status

# Ensure proper ports are open
ufw allow ssh
ufw allow http
ufw allow https
ufw allow out 443  # For Doppler API access
```

### Secret Management

- ✅ Use Doppler service tokens for production
- ✅ Never commit secrets to version control
- ✅ Rotate secrets regularly
- ✅ Use encrypted fallback for high availability
- ✅ Monitor secret access logs

### Access Control

- Use SSH keys only (disable password authentication)
- Configure fail2ban for brute force protection
- Regular security updates
- Monitor access logs

## Troubleshooting

### Common Issues

#### Doppler Connection Issues

```bash
# Check Doppler configuration
doppler configure get

# Test API connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.doppler.com/v3/me

# Check network connectivity
curl -I https://api.doppler.com
```

#### Service Startup Issues

```bash
# Check Docker service
systemctl status docker

# Check individual containers
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs SERVICE_NAME

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### Database Connection Issues

```bash
# Test database connection
doppler run -- psql $DATABASE_URL -c "SELECT 1;"

# Check database logs in managed service
# (via Digital Ocean console)
```

### Log Locations

- Setup logs: `/var/log/codecave-setup.log`
- Application logs: `/mnt/volume_nyc3_01/app-logs/`
- Docker logs: `docker-compose logs`
- System logs: `/var/log/syslog`

## Performance Optimization

### Resource Monitoring

```bash
# Monitor system resources
htop
iostat -x 1
netstat -tulpn
```

### Scaling Considerations

- Monitor CPU, memory, and disk usage
- Consider upgrading droplet size if needed
- Use load balancers for high traffic
- Implement database read replicas if necessary

## Backup and Recovery

### Automated Backups

- Daily volume snapshots via Digital Ocean
- Database backups via managed PostgreSQL
- Application data backups via cron jobs

### Recovery Procedures

1. **Complete Infrastructure Recovery**

   ```bash
   # Redeploy via Terraform
   terraform apply

   # Restore from backup
   # (specific steps depend on backup type)
   ```

2. **Application Recovery**
   ```bash
   # Restore from git
   cd /root/codecave
   git checkout main
   ./scripts/deploy-production.sh
   ```

## Support and Documentation

- Infrastructure documentation: `/documentation/infrastructure/`
- Deployment scripts: `/scripts/`
- Health monitoring: `./scripts/health-check.sh`
- Doppler documentation: https://docs.doppler.com

For issues, check logs and run health checks before escalating.
