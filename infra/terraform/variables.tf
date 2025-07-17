# DigitalOcean Configuration
variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "codecave"
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
  default     = "s-2vcpu-4gb" # 2 vCPUs, 4GB RAM, 80GB SSD
}

variable "droplet_region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc3"
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
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "codecave.tech"
}

variable "subdomain" {
  description = "Subdomain for the environment"
  type        = string
  default     = "api"
}

# Backup Configuration
variable "backup_enabled" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "monitoring_enabled" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

# Database Configuration
variable "database_cluster_size" {
  description = "Size of the database cluster"
  type        = string
  default     = "db-s-1vcpu-1gb" # 1 vCPU, 1GB RAM, 10GB storage
}

variable "database_engine" {
  description = "Database engine"
  type        = string
  default     = "pg"
}

variable "database_version" {
  description = "Database version"
  type        = string
  default     = "15"
}

# Tags
variable "tags" {
  description = "Tags to apply to resources"
  type        = list(string)
  default     = ["codecave", "production", "terraform"]
} 