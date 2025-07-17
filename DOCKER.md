# Docker Compose Local Development Guide

This guide explains how to set up and use the local development environment with Docker Compose.

## 🏗️ **What's Included**

Your Docker Compose setup includes these services:

- **PostgreSQL** (port 5432) - Local database
- **Meilisearch** (port 7700) - Search engine with admin UI
- **RabbitMQ** (port 5672, management UI on 15672) - Message queue
- **Kong Gateway** (proxy on 8000, admin on 8001, GUI on 8002) - API Gateway
- **Redis** (port 6379) - Caching and sessions
- **NestJS API** (port 3001) - Your backend application (when built)

## 🚀 **Getting Started**

### Step 1: Set up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Fill in your actual values from Doppler
# At minimum, add your Supabase credentials
```

### Step 2: Start Infrastructure Services
```bash
# Start just the infrastructure (without your API)
docker-compose up -d db search mq redis gateway
```

### Step 3: Verify Services
```bash
# Check all services are running
docker-compose ps

# Check logs if any service fails
docker-compose logs [service-name]
```

### Step 4: Access Management UIs
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **Meilisearch**: http://localhost:7700
- **Kong Admin GUI**: http://localhost:8002

## 🔧 **Common Commands**

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f db
```

### Restart a Service
```bash
docker-compose restart search
```

### Clean Reset (⚠️ Destroys all data)
```bash
docker-compose down -v
docker-compose up -d
```

## 🗄️ **Database Access**

### Connect to PostgreSQL
```bash
# Using psql in the container
docker-compose exec db psql -U postgres -d codecave_dev

# Or from your host (if you have psql installed)
psql -h localhost -U postgres -d codecave_dev
```

### Database Credentials
- **Host**: localhost:5432
- **Database**: codecave_dev
- **Username**: postgres
- **Password**: postgres

## 🔍 **Search Engine (Meilisearch)**

- **URL**: http://localhost:7700
- **Master Key**: development_key_for_local_only (for local development only)

## 📬 **Message Queue (RabbitMQ)**

- **AMQP URL**: amqp://admin:admin@localhost:5672
- **Management UI**: http://localhost:15672
- **Credentials**: admin/admin

## 🌐 **API Gateway (Kong)**

- **Proxy**: http://localhost:8000 (routes to your APIs)
- **Admin API**: http://localhost:8001
- **Admin GUI**: http://localhost:8002

## 🚨 **Troubleshooting**

### Port Conflicts
If you get port conflicts, check what's running:
```bash
lsof -i :5432  # Check if PostgreSQL is already running locally
lsof -i :6379  # Check if Redis is already running locally
```

### Service Won't Start
```bash
# Check logs for the specific service
docker-compose logs [service-name]

# Restart the service
docker-compose restart [service-name]
```

### Clean Slate Reset
```bash
# Stop everything and remove volumes (destroys data)
docker-compose down -v

# Remove images if needed
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## 💡 **Development Tips**

1. **Use Doppler CLI** to inject environment variables:
   ```bash
   doppler run -- docker-compose up -d
   ```

2. **Keep services running** - Only restart when you change Docker configs

3. **Use service names** in your application configs:
   - Database: `db:5432` (inside containers)
   - Search: `search:7700` (inside containers)
   - Queue: `mq:5672` (inside containers)

4. **Monitor resources**: Use `docker stats` to monitor CPU/memory usage

## 🎯 **Next Steps**

1. Set up your NestJS API in `apps/api/`
2. Configure Kong routes for your API endpoints
3. Set up Meilisearch indexes for search functionality
4. Configure RabbitMQ queues for background jobs 