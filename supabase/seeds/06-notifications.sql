-- ================================
-- NOTIFICATIONS SEED DATA
-- ================================
-- Creates realistic notification data showing platform activity
-- Includes different notification types with proper data structure

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- NOTIFICATIONS - User Activity
-- ================================

INSERT INTO public.notifications (
  id, user_id, type, title, message, data, read, created_at
) VALUES
-- Sarah's notifications (popular user gets more activity)
(seed_notification_uuid('sarahchen', 'follow', 1), 
 seed_user_uuid('sarahchen'), 'follow',
 'New Follower', 'Jessica Brown started following you',
 ('{"followerId": "' || seed_user_uuid('jessicabrownjs') || '", "followerUsername": "jessicabrownjs"}')::jsonb,
 false, now() - interval '3 hours'),

(seed_notification_uuid('sarahchen', 'like', 1), 
 seed_user_uuid('sarahchen'), 'like',
 'Post Liked', 'Alex Rodriguez liked your post "Building Real-time Collaborative Features"',
 ('{"postId": "' || seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets') || '", "likerUsername": "alexrodriguez"}')::jsonb,
 false, now() - interval '1 day'),

(seed_notification_uuid('sarahchen', 'collaboration', 1), 
 seed_user_uuid('sarahchen'), 'collaboration',
 'Application Received', 'You received a new application for "Real-time Collaborative Code Editor"',
 ('{"collaborationId": "' || seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen') || '", "applicantUsername": "jessicabrownjs"}')::jsonb,
 false, now() - interval '2 days'),

(seed_notification_uuid('sarahchen', 'collaboration', 2), 
 seed_user_uuid('sarahchen'), 'collaboration',
 'Application Accepted', 'Emma Wilson accepted your collaboration application',
 ('{"collaborationId": "' || seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder') || '", "status": "accepted"}')::jsonb,
 true, now() - interval '1 week'),

-- Alex's notifications (open source maintainer activity)
(seed_notification_uuid('alexrodriguez', 'comment', 1), 
 seed_user_uuid('alexrodriguez'), 'comment',
 'New Comment', 'Jessica Brown commented on your post "Your First Open Source Contribution"',
 ('{"postId": "' || seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide') || '", "commenterUsername": "jessicabrownjs"}')::jsonb,
 true, now() - interval '6 days'),

(seed_notification_uuid('alexrodriguez', 'collaboration', 1), 
 seed_user_uuid('alexrodriguez'), 'collaboration',
 'New Collaboration Application', 'Marcus Johnson applied to your "JavaScript Performance Optimizer"',
 ('{"collaborationId": "' || seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez') || '", "applicantUsername": "marcusjohnson"}')::jsonb,
 false, now() - interval '1 week'),

(seed_notification_uuid('alexrodriguez', 'follow', 1), 
 seed_user_uuid('alexrodriguez'), 'follow',
 'New Follower', 'Raj Singh started following you',
 ('{"followerId": "' || seed_user_uuid('rajsingh') || '", "followerUsername": "rajsingh"}')::jsonb,
 false, now() - interval '3 days'),

-- Jessica's notifications (junior developer getting community support)
(seed_notification_uuid('jessicabrownjs', 'follow', 1), 
 seed_user_uuid('jessicabrownjs'), 'follow',
 'Follow Back', 'Sarah Chen followed you back',
 ('{"followerId": "' || seed_user_uuid('sarahchen') || '", "followerUsername": "sarahchen"}')::jsonb,
 false, now() - interval '2 hours'),

(seed_notification_uuid('jessicabrownjs', 'like', 1), 
 seed_user_uuid('jessicabrownjs'), 'like',
 'Post Liked', 'Anna Schmidt liked your post "My Coding Bootcamp to First Job Journey"',
 ('{"postId": "' || seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey') || '", "likerUsername": "annatechlead"}')::jsonb,
 false, now() - interval '5 days'),

(seed_notification_uuid('jessicabrownjs', 'collaboration', 1), 
 seed_user_uuid('jessicabrownjs'), 'collaboration',
 'Application Accepted', 'You were accepted to the "Algorithm Study Group"',
 ('{"collaborationId": "' || seed_collab_uuid('Algorithm Study Group', 'mikelearning') || '", "status": "accepted"}')::jsonb,
 true, now() - interval '1 day'),

(seed_notification_uuid('jessicabrownjs', 'system', 1), 
 seed_user_uuid('jessicabrownjs'), 'system',
 'Welcome to CodeCave!', 'Welcome to the CodeCave community! Start by completing your profile and connecting with other developers.',
 ('{"action": "complete-profile"}')::jsonb,
 true, now() - interval '2 months'),

-- Emma's notifications (frontend specialist)
(seed_notification_uuid('emmawilson', 'collaboration', 1), 
 seed_user_uuid('emmawilson'), 'collaboration',
 'Application Accepted', 'You were accepted to the "Real-time Collaborative Code Editor" project',
 ('{"collaborationId": "' || seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen') || '", "status": "accepted"}')::jsonb,
 false, now() - interval '3 days'),

(seed_notification_uuid('emmawilson', 'like', 1), 
 seed_user_uuid('emmawilson'), 'like',
 'Post Liked', 'Zoe Taylor liked your post "Perfect Center Alignment with Modern CSS"',
 ('{"postId": "' || seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css') || '", "likerUsername": "zoedesigner"}')::jsonb,
 false, now() - interval '1 day'),

-- Marcus's notifications (DevOps engineer)
(seed_notification_uuid('marcusjohnson', 'collaboration', 1), 
 seed_user_uuid('marcusjohnson'), 'collaboration',
 'New Application', 'David Kim applied to your "Kubernetes Deployment Dashboard"',
 ('{"collaborationId": "' || seed_collab_uuid('Kubernetes Deployment Dashboard', 'marcusjohnson') || '", "applicantUsername": "davidkim"}')::jsonb,
 false, now() - interval '2 days'),

(seed_notification_uuid('marcusjohnson', 'like', 1), 
 seed_user_uuid('marcusjohnson'), 'like',
 'Post Liked', 'Samuel Johnson liked your post "The Future of Infrastructure as Code"',
 ('{"postId": "' || seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code') || '", "likerUsername": "samuelfounder"}')::jsonb,
 false, now() - interval '1 day'),

-- Mike's notifications (student getting guidance)
(seed_notification_uuid('mikelearning', 'system', 2), 
 seed_user_uuid('mikelearning'), 'system',
 'Weekly Digest', 'Here are the top posts and collaborations from this week in your network.',
 ('{"type": "weekly-digest"}')::jsonb,
 false, now() - interval '1 day'),

(seed_notification_uuid('mikelearning', 'follow', 1), 
 seed_user_uuid('mikelearning'), 'follow',
 'Follow Back', 'Raj Singh followed you back',
 ('{"followerId": "' || seed_user_uuid('rajsingh') || '", "followerUsername": "rajsingh"}')::jsonb,
 false, now() - interval '1 week'),

(seed_notification_uuid('mikelearning', 'collaboration', 1), 
 seed_user_uuid('mikelearning'), 'collaboration',
 'Application Received', 'Jessica Brown applied to your "Algorithm Study Group"',
 ('{"collaborationId": "' || seed_collab_uuid('Algorithm Study Group', 'mikelearning') || '", "applicantUsername": "jessicabrownjs"}')::jsonb,
 false, now() - interval '3 days'),

-- Anna's notifications (tech lead with mentoring activity)
(seed_notification_uuid('annatechlead', 'collaboration', 1), 
 seed_user_uuid('annatechlead'), 'collaboration',
 'New Mentor Application', 'Sarah Chen applied to be a mentor in your program',
 ('{"collaborationId": "' || seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead') || '", "applicantUsername": "sarahchen"}')::jsonb,
 true, now() - interval '6 days'),

(seed_notification_uuid('annatechlead', 'collaboration', 2), 
 seed_user_uuid('annatechlead'), 'collaboration',
 'Mentor Application Approved', 'Alex Rodriguez was approved as a mentor',
 ('{"collaborationId": "' || seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead') || '", "mentorUsername": "alexrodriguez"}')::jsonb,
 true, now() - interval '4 days'),

-- Tom's security-focused notifications
(seed_notification_uuid('tomhacker', 'collaboration', 1), 
 seed_user_uuid('tomhacker'), 'collaboration',
 'Security Project Application', 'David Kim applied to your "Web Application Security Scanner"',
 ('{"collaborationId": "' || seed_collab_uuid('Web Application Security Scanner', 'tomhacker') || '", "applicantUsername": "davidkim"}')::jsonb,
 false, now() - interval '2 days'),

(seed_notification_uuid('tomhacker', 'like', 1), 
 seed_user_uuid('tomhacker'), 'like',
 'Post Liked', 'David Kim liked your post "Secure JWT Implementation in Node.js"',
 ('{"postId": "' || seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs') || '", "likerUsername": "davidkim"}')::jsonb,
 false, now() - interval '1 week'),

-- Raj's AI/ML notifications
(seed_notification_uuid('rajsingh', 'collaboration', 1), 
 seed_user_uuid('rajsingh'), 'collaboration',
 'Startup Opportunity', 'Samuel Johnson invited you to join "AI-Powered Developer Assistant"',
 ('{"collaborationId": "' || seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder') || '", "inviterUsername": "samuelfounder"}')::jsonb,
 false, now() - interval '4 days'),

-- David's backend notifications
(seed_notification_uuid('davidkim', 'collaboration', 1), 
 seed_user_uuid('davidkim'), 'collaboration',
 'GraphQL Project Interest', 'Marcus Johnson saved your "GraphQL API for E-commerce Platform"',
 ('{"collaborationId": "' || seed_collab_uuid('GraphQL API for E-commerce Platform', 'davidkim') || '", "saverUsername": "marcusjohnson"}')::jsonb,
 false, now() - interval '1 day'),

-- Priya's mobile development notifications
(seed_notification_uuid('priyapatel', 'collaboration', 1), 
 seed_user_uuid('priyapatel'), 'collaboration',
 'Mobile App Application', 'Jessica Brown applied to your "Cross-Platform Fitness Tracking App"',
 ('{"collaborationId": "' || seed_collab_uuid('Cross-Platform Fitness Tracking App', 'priyapatel') || '", "applicantUsername": "jessicabrownjs"}')::jsonb,
 false, now() - interval '1 day'),

-- Lina's game development notifications
(seed_notification_uuid('linasweden', 'like', 1), 
 seed_user_uuid('linasweden'), 'like',
 'Post Liked', 'Mike Chen liked your post "Unity Performance Optimization: 5 Essential Tips"',
 ('{"postId": "' || seed_post_uuid('linasweden', 'unity-performance-optimization-tips') || '", "likerUsername": "mikelearning"}')::jsonb,
 false, now() - interval '2 days'),

-- Samuel's startup notifications
(seed_notification_uuid('samuelfounder', 'collaboration', 1), 
 seed_user_uuid('samuelfounder'), 'collaboration',
 'Co-founder Interest', 'Sarah Chen accepted your co-founder invitation',
 ('{"collaborationId": "' || seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder') || '", "cofounderUsername": "sarahchen"}')::jsonb,
 false, now() - interval '4 days'),

-- Carlos's freelancer notifications
(seed_notification_uuid('carlosfreelance', 'follow', 1), 
 seed_user_uuid('carlosfreelance'), 'follow',
 'New Connection', 'Anna Schmidt accepted your connection request',
 ('{"connectionId": "' || gen_random_uuid() || '", "connectedUsername": "annatechlead"}')::jsonb,
 true, now() - interval '3 months'),

-- Zoe's design notifications
(seed_notification_uuid('zoedesigner', 'like', 1), 
 seed_user_uuid('zoedesigner'), 'like',
 'Project Liked', 'Emma Wilson liked your "Component Library Builder" project',
 ('{"projectId": "' || seed_project_uuid('Component Library Builder', 'zoedesigner') || '", "likerUsername": "emmawilson"}')::jsonb,
 false, now() - interval '1 day'),

-- System notifications for new users
(seed_notification_uuid('mikelearning', 'system', 1), 
 seed_user_uuid('mikelearning'), 'system',
 'Profile Complete!', 'Great job completing your profile! Start exploring collaborations and connecting with developers.',
 ('{"action": "explore-collaborations", "completionPercentage": 100}')::jsonb,
 true, now() - interval '3 months'),

(seed_notification_uuid('jessicabrownjs', 'system', 2), 
 seed_user_uuid('jessicabrownjs'), 'system',
 'First Week Achievement', 'You''ve been active for a week! Keep engaging with the community.',
 ('{"achievement": "first-week", "encouragement": true}')::jsonb,
 true, now() - interval '1 month'),

-- Weekly digest notifications
(seed_notification_uuid('emmawilson', 'system', 1), 
 seed_user_uuid('emmawilson'), 'system',
 'Weekly Digest', 'Top posts in your network: React performance tips, CSS animations, and design systems.',
 ('{"type": "weekly-digest", "topPosts": ["react-performance", "css-animations"], "newConnections": 3}')::jsonb,
 false, now() - interval '2 days'),

(seed_notification_uuid('marcusjohnson', 'system', 1), 
 seed_user_uuid('marcusjohnson'), 'system',
 'Weekly Digest', 'DevOps trends this week: Infrastructure automation, Kubernetes best practices.',
 ('{"type": "weekly-digest", "topPosts": ["infrastructure-automation", "k8s-best-practices"], "newCollaborations": 2}')::jsonb,
 false, now() - interval '1 day'),

-- Collaboration milestone notifications
(seed_notification_uuid('annatechlead', 'collaboration', 3), 
 seed_user_uuid('annatechlead'), 'collaboration',
 'Mentorship Milestone', 'Your mentorship program now has 5 mentors and 12 mentees!',
 ('{"collaborationId": "' || seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead') || '", "milestone": "team-growth", "mentorCount": 5, "menteeCount": 12}')::jsonb,
 false, now() - interval '2 days'),

-- Content engagement notifications
(seed_notification_uuid('rajsingh', 'like', 1), 
 seed_user_uuid('rajsingh'), 'like',
 'Post Popular', 'Your "TensorFlow.js in Browser" post reached 100 likes!',
 ('{"postId": "' || seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser') || '", "milestone": "100-likes"}')::jsonb,
 false, now() - interval '1 week'),

(seed_notification_uuid('tomhacker', 'comment', 1), 
 seed_user_uuid('tomhacker'), 'comment',
 'Security Discussion', 'David Kim started a discussion on your JWT security post',
 ('{"postId": "' || seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs') || '", "commenterUsername": "davidkim", "type": "discussion"}')::jsonb,
 false, now() - interval '1 week'),

-- Project showcase notifications
(seed_notification_uuid('linasweden', 'system', 1), 
 seed_user_uuid('linasweden'), 'system',
 'Project Featured', 'Your "Quantum Blocks" game was featured in the Unity showcase!',
 ('{"projectId": "' || seed_project_uuid('Indie Puzzle Game', 'linasweden') || '", "showcase": "unity-featured"}')::jsonb,
 false, now() - interval '3 days'),

-- Connection invitation responses
(seed_notification_uuid('mikelearning', 'system', 3), 
 seed_user_uuid('mikelearning'), 'system',
 'Connection Accepted', 'Anna Schmidt accepted your connection request',
 ('{"requestId": "' || gen_random_uuid() || '", "connectedUsername": "annatechlead"}')::jsonb,
 true, now() - interval '3 days'),

(seed_notification_uuid('carlosfreelance', 'system', 2), 
 seed_user_uuid('carlosfreelance'), 'system',
 'Connection Request', 'Samuel Johnson sent you a connection request',
 ('{"requestId": "' || gen_random_uuid() || '", "requesterUsername": "samuelfounder"}')::jsonb,
 false, now() - interval '5 days');

-- ================================
-- VALIDATION
-- ================================

-- Verify notifications were created correctly
DO $$
DECLARE
  notification_count integer;
  invalid_users integer;
  read_count integer;
  unread_count integer;
BEGIN
  SELECT COUNT(*) INTO notification_count FROM public.notifications;
  SELECT COUNT(*) INTO read_count FROM public.notifications WHERE read = true;
  SELECT COUNT(*) INTO unread_count FROM public.notifications WHERE read = false;
  
  -- Check for invalid user references
  SELECT COUNT(*) INTO invalid_users 
  FROM public.notifications n
  LEFT JOIN public.profiles p ON n.user_id = p.id
  WHERE p.id IS NULL;
  
  IF invalid_users > 0 THEN
    RAISE EXCEPTION 'Found % notifications with invalid user references', invalid_users;
  END IF;
  
  IF notification_count = 0 THEN
    RAISE EXCEPTION 'No notifications were created';
  END IF;
  
  RAISE NOTICE 'Notifications seeded successfully: % total (% read, % unread)', 
    notification_count, read_count, unread_count;
END $$;

COMMIT;

\echo 'Notification seeding completed successfully'