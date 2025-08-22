-- ================================
-- ENGAGEMENT SEED DATA
-- ================================
-- Creates realistic engagement data: likes, comments, bookmarks, reposts
-- Demonstrates active community interaction patterns

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- POST LIKES - Engagement Patterns
-- ================================

INSERT INTO public.post_likes (post_id, user_id, created_at) VALUES
-- Sarah's React article gets engagement from frontend developers
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('alexrodriguez'), now() - interval '3 days'),
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('emmawilson'), now() - interval '2 days'),
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('jessicabrownjs'), now() - interval '2 days'),
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('mikelearning'), now() - interval '1 day'),
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('zoedesigner'), now() - interval '1 day'),

-- Alex's open source guide gets lots of engagement from beginners
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('sarahchen'), now() - interval '1 week'),
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('jessicabrownjs'), now() - interval '6 days'),
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('mikelearning'), now() - interval '5 days'),
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('linasweden'), now() - interval '4 days'),
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('carlosfreelance'), now() - interval '3 days'),

-- Emma's CSS snippet gets frontend developer engagement
(seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css'), 
seed_user_uuid('jessicabrownjs'), now() - interval '2 days'),
(seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css'), 
seed_user_uuid('zoedesigner'), now() - interval '1 day'),
(seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css'), 
seed_user_uuid('linasweden'), now() - interval '1 day'),

-- Jessica's journey gets support from community
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('sarahchen'), now() - interval '6 days'),
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('alexrodriguez'), now() - interval '5 days'),
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('annatechlead'), now() - interval '5 days'),
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('mikelearning'), now() - interval '4 days'),
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('emmawilson'), now() - interval '4 days'),

-- Marcus's DevOps thought gets technical audience engagement
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('davidkim'), now() - interval '1 day'),
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('samuelfounder'), now() - interval '1 day'),
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('tomhacker'), now() - interval '6 hours'),

-- Priya's mobile comparison gets mobile developer interest
(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('emmawilson'), now() - interval '4 days'),
(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('jessicabrownjs'), now() - interval '3 days'),
(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('zoedesigner'), now() - interval '2 days'),

-- David's backend snippet gets backend developer engagement
(seed_post_uuid('davidkim', 'clean-error-handling-nodejs-apis'), 
seed_user_uuid('sarahchen'), now() - interval '4 days'),
(seed_post_uuid('davidkim', 'clean-error-handling-nodejs-apis'), 
seed_user_uuid('marcusjohnson'), now() - interval '3 days'),
(seed_post_uuid('davidkim', 'clean-error-handling-nodejs-apis'), 
seed_user_uuid('carlosfreelance'), now() - interval '2 days'),

-- Raj's AI article gets data science community engagement
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('mikelearning'), now() - interval '7 days'),
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('samuelfounder'), now() - interval '6 days'),
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('linasweden'), now() - interval '5 days'),

-- Tom's security post gets security-conscious engagement
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('davidkim'), now() - interval '2 weeks'),
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('samuelfounder'), now() - interval '1 week'),
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('annatechlead'), now() - interval '1 week'),

-- Anna's leadership article gets management-interested engagement
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('sarahchen'), now() - interval '9 days'),
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('marcusjohnson'), now() - interval '8 days'),
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('samuelfounder'), now() - interval '7 days'),

-- Cross-engagement showing community interaction
(seed_post_uuid('linasweden', 'unity-performance-optimization-tips'), 
seed_user_uuid('mikelearning'), now() - interval '2 days'),
(seed_post_uuid('mikelearning', 'why-i-love-competitive-programming'), 
seed_user_uuid('rajsingh'), now() - interval '1 day'),
(seed_post_uuid('zoedesigner', 'building-scalable-design-systems'), 
seed_user_uuid('emmawilson'), now() - interval '1 week');

-- ================================
-- POST COMMENTS - Community Discussions
-- ================================

INSERT INTO public.post_comments (post_id, author_id, content, created_at) VALUES
-- Comments on Alex's open source guide (encouraging beginners)
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('jessicabrownjs'),
'This is exactly what I needed! I''ve been wanting to contribute to open source but didn''t know where to start. Thanks Alex!',
now() - interval '6 days'),

(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('mikelearning'),
'Great guide! I made my first contribution last week following these steps. The community was so welcoming.',
now() - interval '4 days'),

(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('carlosfreelance'),
'As someone who started with open source, this guide is spot on. Especially the part about starting small!',
now() - interval '3 days'),

-- Comments on Jessica's journey (community support)
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('sarahchen'),
'Congratulations Jessica! Your journey is inspiring. Keep up the great work!',
now() - interval '5 days'),

(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('annatechlead'),
'Amazing story! The portfolio advice is spot on. Projects beat tutorials every time.',
now() - interval '5 days'),

(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('alexrodriguez'),
'Love seeing success stories like this. The community grows stronger with every new developer!',
now() - interval '4 days'),

-- Comments on Sarah's React article (technical discussion)
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('emmawilson'),
'Really helpful article! I''ve been struggling with WebSocket state management. Your approach makes a lot of sense.',
now() - interval '2 days'),

(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('davidkim'),
'Great backend perspective on the WebSocket handling. Have you considered using Redis for state synchronization?',
now() - interval '1 day'),

-- Comments on Tom's security snippet (security discussion)
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('davidkim'),
'Security is so important but often overlooked. Thanks for the practical example!',
now() - interval '1 week'),

(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('annatechlead'),
'We implemented something similar at my company. The short expiration times are crucial for security.',
now() - interval '1 week'),

-- Comments on Anna's leadership article (career guidance)
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('marcusjohnson'),
'This resonates so much! The delegation part was the hardest for me too when I moved into team lead roles.',
now() - interval '8 days'),

(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('jessicabrownjs'),
'Saving this for the future! Still learning to code but already thinking about career growth.',
now() - interval '7 days'),

-- Comments on Priya's mobile comparison (technology discussion)
(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('linasweden'),
'Great comparison! As a game dev, I''ve been curious about mobile development. This helps me understand the landscape.',
now() - interval '3 days'),

(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('emmawilson'),
'The React Native ecosystem point is so true. Having React knowledge definitely makes the transition easier.',
now() - interval '2 days'),

-- Comments on Marcus's DevOps thought (future technology discussion)
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('samuelfounder'),
'AI-assisted infrastructure is exactly what we''re building! The potential for cost optimization is huge.',
now() - interval '1 day'),

(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('rajsingh'),
'From an AI perspective, the data patterns in infrastructure are perfect for machine learning optimization.',
now() - interval '6 hours'),

-- Comments on Mike's competitive programming (student community)
(seed_post_uuid('mikelearning', 'why-i-love-competitive-programming'), 
seed_user_uuid('jessicabrownjs'),
'I should try competitive programming! It sounds like great practice for technical interviews.',
now() - interval '1 day'),

(seed_post_uuid('mikelearning', 'why-i-love-competitive-programming'), 
seed_user_uuid('rajsingh'),
'Competitive programming taught me so much about algorithms too. The time pressure really helps with problem-solving skills.',
now() - interval '12 hours');

-- ================================
-- POST BOOKMARKS - Saved Content
-- ================================

INSERT INTO public.post_bookmarks (post_id, user_id, created_at) VALUES
-- Junior developers bookmarking learning content
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('jessicabrownjs'), now() - interval '1 week'),
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('jessicabrownjs'), now() - interval '7 days'),
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('mikelearning'), now() - interval '5 days'),

-- Developers bookmarking relevant technical content
(seed_post_uuid('davidkim', 'clean-error-handling-nodejs-apis'), 
seed_user_uuid('sarahchen'), now() - interval '3 days'),
(seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css'), 
seed_user_uuid('zoedesigner'), now() - interval '2 days'),
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('davidkim'), now() - interval '1 week'),

-- Cross-domain interest bookmarks
(seed_post_uuid('linasweden', 'unity-performance-optimization-tips'), 
seed_user_uuid('marcusjohnson'), now() - interval '2 days'), -- DevOps interested in performance
(seed_post_uuid('carlosfreelance', 'freelance-developer-client-communication'), 
seed_user_uuid('samuelfounder'), now() - interval '4 days'), -- Founder interested in client relations
(seed_post_uuid('samuelfounder', 'ai-developer-tools-future'), 
seed_user_uuid('rajsingh'), now() - interval '1 day'), -- AI researcher interested in tools

-- Technical specialists bookmarking reference content
(seed_post_uuid('zoedesigner', 'building-scalable-design-systems'), 
seed_user_uuid('emmawilson'), now() - interval '1 week'),
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('davidkim'), now() - interval '1 day');

-- ================================
-- POST REPOSTS - Content Sharing
-- ================================

INSERT INTO public.post_reposts (post_id, user_id, created_at) VALUES
-- High-quality content gets shared
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('annatechlead'), now() - interval '5 days'), -- Tech lead sharing with team

(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('sarahchen'), now() - interval '4 days'), -- Senior dev sharing inspiring story

(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('samuelfounder'), now() - interval '7 days'), -- Founder sharing leadership content

(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('annatechlead'), now() - interval '1 week'), -- Tech lead sharing security best practices

-- Students sharing educational content
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('mikelearning'), now() - interval '3 days'),

-- Freelancer sharing business content
(seed_post_uuid('carlosfreelance', 'freelance-developer-client-communication'), 
seed_user_uuid('zoedesigner'), now() - interval '2 days');

-- ================================
-- UPDATE POST ENGAGEMENT COUNTS
-- ================================
-- Update post statistics based on actual engagement data

-- Update like counts
UPDATE public.posts SET like_count = (
  SELECT COUNT(*) FROM public.post_likes WHERE post_id = posts.id
);

-- Update comment counts  
UPDATE public.posts SET comment_count = (
  SELECT COUNT(*) FROM public.post_comments WHERE post_id = posts.id
);

-- Update repost counts
UPDATE public.posts SET repost_count = (
  SELECT COUNT(*) FROM public.post_reposts WHERE post_id = posts.id
);

-- ================================
-- VALIDATION
-- ================================

-- Verify engagement data integrity
DO $$
DECLARE
  like_count integer;
  comment_count integer;
  bookmark_count integer;
  repost_count integer;
  invalid_post_refs integer;
  invalid_user_refs integer;
BEGIN
  SELECT COUNT(*) INTO like_count FROM public.post_likes;
  SELECT COUNT(*) INTO comment_count FROM public.post_comments;
  SELECT COUNT(*) INTO bookmark_count FROM public.post_bookmarks;
  SELECT COUNT(*) INTO repost_count FROM public.post_reposts;
  
  -- Check for invalid post references across all engagement tables
  SELECT COUNT(*) INTO invalid_post_refs FROM (
    SELECT post_id FROM public.post_likes
    UNION SELECT post_id FROM public.post_comments
    UNION SELECT post_id FROM public.post_bookmarks
    UNION SELECT post_id FROM public.post_reposts
  ) engagement
  LEFT JOIN public.posts p ON engagement.post_id = p.id
  WHERE p.id IS NULL;
  
  -- Check for invalid user references across all engagement tables
  SELECT COUNT(*) INTO invalid_user_refs FROM (
    SELECT user_id FROM public.post_likes
    UNION SELECT author_id FROM public.post_comments
    UNION SELECT user_id FROM public.post_bookmarks
    UNION SELECT user_id FROM public.post_reposts
  ) engagement
  LEFT JOIN public.profiles p ON engagement.user_id = p.id
  WHERE p.id IS NULL;
  
  IF invalid_post_refs > 0 THEN
    RAISE EXCEPTION 'Found % invalid post references in engagement data', invalid_post_refs;
  END IF;
  
  IF invalid_user_refs > 0 THEN
    RAISE EXCEPTION 'Found % invalid user references in engagement data', invalid_user_refs;
  END IF;
  
  IF like_count = 0 THEN
    RAISE EXCEPTION 'No post likes were created';
  END IF;
  
  RAISE NOTICE 'Engagement seeded successfully: % likes, % comments, % bookmarks, % reposts', 
    like_count, comment_count, bookmark_count, repost_count;
END $$;

-- ================================
-- UPDATE COLLABORATION COUNTS
-- ================================
-- Update collaboration statistics based on actual application and save data

-- Update collaboration application counts
UPDATE public.collaborations SET application_count = (
  SELECT COUNT(*) FROM public.collaboration_applications 
  WHERE collaboration_id = collaborations.id
);

-- Update collaboration save counts
UPDATE public.collaborations SET save_count = (
  SELECT COUNT(*) FROM public.collaboration_saves 
  WHERE collaboration_id = collaborations.id
);

-- Verify collaboration count updates
DO $$
DECLARE
  total_applications integer;
  total_saves integer;
BEGIN
  SELECT SUM(application_count) INTO total_applications FROM public.collaborations;
  SELECT SUM(save_count) INTO total_saves FROM public.collaborations;
  
  RAISE NOTICE 'Collaboration counts updated: % total applications, % total saves', 
    total_applications, total_saves;
END $$;

COMMIT;

\echo 'Engagement seeding completed successfully'