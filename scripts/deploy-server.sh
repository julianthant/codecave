#!/bin/bash

# Production deployment script for CodeCa# Configure Doppler if DOPPLER_TOKEN is provided
if [ # Configure Doppler if DOPPLER_TOKEN is provided
if [ -n "$DOPPLER_TOKEN" ]; then
    log "🔐 Configuring Doppler with provided token..."
    echo "$DOPPLER_TOKEN" | doppler configure set token --scope / || handle_error "Doppler token configuration"
    success "Doppler token configured"
    
    # Check authentication
    log "🔍 Verifying Doppler authentication..."
    if ! doppler me >/dev/null 2>&1; then
        error "Doppler authentication failed. Token may be invalid."
        exit 1
    fi
    success "Doppler authentication verified"
    
    # List available projects for debugging
    log "📋 Available Doppler projects:"
    doppler projects 2>/dev/null || warning "Could not list projects"
    
    # Try to setup the project and config
    log "🔧 Setting up Doppler project and config..."
    
    # Check if project exists, create if not
    if ! doppler projects get codecave >/dev/null 2>&1; then
        log "📁 Creating Doppler project 'codecave'..."
        if doppler projects create codecave --description "CodeCave production environment" >/dev/null 2>&1; then
            success "Created project 'codecave'"
        else
            error "Could not create project 'codecave'. You may need to create it manually in Doppler dashboard."
            log "💡 Go to https://dashboard.doppler.com and create a project named 'codecave'"
            exit 1
        fi
    else
        success "Project 'codecave' exists"
    fi
    
    # Try to setup config - try different common names
    CONFIG_SET=false
    for config in prd_all prod production; do
        log "� Trying to setup config: $config"
        if doppler setup --project codecave --config $config --no-interactive >/dev/null 2>&1; then
            success "Successfully configured with project: codecave, config: $config"
            CONFIG_SET=true
            break
        fi
    done
    
    if [ "$CONFIG_SET" = false ]; then
        warning "Could not setup any config automatically"
        log "� Available configs for codecave:"
        doppler configs --project codecave 2>/dev/null || echo "No configs found"
        
        # Try to create the prd_all config
        log "📁 Creating config 'prd_all'..."
        if doppler configs create prd_all --project codecave >/dev/null 2>&1; then
            success "Created config 'prd_all'"
            if doppler setup --project codecave --config prd_all --no-interactive >/dev/null 2>&1; then
                success "Successfully setup project: codecave, config: prd_all"
                CONFIG_SET=true
            fi
        fi
    fi
    
    if [ "$CONFIG_SET" = false ]; then
        error "Could not setup Doppler configuration"
        error "Please manually run: doppler setup"
        error "And select project: codecave, config: prd_all"
        exit 1
    fi
    
else
    log "🔐 Checking existing Doppler configuration..."
fi

# Verify Doppler configuration
log "🔍 Verifying Doppler configuration..."
if ! doppler secrets --only-names >/dev/null 2>&1; then
    error "Doppler not configured properly."
    error "Solutions:"
    error "1. Set DOPPLER_TOKEN environment variable"
    error "2. Run 'doppler login' and 'doppler setup'"
    error "3. Ensure project 'codecave' exists in your Doppler account"
    error "4. Ensure you have access to the project"
    
    log "📋 Debugging info:"
    doppler auth status 2>/dev/null || echo "Not authenticated"
    doppler projects 2>/dev/null || echo "Could not list projects"
    
    exit 1
fi

success "Doppler configuration verified" ]; then
    log "🔐 Configuring Doppler with provided token..."
    echo "$DOPPLER_TOKEN" | doppler configure set token --scope / || handle_error "Doppler token configuration"
    success "Doppler token configured"
    
    # Check what projects are available
    log "🔍 Checking available Doppler projects..."
    if doppler projects 2>/dev/null; then
        log "✅ Successfully connected to Doppler"
    else
        warning "Could not list Doppler projects"
    fi
    
    # Try to setup the project and config if they don't exist
    log "🔧 Setting up Doppler project and config..."
    if ! doppler projects get codecave 2>/dev/null; then
        log "📁 Creating Doppler project 'codecave'..."
        if ! doppler projects create codecave 2>/dev/null; then
            warning "Could not create Doppler project. It may already exist or you may need permissions."
        fi
    fi
    
    # Setup config
    log "🔧 Setting up Doppler config..."
    if ! doppler setup --project codecave --config prd_all --no-interactive 2>/dev/null; then
        warning "Could not setup Doppler project/config automatically"
        log "💡 Available projects and configs:"
        doppler projects 2>/dev/null || echo "Could not list projects"
        
        # Try alternative common config names
        for config in prod production prd dev; do
            log "🔍 Trying config: $config"
            if doppler setup --project codecave --config $config --no-interactive 2>/dev/null; then
                log "✅ Successfully configured with project: codecave, config: $config"
                break
            fi
        done
    fi
else
    log "🔐 Checking existing Doppler configuration..."
fi

# Verify Doppler configuration
log "🔍 Verifying Doppler configuration..."
if ! doppler secrets --only-names >/dev/null 2>&1; then
    error "Doppler not configured properly. Available options:"
    error "1. Set DOPPLER_TOKEN environment variable, or"
    error "2. Run 'doppler setup' manually"
    error "3. Check if the project 'codecave' and config 'prd_all' exist in your Doppler account"
    
    log "📋 Attempting to show available projects..."
    doppler projects 2>/dev/null || echo "Could not list projects"
    
    exit 1
filer configuration and deployment
# Pass DOPPLER_TOKEN as environment variable for automated deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Function for error handling
handle_error() {
    error "Deployment failed at step: $1"
    log "🔍 Checking service status..."
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    exit 1
}

log "🚀 Starting CodeCave production deployment..."

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    error "docker-compose.prod.yml not found. Please run this from the project root."
    exit 1
fi

# Install Doppler CLI if not present
if ! command -v doppler &> /dev/null; then
    log "📦 Installing Doppler CLI..."
    curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh || handle_error "Doppler CLI installation"
    success "Doppler CLI installed successfully"
fi

# Configure Doppler if DOPPLER_TOKEN is provided
if [ -n "$DOPPLER_TOKEN" ]; then
    log "� Configuring Doppler with provided token..."
    echo "$DOPPLER_TOKEN" | doppler configure set token --scope / || handle_error "Doppler token configuration"
    success "Doppler token configured"
else
    log "🔐 Checking existing Doppler configuration..."
fi

# Verify Doppler configuration
log "� Verifying Doppler configuration..."
if ! doppler secrets --only-names --config=prd_all --project=codecave >/dev/null 2>&1; then
    error "Doppler not configured properly. Either:"
    error "1. Set DOPPLER_TOKEN environment variable, or"
    error "2. Run 'doppler setup' manually and select project: codecave, config: prd_all"
    exit 1
fi

success "Doppler configuration verified"

# Pull latest changes
log "🔄 Pulling latest changes from main..."
git pull origin main || handle_error "Git pull"

# Clean up unnecessary files for production
log "🧹 Cleaning up unnecessary files..."
if [ -f "scripts/cleanup-production.sh" ]; then
    chmod +x scripts/cleanup-production.sh
    ./scripts/cleanup-production.sh || warning "Cleanup script failed"
fi

# Validate Docker Compose configuration with Doppler
log "🔍 Validating Docker Compose configuration..."
doppler run -- docker compose -f docker-compose.prod.yml config --quiet || handle_error "Docker Compose validation"

# Stop existing services and remove orphaned containers
log "🛑 Stopping existing services..."
doppler run -- docker compose -f docker-compose.prod.yml down --remove-orphans || warning "Services were not running"

# Clean up old images and containers
log "🧹 Cleaning up Docker resources..."
docker image prune -f || handle_error "Docker cleanup"
docker container prune -f

# Build and start services with Doppler environment injection
log "🚀 Building and starting services..."
doppler run -- docker compose -f docker-compose.prod.yml up -d --build || handle_error "Service startup"

# Wait for services to start
log "⏳ Waiting for services to start..."
sleep 30

# Comprehensive health check
log "🏥 Performing comprehensive health check..."
FAILED_SERVICES=""

# Check each service health
for service in $(doppler run -- docker compose -f docker-compose.prod.yml ps --services); do
    log "Checking $service..."
    if ! doppler run -- docker compose -f docker-compose.prod.yml ps $service | grep -q "healthy\|running"; then
        FAILED_SERVICES="$FAILED_SERVICES $service"
    fi
done

if [ -n "$FAILED_SERVICES" ]; then
    error "Failed services:$FAILED_SERVICES"
    log "📋 Service logs for debugging:"
    for service in $FAILED_SERVICES; do
        log "=== $service logs ==="
        doppler run -- docker compose -f docker-compose.prod.yml logs --tail=50 $service
    done
    handle_error "Health check failed"
fi

# Show running containers
success "Deployment complete! Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Final service health summary
log "🏥 Final service health summary:"
doppler run -- docker compose -f docker-compose.prod.yml ps

# Test API health endpoint
log "🏥 Testing API health..."
sleep 5
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    success "API health check passed"
else
    warning "API health check failed"
fi

# Check Kong gateway
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    success "Kong gateway health check passed"
else
    warning "Kong gateway health check failed"
fi

success "🎉 CodeCave deployment completed successfully!"
log "📍 API available at: https://api.codecave.tech"
log "🔧 Kong admin at: http://localhost:8001" 