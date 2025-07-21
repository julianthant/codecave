# Configure the DigitalOcean Provider
# Following Context7 best practices for provider configuration
provider "digitalocean" {
  # Uses DIGITALOCEAN_ACCESS_TOKEN environment variable automatically
  # This follows the DigitalOcean provider's recommended authentication pattern
  
  # DigitalOcean Spaces credentials (for S3-compatible storage)
  spaces_access_id  = var.spaces_access_key
  spaces_secret_key = var.spaces_secret_key
}

# Provider alias for different regions (Context7 best practice)
provider "digitalocean" {
  alias = "nyc3"
  
  # For multi-region deployments if needed
  spaces_access_id  = var.spaces_access_key
  spaces_secret_key = var.spaces_secret_key
}

# Data source to get account information
data "digitalocean_account" "current" {}

# SSH key for droplet access
resource "digitalocean_ssh_key" "codecave" {
  name       = "${var.project_name}-${var.environment}-ssh-key"
  public_key = file(var.ssh_public_key_path)
} 