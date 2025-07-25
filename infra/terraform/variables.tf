# DigitalOcean Configuration
# Note: Uses DIGITALOCEAN_ACCESS_TOKEN environment variable

# DigitalOcean Spaces Configuration
variable "spaces_access_key" {
  description = "DigitalOcean Spaces Access Key"
  type        = string
  sensitive   = true
}

variable "spaces_secret_key" {
  description = "DigitalOcean Spaces Secret Key"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "codecave"
}

variable "domain_name" {
  description = "Primary domain name for the project"
  type        = string
  default     = "codecave.tech"
}

variable "environment" {
  description = "Environment (staging, production)"
  type        = string
  default     = "production"
}

# Droplet Configuration
variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
  default     = "s-1vcpu-2gb" # 1 vCPUs, 2GB RAM, 50GB SSD
}

variable "droplet_region" {
  description = "DigitalOcean region"
  type        = string
  default     = "sfo3"
}

variable "droplet_image" {
  description = "Droplet image"
  type        = string
  default     = "docker-20-04" # Ubuntu 20.04 with Docker pre-installed
}

# SSH Configuration
variable "ssh_public_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "ssh_private_key_path" {
  description = "Path to SSH private key for provisioning"
  type        = string
  default     = "~/.ssh/id_rsa"
}

# Application Configuration
variable "subdomain" {
  description = "Subdomain for the environment"
  type        = string
  default     = "api"
}

# Backup Configuration
variable "backup_enabled" {
  description = "Enable automated backups"
  type        = bool
  default     = false
}

variable "monitoring_enabled" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

# Database Configuration - Digital Ocean Managed Database
variable "db_size" {
  description = "Size of the database cluster"
  type        = string
  default     = "db-s-1vcpu-1gb" # 1 vCPU, 1GB RAM, 10GB storage
}

variable "db_replica_size" {
  description = "Size of the database read replicas"
  type        = string
  default     = "db-s-1vcpu-1gb" # Same size as primary for consistency
}

variable "db_node_count" {
  description = "Number of database nodes"
  type        = number
  default     = 1
}

variable "region" {
  description = "DigitalOcean region for all resources"
  type        = string
  default     = "sfo3"
}

# Tags
variable "tags" {
  description = "Tags to apply to resources"
  type        = list(string)
  default     = ["codecave", "production", "terraform"]
} 