#!/bin/bash

# CodeCave Development Environment Setup
# Following Docker Compose and Context7 best practices for development

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker Compose is available"
}

# Validate Docker Compose configuration
validate_compose() {
    print_status "Validating Docker Compose configuration..."
    
    if ! docker-compose -f docker-compose.yml config --quiet; then
        print_error "docker-compose.yml configuration is invalid"
        exit 1
    fi

    if [ -f "docker-compose.dev.yml" ]; then
        if ! docker-compose -f docker-compose.dev.yml config --quiet; then
            print_error "docker-compose.dev.yml configuration is invalid"
            exit 1
        fi
    fi

    print_success "Docker Compose configuration is valid"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Created .env file from env.example"
        else
            print_warning "No env.example file found. Creating basic .env file..."
            cat > .env << EOF
# Development Environment Variables
NODE_ENV=development
POSTGRES_DB=codecave_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
MEILI_MASTER_KEY=development_key_for_local_only
RABBITMQ_USER=admin
RABBITMQ_PASS=admin
EOF
            print_success "Created basic .env file"
        fi
    else
        print_success ".env file already exists"
    fi
}

# Clean up existing containers and volumes
cleanup_existing() {
    print_status "Cleaning up existing containers and volumes..."
    
    # Stop and remove containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Remove development volumes if they exist
    docker volume rm codecave_postgres_dev_data 2>/dev/null || true
    docker volume rm codecave_redis_dev_data 2>/dev/null || true
    docker volume rm codecave_meilisearch_dev_data 2>/dev/null || true
    docker volume rm codecave_rabbitmq_dev_data 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start core infrastructure services
    docker-compose up -d db redis search mq
    
    print_status "Waiting for services to become healthy..."
    
    # Wait for database
    print_status "Waiting for PostgreSQL..."
    timeout 60 bash -c 'until docker-compose exec -T db pg_isready -U postgres; do sleep 2; done'
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout 60 bash -c 'until docker-compose exec -T redis redis-cli ping; do sleep 2; done'
    
    # Wait for Meilisearch
    print_status "Waiting for Meilisearch..."
    timeout 60 bash -c 'until curl -s http://localhost:7700/health; do sleep 2; done'
    
    # Wait for RabbitMQ
    print_status "Waiting for RabbitMQ..."
    timeout 60 bash -c 'until docker-compose exec -T mq rabbitmq-diagnostics -q ping; do sleep 2; done'
    
    print_success "All infrastructure services are healthy"
}

# Display service information
show_services() {
    print_success "Development environment is ready!"
    echo
    echo "🌐 Service URLs:"
    echo "  • PostgreSQL: localhost:5432 (postgres/postgres)"
    echo "  • Redis: localhost:6379"
    echo "  • Meilisearch: http://localhost:7700"
    echo "  • RabbitMQ Management: http://localhost:15672 (admin/admin)"
    echo
    echo "🔧 Useful commands:"
    echo "  • Start API: docker-compose up api"
    echo "  • View logs: docker-compose logs -f [service]"
    echo "  • Shell access: docker-compose exec [service] bash"
    echo "  • Stop all: docker-compose down"
    echo
    echo "📊 Current status:"
    docker-compose ps
}

# Main setup function
main() {
    echo "🚀 CodeCave Development Environment Setup"
    echo "========================================"
    echo
    
    # Pre-flight checks
    check_docker
    check_docker_compose
    validate_compose
    
    # Setup
    setup_environment
    
    # Ask for cleanup confirmation
    echo
    read -p "Do you want to clean up existing containers and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup_existing
    fi
    
    # Start services
    start_infrastructure
    
    # Show final status
    show_services
    
    print_success "Setup completed successfully!"
}

# Run main function
main "$@"
