# Managed PostgreSQL Database Cluster
resource "digitalocean_database_cluster" "codecave_db" {
  name       = "${var.project_name}-${var.environment}-db"
  engine     = var.database_engine
  version    = var.database_version
  size       = var.database_cluster_size
  region     = var.droplet_region
  node_count = 1
  
  private_network_uuid = digitalocean_vpc.codecave.id
  
  tags = var.tags
  
  # Maintenance window (Sunday 2-3 AM UTC)
  maintenance_window {
    day  = "sunday"
    hour = "02:00:00"
  }
}

# Database for the application
resource "digitalocean_database_db" "codecave_main" {
  cluster_id = digitalocean_database_cluster.codecave_db.id
  name       = "${var.project_name}_${var.environment}"
}

# Database user for the application
resource "digitalocean_database_user" "codecave_app" {
  cluster_id = digitalocean_database_cluster.codecave_db.id
  name       = "${var.project_name}_app"
}

# Database firewall to allow access from our droplet
resource "digitalocean_database_firewall" "codecave_db_firewall" {
  cluster_id = digitalocean_database_cluster.codecave_db.id

  rule {
    type  = "droplet"
    value = digitalocean_droplet.app_server.id
  }
} 