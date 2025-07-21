# 🚀 CodeCave Development Environment - Enhanced Setup Guide

## 📋 **Overview**

This guide provides a comprehensive setup for the CodeCave development environment, following Docker Compose and Context7 best practices for optimal development workflow.

## 🏗️ **Architecture**

### **Development Services**

- **PostgreSQL 15** - Primary database with development logging
- **Redis 7** - Caching and session management (development optimized)
- **Meilisearch v1.10** - Full-text search engine with debug logging
- **RabbitMQ 3** - Message queue with management interface
- **Kong Gateway** - API gateway (optional for local development)

### **Production Services** (docker-compose.prod.yml)

- **External Database** - DigitalOcean Managed PostgreSQL
- **Meilisearch** - Production-optimized search
- **RabbitMQ** - Production message queue
- **Redis** - Production caching with authentication
- **Kong Gateway** - SSL-terminated API gateway

## 🚀 **Quick Start**

### **Automated Setup (Recommended)**

```bash
# Run the automated setup script
./scripts/setup-dev.sh
```

This script will:

- ✅ Check Docker installation and status
- ✅ Validate Docker Compose configuration
- ✅ Setup environment variables
- ✅ Start infrastructure services
- ✅ Wait for all services to become healthy
- ✅ Display service URLs and useful commands

### **Manual Setup**

1. **Environment Setup**

```bash
# Copy environment template
cp env.example .env

# Edit with your preferences (optional for development)
nano .env
```

2. **Start Infrastructure Only**

```bash
# Start core services (recommended for API development)
docker-compose up -d db redis search mq

# Verify services are healthy
docker-compose ps
```

3. **Start All Services**

```bash
# Start everything including Kong Gateway
docker-compose up -d

# Check service status
docker-compose logs -f
```

## 🌐 **Service Access**

### **Development URLs**

- **PostgreSQL**: `localhost:5432` (postgres/postgres)
- **Redis**: `localhost:6379` (no auth in development)
- **Meilisearch**: http://localhost:7700 (master key: `development_key_for_local_only`)
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **Kong Admin GUI**: http://localhost:8002 (if using full setup)
- **Kong Admin API**: http://localhost:8001 (if using full setup)

### **Database Connection Examples**

#### **Node.js/NestJS**

```javascript
// Prisma database URL
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/codecave_dev";

// Direct connection
const client = new Client({
  host: "localhost",
  port: 5432,
  database: "codecave_dev",
  user: "postgres",
  password: "postgres",
});
```

#### **Redis Connection**

```javascript
// Development Redis (no auth)
const redis = new Redis({
  host: "localhost",
  port: 6379,
});
```

## 🔧 **Development Workflows**

### **API Development**

```bash
# Option 1: Run API in Docker
docker-compose up -d db redis search mq  # Start infrastructure
docker-compose up api                    # Start API with logs

# Option 2: Run API locally (infrastructure in Docker)
docker-compose up -d db redis search mq  # Start infrastructure
cd apps/api
npm run dev                              # Run API locally
```

### **Database Operations**

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d codecave_dev

# Run database migrations
docker-compose exec api npm run prisma:migrate:dev

# Reset database with fresh data
docker-compose exec api npm run prisma:reset
```

### **Service Management**

```bash
# View logs for specific service
docker-compose logs -f api
docker-compose logs -f db

# Restart a service
docker-compose restart api

# Access service shell
docker-compose exec api bash
docker-compose exec db bash

# Check service health
docker-compose ps
```

## 🔍 **Debugging & Troubleshooting**

### **Common Issues**

#### **Services Won't Start**

```bash
# Check Docker daemon
docker info

# Validate compose file
docker-compose config

# Check port conflicts
netstat -tulpn | grep :5432
```

#### **Database Connection Issues**

```bash
# Check database is accepting connections
docker-compose exec db pg_isready -U postgres

# Check database logs
docker-compose logs db

# Reset database if corrupted
docker-compose down
docker volume rm codecave_postgres_dev_data
docker-compose up -d db
```

#### **Performance Issues**

```bash
# Check container resource usage
docker stats

# Clean up unused resources
docker system prune

# Restart services
docker-compose restart
```

### **Service Health Checks**

```bash
# Check all service health
./scripts/health-check.sh

# Manual health verification
curl http://localhost:7700/health     # Meilisearch
curl http://localhost:15672/api/overview  # RabbitMQ
docker-compose exec redis redis-cli ping  # Redis
docker-compose exec db pg_isready -U postgres  # PostgreSQL
```

## 🔐 **Security Notes**

### **Development Security**

- Default passwords are used for development convenience
- Services are accessible without authentication
- Debug logging is enabled for troubleshooting

### **Never Use Development Config in Production**

- ❌ Default passwords
- ❌ Debug logging
- ❌ Open access policies
- ❌ Unencrypted connections

## 📊 **Resource Usage**

### **Typical Development Resource Requirements**

- **CPU**: 2-4 cores recommended
- **RAM**: 4-8GB recommended
- **Disk**: 10-20GB for volumes
- **Network**: Local Docker network

### **Service Resource Allocation**

- **PostgreSQL**: ~200MB RAM
- **Redis**: ~100MB RAM
- **Meilisearch**: ~200MB RAM
- **RabbitMQ**: ~150MB RAM
- **Kong**: ~100MB RAM (if used)

## 🛠️ **Advanced Configuration**

### **Custom Environment Variables**

```bash
# Override default settings in .env
POSTGRES_DB=my_custom_db
MEILI_MASTER_KEY=my_custom_key
RABBITMQ_USER=my_user
RABBITMQ_PASS=my_password

# Service-specific settings
POSTGRES_LOG_STATEMENT=all  # Enable SQL query logging
REDIS_MAXMEMORY=512mb       # Set Redis memory limit
MEILI_LOG_LEVEL=INFO        # Adjust Meilisearch log level
```

### **Volume Management**

```bash
# List development volumes
docker volume ls | grep codecave

# Backup volume data
docker run --rm -v codecave_postgres_dev_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume data
docker run --rm -v codecave_postgres_dev_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

### **Network Configuration**

```bash
# Inspect Docker network
docker network inspect codecave-dev-network

# Connect external container to network
docker run --network codecave-dev-network redis:cli redis-cli -h redis ping
```

## 📚 **Additional Resources**

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PostgreSQL Development Guide](https://www.postgresql.org/docs/)
- [Redis Development Best Practices](https://redis.io/docs/manual/)
- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials.html)

## 🤝 **Contributing**

When contributing to the development environment:

1. Test changes with `docker-compose config`
2. Ensure health checks pass
3. Update documentation for new services
4. Maintain backward compatibility
5. Consider resource impact

## 📝 **Next Steps**

After setting up the development environment:

1. **Configure your IDE** for Docker integration
2. **Set up debugging** for your preferred development tools
3. **Create custom scripts** for your workflow
4. **Integrate with CI/CD** for testing

---

**💡 Pro Tip**: Use `docker-compose up -d db redis search mq` for backend API development to keep infrastructure running while you develop your application locally.
