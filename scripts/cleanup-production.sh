#!/bin/bash

# Production cleanup script for CodeCave
# Removes unnecessary files after git pull to save disk space and memory

set -e

echo "🧹 Cleaning up unnecessary files for production deployment..."

# Remove frontend/web application (served by Vercel)
if [ -d "apps/web" ]; then
    echo "🗑️  Removing frontend app (served by Vercel)..."
    rm -rf apps/web
fi

# Remove frontend-specific files
echo "🗑️  Removing frontend-specific files..."
rm -f FRONTEND-TASKS.md
rm -f apps/web/.env.local 2>/dev/null || true

# Remove documentation that's not needed in production
echo "🗑️  Removing development documentation..."
rm -rf documentation
rm -f README.md
rm -f TASKS.md
rm -f PROJECT-PLAN.md 2>/dev/null || true
rm -f PRODUCTION-SUPABASE-MIGRATION.md 2>/dev/null || true

# Remove development and testing files
echo "🗑️  Removing development files..."
rm -f eslint.config.mjs
rm -f turbo.json
rm -f .gitignore
rm -rf .git/hooks 2>/dev/null || true

# Remove CI/CD files (already deployed)
echo "🗑️  Removing CI/CD files..."
rm -rf .github

# Remove local development configurations
echo "🗑️  Removing local development configs..."
rm -f docker-compose.yml  # Keep only docker-compose.prod.yml
rm -f .env.local 2>/dev/null || true
rm -f .env.example 2>/dev/null || true

# Remove package-lock.json if it exists (we use pnpm)
rm -f package-lock.json 2>/dev/null || true

# Remove any test files
echo "🗑️  Removing test files..."
find . -name "*.test.ts" -delete 2>/dev/null || true
find . -name "*.test.js" -delete 2>/dev/null || true
find . -name "*.spec.ts" -delete 2>/dev/null || true
find . -name "*.spec.js" -delete 2>/dev/null || true
rm -rf apps/*/tests 2>/dev/null || true

# Remove any temp or cache directories
echo "🗑️  Removing cache and temp files..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf apps/*/node_modules/.cache 2>/dev/null || true
rm -rf .turbo 2>/dev/null || true
rm -rf apps/*/.turbo 2>/dev/null || true
rm -rf apps/*/.next 2>/dev/null || true

# Remove any TypeScript build info
rm -f apps/*/tsconfig.tsbuildinfo 2>/dev/null || true

# Show what's left
echo "✅ Cleanup complete!"
echo "📁 Remaining structure:"
find . -maxdepth 2 -type d | grep -E "^\./[^.]" | sort

# Show disk usage
echo "💾 Current disk usage:"
du -sh .

echo "🎯 Production-optimized codebase ready!"
