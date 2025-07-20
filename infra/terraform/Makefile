# Makefile for CodeCave Terraform operations
# Simplifies common infrastructure management tasks

.PHONY: help init plan apply destroy validate format check clean

# Default target
help: ## Show this help message
	@echo "CodeCave Terraform Management"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init: ## Initialize Terraform
	@echo "Initializing Terraform..."
	terraform init

plan: ## Create and show execution plan
	@echo "Creating execution plan..."
	doppler run --command="sh -c 'export DIGITALOCEAN_ACCESS_TOKEN=\$$DO_API_TOKEN && export TF_VAR_spaces_access_key=\$$DO_SPACES_KEY && export TF_VAR_spaces_secret_key=\$$DO_SPACES_SECRET && terraform plan'"

apply: ## Build or change infrastructure
	@echo "Applying infrastructure changes..."
	doppler run --command="sh -c 'export DIGITALOCEAN_ACCESS_TOKEN=\$$DO_API_TOKEN && export TF_VAR_spaces_access_key=\$$DO_SPACES_KEY && export TF_VAR_spaces_secret_key=\$$DO_SPACES_SECRET && terraform apply'"

destroy: ## Destroy infrastructure (use with caution!)
	@echo "⚠️  WARNING: This will destroy all infrastructure!"
	@read -p "Are you sure? Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ]
	doppler run --command="sh -c 'export DIGITALOCEAN_ACCESS_TOKEN=\$$DO_API_TOKEN && export TF_VAR_spaces_access_key=\$$DO_SPACES_KEY && export TF_VAR_spaces_secret_key=\$$DO_SPACES_SECRET && terraform destroy'"

validate: ## Validate Terraform configuration
	@echo "Validating configuration..."
	terraform validate

format: ## Format Terraform files
	@echo "Formatting Terraform files..."
	terraform fmt -recursive

check: validate format ## Run validation and formatting checks
	@echo "Running configuration checks..."

# Development targets
plan-dev: ## Plan with development variables
	@echo "Planning development infrastructure..."
	terraform plan -var-file="dev.tfvars"

apply-dev: ## Apply development infrastructure
	@echo "Applying development infrastructure..."
	terraform apply -var-file="dev.tfvars"

# Output targets
outputs: ## Show all outputs
	@echo "Current infrastructure outputs:"
	terraform output

ip: ## Show droplet IP
	@terraform output -raw droplet_ip 2>/dev/null || echo "No droplet deployed"

ssh: ## SSH to the droplet
	@IP=$$(terraform output -raw droplet_ip 2>/dev/null); \
	if [ "$$IP" != "" ]; then \
		ssh root@$$IP; \
	else \
		echo "No droplet IP found. Deploy infrastructure first."; \
	fi

# State management
state-list: ## List all resources in state
	terraform state list

state-show: ## Show a specific resource (usage: make state-show RESOURCE=resource_name)
	terraform state show $(RESOURCE)

refresh: ## Refresh state
	terraform refresh

# Cleanup targets
clean: ## Clean Terraform cache and lock files
	@echo "Cleaning Terraform cache..."
	rm -rf .terraform/
	rm -f .terraform.lock.hcl
	rm -f terraform.tfstate.backup

# Security targets
security-scan: ## Run security scan on Terraform files
	@echo "Running security scan..."
	@command -v tfsec >/dev/null 2>&1 || { echo "tfsec not installed. Install with: brew install tfsec"; exit 1; }
	tfsec .

# Cost estimation
cost: ## Estimate infrastructure costs
	@echo "Estimating costs..."
	@command -v infracost >/dev/null 2>&1 || { echo "infracost not installed. See: https://www.infracost.io/docs/"; exit 1; }
	infracost breakdown --path .

# Documentation
docs: ## Generate documentation
	@echo "Generating Terraform documentation..."
	@command -v terraform-docs >/dev/null 2>&1 || { echo "terraform-docs not installed. Install with: brew install terraform-docs"; exit 1; }
	terraform-docs markdown table --output-file README-generated.md .

# Quick deployment workflow
deploy: init validate plan apply ## Full deployment workflow
	@echo "✅ Infrastructure deployment completed!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Configure DNS to point to: $$(terraform output -raw droplet_ip)"
	@echo "2. SSH to server: make ssh"
	@echo "3. Set up SSL certificates"
	@echo "4. Deploy application"

# Quick status check
status: ## Show infrastructure status
	@echo "=== Infrastructure Status ==="
	@echo ""
	@echo "Droplet IP: $$(terraform output -raw droplet_ip 2>/dev/null || echo 'Not deployed')"
	@echo "Database Host: $$(terraform output database_host 2>/dev/null || echo 'Not deployed')"
	@echo "VPC ID: $$(terraform output -raw vpc_id 2>/dev/null || echo 'Not deployed')"
	@echo ""
	@if terraform output -raw droplet_ip >/dev/null 2>&1; then \
		echo "✅ Infrastructure is deployed"; \
	else \
		echo "❌ Infrastructure not deployed"; \
	fi 