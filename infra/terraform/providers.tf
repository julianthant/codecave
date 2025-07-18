# Configure the DigitalOcean Provider
provider "digitalocean" {
  # Uses DIGITALOCEAN_ACCESS_TOKEN environment variable automatically
}

# Data source to get account information
data "digitalocean_account" "current" {}

# SSH key for droplet access
resource "digitalocean_ssh_key" "codecave" {
  name       = "${var.project_name}-${var.environment}-ssh-key"
  public_key = file(var.ssh_public_key_path)
} 