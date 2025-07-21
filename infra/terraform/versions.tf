terraform {
  required_version = ">= 1.0"
  
  # Following Context7 best practices for provider version constraints
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    
    # Add random provider for secure resource naming
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
    
    # Add time provider for resource lifecycle management
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
  }

  # Optional: Configure remote state (uncomment when ready)
  # Following Terraform best practices for remote state
  # backend "s3" {
  #   bucket = "codecave-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  #   encrypt = true
  #   dynamodb_table = "terraform-state-lock"
  # }
} 