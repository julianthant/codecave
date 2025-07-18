# DigitalOcean CDN Configuration for CodeCave
# This provides global content delivery and caching for better performance

resource "digitalocean_cdn" "codecave_cdn" {
  origin           = "${digitalocean_spaces_bucket.codecave_storage.name}.${digitalocean_spaces_bucket.codecave_storage.region}.digitaloceanspaces.com"
  
  # TTL (Time To Live) settings for different content types
  ttl = 3600  # 1 hour default cache
  
  # Note: Custom domain removed since DNS is managed externally
  # You'll create a CNAME record manually: cdn.codecave.tech -> CDN endpoint
}

# Note: CDN uses Spaces bucket as origin for static content delivery
# This is the standard approach for CDN - serving static files, images, etc.
# For API caching, consider using a dedicated API caching solution instead

# Output the CDN endpoint for reference
output "cdn_endpoint" {
  description = "CDN endpoint URL (use this in your external DNS CNAME record)"
  value       = digitalocean_cdn.codecave_cdn.endpoint
}

output "cdn_origin" {
  description = "CDN origin (Spaces bucket)"
  value       = digitalocean_cdn.codecave_cdn.origin
}

output "cdn_setup_instructions" {
  description = "Instructions for setting up CDN with external DNS"
  value = "Add this CNAME record to your DNS provider: cdn.codecave.tech -> ${digitalocean_cdn.codecave_cdn.endpoint}"
} 