-- ================================
-- CODECAVE DATABASE SEED ENTRY POINT
-- ================================
-- Main seeding entry point for CodeCave development database
-- 
-- This file serves as the entry point for the modular seeding system.
-- It executes all seed files in the correct order and provides legacy
-- compatibility for direct execution.
--
-- USAGE:
--   supabase db reset                    (recommended - uses config.toml)
--   psql $DATABASE_URL -f seed.sql       (direct execution)
--
-- STRUCTURE:
--   This file coordinates execution of modular seed files in the seeds/
--   directory. Each file handles a specific domain (profiles, posts, etc.)
--   and can be run independently for testing.

-- Error handling for the entire seeding process
\set ON_ERROR_STOP on
\set VERBOSITY verbose

-- Display seeding start message
\echo ''
\echo '================================'
\echo '🚀 CODECAVE DATABASE SEEDING 🚀'
\echo '================================'
\echo 'Starting comprehensive database seeding...'
\echo 'This will create realistic developer community data'
\echo ''

-- ================================
-- EXECUTE MODULAR SEED FILES
-- ================================

-- 00-setup.sql: RLS disable, cleanup, helper functions
\echo '1/9 Running setup and helper functions...'
\ir seeds/00-setup.sql

-- 01-profiles.sql: User profiles and settings
\echo '2/9 Seeding user profiles and settings...'
\ir seeds/01-profiles.sql

-- 02-connections.sql: Social connections and invitations
\echo '3/9 Creating social network connections...'
\ir seeds/02-connections.sql

-- 03-collaborations.sql: Collaboration opportunities and applications
\echo '4/9 Adding collaboration opportunities...'
\ir seeds/03-collaborations.sql

-- 04-posts.sql: Content posts with rich data
\echo '5/9 Creating content posts and articles...'
\ir seeds/04-posts.sql

-- 05-projects.sql: Portfolio projects
\echo '6/9 Adding portfolio projects...'
\ir seeds/05-projects.sql

-- 06-notifications.sql: User notifications
\echo '7/9 Generating user notifications...'
\ir seeds/06-notifications.sql

-- 07-engagement.sql: Post engagement (likes, comments, etc.)
\echo '8/9 Creating post engagement data...'
\ir seeds/07-engagement.sql

-- 99-cleanup.sql: RLS re-enable, validation, summary
\echo '9/9 Finalizing and validating seed data...'
\ir seeds/99-cleanup.sql

-- ================================
-- LEGACY COMPATIBILITY NOTICE
-- ================================

\echo ''
\echo '================================'
\echo 'SEEDING COMPLETED SUCCESSFULLY!'
\echo '================================'
\echo ''
\echo 'Next steps:'
\echo '• Visit /connections to see the social network'
\echo '• Visit /collaborations to browse opportunities'  
\echo '• Visit /feed to view posts and engagement'
\echo '• Visit /dashboard to see activity metrics'
\echo ''
\echo 'For future seeding:'
\echo '• Use: supabase db reset (recommended)'
\echo '• Or: pnpm db:seed'
\echo '• Individual domains: psql $DATABASE_URL -f seeds/01-profiles.sql'
\echo ''
\echo 'Documentation: supabase/CLAUDE.md'
\echo 'Happy coding! 🎉'
\echo ''