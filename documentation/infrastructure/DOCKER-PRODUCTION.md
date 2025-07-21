# Docker Production Infrastructure Implementation

## Overview

This document describes the complete Docker production infrastructure implementation for CodeCave, including containerization strategy, multi-stage builds, service orchestration, and production deployment configurations.

## Architecture

### Container Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Stack                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Kong     │  │   NestJS    │  │ Meilisearch │            │
│  │  (Gateway)  │  │    (API)    │  │  (Search)   │            │
│  │   Port:80   │  │  Port:3001  │  │ Port:7700   │            │
│  │   Port:443  │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  RabbitMQ   │  │    Redis    │  │  Volumes    │            │
│  │    (MQ)     │  │   (Cache)   │  │ (Persistent)│            │
│  │ Port:5672   │  │ Port:6379   │  │   Storage   │            │
│  │ Port:15672  │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                │
│  External: Managed PostgreSQL Database (DigitalOcean)         │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Production Docker Compose (`docker-compose.prod.yml`)

**Service Overview:**

- **Kong Gateway**: API gateway and load balancer
- **NestJS API**: Main application backend
- **Meilisearch**: Search engine service
- **RabbitMQ**: Message queue for async processing
- **Redis**: Caching and session storage
- **Volume Mounts**: Persistent data storage

### 2. NestJS API Container

**Dockerfile (`apps/api/Dockerfile.prod`):**

```dockerfile
# Multi-stage build for optimized production image
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/dist ./dist
COPY --from=deps --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/package.json ./package.json

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

USER nestjs
EXPOSE 3001

CMD ["node", "dist/main.js"]
```

**Key Features:**

- **Multi-stage build**: Reduces final image size by ~60%
- **Security**: Non-root user execution
- **Health checks**: Automated container health monitoring
- **Optimized layers**: Efficient Docker layer caching

### 3. Service Configuration

**Kong API Gateway:**

```yaml
gateway:
  image: kong:latest
  container_name: codecave-gateway-prod
  environment:
    KONG_DATABASE: "off"
    KONG_DECLARATIVE_CONFIG: /opt/kong/kong.yml
    KONG_SSL_CERT: /etc/kong/ssl/fullchain.pem
    KONG_SSL_CERT_KEY: /etc/kong/ssl/privkey.pem
  ports:
    - "80:8000" # HTTP
    - "443:8443" # HTTPS
    - "8001:8001" # Admin API
  volumes:
    - ./kong/kong.yml:/opt/kong/kong.yml:ro
    - /etc/letsencrypt:/etc/letsencrypt
    - /mnt/volume_nyc3_01/kong-ssl:/etc/kong/ssl
  healthcheck:
    test: ["CMD", "kong", "health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**Meilisearch Search Engine:**

```yaml
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
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 30s
```

**Redis Cache:**

```yaml
redis:
  image: redis:7-alpine
  container_name: codecave-redis-prod
  command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
  ports:
    - "6379:6379"
  volumes:
    - /mnt/volume_nyc3_01/redis:/data
  healthcheck:
    test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**RabbitMQ Message Queue:**

```yaml
mq:
  image: rabbitmq:3-management-alpine
  container_name: codecave-mq-prod
  environment:
    RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
    RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS}
    RABBITMQ_DEFAULT_VHOST: codecave
  ports:
    - "5672:5672" # AMQP
    - "15672:15672" # Management UI
  volumes:
    - /mnt/volume_nyc3_01/rabbitmq:/var/lib/rabbitmq
  healthcheck:
    test: rabbitmq-diagnostics -q ping
    interval: 30s
    timeout: 30s
    retries: 3
    start_period: 60s
```

### 4. Volume Management

**Persistent Storage Strategy:**

```yaml
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

**Volume Mount Points:**

- `/mnt/volume_nyc3_01/meilisearch` - Search index data
- `/mnt/volume_nyc3_01/rabbitmq` - Message queue data
- `/mnt/volume_nyc3_01/redis` - Cache data and persistence
- `/mnt/volume_nyc3_01/app-logs` - Application logs
- `/mnt/volume_nyc3_01/kong-ssl` - SSL certificates

### 5. Networking Configuration

**Custom Network:**

```yaml
networks:
  default:
    name: codecave-prod-network
    driver: bridge
```

**Service Communication:**

- **Internal DNS**: Services communicate via service names
- **API Gateway**: Routes external traffic to appropriate services
- **Database**: External managed PostgreSQL (secure connection)
- **Load Balancing**: Kong handles traffic distribution

**Port Mapping:**

```
External → Internal
80       → 8000    (Kong HTTP)
443      → 8443    (Kong HTTPS)
3001     → 3001    (API Direct Access)
5672     → 5672    (RabbitMQ AMQP)
15672    → 15672   (RabbitMQ Management)
6379     → 6379    (Redis)
7700     → 7700    (Meilisearch)
8001     → 8001    (Kong Admin)
```

## Build Optimization

### 1. Multi-Stage Builds

**Benefits:**

- **Size Reduction**: Final images are 60-70% smaller
- **Security**: No build tools in production images
- **Caching**: Optimized layer caching for faster builds
- **Separation**: Clear separation of build and runtime dependencies

**Build Stages:**

1. **Base**: Common dependencies and tooling
2. **Dependencies**: Install only production dependencies
3. **Builder**: Build the application
4. **Runner**: Minimal runtime image

### 2. Docker Layer Caching

**Optimization Strategies:**

```dockerfile
# Copy package files first (changes less frequently)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code last (changes most frequently)
COPY . .
RUN pnpm build
```

**Cache Efficiency:**

- Package installations cached unless dependencies change
- Source code changes don't invalidate dependency layers
- Build artifacts cached for incremental builds

### 3. Image Size Optimization

**Techniques Used:**

- **Alpine Linux**: Smaller base images
- **Multi-stage builds**: Remove build artifacts
- **Dependency pruning**: Only production dependencies
- **.dockerignore**: Exclude unnecessary files

**Image Sizes:**

- NestJS API (production): ~150MB
- Development image: ~400MB
- Base node:20-alpine: ~50MB

## Security Implementation

### 1. Container Security

**Security Measures:**

```dockerfile
# Non-root user
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Read-only file system (where possible)
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist

# Minimal attack surface
FROM node:20-alpine AS runner  # Minimal base image
```

**Runtime Security:**

- Containers run as non-root users
- Minimal base images (Alpine Linux)
- No shell access in production containers
- Read-only root filesystems where possible

### 2. Secrets Management

**Environment Variables:**

```yaml
# Managed via Doppler in production
environment:
  DATABASE_URL: ${DATABASE_URL}
  JWT_SECRET: ${JWT_SECRET}
  REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
  MEILI_HOST: http://search:7700
  RABBITMQ_URL: amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@mq:5672/codecave
```

**Secret Sources:**

- **Development**: `.env.local` files
- **Production**: Doppler secrets management
- **Runtime**: Environment variable injection

### 3. Network Security

**Security Features:**

- **Internal networking**: Services communicate via private network
- **Firewall rules**: Only necessary ports exposed
- **SSL/TLS**: HTTPS enforced via Kong gateway
- **CORS**: Strict origin policies

## Health Monitoring

### 1. Health Check Implementation

**API Health Check:**

```typescript
@Controller()
export class AppController {
  @Get("health")
  @Public()
  async health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        meilisearch: await this.checkMeilisearch(),
      },
    };
  }
}
```

**Docker Health Checks:**

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### 2. Service Dependencies

**Dependency Management:**

```yaml
api:
  depends_on:
    search:
      condition: service_healthy
    mq:
      condition: service_healthy
    redis:
      condition: service_healthy
```

**Startup Sequence:**

1. Infrastructure services (Redis, RabbitMQ, Meilisearch)
2. Kong migrations
3. Kong gateway
4. NestJS API

### 3. Monitoring Integration

**Log Aggregation:**

```yaml
volumes:
  - /mnt/volume_nyc3_01/app-logs:/app/logs
```

**Metrics Collection:**

- Health check status monitoring
- Container resource usage
- Service response times
- Error rate tracking

## Deployment Procedures

### 1. Production Deployment

**Deployment Script (`quick-deploy.sh`):**

```bash
#!/bin/bash
cd /root/codecave

# Pull latest changes
git pull origin main

# Stop services gracefully
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml down --remove-orphans

# Clean up old images and containers
docker system prune -f

# Build and start services
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d --build

# Verify deployment
sleep 30
docker-compose -f docker-compose.prod.yml ps
curl -f http://localhost:3001/health
```

### 2. Zero-Downtime Deployment

**Blue-Green Deployment Strategy:**

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

### 3. Rollback Procedures

**Rollback Strategy:**

```bash
# Quick rollback to previous image
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --no-build

# Full rollback with git
git checkout HEAD~1
./quick-deploy.sh
```

## Development Workflow

### 1. Local Development

**Setup Commands:**

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f api

# Access database
docker-compose exec postgres psql -U codecave codecave_dev

# Redis CLI
docker-compose exec redis redis-cli

# RabbitMQ Management
open http://localhost:15672
```

### 2. Testing

**Test Environment:**

```bash
# Run tests in container
docker-compose exec api npm test

# Integration tests
docker-compose exec api npm run test:e2e

# Load testing
docker-compose exec api npm run test:load
```

### 3. Debugging

**Debug Configuration:**

```yaml
# Development override for debugging
api:
  ports:
    - "3001:3001"
    - "9229:9229" # Node.js debug port
  environment:
    NODE_OPTIONS: "--inspect=0.0.0.0:9229"
```

**Common Debug Commands:**

```bash
# Container shell access
docker-compose exec api sh

# View container logs
docker-compose logs -f api

# Inspect container
docker inspect codecave-api-dev

# Network debugging
docker network ls
docker network inspect codecave_default
```

## Performance Optimization

### 1. Container Performance

**Resource Limits:**

```yaml
api:
  deploy:
    resources:
      limits:
        cpus: "1.0"
        memory: 1G
      reservations:
        cpus: "0.5"
        memory: 512M
```

**Performance Tuning:**

- **Memory limits**: Prevent OOM kills
- **CPU limits**: Fair resource sharing
- **Restart policies**: Automatic recovery
- **Health checks**: Early problem detection

### 2. Build Performance

**Optimization Techniques:**

- **Dependency caching**: Faster rebuilds
- **Parallel builds**: Multi-stage builds
- **Layer optimization**: Minimize layer changes
- **Build contexts**: Smaller build contexts

### 3. Runtime Performance

**Monitoring Metrics:**

- Container CPU/memory usage
- Request response times
- Database connection pools
- Cache hit rates

## Troubleshooting

### 1. Common Issues

**Container Won't Start:**

```bash
# Check logs
docker-compose logs api

# Check health
docker-compose ps

# Inspect configuration
docker-compose config
```

**Database Connection Issues:**

```bash
# Test database connectivity
docker-compose exec api npm run test:db

# Check environment variables
docker-compose exec api env | grep DATABASE

# Network connectivity
docker-compose exec api ping postgres
```

**Performance Issues:**

```bash
# Resource usage
docker stats

# Log analysis
docker-compose logs api | grep ERROR

# Health check status
curl http://localhost:3001/health
```

### 2. Debug Tools

**Useful Commands:**

```bash
# Container inspection
docker inspect codecave-api-prod

# Network troubleshooting
docker network inspect codecave-prod-network

# Volume inspection
docker volume inspect codecave_postgres_data

# System cleanup
docker system prune -a --volumes
```

## Future Improvements

### 1. Orchestration

**Planned Enhancements:**

- [ ] Kubernetes migration for better orchestration
- [ ] Helm charts for deployment management
- [ ] Service mesh implementation (Istio)
- [ ] Auto-scaling based on metrics

### 2. Security Enhancements

**Security Roadmap:**

- [ ] Image vulnerability scanning
- [ ] Runtime security monitoring
- [ ] Secrets rotation automation
- [ ] Network policies implementation

### 3. Performance Improvements

**Performance Roadmap:**

- [ ] Container resource optimization
- [ ] Multi-region deployment
- [ ] CDN integration for static assets
- [ ] Database connection pooling

## Related Documentation

- [Terraform Infrastructure](./TERRAFORM.md)
- [Doppler Configuration](./DOPPLER-CONFIGURATION.md)
- [Local Development Docker Guide](./DOCKER.md)
- [Kong Gateway Configuration](./KONG-CONFIGURATION.md)
