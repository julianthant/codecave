# ============================================================
# DIGITAL OCEAN LOAD BALANCER CONFIGURATION
# ============================================================
# Provides health checks and traffic distribution
# ============================================================

# Load Balancer for API
resource "digitalocean_loadbalancer" "api_lb" {
  name     = "${var.project_name}-api-lb-${var.environment}"
  region   = var.droplet_region
  size     = "lb-small"
  vpc_uuid = digitalocean_vpc.codecave.id  # Ensure same VPC as droplet

  # Forward HTTP traffic to backend
  forwarding_rule {
    entry_protocol  = "http"
    entry_port      = 80
    target_protocol = "http"
    target_port     = 3001
    tls_passthrough = false
  }

  # Health check configuration
  healthcheck {
    protocol                 = "http"
    port                     = 3001
    path                     = "/health/ready"
    check_interval_seconds   = 10
    response_timeout_seconds = 5
    unhealthy_threshold      = 3
    healthy_threshold        = 2
  }

  # Droplet IDs to balance traffic to
  droplet_ids = [digitalocean_droplet.app_server.id]

  # Sticky sessions disabled for API (stateless)
  sticky_sessions {
    type = "none"
  }

  # Enable to distribute traffic to droplets in multiple regions
  enable_proxy_protocol = false

  # Firewall configuration
  enable_backend_keepalive = true
}

# Firewall rule to allow Load Balancer traffic to droplet
resource "digitalocean_firewall" "lb_to_droplet" {
  name = "${var.project_name}-lb-firewall-${var.environment}"

  droplet_ids = [digitalocean_droplet.app_server.id]

  # Allow Load Balancer to reach API port
  inbound_rule {
    protocol                  = "tcp"
    port_range               = "3001"
    source_load_balancer_uids = [digitalocean_loadbalancer.api_lb.id]
  }
}

# Data source to get existing droplet for reference
data "digitalocean_droplet" "existing_api_server" {
  name = "${var.project_name}-${var.environment}-app"
}

# Output Load Balancer information
output "load_balancer_ip" {
  description = "Load Balancer public IP address"
  value       = digitalocean_loadbalancer.api_lb.ip
}

output "load_balancer_status" {
  description = "Load Balancer status"
  value       = digitalocean_loadbalancer.api_lb.status
}

output "api_lb_endpoint" {
  description = "API Load Balancer HTTP endpoint"
  value       = "http://api.codecave.tech"
} 