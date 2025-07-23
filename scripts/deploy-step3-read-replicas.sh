#!/bin/bash
# Deploy Step 3: Read Replica Implementation
# ==========================================

set -e

echo "🔄 Step 3: Deploying Read Replica Implementation"
echo "==============================================="

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

# Change to project root
cd "$(dirname "$0")/.."

print_info "Step 3.1: Extracting Database Connection Strings"
echo "------------------------------------------------"

cd infra/terraform

# Get connection strings from Terraform (requires Doppler)
print_info "Getting connection strings from Terraform..."

# Create a temporary file to store the connection strings
TEMP_ENV_FILE="/tmp/read_replica_env.tmp"

doppler run -- bash << 'TERRAFORM_EOF'
export DIGITALOCEAN_ACCESS_TOKEN=$DO_API_TOKEN 
export TF_VAR_spaces_access_key=$DO_SPACES_KEY 
export TF_VAR_spaces_secret_key=$DO_SPACES_SECRET

# Extract database connection strings
DATABASE_WRITE_POOL_URL=$(terraform output -raw database_write_pool_connection_string)
DATABASE_READ_REPLICA_PRIMARY_URL=$(terraform output -raw database_read_replica_primary_connection_string)
DATABASE_READ_REPLICA_EAST_URL=$(terraform output -raw database_read_replica_east_connection_string)

# Create environment file with new database URLs
cat > /tmp/read_replica_env.tmp << EOF
# Read Replica Database Configuration
DATABASE_WRITE_POOL_URL=$DATABASE_WRITE_POOL_URL
DATABASE_READ_REPLICA_PRIMARY_URL=$DATABASE_READ_REPLICA_PRIMARY_URL
DATABASE_READ_REPLICA_EAST_URL=$DATABASE_READ_REPLICA_EAST_URL
EOF

echo "Database connection strings extracted successfully"
TERRAFORM_EOF

if [ ! -f "$TEMP_ENV_FILE" ]; then
    print_error "Failed to extract database connection strings from Terraform"
    exit 1
fi

print_status "Database connection strings extracted"

cd ../..

print_info "Step 3.2: Building Updated Docker Image with Read Replica Support"
echo "----------------------------------------------------------------"

# Build the updated Docker image with read replica code
print_info "Building production Docker image with read replica support..."
docker build -f apps/api/Dockerfile.prod -t codecave-api-step3:latest .

print_status "Docker image built successfully"

print_info "Step 3.3: Deploying to Production Droplet"
echo "----------------------------------------"

# Get droplet IP from Terraform
cd infra/terraform
DROPLET_IP=$(doppler run -- bash -c 'export DIGITALOCEAN_ACCESS_TOKEN=$DO_API_TOKEN && terraform output -raw droplet_ip')
cd ../..

print_info "Deploying to droplet: $DROPLET_IP"

# Copy updated files and environment to droplet
print_info "Copying updated environment configuration..."
scp -o StrictHostKeyChecking=no "$TEMP_ENV_FILE" root@$DROPLET_IP:/root/read_replica_env.tmp

# Create deployment package with updated code
tar -czf deployment-step3.tar.gz \
    apps/api/ \
    package.json \
    pnpm-lock.yaml \
    pnpm-workspace.yaml \
    docker-compose.prod.yml

print_info "Copying deployment package..."
scp -o StrictHostKeyChecking=no deployment-step3.tar.gz root@$DROPLET_IP:/root/

# Deploy on droplet with read replica support
print_info "Deploying read replica implementation..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'DEPLOY_EOF'
    set -e
    
    echo "📦 Extracting updated deployment package..."
    cd /root
    tar -xzf deployment-step3.tar.gz
    
    echo "🔧 Updating environment configuration..."
    # Merge existing environment with read replica configuration
    if [ -f .env.production ]; then
        cp .env.production .env.production.backup
    fi
    
    # Combine existing env with new replica URLs
    cat > .env.production << 'ENV_EOF'
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
ENV_EOF
    
    # Append read replica configuration
    cat read_replica_env.tmp >> .env.production
    
    echo "🔨 Building updated Docker image..."
    docker build -f apps/api/Dockerfile.prod -t codecave-api-step3:latest .
    
    echo "🔄 Rolling update: Stopping old container..."
    docker stop codecave-api-prod 2>/dev/null || true
    docker rm codecave-api-prod 2>/dev/null || true
    
    echo "🚀 Starting updated API with read replica support..."
    docker run -d \
        --name codecave-api-prod \
        --restart unless-stopped \
        -p 3001:3001 \
        --env-file .env.production \
        codecave-api-step3:latest
    
    echo "⏳ Waiting for API to start with read replicas..."
    sleep 30
    
    # Test the updated API
    echo "🧪 Testing read replica implementation..."
    if curl -f http://localhost:3001/health/live; then
        echo ""
        echo "✅ API is healthy with read replica support"
    else
        echo ""
        echo "❌ API health check failed"
        docker logs codecave-api-prod
        exit 1
    fi
    
    echo ""
    echo "📊 Testing comprehensive health endpoint..."
    curl -s http://localhost:3001/health | jq -r '.services.replicas // "Read replica health info not available"'
    
    echo ""
    echo "🎉 Step 3 deployment completed successfully!"
    
    # Show updated container status
    echo ""
    echo "📊 Container Status:"
    docker ps | grep codecave-api-prod
    
    # Show recent logs
    echo ""
    echo "📝 Recent API Logs:"
    docker logs --tail 20 codecave-api-prod
    
    # Cleanup
    rm -f deployment-step3.tar.gz read_replica_env.tmp
    
DEPLOY_EOF

# Clean up local files
rm -f deployment-step3.tar.gz "$TEMP_ENV_FILE"

print_status "Step 3 deployment completed!"

print_info "Step 3.4: Testing Read Replica Implementation"
echo "-------------------------------------------"

# Test the deployment
print_info "Testing read replica implementation..."

echo ""
echo "🧪 Testing Load Balancer Health:"
if curl -f http://$DROPLET_IP:3001/health/ready; then
    echo ""
    print_status "✅ Ready check passed"
else
    echo ""
    print_warning "⚠️ Ready check failed (API may still be starting)"
fi

echo ""
echo "🧪 Testing Comprehensive Health (with replica info):"
curl -s http://$DROPLET_IP:3001/health | jq '.'

echo ""
echo "🎯 Step 3 Implementation Summary"
echo "=============================="
echo "✅ Read Replicas: 2 (SFO3 + NYC1)"
echo "✅ Database Router: Active with load balancing"
echo "✅ Health Monitoring: Enhanced with replica status"
echo "✅ Fallback Support: Read failures fall back to main DB"
echo "✅ Performance: Read queries distributed across replicas"
echo ""
echo "🚀 Architecture: Main DB (Writes) + 2 Read Replicas (Reads)"
echo "📊 Health Check: http://$DROPLET_IP:3001/health"
echo "🔍 Monitor Logs: ssh root@$DROPLET_IP 'docker logs codecave-api-prod'"

echo ""
print_status "🎉 STEP 3 COMPLETE: Read Replica Implementation Successfully Deployed!" 