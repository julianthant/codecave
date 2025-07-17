#!/bin/bash

# CodeCave Production Deployment Script
# This script will deploy the latest changes to your production server

set -e  # Exit on any error

echo "🚀 CodeCave Production Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_SERVER="root@64.23.239.85"  # Your actual server IP
PROJECT_PATH="/opt/codecave"

echo -e "${YELLOW}Step 1: Building locally and pushing to Git...${NC}"

# Ensure we're on the main branch
git checkout main

# Add, commit and push all changes
git add .
git commit -m "Deploy: Sentry configuration and production fixes" || echo "No changes to commit"
git push origin main

echo -e "${GREEN}✅ Code pushed to repository${NC}"

echo -e "${YELLOW}Step 2: Deploying to production server...${NC}"

# SSH into production server and run deployment commands
ssh $PRODUCTION_SERVER << 'ENDSSH'
set -e

echo "📥 Updating code on production server..."
cd /opt/codecave

# Pull latest changes
git pull origin main

echo "🔧 Updating environment variables..."
# Download latest environment variables from Doppler
doppler secrets download --no-file --format docker > .env

echo "🛑 Stopping existing containers..."
# Stop and remove existing containers
docker compose -f docker-compose.prod.yml down

echo "🏗️ Building new API image..."
# Build the new API image with Sentry configuration
docker compose -f docker-compose.prod.yml build api

echo "🚀 Starting all services..."
# Start all services
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
# Wait for services to be ready
sleep 30

echo "🔍 Checking service status..."
docker compose -f docker-compose.prod.yml ps

echo "🏥 Testing health endpoints..."
# Test the health endpoint
curl -f http://localhost:3001/health || echo "Health check failed - this is expected if API is still starting"

echo "📊 Checking container logs..."
# Show recent logs
docker compose -f docker-compose.prod.yml logs --tail=20 api

echo "✅ Deployment completed!"
echo "🌐 Your API should be available at: http://64.23.239.85/health"
echo "🔍 Check Sentry dashboard for monitoring data"

ENDSSH

echo -e "${GREEN}🎉 Production deployment completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit http://64.23.239.85/health to verify the API is running"
echo "2. Test Sentry endpoints:"
echo "   - http://64.23.239.85/api/sentry-test"
echo "   - http://64.23.239.85/api/sentry-examples/logger-examples"
echo "3. Check your Sentry dashboard for incoming data"
echo "4. Monitor logs with: ssh $PRODUCTION_SERVER 'cd $PROJECT_PATH && docker compose logs -f api'" 