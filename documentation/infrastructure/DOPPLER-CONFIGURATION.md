# Doppler Environment Configuration for Better Auth

## 🎯 **Overview**

This document outlines the complete Doppler environment configuration for CodeCave with Better Auth. All environment variables should be configured in Doppler under `codecave → prd_all` for production environment.

## 📋 **Required Environment Variables**

### **Core Application Settings**

```bash
NODE_ENV=production
FRONTEND_URL=https://codecave.tech
BACKEND_URL=https://api.codecave.tech
```

### **Database Configuration**

```bash
# Digital Ocean PostgreSQL managed database
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### **Better Auth Configuration**

```bash
# Better Auth Secret (32+ characters)
BETTER_AUTH_SECRET=your-secure-secret-key-minimum-32-characters-long
BETTER_AUTH_URL=https://codecave.tech

# OAuth Provider Credentials (GitHub)
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret

# OAuth Provider Credentials (Google)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
```

### **Infrastructure Configuration**

```bash
# DigitalOcean API Token
DO_API_TOKEN=your-digitalocean-api-token

# DigitalOcean Spaces (File Storage)
DO_SPACES_KEY=your-spaces-access-key
DO_SPACES_SECRET=your-spaces-secret-key
DO_SPACES_BUCKET=codecave-production-storage
DO_SPACES_REGION=nyc3
```

### **Monitoring & Analytics**

```bash
# Sentry Error Tracking
SENTRY_DSN_API=your-sentry-api-dsn
SENTRY_DSN_WEB=your-sentry-web-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# New Relic APM
NEW_RELIC_LICENSE_KEY=your-new-relic-license-key
```

### **External Services**

```bash
# Stripe Payments
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Meilisearch
MEILI_MASTER_KEY=your-production-meili-master-key
MEILI_HOST=http://localhost:7700

# RabbitMQ
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password
RABBITMQ_URL=amqp://user:pass@localhost:5672

# Redis
REDIS_URL=redis://localhost:6379
```

### **Feature Flags & Analytics**

```bash
# ConfigCat Feature Flags
CONFIGCAT_SDK_KEY=your-configcat-sdk-key

# Blackfire.io Performance Profiling
BLACKFIRE_SERVER_ID=your-blackfire-server-id
BLACKFIRE_SERVER_TOKEN=your-blackfire-server-token
```

## 🚀 **Development Environment Setup**

### **Local Development with Doppler**

1. **Install Doppler CLI**

```bash
# macOS
brew install doppler

# Or use curl
curl -Ls https://cli.doppler.com/install.sh | sh
```

2. **Login to Doppler**

```bash
doppler login
```

3. **Configure Project**

```bash
cd /path/to/codecave
doppler configure set project codecave config dev
```

4. **Run Development Commands**

```bash
# Start frontend with Doppler
cd apps/web
doppler run -- pnpm dev

# Start backend with Doppler
cd apps/api
doppler run -- pnpm dev

# Run full stack
doppler run -- pnpm dev
```

### **Development Environment Variables**

For local development, use `codecave → dev` config with these values:

```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Use local PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# Better Auth (use different secret for dev)
BETTER_AUTH_SECRET=development-secret-key-32-characters-minimum
BETTER_AUTH_URL=http://localhost:3000

# OAuth (use development OAuth apps)
GITHUB_CLIENT_ID=your-dev-github-client-id
GITHUB_CLIENT_SECRET=your-dev-github-client-secret
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret

# Local services
MEILI_MASTER_KEY=development_key_for_local_only
MEILI_HOST=http://localhost:7700
RABBITMQ_URL=amqp://admin:admin@localhost:5672
REDIS_URL=redis://localhost:6379
```

## 🏗️ **Production Deployment Integration**

### **Terraform Integration**

The Terraform deployment script automatically pulls variables from Doppler:

```bash
# From infra/terraform/terraform.sh
export DIGITALOCEAN_ACCESS_TOKEN="$(doppler secrets get DO_API_TOKEN --config=prd_all --project=codecave --plain)"
export TF_VAR_spaces_access_key="$(doppler secrets get DO_SPACES_KEY --config=prd_all --project=codecave --plain)"
export TF_VAR_spaces_secret_key="$(doppler secrets get DO_SPACES_SECRET --config=prd_all --project=codecave --plain)"
```

### **Docker Compose Integration**

Production deployment automatically uses Doppler:

```bash
# From scripts/deploy-server.sh
doppler run --config=prd_all --project=codecave -- docker-compose -f docker-compose.prod.yml up -d --build
```

### **GitHub Actions Integration**

CI/CD pipeline integrates with Doppler for secure deployments:

```yaml
# Example .github/workflows/deploy.yml
- name: Deploy with Doppler
  run: |
    doppler run --config=prd_all --project=codecave -- ./scripts/deploy-server.sh
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

## 🔒 **Security Best Practices**

### **Secret Management**

- ✅ Never commit secrets to version control
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate secrets regularly (quarterly)
- ✅ Use strong, randomly generated passwords
- ✅ Enable 2FA on all service accounts

### **Access Control**

- ✅ Limit Doppler access to necessary team members
- ✅ Use service tokens for CI/CD, not personal tokens
- ✅ Regularly audit who has access to production secrets
- ✅ Use least-privilege principle for all integrations

### **Monitoring**

- ✅ Monitor Doppler access logs
- ✅ Set up alerts for secret access in production
- ✅ Regularly review and clean up unused secrets
- ✅ Monitor for exposed credentials in logs

## 🛠️ **Development Workflow**

### **Adding New Environment Variables**

1. **Add to Doppler**

```bash
# Add to development environment
doppler secrets set KEY=value --config=dev --project=codecave

# Add to production environment
doppler secrets set KEY=value --config=prd_all --project=codecave
```

2. **Update Application Code**

```typescript
// In your application code
const newVariable = process.env.NEW_VARIABLE;
```

3. **Update Documentation**

- Update this file with the new variable
- Update env.example if needed
- Update deployment scripts if required

### **Testing Environment Variables**

```bash
# Check if variable is set in Doppler
doppler secrets get KEY --config=prd_all --project=codecave

# Test variable in application
doppler run --config=dev --project=codecave -- node -e "console.log(process.env.KEY)"

# Compare environments
doppler secrets compare dev prd_all --project=codecave
```

## 📚 **Quick Reference Commands**

### **Doppler CLI Commands**

```bash
# List all projects
doppler projects list

# List configs for codecave project
doppler configs list --project=codecave

# Get all secrets for current config
doppler secrets list

# Download secrets to .env file (for local development)
doppler secrets download --no-file --format=env > .env

# Run command with secrets
doppler run -- your-command

# Set a secret
doppler secrets set KEY=value

# Delete a secret
doppler secrets delete KEY
```

### **Environment Switching**

````bash
# Switch to development
doppler configure set config dev

## 🖥️ **Digital Ocean Droplet Configuration**

### **Production Droplet Setup**

For production deployment on Digital Ocean droplets, Doppler is integrated into the Docker containers and deployment scripts.

#### **Automatic Installation**

Doppler CLI is automatically installed during droplet initialization via `user_data.sh`:

```bash
# Install Doppler CLI with verification
curl -Ls https://cli.doppler.com/install.sh | sh

# Add to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/profile
echo 'export DOPPLER_CONFIG_DIR="/root/.doppler"' >> /etc/profile
````

#### **Service Token Configuration (Recommended)**

For production droplets, use service tokens instead of personal authentication:

1. **Create Service Token**
   - Go to https://dashboard.doppler.com
   - Navigate to: CodeCave project → prd_all config → Access
   - Create a new Service Token with read permissions
   - Copy the token (starts with `dp.st.prd.`)

2. **Configure on Droplet**

   ```bash
   # SSH to your droplet
   ssh root@your-droplet-ip

   # Run setup script
   cd /root/codecave
   ./scripts/setup-doppler.sh

   # Or manually configure
   export DOPPLER_TOKEN="dp.st.prd.your-token-here"
   echo 'export DOPPLER_TOKEN="dp.st.prd.your-token-here"' >> /root/.bashrc
   ```

3. **Verify Configuration**

   ```bash
   # Test secret access
   doppler secrets --only-names

   # Test environment injection
   doppler run -- env | grep DATABASE_URL
   ```

#### **Docker Integration**

The production Docker Compose configuration uses Doppler for environment variable injection:

```bash
# Start services with Doppler
cd /root/codecave
doppler run -- docker-compose -f docker-compose.prod.yml up -d

# Or use the deployment script
./scripts/deploy-production.sh
```

#### **High Availability Setup**

For production resilience, create encrypted fallback snapshots:

```bash
# Create encrypted secrets snapshot
doppler secrets download --no-file --format env > /opt/codecave/doppler/doppler.encrypted.json

# Use fallback in Docker containers
docker run -e DOPPLER_TOKEN="$DOPPLER_TOKEN" \
  your-app doppler run --fallback=/opt/codecave/doppler/doppler.encrypted.json -- your-command
```

### **Deployment Scripts Integration**

All deployment scripts include Doppler integration:

- `./scripts/setup-doppler.sh` - Initial Doppler configuration
- `./scripts/deploy-production.sh` - Full deployment with Doppler
- `./scripts/health-check.sh` - Health checks including Doppler connectivity

### **Firewall Configuration**

Ensure the droplet can access Doppler API:

```bash
# Allow HTTPS outbound (should be default)
ufw allow out 443

# Verify connectivity
curl -I https://api.doppler.com
```

### **Monitoring Doppler Health**

Regular health checks include Doppler connectivity:

```bash
# Run health check
./scripts/health-check.sh

# Check Doppler specifically
doppler configure get
doppler secrets --only-names
```

### **Troubleshooting on Droplet**

**Issue**: Doppler CLI not found after installation

```bash
# Verify installation
which doppler
/usr/local/bin/doppler --version

# Add to PATH if needed
export PATH="/usr/local/bin:$PATH"
```

**Issue**: Permission denied accessing Doppler config

```bash
# Fix permissions
chmod 700 /root/.doppler
chown -R root:root /root/.doppler
```

**Issue**: Cannot connect to Doppler API

```bash
# Check network connectivity
curl -I https://api.doppler.com

# Check firewall
ufw status
```

**Issue**: Service token not working

```bash
# Verify token format (should start with dp.st.prd.)
echo $DOPPLER_TOKEN

# Test token directly
curl -H "Authorization: Bearer $DOPPLER_TOKEN" https://api.doppler.com/v3/me
```

## 🔧 **Environment-Specific Commands**

### **Switch Between Environments**

```bash
# Development
doppler configure set config dev

# Production
doppler configure set config prd_all

# Check current configuration
doppler configure get
```

## 🆘 **Troubleshooting**

### **Common Issues**

**Issue**: Command fails with "no token set"

```bash
# Solution: Login and configure
doppler login
doppler configure set project codecave config prd_all
```

**Issue**: Variable not found in application

```bash
# Check if variable exists in Doppler
doppler secrets get VARIABLE_NAME

# Check if running with doppler
doppler run -- env | grep VARIABLE_NAME
```

**Issue**: Wrong environment variables

```bash
# Check current config
doppler configure get

# Switch to correct config
doppler configure set config dev  # or prd_all
```

### **Emergency Access**

If Doppler is unavailable, critical environment variables for emergency access:

1. Database connection string (from DO dashboard)
2. Basic auth credentials for services
3. API tokens for infrastructure management

These should be stored securely in a separate system for emergency use only.

---

**Last Updated**: July 21, 2025  
**Version**: 2.0 (Digital Ocean Droplet Integration)
