# 🚨 Production Fix Guide

Your production environment needs these fixes to run the new Sentry-configured API.

## 📋 Current Issues

1. **API Container Failing**: Using generic Node image without application code
2. **Missing Nginx Config**: Nginx container failing due to missing configuration
3. **Outdated Code**: Production doesn't have the new NestJS + Sentry structure

## 🛠️ Quick Fix Options

### Option 1: Automated Deployment (Recommended)

Run the deployment script from your local machine:

```bash
# Make sure you're in the project root
cd /path/to/codecave

# Run the deployment script
./scripts/deploy-production.sh
```

### Option 2: Manual Fix (If automated doesn't work)

SSH into your production server and run these commands:

```bash
# 1. SSH to your server
ssh root@codecave.tech

# 2. Navigate to project directory
cd /opt/codecave

# 3. Pull the latest code (with new API structure)
git pull origin main

# 4. Update environment variables
doppler secrets download --no-file --format docker > .env

# 5. Stop existing containers
docker compose -f docker-compose.prod.yml down

# 6. Build the new API image
docker compose -f docker-compose.prod.yml build api

# 7. Start all services
docker compose -f docker-compose.prod.yml up -d

# 8. Check status
docker compose -f docker-compose.prod.yml ps
```

## ✅ What Will Be Fixed

1. **✅ API Container**: Now builds from proper Dockerfile with your NestJS + Sentry code
2. **✅ Nginx Config**: Created proper configuration files for production
3. **✅ Sentry Integration**: Your API will have full Sentry monitoring
4. **✅ Health Endpoints**: `/health` endpoint will work for monitoring

## 🔍 Verification Steps

After deployment, test these endpoints:

```bash
# Health check
curl http://codecave.tech/health

# Sentry test
curl http://codecave.tech/api/sentry-test

# Sentry logger examples
curl http://codecave.tech/api/sentry-examples/logger-examples
```

## 📊 Monitoring

- **Sentry Dashboard**: Check for incoming events and performance data
- **Container Logs**: `docker compose logs -f api`
- **Container Status**: `docker compose ps`

## 🚨 If Still Having Issues

1. **Check logs**: `docker compose logs api`
2. **Verify environment**: `docker compose config`
3. **Restart specific service**: `docker compose restart api`
4. **Full reset**: `docker compose down && docker compose up -d`

## 📝 What Changed

- ✅ `docker-compose.prod.yml` now builds from `Dockerfile.prod`
- ✅ Created `nginx/nginx.conf` and `nginx/sites/codecave.conf`
- ✅ API now has proper NestJS structure with Sentry
- ✅ Added deployment automation script

## 🎯 Next Steps After Fix

1. **Monitor Sentry**: Check dashboard for events
2. **Set up SSL**: Configure Let's Encrypt for HTTPS
3. **DNS**: Ensure codecave.tech points to your server IP
4. **Frontend**: Deploy Next.js app when ready 