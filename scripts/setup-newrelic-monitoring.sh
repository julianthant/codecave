#!/bin/bash
# Setup New Relic APM + Infrastructure Monitoring
# ==============================================

set -e

echo "🔍 Setting up New Relic Monitoring for CodeCave"
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

print_info "Step 1: New Relic Account Setup"
echo "-------------------------------"
echo "1. Go to: https://newrelic.com/signup"
echo "2. Create free account (100GB/month free)"
echo "3. Go to 'API Keys' in user menu"
echo "4. Copy your 'Ingest - License' key"
echo
read -p "Enter your New Relic License Key: " NEW_RELIC_LICENSE_KEY

if [ -z "$NEW_RELIC_LICENSE_KEY" ]; then
    print_error "License key is required"
    exit 1
fi

print_status "License key received"

print_info "Step 2: Adding New Relic to Doppler"
echo "-----------------------------------"
print_info "Adding NEW_RELIC_LICENSE_KEY to Doppler..."

# Add to Doppler
if command -v doppler &> /dev/null; then
    doppler secrets set NEW_RELIC_LICENSE_KEY="$NEW_RELIC_LICENSE_KEY"
    print_status "Added to Doppler successfully"
else
    print_warning "Doppler CLI not found. Add manually:"
    echo "NEW_RELIC_LICENSE_KEY=$NEW_RELIC_LICENSE_KEY"
fi

print_info "Step 3: Installing New Relic APM Package"
echo "---------------------------------------"

# Add New Relic APM to the API package
cd apps/api
print_info "Installing @newrelic/native-metrics package..."
pnpm add @newrelic/native-metrics newrelic

print_status "New Relic packages installed"

# Create New Relic configuration
print_info "Creating New Relic configuration..."
cat > newrelic.js << 'EOF'
'use strict'

/**
 * New Relic agent configuration for CodeCave API
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['CodeCave API'],
  
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  
  /**
   * Logging level. 'trace' is most useful to New Relic when diagnosing
   * issues with the agent, 'info' and higher will impose the least overhead on
   * production applications.
   */
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when
     * diagnosing issues with the agent, 'info' and higher will impose the
     * least overhead on production applications.
     */
    level: process.env.NODE_ENV === 'production' ? 'info' : 'trace'
  },
  
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  
  /**
   * Attributes captured and sent with every event.
   */
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations.
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*'
    ]
  },
  
  /**
   * Configuration for database monitoring.
   */
  database_name_reporting: {
    enabled: true
  },
  
  /**
   * Configuration for distributed tracing.
   */
  distributed_tracing: {
    /**
     * Enables/disables distributed tracing.
     */
    enabled: true
  },
  
  /**
   * Configuration for application logging features.
   */
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true,
      max_samples_stored: 10000
    },
    metrics: {
      enabled: true
    },
    local_decorating: {
      enabled: true
    }
  }
}
EOF

print_status "New Relic configuration created"

cd ../..

print_info "Step 4: Updating API Dockerfile for New Relic"
echo "--------------------------------------------"

# Update Dockerfile to include New Relic
print_info "Adding New Relic to production Dockerfile..."

# Add New Relic startup to package.json
cd apps/api
print_info "Updating start script to include New Relic..."

# Update package.json start:prod script
if command -v jq &> /dev/null; then
    cp package.json package.json.backup
    jq '.scripts["start:prod"] = "node -r newrelic dist/main"' package.json > package.json.tmp && mv package.json.tmp package.json
    print_status "Updated start:prod script"
else
    print_warning "jq not found. Manual update needed:"
    echo 'Change "start:prod": "node dist/main" to "start:prod": "node -r newrelic dist/main"'
fi

cd ../..

print_info "Step 5: Adding New Relic Environment Variables"
echo "---------------------------------------------"

print_info "Environment variables needed in production:"
echo "NEW_RELIC_LICENSE_KEY=$NEW_RELIC_LICENSE_KEY"
echo "NEW_RELIC_APP_NAME=CodeCave API"
echo "NEW_RELIC_LOG_LEVEL=info"

print_info "Step 6: Infrastructure Agent Configuration"
echo "----------------------------------------"

# Update New Relic infrastructure config
print_info "Updating infrastructure agent configuration..."
cat > infra/newrelic/newrelic-infra.yml << EOF
# New Relic Infrastructure Agent Configuration
license_key: ${NEW_RELIC_LICENSE_KEY}

# Enable infrastructure monitoring
enable_process_metrics: true
enable_docker_containers: true

# Custom attributes for this host
custom_attributes:
  environment: production
  service: codecave
  team: platform
  region: sfo3

# Log forwarding
log_forwarder:
  enabled: true
  sources:
    - name: docker-logs
      pattern: '/var/log/docker/containers/*/*.log'
      attributes:
        service: docker
        environment: production

# Process monitoring
process_monitoring:
  enabled: true
EOF

print_status "Infrastructure agent configured"

print_info "Step 7: Testing New Relic Setup Locally"
echo "--------------------------------------"

print_info "Building Docker image with New Relic..."
if docker build -f apps/api/Dockerfile.prod -t codecave-api-newrelic:test .; then
    print_status "Docker build successful with New Relic"
else
    print_error "Docker build failed"
    exit 1
fi

print_info "Step 8: Deploying to Production"
echo "------------------------------"

print_warning "Ready to deploy to production with New Relic monitoring?"
echo "This will:"
echo "1. Update the production container with New Relic APM"
echo "2. Start infrastructure monitoring"
echo "3. Enable distributed tracing"
echo "4. Set up custom dashboards"
echo
read -p "Deploy now? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deploying to production..."
    
    # Deploy with New Relic
    ./scripts/deploy-backend-to-droplet.sh
    
    print_status "Deployment complete!"
else
    print_info "Deployment skipped. Run './scripts/deploy-backend-to-droplet.sh' when ready."
fi

print_info "Step 9: New Relic Dashboard Setup"
echo "--------------------------------"

echo "🎯 Next steps in New Relic UI:"
echo "1. Go to https://one.newrelic.com/nr1-core"
echo "2. Look for 'CodeCave API' in APM & Services"
echo "3. Create custom dashboard for:"
echo "   • API endpoint performance"
echo "   • Database query performance"
echo "   • Error rates by endpoint"
echo "   • Infrastructure metrics"
echo "4. Set up alerts for:"
echo "   • High error rates (>5%)"
echo "   • Slow API responses (>500ms)"
echo "   • High memory usage (>80%)"
echo "   • Database connection issues"

echo
print_status "🎉 New Relic monitoring setup complete!"
echo
echo "📊 Your monitoring stack now includes:"
echo "✅ Sentry - Error tracking & performance"
echo "✅ New Relic APM - Application performance monitoring"
echo "✅ New Relic Infrastructure - System monitoring"
echo "✅ Digital Ocean - Basic infrastructure metrics"
echo "✅ Built-in health checks - Liveness/readiness probes"
echo
echo "🔍 Key URLs:"
echo "• New Relic Dashboard: https://one.newrelic.com"
echo "• API Health: http://api.codecave.tech/health"
echo "• Sentry Dashboard: https://sentry.io"
echo
echo "💡 Pro tip: Set up custom alerts in New Relic for proactive monitoring!" 