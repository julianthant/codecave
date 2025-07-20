#!/bin/bash

# Manual script to sync all branches with main
# Usage: ./scripts/sync-branches.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Syncing all branches with main...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Get the current branch name
current_branch=$(git branch --show-current)

# Switch to main and pull latest changes
echo -e "${YELLOW}🔄 Switching to main and pulling latest changes...${NC}"
git checkout main
git pull origin main

# Get the current commit hash from main
main_commit=$(git rev-parse HEAD)

# Define the branches to update
branches_to_update=("frontend" "backend" "development")

# Keep track of successes and failures
updated_branches=()
failed_branches=()

# Update each branch
for branch in "${branches_to_update[@]}"; do
    echo -e "${BLUE}Processing branch: $branch${NC}"
    
    # Check if the branch exists locally
    if git show-ref --verify --quiet refs/heads/$branch; then
        echo -e "${YELLOW}🔄 Updating local branch: $branch${NC}"
        
        # Checkout the branch
        if git checkout $branch 2>/dev/null; then
            # Reset to main's commit
            if git reset --hard $main_commit; then
                echo -e "${GREEN}✅ Local branch $branch updated successfully${NC}"
                
                # Try to push to remote if it exists
                if git ls-remote --exit-code --heads origin $branch >/dev/null 2>&1; then
                    echo -e "${YELLOW}📤 Force pushing $branch to remote...${NC}"
                    if git push --force-with-lease origin $branch; then
                        echo -e "${GREEN}✅ Remote branch $branch updated successfully${NC}"
                        updated_branches+=("$branch")
                    else
                        echo -e "${RED}❌ Failed to push $branch to remote${NC}"
                        failed_branches+=("$branch (remote push failed)")
                    fi
                else
                    echo -e "${YELLOW}⚠️  Remote branch $branch doesn't exist, local update only${NC}"
                    updated_branches+=("$branch (local only)")
                fi
            else
                echo -e "${RED}❌ Failed to reset $branch to main${NC}"
                failed_branches+=("$branch (reset failed)")
            fi
        else
            echo -e "${RED}❌ Failed to checkout $branch${NC}"
            failed_branches+=("$branch (checkout failed)")
        fi
    else
        echo -e "${YELLOW}⚠️  Local branch $branch doesn't exist, skipping${NC}"
    fi
done

# Return to the original branch or main
if [ "$current_branch" != "main" ] && git show-ref --verify --quiet refs/heads/$current_branch; then
    git checkout $current_branch
    echo -e "${GREEN}🔙 Returned to $current_branch${NC}"
else
    git checkout main
    echo -e "${GREEN}🔙 Staying on main${NC}"
fi

# Summary
echo -e "\n${BLUE}📋 SYNCHRONIZATION SUMMARY:${NC}"
if [ ${#updated_branches[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Successfully updated: ${updated_branches[*]}${NC}"
fi
if [ ${#failed_branches[@]} -gt 0 ]; then
    echo -e "${RED}❌ Failed to update: ${failed_branches[*]}${NC}"
fi

echo -e "${GREEN}✅ Branch synchronization complete!${NC}"
