# Infrastructure Documentation

## 🎯 **Current Infrastructure Overview**

CodeCave's production infrastructure is deployed on Digital Ocean with a focus on scalability, reliability, and maintainability.

### **Production Architecture**

```
📱 Client
    ↓
🌐 Cloudflare (SSL/CDN)
    ↓
⚖️ DO Load Balancer
    ↓
🐳 Docker Containers
│   ├── 🚀 NestJS API (port 3001)
│   ├── 🔍 Meilisearch
│   ├── 📨 RabbitMQ
│   └── 📊 Monitoring
    ↓
🗄️ Managed Services
│   ├── PostgreSQL (with Read Replicas)
│   ├── Redis Cache
│   └── Spaces (Object Storage)
```

### **Core Services**

- **Load Balancer**: Digital Ocean Load Balancer with health checks
- **API**: NestJS backend with production optimizations
- **Database**: PostgreSQL with 2 read replicas for scaling
- **Cache**: Redis for sessions and application caching
- **Search**: Meilisearch for full-text search capabilities
- **Queue**: RabbitMQ for background job processing
- **Monitoring**: New Relic APM + Sentry error tracking

## 📚 **Infrastructure Guides**

### **Complete Setup Guides**

Each guide is comprehensive and covers all aspects:

- **[Docker Infrastructure Guide](DOCKER-GUIDE.md)** - Complete containerization setup
- **[Terraform Deployment Guide](TERRAFORM-DEPLOYMENT-GUIDE.md)** - Infrastructure as Code
- **[Environment & Third-Party Setup](DOPPLER-AND-THIRD-PARTY-SETUP.md)** - Secrets and integrations

### **Key Benefits**

- ✅ **Full Docker Stack**: PostgreSQL, Redis, Meilisearch, RabbitMQ
- ✅ **Production Optimizations**: Multi-stage builds, health checks, resource limits
- ✅ **Infrastructure as Code**: Complete Terraform configuration for Digital Ocean
- ✅ **Environment Management**: Doppler for secure secret management
- ✅ **Comprehensive Monitoring**: APM, error tracking, and health monitoring

## 🚀 **Quick Start Guides**

### **For Local Development**

1. **Start here**: [Docker Infrastructure Guide](DOCKER-GUIDE.md)
2. **Automated setup**: Run `./scripts/setup-dev.sh`
3. **Services only**: `docker-compose up -d db redis search mq`

### **For Production Deployment**

1. **Infrastructure setup**: [Terraform Deployment Guide](TERRAFORM-DEPLOYMENT-GUIDE.md)
2. **Environment configuration**: [Environment & Third-Party Setup](DOPPLER-AND-THIRD-PARTY-SETUP.md)
3. **Deploy**: `doppler run -- make apply` (from `infra/terraform/`)

## 🛠️ **Common Infrastructure Tasks**

### **Development Environment**

```bash
# Start all development services
docker-compose up -d

# Start only infrastructure services
docker-compose up -d db redis search mq

# View service logs
docker-compose logs -f

# Check service health
./scripts/health-check.sh

# Clean slate reset
docker-compose down -v && docker-compose up -d
```

### **Production Deployment**

```bash
# Configure Doppler
doppler configure set project codecave config prd_all

# Deploy infrastructure with Terraform
cd infra/terraform
doppler run -- make apply

# Deploy application containers
doppler run -- docker-compose -f docker-compose.prod.yml up -d --build

# Check deployment status
./scripts/health-check.sh
```

### **Environment Management**

```bash
# Switch environments
doppler configure set config dev        # Development
doppler configure set config prd_all    # Production

# View environment variables
doppler secrets list

# Run commands with secrets
doppler run -- your-command
```

## 🔧 **Infrastructure Features**

### **Development Environment**

- ✅ **Full Docker Stack**: PostgreSQL, Redis, Meilisearch, RabbitMQ, Kong
- ✅ **Hot Reload**: Development containers with live code reloading
- ✅ **Health Monitoring**: Automated health checks for all services
- ✅ **Resource Management**: Optimized resource allocation
- ✅ **Network Isolation**: Custom Docker networks for security

### **Production Environment**

- ✅ **Multi-stage Builds**: Optimized container images (60% smaller)
- ✅ **Auto-scaling**: Service scaling based on load
- ✅ **High Availability**: Redundant services and health checks
- ✅ **Security**: Non-root containers, firewall rules, SSL/TLS
- ✅ **Monitoring**: Comprehensive logging and metrics

### **Infrastructure as Code**

- ✅ **Terraform**: Complete infrastructure defined as code
- ✅ **Version Control**: All infrastructure changes tracked
- ✅ **Reproducible**: Identical environments across stages
- ✅ **Automated**: Deployment scripts and CI/CD integration

## 💰 **Cost Management**

### **Estimated Monthly Costs**

| Component                 | Development | Production |
| ------------------------- | ----------- | ---------- |
| **Local Development**     | $0          | -          |
| **Digital Ocean Droplet** | -           | ~$24       |
| **Managed PostgreSQL**    | -           | ~$15       |
| **Volume Storage (50GB)** | -           | ~$5        |
| **Spaces + CDN**          | -           | ~$5        |
| **Total**                 | **$0**      | **~$49**   |

### **Cost Optimization**

- **Development**: Free local Docker environment
- **Production**: Right-sized resources with auto-scaling
- **Monitoring**: Built-in Digital Ocean monitoring (no extra cost)
- **Storage**: Lifecycle policies for automatic cleanup

## 🔐 **Security Features**

### **Container Security**

- **Non-root users** in all production containers
- **Minimal base images** (Alpine Linux)
- **Security scanning** for vulnerabilities
- **Resource limits** to prevent DoS attacks

### **Network Security**

- **VPC isolation** for all cloud resources
- **Firewall rules** with least-privilege access
- **Private networking** for internal services
- **SSL/TLS encryption** for all external traffic

### **Secrets Management**

- **Doppler integration** for secure environment variables
- **No secrets in code** or configuration files
- **Environment-specific** secret management
- **Audit logging** for secret access

## 📊 **Monitoring & Observability**

### **Health Monitoring**

- **Docker health checks** for all containers
- **Service dependency** management
- **Automated recovery** for failed services
- **Real-time logging** with structured output

### **Performance Monitoring**

- **Resource usage** tracking (CPU, memory, disk)
- **Service response times** monitoring
- **Error rate** tracking and alerting
- **Infrastructure metrics** via Digital Ocean monitoring

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Docker Development Issues**

```bash
# Check Docker status
docker info
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Reset environment
docker-compose down -v
docker system prune -f
```

#### **Production Deployment Issues**

```bash
# Check Terraform state
terraform state list
terraform plan

# Check service health
curl http://your-server-ip:3001/health

# View container logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### **Environment Variable Issues**

```bash
# Check Doppler configuration
doppler configure get

# Test variable access
doppler secrets get DATABASE_URL

# Verify injection
doppler run -- env | grep DATABASE_URL
```

## 🔗 **Related Documentation**

- [Local Development Guide](../development/LOCAL-DEVELOPMENT-GUIDE.md) - Development environment setup
- [Authentication Guide](../authentication/AUTHENTICATION-GUIDE.md) - Authentication infrastructure
- [Backend Implementation Guide](../backend/BACKEND-IMPLEMENTATION-GUIDE.md) - API infrastructure details

## 🤝 **Contributing to Infrastructure**

When making infrastructure changes:

1. **Test locally first** with Docker Compose
2. **Use Terraform** for all cloud resource changes
3. **Update documentation** for any new services or procedures
4. **Test deployment** in a staging environment
5. **Monitor resources** after deployment

### **Infrastructure Standards**

- **All services must have health checks**
- **Use environment variables** for configuration
- **Implement proper logging** and monitoring
- **Follow security best practices**
- **Document all infrastructure changes**

---

**💡 Pro Tip**: Each infrastructure guide is comprehensive and self-contained. Start with the Docker guide for local development, then move to Terraform for production deployment.

**Last Updated**: January 2025
