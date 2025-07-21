# Local Development Guide

This guide explains how to set up and run the CodeCave application locally for development.

## 🛠️ **Prerequisites**

Before starting, make sure you have the following installed:

- **Node.js** (v18+) and **pnpm** (v8+)
- **Docker** and **Docker Compose**
- **Git**
- **Doppler CLI** (optional, but recommended for environment management)

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/your-username/codecave.git
cd codecave

# Install dependencies
pnpm install

# Copy environment template
cp env.example .env

# Start infrastructure services
docker-compose up -d db redis search mq

# Start development servers
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📁 **Project Structure**

```
codecave/
├── apps/                     # Application modules
│   ├── api/                  # NestJS backend
│   └── web/                  # Next.js frontend
├── documentation/            # Project documentation
├── infra/                    # Infrastructure as code
│   └── terraform/            # Terraform configurations
├── kong/                     # API Gateway configuration
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Local development services
└── pnpm-workspace.yaml       # Workspace configuration
```

## 🔧 **Environment Setup**

### Setting Up Environment Variables

1. **Copy the template**:
   ```bash
   cp env.example .env
   ```

2. **Edit your `.env` file**:
   ```bash
   # Development Environment
   NODE_ENV=development

   # Database (Local PostgreSQL from Docker)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

   # Better Auth
   BETTER_AUTH_SECRET=local_development_secret_change_in_production
   BETTER_AUTH_URL=http://localhost:3000

   # OAuth Providers (Add your credentials)
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # Meilisearch (Local instance)
   MEILI_MASTER_KEY=development_key_for_local_only
   MEILI_HOST=http://localhost:7700

   # RabbitMQ (Local instance)
   RABBITMQ_USER=admin
   RABBITMQ_PASS=admin
   RABBITMQ_URL=amqp://admin:admin@localhost:5672

   # Redis (Local instance)  
   REDIS_URL=redis://localhost:6379

   # API Configuration
   API_PORT=3001
   API_HOST=localhost

   # Frontend URL (for CORS and redirects)
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:3001

   # File Storage (DigitalOcean Spaces - optional for development)
   DO_SPACES_KEY=your_do_spaces_key_here
   DO_SPACES_SECRET=your_do_spaces_secret_here
   DO_SPACES_BUCKET=your_bucket_name_here
   DO_SPACES_REGION=your_region_here
   ```

### Using Doppler (Recommended)

For a more secure environment variable management:

```bash
# Install Doppler CLI
brew install doppler

# Configure Doppler for the project
doppler configure set project codecave config dev

# Run with Doppler
doppler run -- pnpm dev
```

## 🐳 **Docker Services**

The project uses Docker Compose to run infrastructure services:

### Starting Docker Services

```bash
# Start all services
docker-compose up -d

# Start only specific services
docker-compose up -d db redis search mq
```

### Available Services

- **PostgreSQL** (port 5432)
  - Database: `codecave_dev`
  - Username: `postgres`
  - Password: `postgres`

- **Redis** (port 6379)
  - No authentication for development

- **Meilisearch** (port 7700)
  - Master Key: `development_key_for_local_only`
  - UI: http://localhost:7700

- **RabbitMQ** (ports 5672, 15672)
  - Username: `admin`
  - Password: `admin`
  - Management UI: http://localhost:15672

- **Kong API Gateway** (optional, ports 8000, 8001, 8002)
  - Proxy: http://localhost:8000
  - Admin API: http://localhost:8001
  - Admin UI: http://localhost:8002

## 🚀 **Development Workflow**

### Running the Application

```bash
# Start both frontend and backend in development mode
pnpm dev

# Start only frontend
pnpm web:dev

# Start only backend
pnpm api:dev
```

### Database Migrations

```bash
# Generate a new migration
cd apps/api
pnpm prisma:migrate:dev

# Apply migrations
pnpm prisma:migrate:deploy

# Generate Prisma client
pnpm prisma:generate
```

### Testing

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm web:test

# Run API tests
pnpm api:test

# Run E2E tests
pnpm test:e2e
```

## 🔍 **Accessing Services**

### Frontend Application

- URL: http://localhost:3000
- Development features:
  - Hot Module Replacement
  - React Developer Tools
  - Next.js specific debugging

### Backend API

- URL: http://localhost:3001
- Swagger Documentation: http://localhost:3001/api/docs
- Health Check: http://localhost:3001/health

### Database Access

```bash
# Using psql in the container
docker-compose exec db psql -U postgres -d codecave_dev

# Using psql from host machine
psql -h localhost -U postgres -d codecave_dev
```

### Meilisearch

- URL: http://localhost:7700
- Dashboard: http://localhost:7700
- Health Check: http://localhost:7700/health

### RabbitMQ

- Management UI: http://localhost:15672
- Credentials: `admin`/`admin`

## 🚨 **Troubleshooting**

### Common Issues

1. **Port conflicts**:
   - Check if ports are already in use: `lsof -i :3000` or `lsof -i :5432`
   - Change the port in your `.env` file if needed

2. **Database connection errors**:
   - Verify the database service is running: `docker-compose ps db`
   - Check database logs: `docker-compose logs db`

3. **Environment variables not loading**:
   - Restart the development server
   - Verify the `.env` file location

4. **Docker services not starting**:
   - Check Docker logs: `docker-compose logs`
   - Restart Docker Desktop

5. **Next.js build errors**:
   - Clear `.next` directory: `rm -rf apps/web/.next`
   - Run `pnpm web:clean && pnpm web:dev`

### Reset Development Environment

If you need a clean slate:

```bash
# Stop all containers
docker-compose down

# Remove volumes (will delete all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 📚 **Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Doppler Documentation](https://docs.doppler.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Last Updated**: July 30, 2025 