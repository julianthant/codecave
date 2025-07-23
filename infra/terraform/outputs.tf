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

# Database outputs
output "database_cluster_id" {
  description = "ID of the main database cluster"
  value       = digitalocean_database_cluster.codecave_postgres.id
  sensitive   = true
}

output "database_host" {
  description = "Database host"
  value       = digitalocean_database_cluster.codecave_postgres.host
  sensitive   = true
}

output "database_port" {
  description = "Database port"
  value       = digitalocean_database_cluster.codecave_postgres.port
}

output "database_name" {
  description = "Database name"
  value       = digitalocean_database_db.codecave_main.name
}

output "database_user" {
  description = "Database user"
  value       = digitalocean_database_user.codecave_app_user.name
  sensitive   = true
}

output "database_password" {
  description = "Database password"
  value       = digitalocean_database_user.codecave_app_user.password
  sensitive   = true
}

output "database_connection_string" {
  description = "Main database connection string"
  value       = digitalocean_database_cluster.codecave_postgres.uri
  sensitive   = true
}

# Write Pool Connection (Main Database)
output "database_write_pool_connection_string" {
  description = "Write pool connection string for the main database"
  value       = digitalocean_database_connection_pool.codecave_write_pool.uri
  sensitive   = true
}

# Read Replica Connection Strings (Direct Connection)
output "database_read_replica_primary_host" {
  description = "Read replica primary host"
  value       = digitalocean_database_replica.codecave_read_replica_primary.host
  sensitive   = true
}

output "database_read_replica_primary_connection_string" {
  description = "Read replica primary connection string"
  value       = digitalocean_database_replica.codecave_read_replica_primary.uri
  sensitive   = true
}

output "database_read_replica_east_host" {
  description = "Read replica east host"
  value       = digitalocean_database_replica.codecave_read_replica_east.host
  sensitive   = true
}

output "database_read_replica_east_connection_string" {
  description = "Read replica east connection string"
  value       = digitalocean_database_replica.codecave_read_replica_east.uri
  sensitive   = true
}

# Database Configuration Summary
output "database_replica_info" {
  description = "Database replica configuration summary"
  value = {
    primary_region = var.region
    replica_regions = ["sfo3", "nyc1"]
    write_pool_size = 20
    read_replicas_count = 2
    connection_method = "direct" # Read replicas use direct connections
    total_databases = 3 # 1 main + 2 replicas
  }
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