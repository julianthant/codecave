-- ================================
-- CONNECTIONS SEED DATA
-- ================================
-- Creates realistic social network connections and invitations
-- Uses deterministic UUIDs from profiles for relationships

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- CONNECTIONS - Following Network
-- ================================

INSERT INTO public.connections (follower_id, following_id, created_at) VALUES
-- Popular developers (Sarah, Alex, Anna) get more followers
(seed_user_uuid('alexrodriguez'), seed_user_uuid('sarahchen'), now() - interval '5 months'), -- Alex follows Sarah
(seed_user_uuid('emmawilson'), seed_user_uuid('sarahchen'), now() - interval '4 months'), -- Emma follows Sarah
(seed_user_uuid('marcusjohnson'), seed_user_uuid('sarahchen'), now() - interval '3 months'), -- Marcus follows Sarah
(seed_user_uuid('priyapatel'), seed_user_uuid('sarahchen'), now() - interval '2 months'), -- Priya follows Sarah
(seed_user_uuid('davidkim'), seed_user_uuid('sarahchen'), now() - interval '1 month'),  -- David follows Sarah
(seed_user_uuid('jessicabrownjs'), seed_user_uuid('sarahchen'), now() - interval '3 weeks'),  -- Jessica follows Sarah

-- Alex (open source) connections
(seed_user_uuid('sarahchen'), seed_user_uuid('alexrodriguez'), now() - interval '5 months'), -- Sarah follows Alex back
(seed_user_uuid('marcusjohnson'), seed_user_uuid('alexrodriguez'), now() - interval '4 months'), -- Marcus follows Alex
(seed_user_uuid('rajsingh'), seed_user_uuid('alexrodriguez'), now() - interval '3 months'), -- Raj follows Alex
(seed_user_uuid('tomhacker'), seed_user_uuid('alexrodriguez'), now() - interval '2 months'), -- Tom follows Alex
(seed_user_uuid('annatechlead'), seed_user_uuid('alexrodriguez'), now() - interval '6 months'), -- Anna follows Alex

-- Cross-connections between developers with similar interests
(seed_user_uuid('emmawilson'), seed_user_uuid('priyapatel'), now() - interval '2 months'), -- Emma follows Priya (frontend/mobile)
(seed_user_uuid('priyapatel'), seed_user_uuid('emmawilson'), now() - interval '2 months'), -- Priya follows Emma back
(seed_user_uuid('davidkim'), seed_user_uuid('marcusjohnson'), now() - interval '1 month'),  -- David follows Marcus (backend/devops)
(seed_user_uuid('jessicabrownjs'), seed_user_uuid('emmawilson'), now() - interval '1 month'),  -- Jessica follows Emma (frontend)
(seed_user_uuid('rajsingh'), seed_user_uuid('davidkim'), now() - interval '3 weeks'),  -- Raj follows David (data/backend)

-- Game developer connections
(seed_user_uuid('linasweden'), seed_user_uuid('emmawilson'), now() - interval '2 weeks'),  -- Lina follows Emma (creative tech)
(seed_user_uuid('linasweden'), seed_user_uuid('rajsingh'), now() - interval '1 month'),  -- Lina follows Raj (game AI)

-- Student connections
(seed_user_uuid('mikelearning'), seed_user_uuid('jessicabrownjs'), now() - interval '1 week'),   -- Mike follows Jessica (learning)
(seed_user_uuid('mikelearning'), seed_user_uuid('rajsingh'), now() - interval '2 weeks'),   -- Mike follows Raj (algorithms/ML)
(seed_user_uuid('mikelearning'), seed_user_uuid('alexrodriguez'), now() - interval '1 month'),   -- Mike follows Alex (open source)

-- Tech lead connections
(seed_user_uuid('annatechlead'), seed_user_uuid('marcusjohnson'), now() - interval '5 months'), -- Anna follows Marcus
(seed_user_uuid('carlosfreelance'), seed_user_uuid('annatechlead'), now() - interval '3 months'), -- Carlos follows Anna
(seed_user_uuid('samuelfounder'), seed_user_uuid('annatechlead'), now() - interval '1 year'),   -- Samuel follows Anna

-- Founder/startup connections
(seed_user_uuid('samuelfounder'), seed_user_uuid('sarahchen'), now() - interval '8 months'), -- Samuel follows Sarah
(seed_user_uuid('samuelfounder'), seed_user_uuid('alexrodriguez'), now() - interval '6 months'), -- Samuel follows Alex
(seed_user_uuid('samuelfounder'), seed_user_uuid('rajsingh'), now() - interval '4 months'), -- Samuel follows Raj (AI interest)

-- Design engineer connections
(seed_user_uuid('zoedesigner'), seed_user_uuid('emmawilson'), now() - interval '2 months'), -- Zoe follows Emma (design)
(seed_user_uuid('zoedesigner'), seed_user_uuid('sarahchen'), now() - interval '4 months'), -- Zoe follows Sarah

-- Freelancer connections (networking)
(seed_user_uuid('carlosfreelance'), seed_user_uuid('samuelfounder'), now() - interval '6 months'), -- Carlos follows Samuel
(seed_user_uuid('carlosfreelance'), seed_user_uuid('emmawilson'), now() - interval '3 months'), -- Carlos follows Emma
(seed_user_uuid('carlosfreelance'), seed_user_uuid('priyapatel'), now() - interval '1 month'), -- Carlos follows Priya

-- Security engineer connections
(seed_user_uuid('tomhacker'), seed_user_uuid('davidkim'), now() - interval '2 months'), -- Tom follows David (backend security)
(seed_user_uuid('tomhacker'), seed_user_uuid('samuelfounder'), now() - interval '4 months'), -- Tom follows Samuel (startup security)

-- Mutual follows for active collaborators
(seed_user_uuid('marcusjohnson'), seed_user_uuid('davidkim'), now() - interval '2 weeks'), -- Marcus follows David back
(seed_user_uuid('emmawilson'), seed_user_uuid('zoedesigner'), now() - interval '1 month'), -- Emma follows Zoe back
(seed_user_uuid('rajsingh'), seed_user_uuid('mikelearning'), now() - interval '1 week'), -- Raj follows Mike back (mentoring)

-- Senior developers following each other
(seed_user_uuid('annatechlead'), seed_user_uuid('sarahchen'), now() - interval '7 months'),
(seed_user_uuid('samuelfounder'), seed_user_uuid('tomhacker'), now() - interval '5 months'),
(seed_user_uuid('davidkim'), seed_user_uuid('annatechlead'), now() - interval '3 months');

-- ================================
-- CONNECTION INVITATIONS - Pending
-- ================================

INSERT INTO public.connection_invitations (sender_id, receiver_id, message, status, created_at, responded_at) VALUES
-- Pending invitations from junior to senior developers
(seed_user_uuid('jessicabrownjs'), seed_user_uuid('alexrodriguez'), 
'Hi Alex! I''m a junior developer and really admire your open source work. Would love to connect and learn from you!', 
'pending', now() - interval '2 days', null),

(seed_user_uuid('mikelearning'), seed_user_uuid('rajsingh'), 
'Hey Raj! Fellow student here interested in machine learning. Your projects look amazing!', 
'pending', now() - interval '1 day', null),

(seed_user_uuid('linasweden'), seed_user_uuid('tomhacker'), 
'Hi Tom! Game developer here. Interested in learning more about security in game development.', 
'pending', now() - interval '3 days', null),

(seed_user_uuid('carlosfreelance'), seed_user_uuid('samuelfounder'), 
'Hey Samuel! Freelancer here. Would love to discuss potential collaboration opportunities.', 
'pending', now() - interval '5 days', null),

-- Cross-domain interest invitations
(seed_user_uuid('zoedesigner'), seed_user_uuid('linasweden'), 
'Hi Lina! Design engineer here. Love your game development work - interested in the visual design aspects!', 
'pending', now() - interval '1 day', null),

(seed_user_uuid('davidkim'), seed_user_uuid('tomhacker'), 
'Hi Tom! Backend developer interested in learning more about application security. Your expertise would be valuable!', 
'pending', now() - interval '4 days', null),

-- Recently accepted invitations
(seed_user_uuid('jessicabrownjs'), seed_user_uuid('annatechlead'), 
'Hi Anna! Junior developer seeking mentorship. Your experience in tech leadership is inspiring!', 
'accepted', now() - interval '1 week', now() - interval '1 week'),

(seed_user_uuid('mikelearning'), seed_user_uuid('annatechlead'), 
'Hi Anna! CS student interested in technical leadership. Would love to learn from your experience!', 
'accepted', now() - interval '5 days', now() - interval '3 days'),

-- Recently declined invitations
(seed_user_uuid('mikelearning'), seed_user_uuid('samuelfounder'), 
'Hi! Student looking for internship opportunities at your startup.', 
'declined', now() - interval '10 days', now() - interval '8 days'),

(seed_user_uuid('carlosfreelance'), seed_user_uuid('annatechlead'), 
'Hi Anna! Freelancer looking for tech lead consulting opportunities.', 
'declined', now() - interval '2 weeks', now() - interval '10 days');

-- ================================
-- VALIDATION
-- ================================

-- Verify all connections reference valid profiles
DO $$
DECLARE
  connection_count integer;
  invalid_connections integer;
  invitation_count integer;
BEGIN
  SELECT COUNT(*) INTO connection_count FROM public.connections;
  SELECT COUNT(*) INTO invitation_count FROM public.connection_invitations;
  
  -- Check for invalid foreign key references
  SELECT COUNT(*) INTO invalid_connections 
  FROM public.connections c
  LEFT JOIN public.profiles p1 ON c.follower_id = p1.id
  LEFT JOIN public.profiles p2 ON c.following_id = p2.id
  WHERE p1.id IS NULL OR p2.id IS NULL;
  
  IF invalid_connections > 0 THEN
    RAISE EXCEPTION 'Found % invalid connection references', invalid_connections;
  END IF;
  
  IF connection_count = 0 THEN
    RAISE EXCEPTION 'No connections were created';
  END IF;
  
  IF invitation_count = 0 THEN
    RAISE EXCEPTION 'No connection invitations were created';
  END IF;
  
  RAISE NOTICE 'Connections seeded successfully: % connections, % invitations', 
    connection_count, invitation_count;
END $$;

COMMIT;

\echo 'Connection seeding completed successfully'