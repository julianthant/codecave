# Droplet Information
output "droplet_id" {
  description = "ID of the application server droplet"
  value       = digitalocean_droplet.app_server.id
}

output "droplet_ip" {
  description = "Public IP address of the application server"
  value       = digitalocean_droplet.app_server.ipv4_address
}

output "droplet_private_ip" {
  description = "Private IP address of the application server"
  value       = digitalocean_droplet.app_server.ipv4_address_private
}

output "droplet_ipv6" {
  description = "IPv6 address of the application server"
  value       = digitalocean_droplet.app_server.ipv6_address
}

# Database Information
output "database_host" {
  description = "Database cluster host"
  value       = digitalocean_database_cluster.codecave_db.host
  sensitive   = true
}

output "database_port" {
  description = "Database cluster port"
  value       = digitalocean_database_cluster.codecave_db.port
}

output "database_name" {
  description = "Main database name"
  value       = digitalocean_database_db.codecave_main.name
}

output "database_username" {
  description = "Database username"
  value       = digitalocean_database_user.codecave_app.name
  sensitive   = true
}

output "database_password" {
  description = "Database password"
  value       = digitalocean_database_user.codecave_app.password
  sensitive   = true
}

output "database_connection_string" {
  description = "Full database connection string"
  value       = "postgresql://${digitalocean_database_user.codecave_app.name}:${digitalocean_database_user.codecave_app.password}@${digitalocean_database_cluster.codecave_db.host}:${digitalocean_database_cluster.codecave_db.port}/${digitalocean_database_db.codecave_main.name}?sslmode=require"
  sensitive   = true
}

# Network Information
output "vpc_id" {
  description = "VPC ID"
  value       = digitalocean_vpc.codecave.id
}

output "vpc_ip_range" {
  description = "VPC IP range"
  value       = digitalocean_vpc.codecave.ip_range
}

# Volume Information
output "data_volume_id" {
  description = "Data volume ID"
  value       = digitalocean_volume.app_data.id
}

# SSH Information
output "ssh_key_fingerprint" {
  description = "SSH key fingerprint"
  value       = digitalocean_ssh_key.codecave.fingerprint
}

# Application URLs
output "api_url" {
  description = "API URL"
  value       = "https://${var.subdomain}.${var.domain_name}"
}

output "direct_api_url" {
  description = "Direct API URL (via IP)"
  value       = "http://${digitalocean_droplet.app_server.ipv4_address}:3001"
}

# Connection Information
output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh root@${digitalocean_droplet.app_server.ipv4_address}"
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    droplet_ip   = digitalocean_droplet.app_server.ipv4_address
    database_host = digitalocean_database_cluster.codecave_db.host
    vpc_id       = digitalocean_vpc.codecave.id
    environment  = var.environment
    region       = var.droplet_region
  }
} 