# Supabase Seeding Rules (`supabase/`)

**CRITICAL REQUIREMENTS**: Follow these exact patterns for all database seeding operations.

## Overview

CodeCave uses a **modular, domain-organized seeding approach** for consistent and maintainable test data. The seeding system is designed to create realistic developer community data for testing and development.

## File Organization (REQUIRED)

```
supabase/
├── config.toml               # Supabase configuration with seed paths
├── CLAUDE.md                 # This file - seeding best practices
├── README.md                 # User documentation
├── seed.sql                  # Main entry point (legacy support)
└── seeds/                    # Modular seed files (ORDERED EXECUTION)
    ├── 00-setup.sql          # RLS disable, cleanup, helper functions
    ├── 01-profiles.sql       # User profiles and settings
    ├── 02-connections.sql    # Social connections and invitations
    ├── 03-collaborations.sql # Collaboration opportunities and applications
    ├── 04-posts.sql          # Content posts and rich data
    ├── 05-projects.sql       # Portfolio projects
    ├── 06-notifications.sql  # User notifications
    ├── 07-engagement.sql     # Post likes, comments, saves
    └── 99-cleanup.sql        # RLS re-enable, data verification
```

## Seeding Principles (CRITICAL)

### 1. **Ordered Execution**
- Files execute in lexicographic order: `00-`, `01-`, `02-`, etc.
- Each file is atomic and can be run independently
- Dependencies flow logically from lower to higher numbers

### 2. **Data Generation Best Practices**
```sql
-- ✅ CORRECT: Use built-in UUID generation
INSERT INTO profiles (id, username) VALUES 
(gen_random_uuid(), 'username1');

-- ❌ WRONG: Hardcoded UUIDs (maintenance nightmare)
INSERT INTO profiles (id, username) VALUES 
('01920394-1234-7890-abcd-1234567890ab', 'username1');
```

### 3. **Transaction Safety**
```sql
-- ✅ CORRECT: Wrap each file in transaction
BEGIN;

-- Seed operations here
INSERT INTO table_name (...) VALUES (...);

-- Verify critical constraints
SELECT CASE 
  WHEN COUNT(*) = 0 THEN 
    RAISE(EXCEPTION, 'No data inserted - seeding failed') 
  END 
FROM table_name;

COMMIT;
```

### 4. **Idempotency (Safe Re-runs)**
```sql
-- ✅ CORRECT: Clear existing data safely
DELETE FROM dependent_table WHERE created_during_seed = true;
DELETE FROM main_table WHERE created_during_seed = true;

-- ✅ CORRECT: Or use ON CONFLICT for upserts
INSERT INTO table_name (id, username) VALUES 
(gen_random_uuid(), 'unique_username')
ON CONFLICT (username) DO UPDATE SET
  updated_at = now();
```

### 5. **RLS Handling**
```sql
-- ✅ CORRECT: Disable only for seeding, re-enable after
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- ... seeding operations ...
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- ✅ CORRECT: Bulk operations with proper session settings
SET session_replication_role = replica;  -- Disable triggers
-- ... bulk operations ...
SET session_replication_role = DEFAULT;  -- Re-enable triggers
```

## File Structure Requirements (EXACT)

### `00-setup.sql` (REQUIRED FIRST)
- Disable RLS on all tables
- Create helper functions for data generation
- Clear existing seed data (if present)
- Set up session variables

### `01-XX-domain.sql` (DOMAIN FILES)
- One domain per file (profiles, posts, etc.)
- Include realistic, interconnected data
- Use helper functions for UUIDs and relationships
- Add domain-specific validation

### `99-cleanup.sql` (REQUIRED LAST)
- Re-enable RLS on all tables
- Run data integrity checks
- Display seeding summary
- Reset session variables

## Data Generation Patterns (REQUIRED)

### UUID Generation
```sql
-- ✅ CORRECT: Generated UUIDs with deterministic patterns
CREATE OR REPLACE FUNCTION seed_user_uuid(username text) 
RETURNS uuid AS $$
BEGIN
  -- Use md5 hash for deterministic but unique UUIDs during seeding
  RETURN ('00000000-0000-0000-0000-' || substr(md5(username), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Usage
INSERT INTO profiles (id, username) VALUES 
(seed_user_uuid('sarahchen'), 'sarahchen');
```

### Relationship Building
```sql
-- ✅ CORRECT: Reference by deterministic IDs
INSERT INTO connections (follower_id, following_id) VALUES
(seed_user_uuid('jessica'), seed_user_uuid('sarah'));

-- ❌ WRONG: Hardcoded references
INSERT INTO connections (follower_id, following_id) VALUES
('01920394-1234-7890-abcd-1234567890ah', '01920394-1234-7890-abcd-1234567890ab');
```

### Timestamp Generation
```sql
-- ✅ CORRECT: Relative timestamps
INSERT INTO posts (created_at) VALUES
(now() - interval '3 days'),
(now() - interval '1 week'),
(now() - interval '2 hours');

-- ✅ CORRECT: Realistic distribution
SELECT CASE 
  WHEN random() < 0.6 THEN now() - interval '1 day' * (random() * 7)     -- 60% within week
  WHEN random() < 0.9 THEN now() - interval '1 week' * (random() * 4)    -- 30% within month
  ELSE now() - interval '1 month' * (random() * 6)                       -- 10% within 6 months
END as created_at;
```

## Error Handling (CRITICAL)

### File-Level Error Handling
```sql
-- Required in each seed file
BEGIN;

-- Set error handling
\set ON_ERROR_STOP on
\set VERBOSITY verbose

-- Seeding operations...

-- Validation before commit
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM profiles) = 0 THEN
    RAISE EXCEPTION 'Profile seeding failed - no records inserted';
  END IF;
END $$;

COMMIT;
```

### Data Validation
```sql
-- ✅ CORRECT: Validate critical relationships
SELECT CASE 
  WHEN EXISTS(
    SELECT 1 FROM connections c 
    LEFT JOIN profiles p1 ON c.follower_id = p1.id
    LEFT JOIN profiles p2 ON c.following_id = p2.id
    WHERE p1.id IS NULL OR p2.id IS NULL
  ) THEN 
    RAISE(EXCEPTION, 'Invalid connection references found')
  END;
```

## Development Workflow (EXACT STEPS)

### Adding New Seed Data
1. **Identify Domain**: Determine which domain file to modify
2. **Create Helper Function**: If needed for ID generation
3. **Add Data**: Following patterns in existing files
4. **Validate**: Add relationship and constraint checks
5. **Test**: Run seeding in isolated environment

### Testing Seed Files
```bash
# Test individual files
psql $DATABASE_URL -f supabase/seeds/01-profiles.sql

# Test full seeding process
supabase db reset        # Clears and re-seeds everything
# OR
pnpm db:drop && pnpm db:push && pnpm db:seed
```

### Modifying Existing Data
1. **Edit Appropriate File**: Locate domain-specific file
2. **Maintain Relationships**: Ensure foreign key integrity
3. **Update Counts**: Adjust derived counts if needed
4. **Test Isolation**: Verify file can run independently

## Common Anti-Patterns (AVOID)

### ❌ WRONG: Monolithic File
- Single massive `seed.sql` file
- Hardcoded UUIDs throughout
- No error handling or validation
- Mixed domains in same file

### ❌ WRONG: Unsafe Operations
```sql
-- Dangerous - no transaction safety
DELETE FROM profiles;
INSERT INTO profiles ...;

-- Dangerous - hardcoded foreign keys
INSERT INTO posts (author_id) VALUES 
('some-hardcoded-uuid-that-might-not-exist');
```

### ❌ WRONG: No Validation
```sql
-- Missing validation - might insert bad data
INSERT INTO table_name VALUES (...);
-- Should validate constraints and relationships
```

## Integration with Development (REQUIRED)

### Package.json Scripts
```json
{
  "scripts": {
    "db:seed": "supabase db reset",
    "db:seed:prod": "psql $DATABASE_URL -f supabase/seed.sql",
    "db:seed:dev": "psql $DEV_DATABASE_URL -f supabase/seed.sql"
  }
}
```

### Environment Variables
- `DATABASE_URL` - Primary database connection
- `DEV_DATABASE_URL` - Development branch (optional)
- `SUPABASE_PROJECT_ID` - For Supabase CLI commands

## Maintenance Guidelines (CRITICAL)

### Regular Updates
- **Monthly**: Review and update user profiles for realism
- **Per Feature**: Add seed data for new tables/relationships
- **Before Demos**: Ensure data showcases all features
- **Bug Reports**: Add edge cases to prevent regression

### Performance Considerations
- **Indexes**: Ensure seeded data tests indexes properly
- **Volumes**: Keep seed data size reasonable (< 10K records per table)
- **Relationships**: Test complex queries with seeded relationships
- **Cleanup**: Regular cleanup of unused test data patterns

### Quality Standards
- ✅ All foreign key relationships must be valid
- ✅ All enum values must match schema definitions
- ✅ All required fields must have realistic values
- ✅ Timestamps must be logical and recent
- ✅ JSON fields must match expected schema structure

## Security Guidelines (CRITICAL)

### RLS Testing
- Seed data must work properly with RLS enabled
- Test data access with different user contexts
- Verify policy effectiveness with realistic data relationships

### Data Privacy
- Use realistic but fictional personal information
- No real email addresses or personal data
- Placeholder URLs for external links
- Generic but realistic location data

### Production Safety
- **NEVER** run development seeds on production
- **ALWAYS** use separate seed configurations for environments
- **ALWAYS** backup before running seeds on staging
- **NEVER** include production credentials in seed files

## Common Seed Data Patterns

### User Diversity
- Multiple experience levels (junior, mid, senior, expert)
- Different technology stacks and specializations
- Realistic geographic distribution
- Varied collaboration preferences and availability

### Content Variety
- Different post types (articles, snippets, thoughts)
- Rich content with proper JSON structure
- Realistic engagement patterns (likes, comments)
- Varied publication dates for feed testing

### Social Networks
- Realistic following/follower patterns
- Pending invitations and requests
- Cross-connections between similar users
- Mentor-mentee relationships

## Troubleshooting Common Issues

### Foreign Key Violations
```sql
-- Debug missing references
SELECT 'Missing author' as issue, p.author_id
FROM posts p
LEFT JOIN profiles pr ON p.author_id = pr.id  
WHERE pr.id IS NULL;
```

### RLS Policy Conflicts
```sql
-- Test with RLS enabled
SET ROLE authenticated;
SELECT * FROM profiles WHERE id = 'test-user-id';
```

### Data Consistency
```sql
-- Verify counts match
SELECT 
  'posts' as table_name,
  COUNT(*) as actual_count,
  (SELECT SUM(like_count) FROM posts) as total_likes
FROM posts;
```

## Quick Commands

```bash
# Full reset and seed
supabase db reset

# Manual seeding (development)
psql $DATABASE_URL -f supabase/seed.sql

# Test individual domain
psql $DATABASE_URL -f supabase/seeds/01-profiles.sql

# Verify seeding worked
psql $DATABASE_URL -c "SELECT 'profiles', COUNT(*) FROM profiles;"
```

This modular approach ensures maintainable, realistic, and safe database seeding for CodeCave development and testing environments.