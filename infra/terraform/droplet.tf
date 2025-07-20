# Main application server droplet
resource "digitalocean_droplet" "app_server" {
  image    = var.droplet_image
  name     = "${var.project_name}-${var.environment}-app"
  region   = var.droplet_region
  size     = var.droplet_size
  vpc_uuid = digitalocean_vpc.codecave.id
  
  ssh_keys = [digitalocean_ssh_key.codecave.id]
  
  # Enable backups if specified
  backups           = var.backup_enabled
  monitoring        = var.monitoring_enabled
  ipv6              = true
  resize_disk       = true
  
  tags = var.tags
  
  # User data script to set up the environment
  user_data = templatefile("${path.module}/scripts/user_data.sh", {
    project_name = var.project_name
    environment  = var.environment
  })

  # Connection for provisioning
  connection {
    type        = "ssh"
    user        = "root"
    private_key = file(var.ssh_private_key_path)
    host        = self.ipv4_address
    timeout     = "5m"
  }

  # Create directories first
  provisioner "remote-exec" {
    inline = [
      "mkdir -p /opt/codecave/scripts",
    ]
  }

  # Copy docker-compose file and environment setup
  provisioner "file" {
    source      = "${path.module}/../../docker-compose.prod.yml"
    destination = "/opt/codecave/docker-compose.yml"
  }

  # Wait for user_data script to complete
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for user_data script to complete...'",
      "while [ ! -f /tmp/user_data_complete ]; do sleep 5; done",
      "echo 'User data script completed successfully'",
    ]
  }
}

# Volume for persistent data
resource "digitalocean_volume" "app_data" {
  region                  = var.droplet_region
  name                    = "${var.project_name}-${var.environment}-data"
  size                    = 50 # 50GB
  initial_filesystem_type = "ext4"
  description             = "Volume for CodeCave application data"
  
  tags = var.tags
}

# Attach volume to droplet
resource "digitalocean_volume_attachment" "app_data" {
  droplet_id = digitalocean_droplet.app_server.id
  volume_id  = digitalocean_volume.app_data.id
} 