# Infrastructure Documentation

This directory contains documentation related to the infrastructure and deployment of the CodeCave application.

## 📚 Contents

- [Docker Infrastructure](DOCKER-INFRASTRUCTURE.md) - Docker infrastructure guide
- [Terraform Guide](TERRAFORM-GUIDE.md) - Setting up infrastructure with Terraform
- [Docker](DOCKER.md) - Docker setup and usage
- [Doppler Configuration](DOPPLER-CONFIGURATION.md) - Setting up Doppler for environment variables
- [Third-Party Tools Setup](THIRD-PARTY-TOOLS-SETUP.md) - Setting up third-party tools

## 🏗️ Infrastructure Overview

CodeCave uses a modern infrastructure stack:

- **Docker**: For containerization and local development
- **Terraform**: For infrastructure as code
- **DigitalOcean**: For cloud hosting
- **Doppler**: For environment variable management
- **Kong API Gateway**: For API management

### Production Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  Client Browser  │────▶│  Vercel (Next.js)│────▶│  Kong API Gateway│
│                  │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  PostgreSQL DB   │◀───▶│  NestJS API      │◀───▶│  Redis Cache     │
│                  │     │                  │     │                  │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                         ┌────────┼─────────┐
                         │        │         │
                         ▼        ▼         ▼
                ┌──────────┐ ┌───────┐ ┌─────────────┐
                │          │ │       │ │             │
                │Meilisearch│ │RabbitMQ│ │DO Spaces   │
                │          │ │       │ │             │
                └──────────┘ └───────┘ └─────────────┘
```

## 🚀 Getting Started with Infrastructure

### Local Development

```bash
# Start infrastructure services
docker-compose up -d db redis search mq

# Verify services are running
docker-compose ps
```

### Deploying to Production

1. Set up Terraform:
   ```bash
   cd infra/terraform
   terraform init
   ```

2. Configure Doppler:
   ```bash
   doppler configure set project codecave config prd_all
   ```

3. Deploy infrastructure:
   ```bash
   doppler run -- make apply
   ```

4. Deploy applications:
   ```bash
   doppler run -- docker-compose -f docker-compose.prod.yml up -d
   ```

## 💰 Infrastructure Cost Estimates

- **Droplet** (s-2vcpu-4gb): ~$24/month
- **Database** (db-s-1vcpu-1gb): ~$15/month
- **Volume** (50GB): ~$5/month
- **Total**: ~$44/month

## 🔧 Maintenance Tasks

### Database Backups

```bash
# Create a backup
make db-backup

# Restore a backup
make db-restore BACKUP_FILE=backup-2025-07-30.sql
```

### SSL Certificate Renewal

SSL certificates are automatically renewed through Let's Encrypt.

### Monitoring

- Access Digital Ocean monitoring dashboard for metrics
- Logs are available through the Digital Ocean console

---

**Last Updated**: July 30, 2025 