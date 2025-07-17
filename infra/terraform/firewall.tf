# Firewall for web server
resource "digitalocean_firewall" "web" {
  name = "${var.project_name}-${var.environment}-web-firewall"

  droplet_ids = [digitalocean_droplet.app_server.id]

  # SSH access
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # API port (if needed for direct access)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3001"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Kong API Gateway ports
  inbound_rule {
    protocol         = "tcp"
    port_range       = "8000"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "8001"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Database access (PostgreSQL) - only from VPC
  inbound_rule {
    protocol           = "tcp"
    port_range         = "5432"
    source_addresses   = [digitalocean_vpc.codecave.ip_range]
  }

  # Redis access - only from VPC
  inbound_rule {
    protocol           = "tcp"
    port_range         = "6379"
    source_addresses   = [digitalocean_vpc.codecave.ip_range]
  }

  # RabbitMQ access - only from VPC
  inbound_rule {
    protocol           = "tcp"
    port_range         = "5672"
    source_addresses   = [digitalocean_vpc.codecave.ip_range]
  }

  # RabbitMQ Management UI - only from VPC
  inbound_rule {
    protocol           = "tcp"
    port_range         = "15672"
    source_addresses   = [digitalocean_vpc.codecave.ip_range]
  }

  # Meilisearch - only from VPC
  inbound_rule {
    protocol           = "tcp"
    port_range         = "7700"
    source_addresses   = [digitalocean_vpc.codecave.ip_range]
  }

  # Allow all outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
} 