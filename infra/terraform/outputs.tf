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

# Database Information - REMOVED
# Database functionality migrated to Supabase
# Connection details managed via Doppler environment variables

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
    vpc_id       = digitalocean_vpc.codecave.id
    environment  = var.environment
    region       = var.droplet_region
    database     = "Supabase (managed)"
  }
}

# Spaces Storage Information
output "spaces_bucket_name" {
  description = "Name of the Spaces storage bucket"
  value       = digitalocean_spaces_bucket.codecave_storage.name
}

output "spaces_bucket_region" {
  description = "Region of the Spaces storage bucket"
  value       = digitalocean_spaces_bucket.codecave_storage.region
}

output "spaces_bucket_domain" {
  description = "Domain name of the Spaces bucket"
  value       = digitalocean_spaces_bucket.codecave_storage.bucket_domain_name
}

output "spaces_endpoint" {
  description = "S3-compatible endpoint for Spaces"
  value       = "https://${digitalocean_spaces_bucket.codecave_storage.region}.digitaloceanspaces.com"
}

# output "spaces_cdn_endpoint" {
#   description = "CDN endpoint for faster file delivery"
#   value       = digitalocean_cdn.codecave_storage_cdn.endpoint
# } 