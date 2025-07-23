# CodeCave Local Development Guide

## 🎯 **Overview**

This comprehensive guide covers everything you need to set up and run CodeCave locally for development. It includes Docker infrastructure, environment configuration, and development workflows.

## 📋 **Prerequisites**

Before starting, ensure you have the following installed:

- **Node.js** (v18+) and **pnpm** (v8+)
- **Docker** and **Docker Compose**
- **Git**
- **Doppler CLI** (optional, but recommended for environment management)

## 🏗️ **Architecture**

### **Development Services**

- **PostgreSQL 15** (port 5432) - Primary database with development logging
- **Redis 7** (port 6379) - Caching and session management
- **Meilisearch v1.10** (port 7700) - Full-text search engine with debug logging
- **RabbitMQ 3** (ports 5672, 15672) - Message queue with management interface
- **Kong Gateway** (ports 8000, 8001, 8002) - API gateway (optional for local development)
- **NestJS API** (port 3001) - Backend application
- **Next.js Web** (port 3000) - Frontend application

## 🚀 **Quick Start**

### **Option 1: Automated Setup (Recommended)**

```bash
# Clone the repository
git clone https://github.com/your-username/codecave.git
cd codecave

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

### **Option 2: Manual Setup**

```bash
# Clone and install dependencies
git clone https://github.com/your-username/codecave.git
cd codecave
pnpm install

# Copy environment template
cp env.example .env

# Start infrastructure services only
docker-compose up -d db redis search mq

# Start development servers
pnpm dev
```

## 🔧 **Environment Setup**

### **Creating Your `.env` File**

```bash
# Copy the template and edit it
cp env.example .env
```

### **Required Environment Variables**

```env
# Development Environment
NODE_ENV=development

# Database (Local PostgreSQL from Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# Better Auth Configuration
BETTER_AUTH_SECRET=local_development_secret_change_in_production
BETTER_AUTH_URL=http://localhost:3000

# OAuth Provider Credentials (Development)
GITHUB_CLIENT_ID=your_dev_github_client_id
GITHUB_CLIENT_SECRET=your_dev_github_client_secret
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_client_secret

# Infrastructure Services (Local)
MEILI_MASTER_KEY=development_key_for_local_only
MEILI_HOST=http://localhost:7700
RABBITMQ_USER=admin
RABBITMQ_PASS=admin
RABBITMQ_URL=amqp://admin:admin@localhost:5672
REDIS_URL=redis://localhost:6379

# API Configuration
API_PORT=3001
API_HOST=localhost
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Optional Development Settings
LOG_LEVEL=debug
ENABLE_CORS=true
```

### **Using Doppler (Recommended)**

For secure environment variable management:

```bash
# Install Doppler CLI
brew install doppler

# Configure Doppler for the project
doppler configure set project codecave config dev

# Run with Doppler
doppler run -- pnpm dev
```

## 🐳 **Docker Services**

### **Starting Docker Services**

```bash
# Start all services including Kong Gateway
docker-compose up -d

# Start only infrastructure services (for API development)
docker-compose up -d db redis search mq

# Verify services are healthy
docker-compose ps
./scripts/health-check.sh
```

### **Available Services**

#### **PostgreSQL Database**

- **Port**: 5432
- **Database**: `codecave_dev`
- **Username**: `postgres`
- **Password**: `postgres`
- **Connection**: `postgresql://postgres:postgres@localhost:5432/codecave_dev`

#### **Redis Cache**

- **Port**: 6379
- **No authentication** for development
- **Connection**: `redis://localhost:6379`

#### **Meilisearch Search Engine**

- **Port**: 7700
- **Master Key**: `development_key_for_local_only`
- **Web UI**: http://localhost:7700
- **Health Check**: http://localhost:7700/health

#### **RabbitMQ Message Queue**

- **AMQP Port**: 5672
- **Management UI**: http://localhost:15672
- **Credentials**: `admin`/`admin`
- **Connection**: `amqp://admin:admin@localhost:5672`

#### **Kong API Gateway** (Optional)

- **Proxy**: http://localhost:8000
- **Admin API**: http://localhost:8001
- **Admin UI**: http://localhost:8002

## 🚀 **Development Workflow**

### **Running the Application**

```bash
# Start both frontend and backend in development mode
pnpm dev

# Start only frontend
pnpm web:dev

# Start only backend
pnpm api:dev

# Start with Doppler
doppler run -- pnpm dev
```

### **Database Operations**

#### **Database Migrations**

```bash
# Navigate to API directory
cd apps/api

# Generate a new migration
pnpm prisma:migrate:dev

# Apply migrations
pnpm prisma:migrate:deploy

# Generate Prisma client
pnpm prisma:generate

# Reset database with fresh data
pnpm prisma:reset
```

#### **Database Access**

```bash
# Using psql in the container
docker-compose exec db psql -U postgres -d codecave_dev

# Using psql from host machine (if installed)
psql -h localhost -U postgres -d codecave_dev

# Using Prisma Studio
cd apps/api
pnpm prisma studio
```

### **Service Management**

```bash
# View logs for all services
docker-compose logs -f

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
./scripts/health-check.sh
```

## 🧪 **Testing**

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm web:test

# Run API tests
pnpm api:test

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

## 🔍 **Accessing Services**

### **Application URLs**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Swagger Documentation**: http://localhost:3001/api/docs

### **Infrastructure UIs**

- **Meilisearch Dashboard**: http://localhost:7700
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **Kong Admin GUI**: http://localhost:8002 (if using full setup)

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Port Conflicts**

```bash
# Check if ports are already in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Change ports in .env file if needed
```

#### **Docker Services Won't Start**

```bash
# Check Docker daemon
docker info

# Validate compose file
docker-compose config

# Check service logs
docker-compose logs [service-name]

# Restart Docker Desktop if necessary
```

#### **Database Connection Errors**

```bash
# Verify database service is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec db pg_isready -U postgres

# Reset database if corrupted
docker-compose down
docker volume rm codecave_postgres_dev_data
docker-compose up -d db
```

#### **Environment Variables Not Loading**

```bash
# Restart the development server
pnpm dev

# Verify .env file location and contents
cat .env

# Check if running with Doppler
doppler run -- env | grep DATABASE_URL
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

### **Clean Slate Reset**

If you need a fresh start:

```bash
# Stop all containers and remove volumes (destroys all data)
docker-compose down -v

# Remove images if needed
docker-compose down --rmi all

# Clean up Docker system
docker system prune -f

# Start fresh
docker-compose up -d
```

## 🎯 **Development Tips**

### **Best Practices**

1. **Use service names in containers**:
   - Database: `db:5432` (inside containers)
   - Search: `search:7700` (inside containers)
   - Queue: `mq:5672` (inside containers)

2. **Keep services running**: Only restart when changing Docker configs

3. **Monitor resources**: Use `docker stats` to monitor CPU/memory usage

4. **Use Doppler**: For consistent environment variable management across team

5. **Health checks**: Regular `./scripts/health-check.sh` runs

### **Useful Commands**

```bash
# Quick health check
curl http://localhost:3001/health
curl http://localhost:7700/health

# Check Docker network
docker network inspect codecave_default

# View container logs in real-time
docker-compose logs -f --tail=100

# Execute commands in running containers
docker-compose exec api npm run prisma:studio
docker-compose exec redis redis-cli
```

## 📱 **API Development**

### **Running API in Different Modes**

```bash
# Option 1: Run API in Docker with hot reload
docker-compose up api

# Option 2: Run API locally (infrastructure in Docker)
docker-compose up -d db redis search mq
cd apps/api
pnpm dev

# Option 3: Full local development
pnpm dev  # Runs both frontend and backend
```

### **API Endpoints**

#### **Basic Endpoints**

- `GET /` - Hello world
- `GET /health` - Health check
- `GET /api/auth/*` - Authentication routes (Better Auth)

#### **User Endpoints**

- `GET /users/profile` - Current user profile (authenticated)

#### **Development/Testing Endpoints**

- `GET /sentry-test` - Test Sentry integration
- `GET /sentry-error` - Test error tracking

## 🔐 **Authentication Development**

### **OAuth Setup for Development**

1. **GitHub OAuth App**:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/api/auth/callback/github`

2. **Google OAuth App**:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`

### **Testing Authentication**

```bash
# Test auth endpoints
curl http://localhost:3001/api/auth/session

# Test protected endpoint
curl -H "Cookie: better-auth.session_token=..." http://localhost:3001/users/profile
```

## 📊 **Resource Usage**

### **Typical Development Requirements**

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

## 🔄 **Switching Between Environments**

### **Development to Production Testing**

```bash
# Switch to production Doppler config
doppler configure set config prd_all

# Test with production environment variables
doppler run -- pnpm dev

# Switch back to development
doppler configure set config dev
```

## 📚 **Additional Resources**

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PostgreSQL Development Guide](https://www.postgresql.org/docs/)
- [Redis Development Best Practices](https://redis.io/docs/manual/)
- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials.html)
- [Better Auth Documentation](https://better-auth.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 **Contributing**

When contributing to the development environment:

1. Test changes with `docker-compose config`
2. Ensure health checks pass
3. Update documentation for new services
4. Maintain backward compatibility
5. Consider resource impact

---

**💡 Pro Tip**: Use `docker-compose up -d db redis search mq` for backend API development to keep infrastructure running while you develop your application locally.

**Last Updated**: January 2025
