# CodeCave Environment & Third-Party Tools Setup Guide

## 🎯 **Overview**

This comprehensive guide covers environment variable management with Doppler and integration of all third-party tools for CodeCave, including monitoring, analytics, feature flags, and performance profiling.

## 🔑 **Doppler Environment Configuration**

### **What is Doppler?**

Doppler is a secure environment variable management platform that eliminates the need to store secrets in `.env` files or directly in your codebase. It provides:

- ✅ Centralized secret management
- ✅ Environment-specific configurations
- ✅ Secure secret injection at runtime
- ✅ Team collaboration and access control
- ✅ Audit logs and secret rotation

### **Project Structure**

```
Doppler Organization: CodeCave
├── Project: codecave
    ├── Config: dev (Development)
    ├── Config: staging (Staging)
    └── Config: prd_all (Production)
```

## 🚀 **Doppler Setup**

### **Installation**

```bash
# macOS
brew install doppler

# Linux/Windows
curl -Ls https://cli.doppler.com/install.sh | sh

# Verify installation
doppler --version
```

### **Initial Configuration**

```bash
# Login to Doppler
doppler login

# Configure project
cd /path/to/codecave
doppler configure set project codecave config dev

# Verify configuration
doppler configure get

# Test secret access
doppler secrets --only-names
```

## 🔧 **Environment Variables Configuration**

### **Core Application Settings**

```bash
# Environment
NODE_ENV=production

# URLs
FRONTEND_URL=https://codecave.tech
BACKEND_URL=https://api.codecave.tech
```

### **Better Auth Configuration**

```bash
# Better Auth Secret (32+ characters)
BETTER_AUTH_SECRET=your-secure-secret-key-minimum-32-characters-long
BETTER_AUTH_URL=https://codecave.tech

# OAuth Provider Credentials
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
```

### **Database Configuration**

```bash
# Digital Ocean PostgreSQL managed database
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### **Infrastructure Services**

```bash
# Meilisearch
MEILI_MASTER_KEY=your-production-meili-master-key
MEILI_HOST=http://localhost:7700

# RabbitMQ
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password
RABBITMQ_URL=amqp://user:pass@localhost:5672

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

### **Digital Ocean Configuration**

```bash
# API Token
DO_API_TOKEN=your-digitalocean-api-token

# Spaces (File Storage)
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

### **Payment Processing**

```bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
```

### **Feature Flags & Performance**

```bash
# ConfigCat Feature Flags
CONFIGCAT_SDK_KEY=your-configcat-sdk-key

# Blackfire.io Performance Profiling
BLACKFIRE_SERVER_ID=your-blackfire-server-id
BLACKFIRE_SERVER_TOKEN=your-blackfire-server-token
```

## 🌍 **Environment-Specific Configuration**

### **Development Environment (`dev`)**

```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Local PostgreSQL
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

### **Production Environment (`prd_all`)**

```bash
NODE_ENV=production
FRONTEND_URL=https://codecave.tech
BACKEND_URL=https://api.codecave.tech

# Managed PostgreSQL
DATABASE_URL=postgresql://username:password@managed-host:port/database?sslmode=require

# Better Auth (strong production secret)
BETTER_AUTH_SECRET=strong-production-secret-32-characters-minimum
BETTER_AUTH_URL=https://codecave.tech

# OAuth (production OAuth apps)
GITHUB_CLIENT_ID=your-prod-github-client-id
GITHUB_CLIENT_SECRET=your-prod-github-client-secret
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret

# Production services
MEILI_MASTER_KEY=strong-production-meili-key
RABBITMQ_USER=codecave_prod
RABBITMQ_PASS=secure-rabbitmq-password
REDIS_PASSWORD=secure-redis-password
```

## 🔧 **Doppler Integration**

### **Development Workflow**

```bash
# Switch to development environment
doppler configure set config dev

# Run development with Doppler
doppler run -- pnpm dev

# Start specific services
doppler run -- pnpm web:dev
doppler run -- pnpm api:dev
```

### **Production Deployment**

```bash
# Switch to production environment
doppler configure set config prd_all

# Deploy with Doppler
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d

# Run Terraform with Doppler
doppler run --config=prd_all --project=codecave -- \
  terraform apply
```

### **Service Token Setup (Recommended for Production)**

```bash
# Create service token in Doppler dashboard
# Go to: codecave → prd_all → Access → Service Tokens

# Configure on server
export DOPPLER_TOKEN="dp.st.prd.your-token-here"
echo 'export DOPPLER_TOKEN="dp.st.prd.your-token-here"' >> /root/.bashrc

# Verify token
doppler secrets --only-names
```

### **Docker Integration**

```bash
# Production deployment with service token
DOPPLER_TOKEN="dp.st.prd.your-token" \
  doppler run -- docker-compose -f docker-compose.prod.yml up -d

# Alternative: Environment variable injection
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ **Third-Party Tools Integration**

### **✅ Already Configured Tools**

#### **Sentry (Error Monitoring)**

**Status**: ✅ Fully integrated in codebase

- **Backend**: `apps/api/src/instrument.ts`
- **Frontend**: `apps/web/src/instrumentation.ts`
- **Environment Variables**: `SENTRY_DSN_API`, `SENTRY_DSN_WEB`

**Features Enabled**:

- ✅ Automatic error capture
- ✅ Performance monitoring
- ✅ Custom spans for API endpoints
- ✅ Console integration (console.log, console.error)
- ✅ User journey tracking with breadcrumbs

#### **Doppler (Secret Management)**

**Status**: ✅ Fully integrated in deployment system

- **Configuration**: `codecave → prd_all`
- **Integration**: Terraform, Docker deployment, CI/CD

### **🔄 Tools Needing Setup**

#### **1. ConfigCat (Feature Flags)**

**Purpose**: Safe feature rollouts with instant rollback capability

**Setup Steps**:

1. **Create ConfigCat Account**:

   ```bash
   # Go to: https://configcat.com/
   # Create account and new Product: "CodeCave"
   ```

2. **Create Config and Get SDK Key**:

   ```bash
   # Create config for environments (dev, prod)
   # Copy SDK Key from dashboard
   ```

3. **Add to Doppler**:

   ```bash
   CONFIGCAT_SDK_KEY=your_configcat_sdk_key
   ```

4. **NestJS Integration**:

   ```typescript
   // apps/api/src/config/configcat.service.ts
   import { Injectable } from "@nestjs/common";
   import * as configcat from "configcat-node";

   @Injectable()
   export class ConfigCatService {
     private client: configcat.IConfigCatClient;

     constructor() {
       this.client = configcat.getClient(process.env.CONFIGCAT_SDK_KEY);
     }

     async isFeatureEnabled(key: string, userId?: string): Promise<boolean> {
       const user = userId ? { identifier: userId } : undefined;
       return await this.client.getValueAsync(key, false, user);
     }

     async getFeatureValue<T>(
       key: string,
       defaultValue: T,
       userId?: string
     ): Promise<T> {
       const user = userId ? { identifier: userId } : undefined;
       return await this.client.getValueAsync(key, defaultValue, user);
     }
   }
   ```

5. **Usage Example**:
   ```typescript
   // In your controller
   @Get('feature-test')
   async testFeature(@Query('userId') userId: string) {
     const isEnabled = await this.configCat.isFeatureEnabled('new_dashboard', userId);
     return { featureEnabled: isEnabled };
   }
   ```

#### **2. Blackfire.io (Performance Profiling)**

**Purpose**: Performance profiling for NestJS backend

**Setup Steps**:

1. **Create Blackfire Account**:

   ```bash
   # Go to: https://blackfire.io/
   # Create account and new Environment: "codecave-production"
   ```

2. **Get Credentials**:

   ```bash
   # Navigate to Settings → Credentials
   # Copy Server ID and Server Token
   ```

3. **Add to Doppler**:

   ```bash
   BLACKFIRE_SERVER_ID=your_blackfire_server_id
   BLACKFIRE_SERVER_TOKEN=your_blackfire_server_token
   ```

4. **Docker Integration** (add to `apps/api/Dockerfile.prod`):

   ```dockerfile
   # Add Blackfire probe
   RUN version=$(php -r "echo PHP_MAJOR_VERSION.PHP_MINOR_VERSION;") \
       && architecture=$(case $(uname -m) in i386 | i686 | x86) echo "i386" ;; x86_64 | amd64) echo "amd64" ;; aarch64 | arm64) echo "arm64" ;; *) echo "amd64" ;; esac) \
       && curl -A "Docker" -o /tmp/blackfire-probe.tar.gz -D - -L -s https://blackfire.io/api/v1/releases/probe/php/alpine/$architecture/$version \
       && mkdir -p /tmp/blackfire \
       && tar zxpf /tmp/blackfire-probe.tar.gz -C /tmp/blackfire \
       && mv /tmp/blackfire/blackfire-*.so $(php -r "echo ini_get('extension_dir');")/blackfire.so \
       && printf "extension=blackfire.so\nblackfire.agent_socket=tcp://blackfire:8307\n" > $PHP_INI_DIR/conf.d/blackfire.ini
   ```

5. **Usage**:

   ```bash
   # Profile API endpoint
   blackfire curl https://api.codecave.tech/health

   # View results in Blackfire dashboard
   ```

#### **3. ImgBot (Automated Image Optimization)**

**Purpose**: Automatically optimize images in your repository

**Setup Steps**:

1. **Install GitHub App**:

   ```bash
   # Go to: https://github.com/marketplace/imgbot
   # Click "Set up a plan" → Choose free plan
   # Install and authorize for codecave repository
   ```

2. **Configuration** (optional - create `.imgbotconfig`):

   ```json
   {
     "schedule": "weekly",
     "ignoredFiles": ["*.ico", "public/logos/*"],
     "aggressiveCompression": false
   }
   ```

3. **Verification**:

   ```bash
   # Add an unoptimized image to test
   git add public/test-image.png
   git commit -m "test: add test image for ImgBot"
   git push origin main

   # ImgBot should create a PR within 24 hours
   ```

#### **4. CodeScene (Code Health Analysis)**

**Purpose**: Deep code analysis for technical debt identification

**Setup Steps**:

1. **Sign Up with GitHub**:

   ```bash
   # Go to: https://codescene.com/
   # Sign up using GitHub account
   ```

2. **Authorize and Create Project**:

   ```bash
   # Authorize CodeScene to access repositories
   # Create new analysis project
   # Link codecave repository
   ```

3. **Run Initial Analysis**:
   ```bash
   # CodeScene will automatically analyze your repository
   # View results in CodeScene dashboard
   ```

**Benefits**:

- ✅ Identifies code hotspots and complexity
- ✅ Technical debt visualization
- ✅ Development trends tracking
- ✅ Refactoring recommendations

## 🎯 **Integration Priority & Timeline**

### **High Priority (Week 1)**

1. **ConfigCat** - Essential for safe feature deployments

   ```bash
   # Setup time: ~2 hours
   # Impact: High - Safe feature rollouts
   # Effort: Low - Simple integration
   ```

2. **ImgBot** - Automatic image optimization
   ```bash
   # Setup time: ~15 minutes
   # Impact: Medium - Performance improvement
   # Effort: Very Low - One-time GitHub App install
   ```

### **Medium Priority (Week 2-3)**

3. **Blackfire.io** - Performance profiling

   ```bash
   # Setup time: ~4 hours
   # Impact: High - Performance optimization
   # Effort: Medium - Docker integration required
   ```

4. **CodeScene** - Code health monitoring
   ```bash
   # Setup time: ~1 hour
   # Impact: Medium - Code quality insights
   # Effort: Low - Automated analysis
   ```

## 🧪 **Testing & Verification**

### **ConfigCat Verification**

```typescript
// Test endpoint in your API
@Get('feature-test')
async testFeature(@Query('userId') userId: string) {
  const isEnabled = await this.configCat.isFeatureEnabled('new_feature', userId);
  return { featureEnabled: isEnabled };
}

// Test curl command
curl "https://api.codecave.tech/feature-test?userId=test-user"
```

### **Blackfire Verification**

```bash
# Profile API endpoint
blackfire curl https://api.codecave.tech/health

# Check if profile data appears in dashboard
# https://blackfire.io/profiles
```

### **ImgBot Verification**

```bash
# Add test image and commit
cp large-image.png public/test-image.png
git add public/test-image.png
git commit -m "test: add large test image"
git push origin main

# Check for PR from ImgBot within 24 hours
```

### **Doppler Verification**

```bash
# Test environment variable access
doppler secrets get DATABASE_URL --config=prd_all --project=codecave

# Test application startup with Doppler
doppler run --config=dev --project=codecave -- pnpm dev

# Verify secrets in running container
docker exec -it codecave-api-prod env | grep DATABASE_URL
```

## 🔐 **Security Best Practices**

### **Doppler Security**

```bash
# Use service tokens for production
# Rotate secrets quarterly
# Monitor secret access logs
# Use least-privilege access

# Example: Create read-only service token for CI/CD
# Go to Doppler dashboard → Access → Service Tokens
# Create token with read-only permissions
```

### **Third-Party Tool Security**

```bash
# ConfigCat: Use environment-specific SDK keys
CONFIGCAT_SDK_KEY_DEV=dev-key
CONFIGCAT_SDK_KEY_PROD=prod-key

# Blackfire: Use separate environments
BLACKFIRE_ENV_DEV=codecave-development
BLACKFIRE_ENV_PROD=codecave-production

# CodeScene: Limit repository access to necessary repos only
```

### **Secret Rotation**

```bash
# Quarterly secret rotation checklist:
# 1. Generate new secrets in service providers
# 2. Update secrets in Doppler
# 3. Deploy applications with new secrets
# 4. Verify applications work with new secrets
# 5. Revoke old secrets in service providers
```

## 📊 **Monitoring & Observability Stack**

### **Complete Monitoring Setup**

```mermaid
graph TD
    A[Application] --> B[Sentry - Error Tracking]
    A --> C[New Relic - APM]
    A --> D[Blackfire - Performance Profiling]
    A --> E[ConfigCat - Feature Flags]
    A --> F[CodeScene - Code Health]

    B --> G[Alert Notifications]
    C --> G
    D --> H[Performance Reports]
    E --> I[Feature Analytics]
    F --> J[Code Quality Reports]
```

### **Alerting Configuration**

```bash
# Sentry: Configure alert rules for error rates
# New Relic: Set up performance threshold alerts
# Blackfire: Monitor performance regressions
# ConfigCat: Track feature flag usage
```

## 🚀 **Deployment Integration**

### **CI/CD Pipeline Integration**

```yaml
# Example GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v3

      - name: Deploy with Doppler
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
        run: |
          doppler run --config=prd_all --project=codecave -- \
            ./scripts/deploy-production.sh
```

### **Docker Compose Integration**

```bash
# Production deployment with all integrations
doppler run --config=prd_all --project=codecave -- \
  docker-compose -f docker-compose.prod.yml up -d
```

### **Terraform Integration**

```bash
# Infrastructure deployment with secrets
doppler run --config=prd_all --project=codecave -- \
  terraform apply
```

## 📚 **Quick Reference Commands**

### **Doppler Commands**

```bash
# List all projects
doppler projects list

# List configs for codecave project
doppler configs list --project=codecave

# Get all secrets for current config
doppler secrets list

# Download secrets to .env file (development only)
doppler secrets download --no-file --format=env > .env

# Run command with secrets
doppler run -- your-command

# Set a secret
doppler secrets set KEY=value

# Delete a secret
doppler secrets delete KEY

# Compare environments
doppler secrets compare dev prd_all --project=codecave
```

### **Environment Switching**

```bash
# Switch to development
doppler configure set config dev

# Switch to production
doppler configure set config prd_all

# Check current configuration
doppler configure get
```

### **Testing Commands**

```bash
# Test ConfigCat integration
curl "https://api.codecave.tech/feature-test?userId=test"

# Test Blackfire profiling
blackfire curl https://api.codecave.tech/health

# Test Sentry integration
curl https://api.codecave.tech/sentry-test

# Test application health
curl https://api.codecave.tech/health
```

## 🆘 **Troubleshooting**

### **Common Doppler Issues**

#### **"No token set" Error**

```bash
# Solution: Login and configure
doppler login
doppler configure set project codecave config prd_all
```

#### **Environment Variable Not Found**

```bash
# Check if variable exists in Doppler
doppler secrets get VARIABLE_NAME

# Check current config
doppler configure get

# Verify running with Doppler
doppler run -- env | grep VARIABLE_NAME
```

#### **Doppler API Connection Issues**

```bash
# Check network connectivity
curl -I https://api.doppler.com

# Test with personal token
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.doppler.com/v3/me

# Check firewall (ensure port 443 outbound is open)
ufw allow out 443
```

### **Third-Party Tool Issues**

#### **ConfigCat Not Working**

```bash
# Verify SDK key
doppler secrets get CONFIGCAT_SDK_KEY

# Test API connectivity
curl -H "Authorization: Basic YOUR_SDK_KEY" \
  https://cdn-global.configcat.com/configuration-files/YOUR_SDK_KEY/config_v6.json
```

#### **Blackfire Profile Not Appearing**

```bash
# Check agent connectivity
blackfire agent --socket=tcp://localhost:8307 status

# Verify server credentials
echo $BLACKFIRE_SERVER_ID
echo $BLACKFIRE_SERVER_TOKEN
```

#### **ImgBot Not Creating PRs**

```bash
# Check GitHub App installation
# Go to: https://github.com/settings/installations
# Verify ImgBot has access to codecave repository

# Check repository permissions
# Ensure ImgBot can create PRs and access files
```

## 💰 **Cost Analysis**

### **Monthly Tool Costs (Estimated)**

| Tool         | Plan                  | Monthly Cost | Annual Cost |
| ------------ | --------------------- | ------------ | ----------- |
| Doppler      | Team (5 users)        | $20          | $240        |
| ConfigCat    | Free (10K requests)   | $0           | $0          |
| Blackfire.io | Hack (10 profiles)    | $0           | $0          |
| ImgBot       | Free                  | $0           | $0          |
| CodeScene    | Open Source           | $0           | $0          |
| Sentry       | Developer ($26/month) | $26          | $312        |
| **Total**    |                       | **$46**      | **$552**    |

### **ROI Benefits**

- **Security**: Secure secret management ($0 data breach cost)
- **Performance**: 20-30% faster load times (better user retention)
- **Reliability**: 99.9% uptime (reduced lost revenue)
- **Developer Productivity**: 50% faster deployments
- **Code Quality**: Reduced technical debt and maintenance costs

## 📈 **Expected Benefits**

### **Doppler Benefits**

- 🔒 **Security**: No secrets in code or environment files
- 🚀 **Productivity**: Instant environment switching
- 👥 **Collaboration**: Team-wide secret management
- 📊 **Compliance**: Secret access audit logs
- 🔄 **Reliability**: Fallback secret injection

### **Third-Party Tool Benefits**

#### **ConfigCat**

- 🎯 **Safe Deployments**: Instant feature rollback
- 📊 **A/B Testing**: Data-driven feature decisions
- 👥 **Targeted Releases**: User segment-based features

#### **Blackfire.io**

- ⚡ **Performance**: Identify bottlenecks
- 📈 **Optimization**: Track performance improvements
- 🔍 **Debugging**: Deep code profiling

#### **ImgBot**

- 🚀 **Speed**: Faster page loads
- 💾 **Storage**: Reduced bandwidth costs
- 📱 **Mobile**: Better mobile experience

#### **CodeScene**

- 🧹 **Quality**: Reduced technical debt
- 📊 **Insights**: Code complexity analysis
- 🎯 **Focus**: Prioritized refactoring

---

**💡 Pro Tip**: Start with Doppler and ConfigCat for immediate security and deployment benefits, then add other tools incrementally based on your team's needs.

**Last Updated**: January 2025
