# CodeCave Docker Infrastructure Guide

## 🎯 **Overview**

This comprehensive guide covers Docker infrastructure for CodeCave, including local development, production deployment, multi-stage builds, and container orchestration.

## 🏗️ **Infrastructure Architecture**

### **Development Environment**

- **PostgreSQL 15** (port 5432) - Local database with development logging
- **Redis 7** (port 6379) - Caching and sessions (development optimized)
- **Meilisearch v1.10** (port 7700) - Search engine with debug logging
- **RabbitMQ 3** (ports 5672, 15672) - Message queue with management UI
- **NestJS API** (port 3001) - Backend application
- **Next.js Web** (port 3000) - Frontend application

### **Production Environment**

- **PostgreSQL 15** - Managed database on Digital Ocean
- **Redis 7** - Managed Redis on Digital Ocean
- **Meilisearch v1.10** - Self-hosted on Digital Ocean Droplet
- **RabbitMQ 3** - Self-hosted on Digital Ocean Droplet
- **NestJS API** - Containerized backend application
- **Next.js Web** - Deployed to Vercel

## 🚀 **Quick Start**

### **Automated Setup (Recommended)**

```bash
# Run the automated setup script
./scripts/setup-dev.sh
```

This script will:

- ✅ Validate Docker setup
- ✅ Configure environment variables
- ✅ Start all infrastructure services
- ✅ Wait for health checks to pass
- ✅ Display service URLs and commands

### **Manual Local Development**

```bash
# Start all services
docker-compose up -d

# Start only infrastructure services (for API development)
docker-compose up -d db redis search mq

# Verify services are healthy
docker-compose ps
./scripts/health-check.sh
```

## 🛠️ **Docker Compose Configuration**

### **Development Setup** (`docker-compose.yml`)

```yaml
version: "3.8"

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    container_name: codecave-postgres-dev
    environment:
      POSTGRES_DB: codecave_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_LOG_STATEMENT: all
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: codecave-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Meilisearch Search Engine
  search:
    image: getmeili/meilisearch:v1.10
    container_name: codecave-search-dev
    environment:
      MEILI_MASTER_KEY: development_key_for_local_only
      MEILI_ENV: development
      MEILI_LOG_LEVEL: DEBUG
    ports:
      - "7700:7700"
    volumes:
      - search_data:/meili_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # RabbitMQ Message Queue
  mq:
    image: rabbitmq:3-management
    container_name: codecave-rabbitmq-dev
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    ports:
      - "5672:5672" # AMQP protocol
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 30s
      retries: 3

  # Kong API Gateway (Optional)
  kong:
    image: kong:3.0
    container_name: codecave-kong-dev
    depends_on:
      - kong-database
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kongpass
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001, 0.0.0.0:8444 ssl
    ports:
      - "8000:8000" # Proxy
      - "8001:8001" # Admin API
      - "8002:8002" # Admin UI
    volumes:
      - ./kong:/usr/local/kong/declarative

  # Kong Database
  kong-database:
    image: postgres:15
    container_name: codecave-kong-db-dev
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kongpass
    volumes:
      - kong_data:/var/lib/postgresql/data

  # NestJS API (Development)
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    container_name: codecave-api-dev
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/codecave_dev
      REDIS_URL: redis://redis:6379
      MEILI_HOST: http://search:7700
      RABBITMQ_URL: amqp://admin:admin@mq:5672
    depends_on:
      - db
      - redis
      - search
      - mq

volumes:
  postgres_data:
  redis_data:
  search_data:
  rabbitmq_data:
  kong_data:

networks:
  default:
    name: codecave-dev-network
```

### **Production Docker Configuration**

#### **Multi-Stage Dockerfile for Production**

```dockerfile
# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally with specific version for consistency
RUN npm install -g pnpm@8.15.0

# Copy package files for dependency resolution
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy package.json files for API workspace
COPY apps/api/package*.json ./apps/api/

# Install ALL dependencies (including dev dependencies needed for build)
RUN pnpm install --filter @codecave/api --no-frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client before building
RUN cd apps/api && npx prisma generate --schema=./prisma/schema.prisma

# Build the API (this needs @nestjs/cli and other dev dependencies)
RUN pnpm --filter @codecave/api build

# ===================================================

# Stage 2: Production Stage with Doppler Integration
# This stage only includes production dependencies and built files
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl && \
    # Install pnpm globally
    npm install -g pnpm@8.15.0

# Copy package files for dependency resolution
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy package.json files for API workspace
COPY apps/api/package*.json ./apps/api/

# Install ONLY production dependencies (smaller image, faster startup)
RUN pnpm install --filter @codecave/api --prod --no-frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy generated Prisma client
COPY --from=builder /app/apps/api/generated ./apps/api/generated

# Copy any additional files needed at runtime
COPY --from=builder /app/apps/api/package*.json ./apps/api/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port
EXPOSE 3001

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health/live || exit 1

# Start the application
CMD ["node", "apps/api/dist/main.js"]
```

### **Production Services** (`docker-compose.prod.yml`)

```yaml
# Production Docker Compose configuration for CodeCave with Doppler Integration
# Uses managed database, Doppler for secrets, and production-optimized settings

# Dynamic environment injection from Doppler
# Run with: doppler run -- docker-compose -f docker-compose.prod.yml up -d

services:
  # Meilisearch - Search engine
  search:
    image: getmeili/meilisearch:v1.10
    container_name: codecave-search-prod
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_ENV: production
      MEILI_HTTP_ADDR: 0.0.0.0:7700
    ports:
      - "7700:7700"
    volumes:
      - /mnt/volume_nyc3_01/meilisearch:/meili_data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # RabbitMQ - Message queue
  queue:
    image: rabbitmq:3-management-alpine
    container_name: codecave-queue-prod
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
      RABBITMQ_DEFAULT_VHOST: codecave
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - /mnt/volume_nyc3_01/rabbitmq:/var/lib/rabbitmq
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # NestJS API - Main application with production optimizations
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile.prod
    container_name: codecave-api-prod
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      SENTRY_DSN: ${SENTRY_DSN}
      MEILI_HOST: ${MEILI_HOST}
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      RABBITMQ_URL: ${RABBITMQ_URL}
      NEW_RELIC_LICENSE_KEY: ${NEW_RELIC_LICENSE_KEY}
      NEW_RELIC_APP_NAME: ${NEW_RELIC_APP_NAME}
      NEW_RELIC_LOG_LEVEL: ${NEW_RELIC_LOG_LEVEL}
    ports:
      - "3001:3001"
    depends_on:
      - search
      - queue
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "1.0"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    volumes:
      - /mnt/volume_nyc3_01/app-logs:/app/logs

# External networks for inter-service communication
networks:
  default:
    driver: bridge
```

### **Build Optimization Features**

- **Multi-stage builds**: Reduces final images by 60-70%
- **Security**: Non-root user execution
- **Health checks**: Automated container health monitoring
- **Layer caching**: Efficient Docker layer caching
- **Production-only deps**: Smaller runtime images

## 🔧 **Common Commands**

### **Development Commands**

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d db redis search mq

# View logs
docker-compose logs -f
docker-compose logs -f api

# Restart a service
docker-compose restart api

# Execute commands in containers
docker-compose exec api bash
docker-compose exec db psql -U postgres -d codecave_dev
docker-compose exec redis redis-cli

# Stop all services
docker-compose down

# Stop and remove volumes (destroys data)
docker-compose down -v
```

### **Production Commands**

```bash
# Deploy with Doppler
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale API service
docker-compose -f docker-compose.prod.yml up -d --scale api=3

# Rolling update
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --no-deps api
```

## 🌐 **Service Access**

### **Development URLs**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379
- **Meilisearch**: http://localhost:7700
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **Kong Proxy**: http://localhost:8000
- **Kong Admin**: http://localhost:8001
- **Kong Admin UI**: http://localhost:8002

### **Production Configuration**

```
External → Internal
80       → 8000    (Kong HTTP)
443      → 8443    (Kong HTTPS)
3001     → 3001    (API Direct Access - internal only)
5672     → 5672    (RabbitMQ AMQP - internal only)
15672    → 15672   (RabbitMQ Management - VPN only)
6379     → 6379    (Redis - internal only)
7700     → 7700    (Meilisearch - internal only)
8001     → 8001    (Kong Admin - VPN only)
```

## 💾 **Volume Management**

### **Development Volumes**

```bash
# List all volumes
docker volume ls | grep codecave

# Inspect volume
docker volume inspect codecave_postgres_data

# Backup volume
docker run --rm -v codecave_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v codecave_postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

### **Production Volume Strategy**

```yaml
# Production volumes use bind mounts to persistent storage
volumes:
  # Meilisearch data
  meilisearch_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/volume_nyc3_01/meilisearch

  # RabbitMQ data
  rabbitmq_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/volume_nyc3_01/rabbitmq

  # Redis data
  redis_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/volume_nyc3_01/redis

  # Application logs
  app_logs:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/volume_nyc3_01/app-logs
```

## 🔐 **Security Configuration**

### **Container Security**

```dockerfile
# Security best practices in Dockerfiles

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

# Use minimal base images
FROM node:22-alpine AS production

# Health checks for monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Resource limits
deploy:
  resources:
    limits:
      cpus: "1.0"
      memory: 1G
    reservations:
      cpus: "0.5"
      memory: 512M
```

### **Network Security**

```yaml
# Custom networks for isolation
networks:
  default:
    name: codecave-prod-network
    driver: bridge
# Internal service communication
# Services communicate via service names (internal DNS)
# External access only through Kong Gateway
```

### **Secrets Management**

```bash
# Production secrets via Doppler
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d

# Environment variables injected at runtime
# No secrets in Dockerfiles or compose files
```

## 📊 **Health Monitoring**

### **Health Check Implementation**

```typescript
// apps/api/src/app.controller.ts
@Public()
@Get("health")
getHealth(): { status: string; timestamp: string; services: object } {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      meilisearch: await this.checkMeilisearch(),
      rabbitmq: await this.checkRabbitMQ(),
    },
  };
}
```

### **Docker Health Checks**

```yaml
# All services include health checks
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### **Service Dependencies**

```yaml
# Proper service dependencies
api:
  depends_on:
    search:
      condition: service_healthy
    mq:
      condition: service_healthy
    redis:
      condition: service_healthy
```

## 🚀 **Deployment Procedures**

### **Development Deployment**

```bash
# Automated development setup
./scripts/setup-dev.sh

# Manual setup
docker-compose up -d db redis search mq
pnpm dev
```

### **Production Deployment**

#### **Initial Deployment**

```bash
# Using deployment script
cd /root/codecave
./scripts/deploy-production.sh

# Manual deployment
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d --build
```

#### **Rolling Updates**

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Rolling update without downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps api

# Verify deployment
./scripts/health-check.sh
```

#### **Blue-Green Deployment**

```bash
# Deploy to secondary stack
docker-compose -f docker-compose.prod.yml -p codecave-blue up -d --build

# Health check new deployment
curl -f http://localhost:3002/health

# Switch traffic via Kong configuration
kubectl apply -f kong-blue-green.yml

# Stop old deployment
docker-compose -f docker-compose.prod.yml -p codecave-green down
```

### **Rollback Procedures**

```bash
# Quick rollback to previous image
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --no-build

# Full rollback with git
git checkout HEAD~1
./scripts/deploy-production.sh
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Container Won't Start**

```bash
# Check logs
docker-compose logs [service-name]

# Check Docker daemon
docker info

# Validate compose file
docker-compose config

# Check disk space
df -h

# Check memory
free -h
```

#### **Port Conflicts**

```bash
# Check what's using the port
lsof -i :5432
netstat -tulpn | grep :5432

# Change port in docker-compose.yml
ports:
  - "5433:5432"  # Map to different host port
```

#### **Database Connection Issues**

```bash
# Check database container
docker-compose ps db

# Test connection from host
psql -h localhost -U postgres -d codecave_dev

# Test connection from another container
docker-compose exec api psql ${DATABASE_URL}

# Check database logs
docker-compose logs db
```

#### **Performance Issues**

```bash
# Check resource usage
docker stats

# Check container health
docker-compose ps

# Check logs for errors
docker-compose logs --tail=100

# System cleanup
docker system prune -f
```

### **Debugging Tools**

```bash
# Container inspection
docker inspect codecave-api-prod

# Network troubleshooting
docker network ls
docker network inspect codecave-prod-network

# Volume inspection
docker volume ls
docker volume inspect codecave_postgres_data

# Execute debugging commands
docker-compose exec api bash
docker-compose exec db psql -U postgres
docker-compose exec redis redis-cli
```

## 📈 **Performance Optimization**

### **Container Performance**

```yaml
# Resource limits and reservations
deploy:
  resources:
    limits:
      cpus: "2.0"
      memory: 2G
    reservations:
      cpus: "1.0"
      memory: 1G
```

### **Build Performance**

```dockerfile
# Optimize layer caching
COPY package*.json ./
RUN pnpm install

# Copy source last (changes most frequently)
COPY . .
RUN pnpm build
```

### **Runtime Performance**

```bash
# Monitor performance
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Scale services based on load
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

## 📚 **Additional Resources**

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Kong Gateway Documentation](https://docs.konghq.com/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)
- [Meilisearch Docker](https://docs.meilisearch.com/learn/cookbooks/docker.html)
- [RabbitMQ Docker](https://hub.docker.com/_/rabbitmq)

---

**💡 Pro Tip**: Use `docker-compose up -d db redis search mq` for backend API development to keep infrastructure running while you develop your application locally.

**Last Updated**: January 2025
