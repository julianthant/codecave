#!/bin/bash

# CodeCave Database Migration: Digital Ocean → Supabase
# This script helps migrate your data from Digital Ocean PostgreSQL to Supabase

set -e  # Exit on any error

echo "🚀 CodeCave Database Migration: Digital Ocean → Supabase"
echo "========================================================="

# Configuration
BACKUP_FILE="codecave_migration_$(date +%Y%m%d_%H%M%S).sql"
LOG_FILE="migration_$(date +%Y%m%d_%H%M%S).log"

echo "📋 Pre-Migration Checklist:"
echo "1. ✅ Supabase project created"
echo "2. ✅ Supabase DATABASE_URL updated in Doppler"
echo "3. ✅ Application stopped on production server"
echo ""

read -p "Have you completed all the above steps? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the checklist first"
    exit 1
fi

echo ""
echo "📊 Step 1: Export data from Digital Ocean PostgreSQL"
echo "======================================================"

# Check if we have the necessary environment variables
if [ -z "$DO_DATABASE_URL" ]; then
    echo "❌ Error: DO_DATABASE_URL environment variable not set"
    echo "   Please set it to your Digital Ocean database connection string"
    exit 1
fi

if [ -z "$SUPABASE_DATABASE_URL" ]; then
    echo "❌ Error: SUPABASE_DATABASE_URL environment variable not set"
    echo "   Please set it to your Supabase database connection string"
    exit 1
fi

echo "📥 Exporting data from Digital Ocean..."
pg_dump "$DO_DATABASE_URL" --no-owner --no-privileges --clean --if-exists > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Data exported successfully to $BACKUP_FILE"
    echo "📊 Backup file size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Error: Failed to export data from Digital Ocean"
    exit 1
fi

echo ""
echo "📥 Step 2: Import data to Supabase"
echo "===================================="

echo "📤 Importing data to Supabase..."
psql "$SUPABASE_DATABASE_URL" -f "$BACKUP_FILE" > "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Data imported successfully to Supabase"
else
    echo "❌ Error: Failed to import data to Supabase"
    echo "   Check $LOG_FILE for details"
    exit 1
fi

echo ""
echo "🔍 Step 3: Verification"
echo "======================="

echo "📊 Comparing table counts..."

# Get table counts from both databases
echo "Digital Ocean table counts:"
psql "$DO_DATABASE_URL" -c "
SELECT schemaname, tablename, n_tup_ins as row_count 
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;"

echo ""
echo "Supabase table counts:"
psql "$SUPABASE_DATABASE_URL" -c "
SELECT schemaname, tablename, n_tup_ins as row_count 
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;"

echo ""
echo "🎉 Migration completed!"
echo "======================"
echo "✅ Backup file: $BACKUP_FILE"
echo "📋 Log file: $LOG_FILE"
echo ""
echo "🚀 Next steps:"
echo "1. Update your production environment to use Supabase DATABASE_URL"
echo "2. Restart your application"
echo "3. Test authentication and data access"
echo "4. Run: terraform apply (to remove Digital Ocean database resources)"
echo "5. Clean up old OAuth environment variables in Doppler"
echo ""
echo "💰 Expected monthly savings: ~$15 (Digital Ocean DB removal)"
