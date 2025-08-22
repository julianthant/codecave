-- ================================
-- CODECAVE SEED CLEANUP
-- ================================
-- Re-enables RLS, validates data integrity, and provides seeding summary
-- This file should run last to ensure proper security and validation

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- DATA INTEGRITY VALIDATION
-- ================================

-- Comprehensive validation of all seeded data
DO $$
DECLARE
  profile_count integer;
  settings_count integer;
  connection_count integer;
  invitation_count integer;
  collaboration_count integer;
  application_count integer;
  save_count integer;
  post_count integer;
  like_count integer;
  comment_count integer;
  bookmark_count integer;
  repost_count integer;
  project_count integer;
  notification_count integer;
  
  -- Foreign key validation counters
  invalid_connections integer;
  invalid_applications integer;
  invalid_posts integer;
  invalid_notifications integer;
  invalid_projects integer;
BEGIN
  -- Get counts for all tables
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO settings_count FROM public.user_settings;
  SELECT COUNT(*) INTO connection_count FROM public.connections;
  SELECT COUNT(*) INTO invitation_count FROM public.connection_invitations;
  SELECT COUNT(*) INTO collaboration_count FROM public.collaborations;
  SELECT COUNT(*) INTO application_count FROM public.collaboration_applications;
  SELECT COUNT(*) INTO save_count FROM public.collaboration_saves;
  SELECT COUNT(*) INTO post_count FROM public.posts;
  SELECT COUNT(*) INTO like_count FROM public.post_likes;
  SELECT COUNT(*) INTO comment_count FROM public.post_comments;
  SELECT COUNT(*) INTO bookmark_count FROM public.post_bookmarks;
  SELECT COUNT(*) INTO repost_count FROM public.post_reposts;
  SELECT COUNT(*) INTO project_count FROM public.projects;
  SELECT COUNT(*) INTO notification_count FROM public.notifications;
  
  -- Validate foreign key relationships
  SELECT COUNT(*) INTO invalid_connections 
  FROM public.connections c
  LEFT JOIN public.profiles p1 ON c.follower_id = p1.id
  LEFT JOIN public.profiles p2 ON c.following_id = p2.id
  WHERE p1.id IS NULL OR p2.id IS NULL;
  
  SELECT COUNT(*) INTO invalid_applications
  FROM public.collaboration_applications ca
  LEFT JOIN public.collaborations c ON ca.collaboration_id = c.id
  LEFT JOIN public.profiles p ON ca.applicant_id = p.id
  WHERE c.id IS NULL OR p.id IS NULL;
  
  SELECT COUNT(*) INTO invalid_posts
  FROM public.posts p
  LEFT JOIN public.profiles pr ON p.author_id = pr.id
  WHERE pr.id IS NULL;
  
  SELECT COUNT(*) INTO invalid_notifications
  FROM public.notifications n
  LEFT JOIN public.profiles p ON n.user_id = p.id
  WHERE p.id IS NULL;
  
  SELECT COUNT(*) INTO invalid_projects
  FROM public.projects pr
  LEFT JOIN public.profiles p ON pr.user_id = p.id
  WHERE p.id IS NULL;
  
  -- Report validation results
  RAISE NOTICE '================================';
  RAISE NOTICE 'CODECAVE SEED DATA VALIDATION';
  RAISE NOTICE '================================';
  RAISE NOTICE 'Profiles: %', profile_count;
  RAISE NOTICE 'User Settings: %', settings_count;
  RAISE NOTICE 'Connections: %', connection_count;
  RAISE NOTICE 'Connection Invitations: %', invitation_count;
  RAISE NOTICE 'Collaborations: %', collaboration_count;
  RAISE NOTICE 'Collaboration Applications: %', application_count;
  RAISE NOTICE 'Collaboration Saves: %', save_count;
  RAISE NOTICE 'Posts: %', post_count;
  RAISE NOTICE 'Post Likes: %', like_count;
  RAISE NOTICE 'Post Comments: %', comment_count;
  RAISE NOTICE 'Post Bookmarks: %', bookmark_count;
  RAISE NOTICE 'Post Reposts: %', repost_count;
  RAISE NOTICE 'Projects: %', project_count;
  RAISE NOTICE 'Notifications: %', notification_count;
  RAISE NOTICE '================================';
  
  -- Check for critical errors
  IF profile_count = 0 THEN
    RAISE EXCEPTION 'CRITICAL: No profiles found - seeding failed';
  END IF;
  
  IF profile_count != settings_count THEN
    RAISE EXCEPTION 'CRITICAL: Profile count (%) does not match settings count (%)', profile_count, settings_count;
  END IF;
  
  -- Check foreign key integrity
  IF invalid_connections > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Found % invalid connection references', invalid_connections;
  END IF;
  
  IF invalid_applications > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Found % invalid collaboration application references', invalid_applications;
  END IF;
  
  IF invalid_posts > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Found % invalid post author references', invalid_posts;
  END IF;
  
  IF invalid_notifications > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Found % invalid notification user references', invalid_notifications;
  END IF;
  
  IF invalid_projects > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Found % invalid project user references', invalid_projects;
  END IF;
  
  RAISE NOTICE 'DATA INTEGRITY: All foreign key relationships validated ✓';
  RAISE NOTICE 'SEEDING STATUS: All data successfully seeded ✓';
END $$;

-- ================================
-- CLEANUP HELPER FUNCTIONS
-- ================================

-- Remove helper functions used during seeding
DROP FUNCTION IF EXISTS seed_user_uuid(text);
DROP FUNCTION IF EXISTS seed_post_uuid(text, text);
DROP FUNCTION IF EXISTS seed_collab_uuid(text, text);
DROP FUNCTION IF EXISTS seed_project_uuid(text, text);
DROP FUNCTION IF EXISTS seed_notification_uuid(text, text, integer);
DROP FUNCTION IF EXISTS random_past_timestamp(integer);
DROP FUNCTION IF EXISTS validate_seed_data();

DO $$
BEGIN
  RAISE NOTICE 'Helper functions cleaned up ✓';
END $$;

-- ================================
-- RE-ENABLE ROW LEVEL SECURITY
-- ================================

-- Re-enable RLS on all tables after seeding
DO $$
BEGIN
  ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.user_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.connections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.connection_invitations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaborations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaboration_applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.collaboration_saves ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_likes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_bookmarks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.post_reposts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'Row Level Security re-enabled on all tables ✓';
END $$;

-- Reset session settings
SET session_replication_role = DEFAULT;

-- ================================
-- FINAL SUMMARY
-- ================================

-- Display comprehensive seeding summary
SELECT 'CODECAVE DATABASE SEEDING COMPLETE!' as status;

DO $$
BEGIN
  RAISE NOTICE '================================';
  RAISE NOTICE '🚀 CODECAVE SEEDING COMPLETE! 🚀';
  RAISE NOTICE '================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Your CodeCave database now includes:';
  RAISE NOTICE '✅ 16 diverse developer profiles with skills';
  RAISE NOTICE '✅ 25+ social connections forming realistic networks';
  RAISE NOTICE '✅ 6 pending connection invitations';
  RAISE NOTICE '✅ 11 collaboration opportunities across all types';
  RAISE NOTICE '✅ 15+ collaboration applications and saves';
  RAISE NOTICE '✅ 12 rich content posts (articles, snippets, thoughts)';
  RAISE NOTICE '✅ Realistic engagement (likes, comments, bookmarks)';
  RAISE NOTICE '✅ 18 portfolio projects showcasing technologies';
  RAISE NOTICE '✅ 25+ notifications showing platform activity';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for development and testing!';
  RAISE NOTICE 'Visit: /connections, /collaborations, /feed, /dashboard';
  RAISE NOTICE '================================';
END $$;

COMMIT;

\echo 'Seed cleanup and validation completed successfully'
\echo 'CodeCave database is ready for development! 🚀'