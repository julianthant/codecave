#!/bin/bash

# Terraform wrapper script for CodeCave
# This script sets up environment variables from Doppler and runs terraform commands

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 CodeCave Terraform Wrapper${NC}"
echo "============================================="

# Check if doppler is installed
if ! command -v doppler &> /dev/null; then
    echo -e "${RED}❌ Doppler CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if we're in the terraform directory
if [ ! -f "providers.tf" ]; then
    echo -e "${RED}❌ Please run this script from the terraform directory${NC}"
    exit 1
fi

# Set up environment variables from Doppler
echo -e "${YELLOW}🔑 Setting up credentials from Doppler...${NC}"

# DigitalOcean API token
export DIGITALOCEAN_ACCESS_TOKEN="$(doppler secrets get DO_TOKEN --config=prd_all --project=codecave --plain)"

# DigitalOcean Spaces credentials (for AWS S3 compatibility)
export AWS_ACCESS_KEY_ID="$(doppler secrets get DO_SPACES_KEY --config=prd_all --project=codecave --plain)"
export AWS_SECRET_ACCESS_KEY="$(doppler secrets get DO_SPACES_SECRET --config=prd_all --project=codecave --plain)"

# Verify credentials are set
if [ -z "$DIGITALOCEAN_ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get DigitalOcean API token from Doppler${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Credentials loaded successfully${NC}"
echo "   - DigitalOcean API token: ${DIGITALOCEAN_ACCESS_TOKEN:0:20}..."
echo "   - Spaces Access Key: ${AWS_ACCESS_KEY_ID:0:10}..."

# Run terraform command
echo -e "${YELLOW}🚀 Running: terraform $@${NC}"
echo "============================================="

# Execute terraform with all arguments passed to this script
terraform "$@"

# Show status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Terraform command completed successfully${NC}"
else
    echo -e "${RED}❌ Terraform command failed${NC}"
    exit 1
fi 