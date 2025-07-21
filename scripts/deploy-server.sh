#!/bin/bash

# Production deployment script for CodeCave
# Run this on the production server to deploy latest changes
# Pass DOPPLER_TOKEN as environment variable

set -e  # Exit on any error

echo "🚀 Starting CodeCave deployment..."

# Check if DOPPLER_TOKEN is provided
if [ -z "$DOPPLER_TOKEN" ]; then
    echo "❌ Error: DOPPLER_TOKEN environment variable not set."
    echo "💡 Usage: DOPPLER_TOKEN='dp.st.prd.xxxx' ./scripts/deploy-server.sh"
    exit 1
fi

# Check if Doppler CLI is installed
if ! command -v doppler &> /dev/null; then
    echo "❌ Error: Doppler CLI not found. Installing..."
    curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh
    echo "✅ Doppler CLI installed"
fi

# Ensure we're in the right directory with the project
DEPLOY_DIR="/root/codecave"
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "📁 Creating deployment directory..."
    mkdir -p "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

# Clone or update the repository
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/julianthant/codecave.git .
else
    echo "🔄 Pulling latest changes from main..."
    git fetch origin
    git reset --hard origin/main
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found after repository setup."
    exit 1
fi

# Prevent DOPPLER_TOKEN from being recorded in bash history
export HISTIGNORE='export DOPPLER_TOKEN*'

# Stop existing services and remove orphaned containers
echo "🛑 Stopping existing services..."
DOPPLER_TOKEN="$DOPPLER_TOKEN" doppler run -- docker compose -f docker-compose.prod.yml down --remove-orphans || true

# Clean up old images and containers
echo "🧹 Cleaning up old images..."
docker image prune -f
docker container prune -f

# Build and start services with Doppler environment injection
echo "🚀 Building and starting services..."
DOPPLER_TOKEN="$DOPPLER_TOKEN" doppler run -- docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

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
