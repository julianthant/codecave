# Docker Infrastructure Guide

This guide explains how to set up and use the Docker-based infrastructure for both development and production environments.

## 🏗️ **Infrastructure Architecture**

The application uses Docker for containerization and orchestration with the following components:

### **Development Environment**

- **PostgreSQL 15** (port 5432) - Local database with development logging
- **Redis 7** (port 6379) - Caching and sessions (development optimized)
- **Meilisearch v1.10** (port 7700) - Search engine with debug logging
- **RabbitMQ 3** (ports 5672, 15672) - Message queue with management UI
- **Kong Gateway** (ports 8000, 8001, 8002) - API Gateway with admin interface
- **NestJS API** (port 3001) - Backend application
- **Next.js Web** (port 3000) - Frontend application

### **Production Environment**

- **PostgreSQL 15** - Managed database on Digital Ocean
- **Redis 7** - Managed Redis on Digital Ocean
- **Meilisearch v1.10** - Self-hosted on Digital Ocean Droplet
- **RabbitMQ 3** - Self-hosted on Digital Ocean Droplet
- **Kong Gateway** - API Gateway for routing and security
- **NestJS API** - Containerized backend application
- **Next.js Web** - Deployed to Vercel

## 🛠️ **Docker Compose Setup**

### Development Environment

```yaml
# docker-compose.yml (simplified)
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: codecave_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  search:
    image: getmeili/meilisearch:v1.10
    environment:
      MEILI_MASTER_KEY: development_key_for_local_only
    ports:
      - "7700:7700"
    volumes:
      - search_data:/meili_data

  mq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    ports:
      - "5672:5672"   # AMQP protocol
      - "15672:15672" # Management UI

  kong:
    image: kong:3.0
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

  kong-database:
    image: postgres:15
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kongpass
    volumes:
      - kong_data:/var/lib/postgresql/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/codecave_dev
      REDIS_URL: redis://redis:6379
      SEARCH_URL: http://search:7700
      MQ_URL: amqp://admin:admin@mq:5672
    depends_on:
      - db
      - redis
      - search
      - mq

volumes:
  postgres_data:
  redis_data:
  search_data:
  kong_data:
```

### Production Environment

```yaml
# docker-compose.prod.yml (simplified)
version: '3.8'

services:
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      SEARCH_URL: ${SEARCH_URL}
      MQ_URL: ${MQ_URL}
    deploy:
      replicas: 2

  search:
    image: getmeili/meilisearch:v1.10
    restart: always
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_ENV: production
      MEILI_NO_ANALYTICS: true
    volumes:
      - search_data:/meili_data

  mq:
    image: rabbitmq:3-management
    restart: always
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS}
    volumes:
      - mq_data:/var/lib/rabbitmq

  kong:
    image: kong:3.0
    restart: always
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /usr/local/kong/declarative/kong.yml
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 127.0.0.1:8001, 127.0.0.1:8444 ssl
    volumes:
      - ./kong:/usr/local/kong/declarative

volumes:
  search_data:
  mq_data:
```

## 🚀 **Development Workflow**

### Starting the Development Environment

```bash
# Start all services
docker-compose up -d

# Start only infrastructure services
docker-compose up -d db redis search mq

# Verify services are healthy
docker-compose ps
```

### Accessing Services

- **Database**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Meilisearch**: `http://localhost:7700`
- **RabbitMQ**: `http://localhost:15672` (Management UI)
- **Kong Admin**: `http://localhost:8001`
- **Kong Gateway**: `http://localhost:8000`
- **API**: `http://localhost:3001`
- **Web**: `http://localhost:3000`

### Common Commands

```bash
# View logs for a service
docker-compose logs -f api

# Restart a service
docker-compose restart api

# Execute commands in a container
docker-compose exec api npm run prisma:migrate

# Stop all services
docker-compose down
```

## 🛫 **Production Deployment**

### Deploying to Digital Ocean

1. **Prepare Production Variables**:
   ```bash
   # Configure Doppler for production
   doppler configure set project codecave config prd_all
   ```

2. **Deploy Infrastructure using Terraform**:
   ```bash
   cd infra/terraform
   make apply
   ```

3. **Deploy Containers**:
   ```bash
   doppler run -- docker-compose -f docker-compose.prod.yml up -d
   ```

### Production Security Considerations

- **Never expose database ports** to the public internet
- **Use a firewall** to restrict access to admin interfaces
- **Enable TLS** for all exposed services
- **Use Doppler** for secure environment variable management
- **Set up monitoring** for all production containers

## 🧪 **Testing Services**

### Database Connectivity

```bash
# Using psql in the container
docker-compose exec db psql -U postgres -d codecave_dev -c "SELECT 'Connected successfully!';"
```

### Redis Connectivity

```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Meilisearch Health

```bash
# Check Meilisearch health
curl http://localhost:7700/health
```

### RabbitMQ Status

```bash
# Check RabbitMQ status (returns queue information)
curl -u admin:admin http://localhost:15672/api/queues
```

## 🚨 **Troubleshooting**

### Container Won't Start

```bash
# Check container logs
docker-compose logs [service-name]

# Check if ports are already in use
lsof -i :<port-number>

# Force recreate a container
docker-compose up -d --force-recreate [service-name]
```

### Database Connection Issues

- Verify the database service is running: `docker-compose ps db`
- Check database logs: `docker-compose logs db`
- Verify connection string format: `postgresql://username:password@host:port/database`

### Resource Constraints

- Monitor container resources: `docker stats`
- Increase Docker resource limits in Docker Desktop settings

### Clean Slate Reset

```bash
# Remove containers, networks, and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 🧠 **Best Practices**

1. **Use named volumes** instead of bind mounts for databases
2. **Use health checks** to ensure services are ready
3. **Separate dev and prod** configurations
4. **Use environment variables** for configuration
5. **Limit container resources** to prevent one service from affecting others
6. **Keep images updated** for security patches
7. **Use Docker Compose profiles** for different development scenarios

## 🎯 **Kong API Gateway**

Kong is configured using a declarative configuration file:

```yaml
# kong/kong.yml
_format_version: "2.1"

services:
  - name: api-service
    url: http://api:3001
    routes:
      - name: api-route
        paths:
          - /api
    plugins:
      - name: cors
      - name: rate-limiting
        config:
          minute: 60
          policy: local

  - name: auth-service
    url: http://api:3001/auth
    routes:
      - name: auth-route
        paths:
          - /auth
    plugins:
      - name: cors
```

---

**Last Updated**: July 30, 2025 