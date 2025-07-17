terraform {
  required_version = ">= 1.0"
  
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  # Optional: Configure remote state (uncomment when ready)
  # backend "s3" {
  #   bucket = "codecave-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  # }
} 