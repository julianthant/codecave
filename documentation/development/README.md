# Development Documentation

This directory contains comprehensive development documentation for CodeCave.

## 📚 **Contents**

- [**Local Development Guide**](LOCAL-DEVELOPMENT-GUIDE.md) - **Complete development setup guide**
  - Docker infrastructure setup
  - Environment configuration
  - Development workflows
  - Database operations
  - Troubleshooting
  - Authentication development
  - API development

- [**Project Setup**](PROJECT-SETUP.md) - Initial project foundation setup
  - GitHub repository setup
  - Third-party service configuration
  - Infrastructure provisioning guide

## 🚀 **Getting Started**

### **Quick Start for New Developers**

1. **Start here**: [Local Development Guide](LOCAL-DEVELOPMENT-GUIDE.md)
2. **Automated setup**: Run `./scripts/setup-dev.sh` from the project root
3. **Manual setup**: Follow the step-by-step instructions in the guide

### **Prerequisites**

- **Node.js** (v18+) and **pnpm** (v8+)
- **Docker** and **Docker Compose**
- **Git**
- **Doppler CLI** (recommended)

## 🏗️ **Development Environment Overview**

### **Services Architecture**

```
Local Development Stack:
├── Next.js Frontend (3000)
├── NestJS API (3001)
├── PostgreSQL Database (5432)
├── Redis Cache (6379)
├── Meilisearch (7700)
├── RabbitMQ (5672, 15672)
└── Kong Gateway (8000, 8001, 8002) [optional]
```

### **Key Features**

- ✅ **Docker Compose**: Full infrastructure in containers
- ✅ **Hot Reload**: Automatic code reloading for development
- ✅ **Health Checks**: Service health monitoring
- ✅ **Environment Management**: Doppler integration
- ✅ **Database Management**: Prisma ORM with migrations
- ✅ **Authentication**: Better Auth with OAuth
- ✅ **Monitoring**: Sentry integration

## 🛠️ **Common Development Tasks**

### **Starting Development**

```bash
# Option 1: Automated setup
./scripts/setup-dev.sh

# Option 2: Manual setup
docker-compose up -d db redis search mq
pnpm dev

# Option 3: With Doppler
doppler run -- pnpm dev
```

### **Database Operations**

```bash
# Navigate to API directory
cd apps/api

# Generate migration
pnpm prisma:migrate:dev

# Apply migrations
pnpm prisma:migrate:deploy

# Open Prisma Studio
pnpm prisma studio
```

### **Debugging & Testing**

```bash
# View service logs
docker-compose logs -f

# Run tests
pnpm test

# Check service health
./scripts/health-check.sh
```

## 🔧 **Development Best Practices**

### **Environment Management**

1. **Use Doppler** for environment variables
2. **Keep services running** - only restart when necessary
3. **Use health checks** to verify service status
4. **Monitor resources** with `docker stats`

### **Database Development**

1. **Always create migrations** for schema changes
2. **Use Prisma Studio** for data exploration
3. **Reset database** for clean testing: `pnpm prisma:reset`
4. **Backup important data** before major changes

### **API Development**

1. **Test endpoints** with curl or Postman
2. **Use global auth guard** - mark public routes with `@Public()`
3. **Monitor Sentry** for errors during development
4. **Use proper TypeScript types** throughout

## 🚨 **Common Issues & Solutions**

### **Port Conflicts**

```bash
# Check what's using ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Solution: Change ports in .env or stop conflicting services
```

### **Docker Issues**

```bash
# Clean slate reset
docker-compose down -v
docker system prune -f
docker-compose up -d

# Check Docker status
docker info
docker-compose ps
```

### **Database Connection Issues**

```bash
# Check database service
docker-compose ps db
docker-compose logs db

# Test connection
docker-compose exec db pg_isready -U postgres
```

## 📊 **Resource Requirements**

### **Minimum Requirements**

- **CPU**: 2 cores
- **RAM**: 4GB
- **Disk**: 10GB free space

### **Recommended**

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Disk**: 20GB+ free space

## 🔗 **Related Documentation**

- [Authentication Guide](../authentication/AUTHENTICATION-GUIDE.md) - Complete auth system documentation
- [Backend Implementation Guide](../backend/BACKEND-IMPLEMENTATION-GUIDE.md) - NestJS API implementation details
- [Docker Infrastructure Guide](../infrastructure/DOCKER-GUIDE.md) - Complete Docker setup guide

## 🤝 **Contributing**

When working on development environment improvements:

1. **Test changes thoroughly** with `docker-compose config`
2. **Update documentation** for any new services or procedures
3. **Ensure backward compatibility** with existing setups
4. **Add health checks** for new services
5. **Update scripts** in the `/scripts` directory

---

**💡 Pro Tip**: The [Local Development Guide](LOCAL-DEVELOPMENT-GUIDE.md) is your single source of truth for all development environment setup and troubleshooting. It contains everything you need to get CodeCave running locally.

**Last Updated**: January 2025
