#!/bin/bash

# CodeCave Production Health Check with Doppler Integration
# Comprehensive service health verification for Digital Ocean deployment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Track overall health status
OVERALL_HEALTH=0
SERVICE_COUNT=0
HEALTHY_COUNT=0

# Function to check Doppler health
check_doppler_health() {
    print_status "Checking Doppler CLI installation..."
    
    if ! command -v doppler >/dev/null 2>&1; then
        print_error "Doppler CLI is not installed"
        return 1
    fi
    
    print_success "Doppler CLI is installed"
    
    # Check Doppler configuration
    print_status "Checking Doppler configuration..."
    
    local project=$(doppler configure get project 2>/dev/null || echo "not-configured")
    local config=$(doppler configure get config 2>/dev/null || echo "not-configured")
    
    if [[ "$project" != "codecave" ]]; then
        print_error "Doppler project not configured correctly: $project (expected: codecave)"
        return 1
    fi
    
    if [[ "$config" != "prd_all" && "$config" != "dev" ]]; then
        print_warning "Doppler config: $config (expected: prd_all for production or dev for development)"
    fi
    
    # Test Doppler connectivity
    print_status "Testing Doppler API connectivity..."
    
    if doppler secrets --only-names >/dev/null 2>&1; then
        local secret_count=$(doppler secrets --only-names 2>/dev/null | wc -l)
        print_success "Doppler API connectivity OK ($secret_count secrets available)"
        return 0
    else
        print_error "Cannot connect to Doppler API or access secrets"
        return 1
    fi
}

# Function to check service health
check_service_health() {
    local service_name=$1
    local health_command=$2
    local port=$3
    local description=$4
    
    SERVICE_COUNT=$((SERVICE_COUNT + 1))
    print_status "Checking $description..."
    
    # Check if container is running
    if ! docker-compose ps "$service_name" | grep -q "Up"; then
        print_error "$service_name container is not running"
        return 1
    fi
    
    # Check port accessibility if provided
    if [ -n "$port" ]; then
        if ! nc -z localhost "$port" 2>/dev/null; then
            print_error "$service_name port $port is not accessible"
            return 1
        fi
    fi
    
    # Execute health command
    if eval "$health_command" >/dev/null 2>&1; then
        print_success "$description is healthy"
        HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
        return 0
    else
        print_error "$description health check failed"
        return 1
    fi
}

# Function to check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}
    
    SERVICE_COUNT=$((SERVICE_COUNT + 1))
    print_status "Checking $description..."
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_code" ]; then
            print_success "$description is responding (HTTP $response)"
            HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
            return 0
        else
            print_error "$description returned HTTP $response (expected $expected_code)"
            return 1
        fi
    else
        print_error "$description is not responding"
        return 1
    fi
}

# Main health check function
main() {
    echo "🏥 CodeCave Production Health Check with Doppler"
    echo "================================================"
    echo "Timestamp: $(date)"
    echo "Environment: Production (Digital Ocean)"
    echo
    
    # 1. Check Doppler integration first
    echo "🔐 Doppler Integration Health"
    echo "----------------------------"
    if check_doppler_health; then
        print_success "Doppler integration is healthy"
    else
        print_error "Doppler integration has issues"
        OVERALL_HEALTH=1
    fi
    echo
    
    # Check if Docker is running
    print_status "Checking Docker daemon..."
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    print_success "Docker daemon is running"
    echo
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in current directory"
        exit 1
    fi
    
    # Check Docker Compose configuration
    print_status "Validating Docker Compose configuration..."
    if docker-compose config --quiet; then
        print_success "Docker Compose configuration is valid"
    else
        print_error "Docker Compose configuration is invalid"
        exit 1
    fi
    echo
    
    # Check individual services
    echo "🔍 Service Health Checks:"
    echo "-------------------------"
    
    # PostgreSQL
    check_service_health "db" \
        "docker-compose exec -T db pg_isready -U postgres" \
        "5432" \
        "PostgreSQL Database"
    
    # Redis
    check_service_health "redis" \
        "docker-compose exec -T redis redis-cli ping | grep -q PONG" \
        "6379" \
        "Redis Cache"
    
    # Meilisearch
    check_http_endpoint "http://localhost:7700/health" "Meilisearch Search Engine"
    
    # RabbitMQ
    check_service_health "mq" \
        "docker-compose exec -T mq rabbitmq-diagnostics -q ping" \
        "5672" \
        "RabbitMQ Message Queue"
    
    # RabbitMQ Management Interface
    check_http_endpoint "http://localhost:15672" "RabbitMQ Management UI"
    
    # Kong Gateway (if running)
    if docker-compose ps gateway | grep -q "Up"; then
        check_http_endpoint "http://localhost:8001" "Kong Admin API"
        check_http_endpoint "http://localhost:8002" "Kong Admin GUI"
    else
        print_warning "Kong Gateway is not running (this is normal for infrastructure-only setup)"
    fi
    
    # API Service (if running)
    if docker-compose ps api | grep -q "Up"; then
        check_http_endpoint "http://localhost:3001/health" "NestJS API"
    else
        print_warning "API service is not running (this is normal for development)"
    fi
    
    echo
    echo "📊 Health Summary:"
    echo "------------------"
    echo "Services checked: $SERVICE_COUNT"
    echo "Services healthy: $HEALTHY_COUNT"
    echo "Services failing: $((SERVICE_COUNT - HEALTHY_COUNT))"
    
    if [ "$HEALTHY_COUNT" -eq "$SERVICE_COUNT" ]; then
        print_success "All services are healthy! 🎉"
        echo
        echo "🌐 Service URLs:"
        echo "  • PostgreSQL: localhost:5432"
        echo "  • Redis: localhost:6379"
        echo "  • Meilisearch: http://localhost:7700"
        echo "  • RabbitMQ Management: http://localhost:15672"
        
        if docker-compose ps api | grep -q "Up"; then
            echo "  • API: http://localhost:3001"
        fi
        
        if docker-compose ps gateway | grep -q "Up"; then
            echo "  • Kong Admin: http://localhost:8001"
            echo "  • Kong GUI: http://localhost:8002"
        fi
        
        OVERALL_HEALTH=0
    else
        print_error "Some services are unhealthy"
        echo
        echo "🔧 Troubleshooting steps:"
        echo "  1. Check service logs: docker-compose logs [service]"
        echo "  2. Restart failing services: docker-compose restart [service]"
        echo "  3. Check port conflicts: netstat -tulpn | grep [port]"
        echo "  4. Rebuild if needed: docker-compose up -d --build"
        OVERALL_HEALTH=1
    fi
    
    echo
    echo "📋 Container Status:"
    docker-compose ps
    
    exit $OVERALL_HEALTH
}

# Run main function
main "$@"
