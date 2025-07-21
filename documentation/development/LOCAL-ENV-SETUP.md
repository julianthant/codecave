# Local Development Environment Variables

Copy these variables into your `.env` file for local development.

## 📝 **Create Your `.env` File**

```bash
# Copy the template and edit it
cp env.example .env
```

Then add/update these variables in your `.env` file:

## 🔧 **Required Environment Variables**

```bash
# Development Environment
NODE_ENV=development

# Database (Local PostgreSQL from Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# Supabase (Replace with your actual credentials from Supabase dashboard)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

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

# JWT Configuration (Use secure keys for production)
JWT_SECRET=local_development_secret_change_in_production
JWT_EXPIRES_IN=24h

# File Storage (DigitalOcean Spaces - add your actual credentials)
DO_SPACES_KEY=your_do_spaces_key_here
DO_SPACES_SECRET=your_do_spaces_secret_here
DO_SPACES_BUCKET=your_bucket_name_here
DO_SPACES_REGION=your_region_here

# Development specific settings
LOG_LEVEL=debug
ENABLE_CORS=true

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# External Services (Add these as you set them up)
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEW_RELIC_LICENSE_KEY=your_key_here
# SENTRY_DSN_API=your_sentry_dsn_here
# SENTRY_DSN_WEB=your_sentry_dsn_here
```

## 🚀 **Quick Setup Commands**

```bash
# 1. Copy environment template
cp env.example .env

# 2. Start local infrastructure
docker-compose up -d db redis search mq

# 3. Verify services are running
docker-compose ps

# 4. Start development servers
pnpm dev           # Frontend on http://localhost:3000
pnpm api:dev       # Backend on http://localhost:3001
```

## 🔍 **Service Access URLs**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **PostgreSQL**: localhost:5432 (postgres/postgres)
- **Meilisearch**: http://localhost:7700
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **Redis**: localhost:6379

## ⚠️ **Important Notes**

1. **Replace placeholder values** with your actual credentials
2. **Never commit** your `.env` file to git
3. **Use strong secrets** for JWT and other security-sensitive values
4. **Keep development and production secrets separate**

## 🔑 **Where to Get Credentials**

- **Supabase**: https://app.supabase.com → Your Project → Settings → API
- **DigitalOcean Spaces**: https://cloud.digitalocean.com → Spaces → Manage Keys
- **Sentry**: https://sentry.io → Settings → Projects → Client Keys 