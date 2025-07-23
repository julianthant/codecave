# PostgreSQL Database Cluster
resource "digitalocean_database_cluster" "codecave_postgres" {
  name                 = "${var.project_name}-${var.environment}-postgres"
  engine               = "pg"
  version              = "15"
  size                 = var.db_size
  region               = var.region
  node_count           = var.db_node_count
  
  # Enable automated backups
  maintenance_window {
    day  = "sunday"
    hour = "02:00:00"
  }

  tags = [
    "project:${var.project_name}",
    "environment:${var.environment}",
    "service:database"
  ]
}

# Read Replica in same region for high performance
resource "digitalocean_database_replica" "codecave_read_replica_primary" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id
  name       = "${var.project_name}-${var.environment}-read-replica-primary"
  region     = var.region
  size       = var.db_replica_size

  tags = [
    "project:${var.project_name}",
    "environment:${var.environment}",
    "service:database-replica",
    "type:read-replica"
  ]
}

# Read Replica in different region for geographic distribution
resource "digitalocean_database_replica" "codecave_read_replica_east" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id
  name       = "${var.project_name}-${var.environment}-read-replica-east"
  region     = "nyc1"  # East coast replica
  size       = var.db_replica_size

  tags = [
    "project:${var.project_name}",
    "environment:${var.environment}",
    "service:database-replica",
    "type:read-replica-geographic"
  ]
}

# Create main application database
resource "digitalocean_database_db" "codecave_main" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id
  name       = "${var.project_name}_${var.environment}"
}

# Create database user for the application
resource "digitalocean_database_user" "codecave_app_user" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id
  name       = "${var.project_name}_app_user"
}

# Database firewall rules (covers main cluster and replicas)
resource "digitalocean_database_firewall" "codecave_postgres_firewall" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id

  rule {
    type  = "droplet"
    value = digitalocean_droplet.app_server.id
  }
  
  # Allow connections from trusted IPs if needed
  # rule {
  #   type  = "ip_addr"
  #   value = "YOUR_TRUSTED_IP/32"
  # }
}

# Create connection pool for write operations (main cluster only)
resource "digitalocean_database_connection_pool" "codecave_write_pool" {
  cluster_id = digitalocean_database_cluster.codecave_postgres.id
  name       = "${var.project_name}-write-pool"
  mode       = "transaction"
  size       = 20
  db_name    = digitalocean_database_db.codecave_main.name
  user       = digitalocean_database_user.codecave_app_user.name
}
