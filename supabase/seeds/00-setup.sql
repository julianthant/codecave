-- ================================
-- CODECAVE SEED SETUP
-- ================================
-- Sets up the environment for safe database seeding
-- - Disables RLS temporarily for bulk operations
-- - Clears existing seed data safely
-- - Creates helper functions for deterministic data generation

BEGIN;

-- Error handling configuration
\set ON_ERROR_STOP on
\set VERBOSITY verbose

-- ================================
-- DISABLE RLS FOR SEEDING
-- ================================
-- Temporarily disable RLS to allow bulk inserts
-- This is safe for development seeding

DO $$
BEGIN
  -- Disable RLS on all tables
  ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.user_settings DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.connections DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.connection_invitations DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaborations DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaboration_applications DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaboration_saves DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.posts DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_likes DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_bookmarks DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_comments DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_reposts DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.projects DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'RLS disabled for seeding';
END $$;

-- ================================
-- SEEDING HELPER FUNCTIONS
-- ================================

-- Create deterministic UUIDs for seed data
-- This allows consistent relationships across runs
CREATE OR REPLACE FUNCTION seed_user_uuid(username text) 
RETURNS uuid AS $$
BEGIN
  -- Generate deterministic UUID based on username
  -- Format: 00000000-0000-0000-0000-{12 char md5 hash}
  RETURN ('00000000-0000-0000-0000-' || substr(md5('user:' || username), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create deterministic UUIDs for posts
CREATE OR REPLACE FUNCTION seed_post_uuid(author_username text, post_slug text)
RETURNS uuid AS $$
BEGIN
  -- Generate deterministic UUID for posts
  -- Format: 11111111-1111-1111-1111-{12 char md5 hash}
  RETURN ('11111111-1111-1111-1111-' || substr(md5('post:' || author_username || ':' || post_slug), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create deterministic UUIDs for collaborations
CREATE OR REPLACE FUNCTION seed_collab_uuid(title text, author_username text)
RETURNS uuid AS $$
BEGIN
  -- Generate deterministic UUID for collaborations
  -- Format: 22222222-2222-2222-2222-{12 char md5 hash}
  RETURN ('22222222-2222-2222-2222-' || substr(md5('collab:' || title || ':' || author_username), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create deterministic UUIDs for projects
CREATE OR REPLACE FUNCTION seed_project_uuid(title text, author_username text)
RETURNS uuid AS $$
BEGIN
  -- Generate deterministic UUID for projects
  -- Format: 33333333-3333-3333-3333-{12 char md5 hash}
  RETURN ('33333333-3333-3333-3333-' || substr(md5('project:' || title || ':' || author_username), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create deterministic UUIDs for notifications
CREATE OR REPLACE FUNCTION seed_notification_uuid(user_username text, notification_type text, sequence_num integer)
RETURNS uuid AS $$
BEGIN
  -- Generate deterministic UUID for notifications
  -- Format: 44444444-4444-4444-4444-{12 char md5 hash}
  RETURN ('44444444-4444-4444-4444-' || substr(md5('notif:' || user_username || ':' || notification_type || ':' || sequence_num::text), 1, 12))::uuid;
END;
$$ LANGUAGE plpgsql;

-- Generate realistic timestamps with distribution
CREATE OR REPLACE FUNCTION random_past_timestamp(max_days_ago integer DEFAULT 30)
RETURNS timestamptz AS $$
BEGIN
  -- 60% within last week, 30% within last month, 10% older
  RETURN CASE 
    WHEN random() < 0.6 THEN now() - interval '1 day' * (random() * 7)
    WHEN random() < 0.9 THEN now() - interval '1 day' * (random() * max_days_ago)
    ELSE now() - interval '1 day' * (random() * max_days_ago * 2)
  END;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- CLEAR EXISTING SEED DATA
-- ================================
-- Clear data in dependency order to avoid foreign key conflicts

DO $$
BEGIN
  -- Disable triggers temporarily to avoid conflicts during cleanup
  SET session_replication_role = replica;
  
  RAISE NOTICE 'Clearing existing seed data...';
  
  -- Clear engagement data first (most dependent)
  DELETE FROM public.post_reposts WHERE true;
  DELETE FROM public.post_comments WHERE true;
  DELETE FROM public.post_bookmarks WHERE true;
  DELETE FROM public.post_likes WHERE true;
  
  -- Clear collaboration data
  DELETE FROM public.collaboration_saves WHERE true;
  DELETE FROM public.collaboration_applications WHERE true;
  DELETE FROM public.collaborations WHERE true;
  
  -- Clear social data
  DELETE FROM public.connection_invitations WHERE true;
  DELETE FROM public.connections WHERE true;
  
  -- Clear content data
  DELETE FROM public.posts WHERE true;
  DELETE FROM public.projects WHERE true;
  DELETE FROM public.notifications WHERE true;
  
  -- Clear user data last (least dependent)
  DELETE FROM public.user_settings WHERE true;
  DELETE FROM public.profiles WHERE true;
  
  -- Re-enable triggers
  SET session_replication_role = DEFAULT;
  
  RAISE NOTICE 'Existing seed data cleared successfully';
END $$;

-- ================================
-- VALIDATION FUNCTIONS
-- ================================

-- Function to validate seeding results
CREATE OR REPLACE FUNCTION validate_seed_data()
RETURNS void AS $$
DECLARE
  profile_count integer;
  connection_count integer;
  post_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM profiles;
  SELECT COUNT(*) INTO connection_count FROM connections;
  SELECT COUNT(*) INTO post_count FROM posts;
  
  IF profile_count = 0 THEN
    RAISE EXCEPTION 'No profiles found after seeding';
  END IF;
  
  IF connection_count = 0 THEN
    RAISE EXCEPTION 'No connections found after seeding';
  END IF;
  
  IF post_count = 0 THEN
    RAISE EXCEPTION 'No posts found after seeding';
  END IF;
  
  RAISE NOTICE 'Seed validation passed: % profiles, % connections, % posts', 
    profile_count, connection_count, post_count;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Setup complete
\echo 'Seeding setup completed successfully'
\echo 'Helper functions created for deterministic data generation'
\echo 'RLS disabled for bulk operations'
\echo 'Ready for domain-specific seeding files'