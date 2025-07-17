# VPC Network for secure private communication
resource "digitalocean_vpc" "codecave" {
  name     = "${var.project_name}-${var.environment}-vpc"
  region   = var.droplet_region
  ip_range = "10.10.0.0/16"
  
  description = "VPC for CodeCave ${var.environment} environment"
} 