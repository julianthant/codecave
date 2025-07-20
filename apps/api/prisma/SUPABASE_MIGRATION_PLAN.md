# Supabase Migration Plan

## Overview

This document outlines the steps to migrate from the current PostgreSQL database to Supabase PostgreSQL.

## Current State

- Using local/Digital Ocean PostgreSQL database
- Prisma schema is up to date with 1 existing migration
- Auth system has been updated to use Supabase OAuth

## Migration Steps

### 1. Environment Variables Update

Update the following environment variables in your deployment platform (Doppler):

```env
# Replace the current DATABASE_URL with Supabase connection string
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Add Supabase specific variables (if not already present)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
SUPABASE_JWT_SECRET=[YOUR_JWT_SECRET]

# Remove old OAuth provider variables (no longer needed)
# GITHUB_CLIENT_ID
# GITHUB_CLIENT_SECRET
# GOOGLE_CLIENT_ID
# GOOGLE_CLIENT_SECRET
# LINKEDIN_CLIENT_ID
# LINKEDIN_CLIENT_SECRET
```

### 2. Database Schema Migration

Once the DATABASE_URL is updated to point to Supabase:

```bash
# Apply the existing migrations to Supabase database
npx prisma migrate deploy

# Generate Prisma client for the new database
npx prisma generate
```

### 3. Data Migration (if needed)

If you have existing data to migrate:

```bash
# Export data from current database
pg_dump $OLD_DATABASE_URL > backup.sql

# Import data to Supabase (modify connection details as needed)
psql $NEW_SUPABASE_DATABASE_URL < backup.sql
```

### 4. Supabase OAuth Configuration

In your Supabase dashboard:

1. **Enable OAuth Providers:**
   - Go to Authentication > Providers
   - Enable GitHub, Google, LinkedIn
   - Configure redirect URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.com/auth/callback`

2. **Configure Site URL:**
   - Set Site URL to your frontend URL
   - Add redirect URLs to the allowed list

### 5. Frontend Updates

Update your frontend authentication flow to use Supabase client:

```typescript
// Instead of calling your API directly, use Supabase auth
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// OAuth login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "github", // or 'google', 'linkedin'
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### 6. Verification Steps

After migration:

1. Test OAuth login with all providers
2. Verify user data is correctly stored
3. Test JWT token generation and validation
4. Verify API endpoints work correctly
5. Test user profile updates

## Database Schema Compatibility

✅ Current schema is fully compatible with Supabase PostgreSQL
✅ All Prisma migrations will work without modification
✅ AuthProvider enum includes all necessary OAuth providers

## Cost Savings

- Removing Digital Ocean PostgreSQL: ~$15/month
- Using Supabase free tier or Pro plan: $0-25/month
- Net savings: Up to $15/month

## Rollback Plan

If issues arise:

1. Revert DATABASE_URL to original value
2. Re-enable individual OAuth provider environment variables
3. Restore auth strategies if needed (currently removed)

## Notes

- The API code has been fully updated for Supabase authentication
- Old OAuth strategy files have been removed
- Package.json has been cleaned of unused OAuth dependencies
- All authentication now flows through Supabase
