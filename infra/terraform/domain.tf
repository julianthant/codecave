# Domain and DNS Configuration for CodeCave
# DNS records are managed externally (not by DigitalOcean)
# This file provides outputs for manual DNS configuration

# Output information for manual DNS configuration
output "manual_dns_records" {
  description = "DNS records to manually configure in your external DNS provider"
  value = {
    api_record = {
      name  = "api"
      type  = "A"
      value = digitalocean_droplet.app_server.ipv4_address
      ttl   = 300
    }
    cdn_record = {
      name  = "cdn"
      type  = "CNAME"
      value = digitalocean_cdn.codecave_cdn.endpoint
      ttl   = 300
    }
  }
}

output "api_domain_ip" {
  description = "IP address for API domain"
  value       = digitalocean_droplet.app_server.ipv4_address
}

output "cdn_endpoint_for_dns" {
  description = "CDN endpoint to use in your external DNS CNAME record"
  value       = digitalocean_cdn.codecave_cdn.endpoint
} 