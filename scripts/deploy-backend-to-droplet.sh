#!/bin/bash
# Deploy Backend Application to Digital Ocean Droplet
# ==================================================

set -e

echo "🚀 Deploying CodeCave Backend to Production Droplet"
echo "==================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️ $1${NC}"; }

# Get droplet IP from Terraform
cd infra/terraform
DROPLET_IP=$(terraform output -raw droplet_ip)
cd ../..

print_info "Deploying to droplet: $DROPLET_IP"

# Wait for SSH to be ready
print_info "Waiting for SSH access..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$DROPLET_IP "echo 'SSH Ready'" 2>/dev/null; then
        print_status "SSH connection established"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts - waiting for SSH..."
    sleep 10
done

if [ $attempt -eq $max_attempts ]; then
    print_error "Could not establish SSH connection after $max_attempts attempts"
    exit 1
fi

# Create deployment package
print_info "Creating deployment package..."
tar -czf deployment.tar.gz \
    apps/api/ \
    package.json \
    pnpm-lock.yaml \
    pnpm-workspace.yaml \
    docker-compose.prod.yml

# Copy files to droplet
print_info "Copying files to droplet..."
scp -o StrictHostKeyChecking=no deployment.tar.gz root@$DROPLET_IP:/root/

# Deploy on droplet
print_info "Deploying application on droplet..."

# Create environment file with Doppler variables
print_info "Injecting Doppler environment variables..."
doppler run -- bash << 'DOPPLER_EOF'
# Create temporary env file with actual values
cat > /tmp/production.env << EOF
NODE_ENV=production
PORT=3001
DATABASE_URL=$DATABASE_URL
BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
BETTER_AUTH_URL=$BETTER_AUTH_URL
FRONTEND_URL=$FRONTEND_URL
GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
EOF
DOPPLER_EOF

# Copy environment file to droplet
scp -o StrictHostKeyChecking=no /tmp/production.env root@$DROPLET_IP:/root/.env.production
rm /tmp/production.env

ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
    set -e
    
    echo "📦 Extracting deployment package..."
    cd /root
    tar -xzf deployment.tar.gz
    
    echo "🔧 Installing dependencies..."
    # Install Node.js and pnpm if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
        apt-get install -y nodejs
    fi
    
    if ! command -v pnpm &> /dev/null; then
        npm install -g pnpm@8.15.0
    fi
    
    echo "🐳 Setting up Docker environment..."
    # Ensure Docker is running
    systemctl enable docker
    systemctl start docker
    
    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/download/2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    echo "🔨 Building production Docker image..."
    docker build -f apps/api/Dockerfile.prod -t codecave-api-prod:latest .
    
    # Stop any existing containers
    docker stop codecave-api-prod 2>/dev/null || true
    docker rm codecave-api-prod 2>/dev/null || true
    
    # Start the production API
    echo "🚀 Starting production API..."
    docker run -d \
        --name codecave-api-prod \
        --restart unless-stopped \
        -p 3001:3001 \
        --env-file .env.production \
        codecave-api-prod:latest
    
    echo "⏳ Waiting for API to start..."
    sleep 30
    
    # Test the API
    echo "🧪 Testing API health..."
    if curl -f http://localhost:3001/health/live; then
        echo "✅ API is healthy and responding"
    else
        echo "❌ API health check failed"
        docker logs codecave-api-prod
        exit 1
    fi
    
    echo "🎉 Backend deployment completed successfully!"
    
    # Show running containers
    echo "📊 Running containers:"
    docker ps
    
    # Show API logs
    echo "📝 Recent API logs:"
    docker logs --tail 20 codecave-api-prod
    
EOF

# Clean up local deployment file
rm deployment.tar.gz

print_status "Backend deployment completed!"

# Test the deployment
print_info "Testing deployed backend..."
if curl -f http://$DROPLET_IP:3001/health/live; then
    print_status "✅ Backend is responding directly"
else
    print_warning "⚠️ Backend not responding yet (may need a few more seconds)"
fi

echo
echo "🎯 Backend Deployment Summary"
echo "============================"
echo "Droplet IP: $DROPLET_IP"
echo "API Port: 3001"
echo "Health Check: http://$DROPLET_IP:3001/health/live"
echo "Backend Logs: ssh root@$DROPLET_IP 'docker logs codecave-api-prod'" 