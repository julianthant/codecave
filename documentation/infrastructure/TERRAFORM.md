# Terraform Infrastructure Implementation

## Overview

This document describes the complete Terraform infrastructure implementation for CodeCave, including DigitalOcean resources, networking, security, and deployment automation.

## Architecture

### Infrastructure Components

```
┌─────────────────────────────────────────────────────────────┐
│                    DigitalOcean Cloud                       │
├─────────────────────────────────────────────────────────────┤
│  VPC: codecave-production-vpc (10.10.0.0/16)              │
│                                                            │
│  ┌──────────────────┐  ┌─────────────────────────────────┐ │
│  │   Droplet        │  │     Managed Database           │ │
│  │   (App Server)   │  │     PostgreSQL 15              │ │
│  │   - Docker Host  │  │     - Connection Pool          │ │
│  │   - Kong Gateway │  │     - Firewall Rules           │ │
│  │   - API Backend  │  │     - Automated Backups        │ │
│  └──────────────────┘  └─────────────────────────────────┘ │
│                                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Storage & CDN                          │ │
│  │  - Spaces Bucket (codecave-production-files)          │ │
│  │  - CDN Distribution                                    │ │
│  │  - CORS Configuration                                  │ │
│  │  - Lifecycle Policies                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Core Infrastructure (`main.tf`)

**VPC Configuration:**

- **Name**: `codecave-production-vpc`
- **CIDR**: `10.10.0.0/16`
- **Region**: `sfo3` (San Francisco)
- **Purpose**: Isolated network for all resources

**SSH Key Management:**

- Ed25519 key for secure access
- Fingerprint: `c0:ea:3b:b1:7d:a7:40:a2:8a:1e:6a:c8:e9:01:85:6e`
- Used across all droplets

### 2. Compute Resources (`droplet.tf`)

**Application Server:**

- **Image**: `docker-20-04` (Ubuntu 20.04 with Docker pre-installed)
- **Size**: `s-1vcpu-2gb` (1 vCPU, 2GB RAM)
- **Features**:
  - IPv6 enabled
  - Monitoring enabled
  - Backups disabled (manual backup strategy)
  - Volume attachment for persistent data

**User Data Script:**

- Comprehensive initialization with retry logic
- Network connectivity validation
- Package installation with error handling
- Doppler CLI setup for secrets management
- Repository cloning and setup
- Service configuration (nginx, fail2ban, ufw)

### 3. Database Infrastructure (`database.tf`)

**PostgreSQL Cluster:**

- **Engine**: PostgreSQL 15
- **Size**: `db-s-1vcpu-1gb`
- **High Availability**: Single node (cost-optimized)
- **Maintenance Window**: Sunday 02:00 UTC

**Connection Pool:**

- **Name**: `codecave-pool`
- **Mode**: Transaction-level pooling
- **Size**: 20 connections
- **User**: `codecave_app_user`

**Security:**

- Database firewall restricting access to droplet only
- Dedicated application user with limited permissions
- VPC-only access (no public internet access)

### 4. Storage & CDN (`spaces.tf`, `cdn.tf`)

**DigitalOcean Spaces:**

- **Bucket**: `codecave-production-files`
- **Region**: `sfo3`
- **Versioning**: Enabled
- **Lifecycle Policies**:
  - Delete old versions after 30 days
  - Clean up incomplete uploads after 7 days

**CDN Configuration:**

- **Origin**: Spaces bucket
- **TTL**: 3600 seconds (1 hour)
- **Custom Domain**: `cdn.codecave.tech`

**CORS Policy:**

```yaml
allowed_origins:
  - https://codecave.tech
  - https://www.codecave.tech
  - https://*.vercel.app
  - http://localhost:3000
allowed_methods: [GET, POST, PUT, DELETE]
allowed_headers: ["*"]
max_age: 3000 seconds
```

### 5. Security & Networking (`firewall.tf`)

**Firewall Rules:**

_Inbound (Public):_

- SSH (22) - Global access
- HTTP (80) - Global access
- HTTPS (443) - Global access
- API (3001) - Global access
- Kong Admin (8001) - Global access

_Inbound (VPC Only):_

- PostgreSQL (5432) - Database access
- Redis (6379) - Cache access
- RabbitMQ (5672, 15672) - Message queue
- Meilisearch (7700) - Search engine

_Outbound:_

- All traffic allowed (required for updates, DNS, etc.)

### 6. Volume Management (`volumes.tf`)

**Persistent Storage:**

- **Name**: `codecave-production-data`
- **Size**: 50GB
- **Type**: `ext4`
- **Mount**: `/mnt/volume_nyc3_01`
- **Purpose**: Application data, logs, service data

## Deployment Automation

### Makefile Integration

The infrastructure uses a comprehensive Makefile with Doppler integration:

```bash
# Initialize Terraform
make init

# Plan changes
make plan

# Apply infrastructure
make apply

# Full deployment workflow
make deploy

# Check status
make status

# SSH to server
make ssh
```

### Environment Variables (Doppler)

Required secrets in Doppler `prd_all` config:

- `DO_API_TOKEN` - DigitalOcean API access
- `DO_SPACES_KEY` - Spaces access key
- `DO_SPACES_SECRET` - Spaces secret key

### Terraform Outputs

```hcl
# Connection Information
droplet_ip                = "134.199.238.129"
ssh_connection           = "ssh root@134.199.238.129"
direct_api_url          = "http://134.199.238.129:3001"

# Database (Sensitive)
database_connection_string      = <sensitive>
database_pool_connection_string = <sensitive>
database_host                   = <sensitive>

# Storage & CDN
cdn_endpoint                = "codecave-production-files.sfo3.cdn.digitaloceanspaces.com"
spaces_bucket_name         = "codecave-production-files"

# DNS Configuration Required
manual_dns_records = {
  api_record = {
    name  = "api"
    type  = "A"
    value = "134.199.238.129"
    ttl   = 300
  }
  cdn_record = {
    name  = "cdn"
    type  = "CNAME"
    value = "codecave-production-files.sfo3.cdn.digitaloceanspaces.com"
    ttl   = 300
  }
}
```

## Operational Procedures

### 1. Initial Deployment

```bash
# 1. Configure Doppler with required secrets
doppler configure set project codecave config prd_all

# 2. Deploy infrastructure
cd infra/terraform
make deploy

# 3. Configure DNS records (manual step)
# Add A record: api.codecave.tech -> 134.199.238.129
# Add CNAME: cdn.codecave.tech -> codecave-production-files.sfo3.cdn.digitaloceanspaces.com

# 4. SSH to server and configure Doppler
make ssh
doppler configure set project codecave config prd_all

# 5. Deploy application
cd /root/codecave && ./quick-deploy.sh
```

### 2. Updates & Maintenance

```bash
# Plan infrastructure changes
make plan

# Apply approved changes
make apply

# Check infrastructure status
make status

# Access server logs
make ssh
journalctl -u docker -f
```

### 3. Backup & Recovery

**Automated Backups:**

- Database: Managed by DigitalOcean (daily snapshots)
- Application Data: Automated script runs daily at 2 AM
- Retention: 7 days for application backups

**Manual Backup:**

```bash
make ssh
/opt/codecave/backup.sh
```

### 4. Monitoring

**Health Checks:**

- Application: `http://134.199.238.129:3001/health`
- Kong Gateway: `http://134.199.238.129:8001/status`
- Services: Automated monitoring script runs every 5 minutes

**Log Locations:**

- Application: `/opt/codecave/logs/`
- System: `/var/log/`
- Docker: `journalctl -u docker`

## Security Considerations

### 1. Network Security

- VPC isolation with private networking
- Database firewall (droplet access only)
- Minimal public ports exposed
- SSH key-based authentication only

### 2. Data Security

- Database encryption at rest (managed)
- Sensitive outputs marked as sensitive
- Environment variables managed via Doppler
- Regular security updates via unattended-upgrades

### 3. Access Control

- SSH key required for server access
- Database user with minimal permissions
- API gateway for request routing and rate limiting

## Cost Optimization

**Current Monthly Costs (Estimated):**

- Droplet (s-1vcpu-2gb): ~$12/month
- Database (db-s-1vcpu-1gb): ~$15/month
- Volume (50GB): ~$5/month
- Spaces + CDN: ~$5/month (based on usage)
- **Total**: ~$37/month

**Cost Optimization Features:**

- Single database node (not HA)
- Lifecycle policies for storage cleanup
- Efficient resource sizing
- Automated cleanup scripts

## Troubleshooting

### Common Issues

**1. Terraform Apply Timeout:**

- User data script taking too long
- Check network connectivity on droplet
- Review `/var/log/cloud-init.log` on server

**2. Database Connection Issues:**

- Verify firewall rules allow droplet access
- Check database cluster status in DO console
- Validate connection string format

**3. Storage/CDN Issues:**

- Verify CORS configuration
- Check Spaces access keys
- Test CDN propagation

### Debug Commands

```bash
# Check Terraform state
terraform state list
terraform state show digitalocean_droplet.app_server

# Server diagnostics
make ssh
systemctl status docker
docker ps -a
tail -f /opt/codecave/logs/monitor.log

# Network diagnostics
curl -I http://localhost:3001/health
netstat -tlnp | grep :3001
```

## Future Improvements

### 1. High Availability

- Multi-region deployment
- Database clustering
- Load balancer implementation

### 2. Monitoring & Alerting

- Prometheus + Grafana setup
- Automated alerting via webhooks
- Performance metrics collection

### 3. CI/CD Integration

- Automated deployments via GitHub Actions
- Blue-green deployment strategy
- Automated testing in staging environment

### 4. Security Enhancements

- Web Application Firewall (WAF)
- DDoS protection
- SSL/TLS certificate automation
- Vulnerability scanning

## Related Documentation

- [Docker Infrastructure Guide](./DOCKER.md)
- [Doppler Configuration Guide](./DOPPLER-CONFIGURATION.md)
- [Development Environment Setup](./development/LOCAL-DEVELOPMENT.md)
- [Authentication Implementation](./authentication/README.md)
