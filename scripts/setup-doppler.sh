#!/bin/bash

# Doppler Setup Script for CodeCave
# This script helps set up the Doppler project and configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

log "🔧 Setting up Doppler for CodeCave..."

# Check if Doppler CLI is installed
if ! command -v doppler &> /dev/null; then
    log "📦 Installing Doppler CLI..."
    curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh
    success "Doppler CLI installed"
fi

# Configure token if provided
if [ -n "$DOPPLER_TOKEN" ]; then
    log "🔐 Configuring Doppler token..."
    echo "$DOPPLER_TOKEN" | doppler configure set token --scope /
    success "Token configured"
fi

# Check authentication
log "🔍 Checking Doppler authentication..."
if ! doppler me 2>/dev/null; then
    error "Not authenticated with Doppler. Please run:"
    echo "  doppler login"
    echo "Or set DOPPLER_TOKEN environment variable"
    exit 1
fi

success "Authenticated with Doppler"

# List available projects
log "📋 Available Doppler projects:"
doppler projects || {
    error "Could not list projects. Check your authentication."
    exit 1
}

# Check if codecave project exists
if doppler projects get codecave 2>/dev/null; then
    success "Project 'codecave' already exists"
else
    log "📁 Creating project 'codecave'..."
    if doppler projects create codecave --description "CodeCave production environment"; then
        success "Project 'codecave' created"
    else
        error "Could not create project 'codecave'"
        error "You may need to create it manually in the Doppler dashboard"
        exit 1
    fi
fi

# Setup configuration
log "🔧 Setting up configuration..."
if doppler setup --project codecave --config prd_all --no-interactive 2>/dev/null; then
    success "Configuration set to codecave -> prd_all"
elif doppler setup --project codecave --config prod --no-interactive 2>/dev/null; then
    success "Configuration set to codecave -> prod"
elif doppler setup --project codecave --config production --no-interactive 2>/dev/null; then
    success "Configuration set to codecave -> production"
else
    warning "Could not setup configuration automatically"
    log "Available configs for codecave project:"
    doppler configs --project codecave 2>/dev/null || echo "No configs found"
    
    log "💡 To manually setup:"
    echo "  doppler setup"
    echo "  Select project: codecave"
    echo "  Select/create config: prd_all (or similar)"
fi

# Test configuration
log "🧪 Testing Doppler configuration..."
if doppler secrets --only-names >/dev/null 2>&1; then
    success "Doppler configuration working!"
    log "📋 Available secrets:"
    doppler secrets --only-names
else
    warning "Doppler configuration not working"
    log "Try running: doppler setup"
fi

success "🎉 Doppler setup complete!"
