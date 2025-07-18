#!/bin/bash

# Production deployment script for CodeCave
# Run this on the production server to deploy latest changes

set -e  # Exit on any error

echo "🚀 Starting CodeCave deployment..."

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found. Please run this from the project root."
    exit 1
fi

# Check if Doppler is installed and configured
if ! command -v doppler &> /dev/null; then
    echo "❌ Error: Doppler CLI not found. Please install it first."
    exit 1
fi

# Pull latest changes
echo "🔄 Pulling latest changes from main..."
git pull origin main

# Stop existing services
echo "🛑 Stopping existing services..."
doppler run --config=prd_all --project=codecave -- docker-compose -f docker-compose.prod.yml down || true

# Clean up old images and containers
echo "🧹 Cleaning up old images..."
docker image prune -f
docker container prune -f

# Build and start services
echo "🚀 Building and starting services..."
doppler run --config=prd_all --project=codecave -- docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Show running containers
echo "✅ Deployment complete! Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health checks
echo "🏥 Running health checks..."
sleep 5

# Check API health
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ API health check passed"
else
    echo "⚠️  API health check failed"
fi

# Check Kong gateway
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Kong gateway health check passed"
else
    echo "⚠️  Kong gateway health check failed"
fi

echo "🎉 Deployment completed!"
echo "📍 API available at: https://api.codecave.tech"
echo "🔧 Kong admin at: http://localhost:8001" 