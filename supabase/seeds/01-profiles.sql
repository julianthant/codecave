-- ================================
-- PROFILES SEED DATA
-- ================================
-- Creates diverse developer community profiles and user settings
-- Uses deterministic UUIDs for consistent relationships

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- PROFILES - Diverse Developer Community
-- ================================

INSERT INTO public.profiles (
  id, username, display_name, bio, avatar_url, cover_image_url, tagline,
  onboarding_completed, is_verified, location, portfolio_url,
  github_username, twitter_username, discord_username, linkedin_url,
  created_at, updated_at
) VALUES
-- Senior Full-Stack Developer
(seed_user_uuid('sarahchen'), 'sarahchen', 'Sarah Chen', 
'Senior Full-Stack Developer at TechCorp. Passionate about React, Node.js, and building scalable web applications. Always excited to mentor junior developers!', 
'https://i.pravatar.cc/150?img=1', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
'Building the future, one commit at a time ⚡',
true, true, 'San Francisco, CA', 'https://sarahchen.dev',
'sarahchen', 'sarahc_dev', 'sarah#1234', 'https://linkedin.com/in/sarahchen',
now() - interval '6 months', now()),

-- Open Source Enthusiast
(seed_user_uuid('alexrodriguez'), 'alexrodriguez', 'Alex Rodriguez',
'Open source contributor and maintainer. Core team member of several popular npm packages. Love helping developers solve complex problems.',
'https://i.pravatar.cc/150?img=2', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
'Open source is the future 🚀',
true, true, 'Austin, TX', 'https://alexr.io',
'alexrodriguez', 'alex_codes', 'alexr#5678', 'https://linkedin.com/in/alexrodriguez',
now() - interval '8 months', now()),

-- Frontend Specialist
(seed_user_uuid('emmawilson'), 'emmawilson', 'Emma Wilson',
'Frontend developer specializing in React, Vue, and modern CSS. UI/UX enthusiast with a keen eye for design and user experience.',
'https://i.pravatar.cc/150?img=3', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&h=400&fit=crop',
'Crafting beautiful user experiences ✨',
true, false, 'London, UK', 'https://emmawilson.design',
'emmawilson', 'emma_frontend', 'emma#9012', 'https://linkedin.com/in/emmawilson',
now() - interval '4 months', now()),

-- DevOps Engineer
(seed_user_uuid('marcusjohnson'), 'marcusjohnson', 'Marcus Johnson',
'DevOps Engineer with expertise in AWS, Docker, Kubernetes, and CI/CD pipelines. Love automating everything and improving developer productivity.',
'https://i.pravatar.cc/150?img=4', 'https://images.unsplash.com/photo-1518085250350-069d04471bc8?w=1200&h=400&fit=crop',
'Automate all the things! 🤖',
true, false, 'Seattle, WA', 'https://marcusj.cloud',
'marcusjohnson', 'marcus_devops', 'marcus#3456', 'https://linkedin.com/in/marcusjohnson',
now() - interval '10 months', now()),

-- Mobile Developer
(seed_user_uuid('priyapatel'), 'priyapatel', 'Priya Patel',
'Mobile app developer focused on React Native and Flutter. Building cross-platform apps that deliver amazing user experiences.',
'https://i.pravatar.cc/150?img=5', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=400&fit=crop',
'Mobile-first mindset 📱',
true, true, 'Toronto, Canada', 'https://priyapatel.app',
'priyapatel', 'priya_mobile', 'priya#7890', 'https://linkedin.com/in/priyapatel',
now() - interval '7 months', now()),

-- Backend Specialist
(seed_user_uuid('davidkim'), 'davidkim', 'David Kim',
'Backend engineer specializing in microservices, databases, and API design. Python and Go enthusiast with experience in distributed systems.',
'https://i.pravatar.cc/150?img=6', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
'Scaling systems, solving problems 🔧',
true, false, 'Vancouver, Canada', 'https://davidkim.dev',
'davidkim', 'david_backend', 'david#1111', 'https://linkedin.com/in/davidkim',
now() - interval '5 months', now()),

-- Junior Developer
(seed_user_uuid('jessicabrownjs'), 'jessicabrownjs', 'Jessica Brown',
'Junior developer passionate about JavaScript and web development. Recently graduated from coding bootcamp and eager to learn and contribute.',
'https://i.pravatar.cc/150?img=7', 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=1200&h=400&fit=crop',
'Learning every day! 🌱',
true, false, 'Chicago, IL', 'https://jessicabrown.dev',
'jessicabrownjs', 'jessica_codes', 'jess#2222', 'https://linkedin.com/in/jessicabrown',
now() - interval '2 months', now()),

-- Data Scientist
(seed_user_uuid('rajsingh'), 'rajsingh', 'Raj Singh',
'Data scientist and ML engineer. Working on AI applications using Python, TensorFlow, and PyTorch. Love turning data into insights.',
'https://i.pravatar.cc/150?img=8', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=400&fit=crop',
'Data tells stories 📊',
true, true, 'Bangalore, India', 'https://rajsingh.ai',
'rajsingh', 'raj_data', 'raj#3333', 'https://linkedin.com/in/rajsingh',
now() - interval '9 months', now()),

-- Game Developer
(seed_user_uuid('linasweden'), 'linasweden', 'Lina Andersson',
'Game developer specializing in Unity and C#. Creating immersive experiences and working on indie games in my spare time.',
'https://i.pravatar.cc/150?img=9', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&h=400&fit=crop',
'Building worlds, one pixel at a time 🎮',
true, false, 'Stockholm, Sweden', 'https://linaandersson.games',
'linasweden', 'lina_gamedev', 'lina#4444', 'https://linkedin.com/in/linaandersson',
now() - interval '6 months', now()),

-- Security Engineer
(seed_user_uuid('tomhacker'), 'tomhacker', 'Tom Wilson',
'Cybersecurity engineer focused on application security and penetration testing. Helping companies build more secure software.',
'https://i.pravatar.cc/150?img=10', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=400&fit=crop',
'Securing the digital world 🔒',
true, true, 'New York, NY', 'https://tomwilson.security',
'tomhacker', 'tom_security', 'tom#5555', 'https://linkedin.com/in/tomwilson',
now() - interval '11 months', now()),

-- Student Developer
(seed_user_uuid('mikelearning'), 'mikelearning', 'Mike Chen',
'Computer Science student at Stanford. Interested in algorithms, competitive programming, and machine learning.',
'https://i.pravatar.cc/150?img=11', 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=1200&h=400&fit=crop',
'Student by day, coder by night 🎓',
true, false, 'Palo Alto, CA', 'https://mikechen.student',
'mikelearning', 'mike_student', 'mike#6666', 'https://linkedin.com/in/mikechen',
now() - interval '3 months', now()),

-- Tech Lead
(seed_user_uuid('annatechlead'), 'annatechlead', 'Anna Schmidt',
'Tech lead with 10+ years experience. Leading teams and architecting large-scale systems. Passionate about mentoring and team growth.',
'https://i.pravatar.cc/150?img=12', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&h=400&fit=crop',
'Leading teams, building futures 👑',
true, true, 'Berlin, Germany', 'https://annaschmidt.tech',
'annatechlead', 'anna_lead', 'anna#7777', 'https://linkedin.com/in/annaschmidt',
now() - interval '1 year', now()),

-- Freelancer
(seed_user_uuid('carlosfreelance'), 'carlosfreelance', 'Carlos Martinez',
'Freelance full-stack developer helping startups and small businesses build their digital presence. Always available for interesting projects.',
'https://i.pravatar.cc/150?img=13', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=1200&h=400&fit=crop',
'Your idea, my code 💼',
true, false, 'Mexico City, Mexico', 'https://carlosmartinez.freelance',
'carlosfreelance', 'carlos_dev', 'carlos#8888', 'https://linkedin.com/in/carlosmartinez',
now() - interval '4 months', now()),

-- Startup Founder
(seed_user_uuid('samuelfounder'), 'samuelfounder', 'Samuel Johnson',
'Startup founder and CTO. Built and sold two companies. Now working on AI-powered developer tools. Always looking for talented co-founders.',
'https://i.pravatar.cc/150?img=14', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&h=400&fit=crop',
'Building the next big thing 🚀',
true, true, 'Boston, MA', 'https://samueljohnson.founder',
'samuelfounder', 'samuel_startup', 'samuel#9999', 'https://linkedin.com/in/samueljohnson',
now() - interval '2 years', now()),

-- Design Engineer
(seed_user_uuid('zoedesigner'), 'zoedesigner', 'Zoe Taylor',
'Design engineer bridging the gap between design and development. Specialized in design systems and component libraries.',
'https://i.pravatar.cc/150?img=15', 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=1200&h=400&fit=crop',
'Where design meets code ✨',
true, false, 'Portland, OR', 'https://zoetaylor.design',
'zoedesigner', 'zoe_design', 'zoe#0000', 'https://linkedin.com/in/zoetaylor',
now() - interval '8 months', now());

-- ================================
-- USER SETTINGS - Developer Preferences
-- ================================

INSERT INTO public.user_settings (
  id, skills, languages, skills_data, experience_level, available_for_collab,
  collaboration_types, collaboration_guidelines, response_time, office_hours,
  email_notifications, theme, timezone, is_pro,
  created_at, updated_at
) VALUES
-- Sarah Chen - Senior Full-Stack
(seed_user_uuid('sarahchen'), 
ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'], 
ARRAY['JavaScript', 'TypeScript', 'Python', 'SQL'],
'{"frontend": {"React": {"years": 5, "isLearning": false}, "TypeScript": {"years": 4, "isLearning": false}}, "backend": {"Node.js": {"years": 5, "isLearning": false}, "PostgreSQL": {"years": 3, "isLearning": false}}}',
'senior', true,
ARRAY['mentoring', 'code-review', 'project'], 
'I love helping junior developers and working on interesting projects. Always happy to do code reviews and share knowledge.',
'within-day',
'{"enabled": true, "monday": {"enabled": true, "start": "09:00", "end": "17:00"}, "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"}}',
true, 'dark', 'America/Los_Angeles', true,
now() - interval '6 months', now()),

-- Alex Rodriguez - Open Source
(seed_user_uuid('alexrodriguez'),
ARRAY['JavaScript', 'Node.js', 'Open Source', 'Git', 'npm'],
ARRAY['JavaScript', 'TypeScript', 'Rust', 'Go'],
'{"tools": {"Git": {"years": 8, "isLearning": false}, "npm": {"years": 6, "isLearning": false}}, "languages": {"Rust": {"years": 2, "isLearning": true}}}',
'senior', true,
ARRAY['open-source', 'mentoring', 'code-review'],
'Open source advocate. Happy to help with OSS contributions and maintainer responsibilities.',
'within-hour',
'{"enabled": true, "saturday": {"enabled": true, "start": "10:00", "end": "16:00"}, "sunday": {"enabled": true, "start": "10:00", "end": "16:00"}}',
true, 'system', 'America/Chicago', false,
now() - interval '8 months', now()),

-- Emma Wilson - Frontend
(seed_user_uuid('emmawilson'),
ARRAY['React', 'Vue.js', 'CSS', 'JavaScript', 'Figma'],
ARRAY['JavaScript', 'TypeScript', 'CSS', 'HTML'],
'{"frontend": {"React": {"years": 3, "isLearning": false}, "Vue.js": {"years": 2, "isLearning": false}, "CSS": {"years": 4, "isLearning": false}}}',
'mid', true,
ARRAY['project', 'design-review', 'pair'],
'Frontend specialist with strong design skills. Love collaborating on UI/UX projects.',
'within-day',
'{"enabled": false}',
true, 'light', 'Europe/London', false,
now() - interval '4 months', now()),

-- Marcus Johnson - DevOps
(seed_user_uuid('marcusjohnson'),
ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
ARRAY['Python', 'Bash', 'YAML', 'Go'],
'{"cloud": {"AWS": {"years": 6, "isLearning": false}, "Kubernetes": {"years": 4, "isLearning": false}}, "tools": {"Docker": {"years": 5, "isLearning": false}}}',
'senior', true,
ARRAY['infrastructure', 'mentoring', 'automation'],
'DevOps engineer helping teams scale and automate. Happy to share infrastructure knowledge.',
'within-day',
'{"enabled": true, "monday": {"enabled": true, "start": "08:00", "end": "16:00"}}',
true, 'dark', 'America/Los_Angeles', true,
now() - interval '10 months', now()),

-- Priya Patel - Mobile Developer
(seed_user_uuid('priyapatel'),
ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
ARRAY['JavaScript', 'Dart', 'Swift', 'Kotlin'],
'{"mobile": {"React Native": {"years": 3, "isLearning": false}, "Flutter": {"years": 2, "isLearning": true}}}',
'mid', true,
ARRAY['mobile', 'project', 'mentoring'],
'Mobile developer focused on cross-platform solutions. Always excited about new mobile technologies.',
'within-day',
'{"enabled": true}',
true, 'system', 'America/Toronto', false,
now() - interval '7 months', now()),

-- David Kim - Backend Engineer
(seed_user_uuid('davidkim'),
ARRAY['Python', 'Go', 'PostgreSQL', 'Microservices', 'API Design'],
ARRAY['Python', 'Go', 'SQL', 'JavaScript'],
'{"backend": {"Python": {"years": 5, "isLearning": false}, "Go": {"years": 3, "isLearning": false}}, "databases": {"PostgreSQL": {"years": 4, "isLearning": false}}}',
'senior', true,
ARRAY['backend', 'architecture', 'mentoring'],
'Backend specialist focused on scalable architectures and clean API design.',
'within-day',
'{"enabled": true, "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"}}',
true, 'dark', 'America/Vancouver', false,
now() - interval '5 months', now()),

-- Jessica Brown - Junior Developer
(seed_user_uuid('jessicabrownjs'),
ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
ARRAY['JavaScript', 'HTML', 'CSS'],
'{"frontend": {"React": {"years": 0.5, "isLearning": true}, "JavaScript": {"years": 1, "isLearning": false}}}',
'junior', true,
ARRAY['learning', 'pair', 'mentoring'],
'Junior developer eager to learn and contribute. Looking for mentorship and learning opportunities.',
'within-hour',
'{"enabled": true, "monday": {"enabled": true, "start": "18:00", "end": "22:00"}}',
true, 'light', 'America/Chicago', false,
now() - interval '2 months', now()),

-- Raj Singh - Data Scientist
(seed_user_uuid('rajsingh'),
ARRAY['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Machine Learning'],
ARRAY['Python', 'R', 'SQL', 'JavaScript'],
'{"ai": {"TensorFlow": {"years": 4, "isLearning": false}, "PyTorch": {"years": 3, "isLearning": false}}, "languages": {"Python": {"years": 6, "isLearning": false}}}',
'lead', true,
ARRAY['ai-ml', 'data-science', 'mentoring'],
'Data scientist passionate about AI applications. Happy to help with ML projects and data analysis.',
'within-day',
'{"enabled": true}',
true, 'dark', 'Asia/Kolkata', true,
now() - interval '9 months', now()),

-- Lina Andersson - Game Developer
(seed_user_uuid('linasweden'),
ARRAY['Unity', 'C#', 'Game Development', '3D Modeling', 'Blender'],
ARRAY['C#', 'JavaScript', 'HLSL'],
'{"gamedev": {"Unity": {"years": 4, "isLearning": false}, "C#": {"years": 5, "isLearning": false}}}',
'mid', true,
ARRAY['gamedev', 'creative', 'project'],
'Game developer creating immersive experiences. Love collaborating on creative and technical challenges.',
'within-day',
'{"enabled": true, "weekend": true}',
true, 'dark', 'Europe/Stockholm', false,
now() - interval '6 months', now()),

-- Tom Wilson - Security Engineer
(seed_user_uuid('tomhacker'),
ARRAY['Cybersecurity', 'Penetration Testing', 'Python', 'Network Security', 'OWASP'],
ARRAY['Python', 'Bash', 'PowerShell', 'SQL'],
'{"security": {"Penetration Testing": {"years": 7, "isLearning": false}, "Python": {"years": 6, "isLearning": false}}}',
'lead', true,
ARRAY['security', 'code-review', 'consulting'],
'Security engineer helping build safer software. Available for security reviews and penetration testing.',
'within-day',
'{"enabled": true, "weekdays": true}',
true, 'dark', 'America/New_York', true,
now() - interval '11 months', now()),

-- Mike Chen - Student
(seed_user_uuid('mikelearning'),
ARRAY['Algorithms', 'Data Structures', 'Java', 'Python', 'Competitive Programming'],
ARRAY['Java', 'Python', 'C++'],
'{"academic": {"Algorithms": {"years": 2, "isLearning": true}, "Java": {"years": 2, "isLearning": false}}}',
'junior', true,
ARRAY['learning', 'study-group', 'algorithms'],
'CS student focused on algorithms and competitive programming. Looking for study partners and learning opportunities.',
'within-hour',
'{"enabled": true, "flexible": true}',
true, 'system', 'America/Los_Angeles', false,
now() - interval '3 months', now()),

-- Anna Schmidt - Tech Lead
(seed_user_uuid('annatechlead'),
ARRAY['Leadership', 'Architecture', 'Java', 'Spring', 'Team Management'],
ARRAY['Java', 'JavaScript', 'Python', 'SQL'],
'{"leadership": {"Team Management": {"years": 8, "isLearning": false}, "Architecture": {"years": 10, "isLearning": false}}}',
'lead', true,
ARRAY['leadership', 'mentoring', 'architecture'],
'Tech lead focused on team growth and system architecture. Passionate about developing technical leaders.',
'within-day',
'{"enabled": true, "business_hours": true}',
true, 'dark', 'Europe/Berlin', true,
now() - interval '1 year', now()),

-- Carlos Martinez - Freelancer
(seed_user_uuid('carlosfreelance'),
ARRAY['Full-Stack', 'React', 'Node.js', 'Freelancing', 'Startups'],
ARRAY['JavaScript', 'TypeScript', 'Python'],
'{"fullstack": {"React": {"years": 4, "isLearning": false}, "Node.js": {"years": 4, "isLearning": false}}}',
'senior', true,
ARRAY['freelance', 'project', 'startup'],
'Freelance developer helping startups and small businesses. Available for interesting full-stack projects.',
'within-hour',
'{"enabled": true, "flexible": true}',
true, 'light', 'America/Mexico_City', false,
now() - interval '4 months', now()),

-- Samuel Johnson - Startup Founder
(seed_user_uuid('samuelfounder'),
ARRAY['Entrepreneurship', 'Product Management', 'Full-Stack', 'AI/ML', 'Leadership'],
ARRAY['JavaScript', 'Python', 'TypeScript'],
'{"business": {"Entrepreneurship": {"years": 15, "isLearning": false}, "Product Management": {"years": 12, "isLearning": false}}}',
'lead', true,
ARRAY['startup', 'product', 'leadership'],
'Experienced founder and CTO. Looking for co-founders and early team members for AI-powered tools.',
'within-day',
'{"enabled": true, "business_hours": true}',
true, 'dark', 'America/New_York', true,
now() - interval '2 years', now()),

-- Zoe Taylor - Design Engineer
(seed_user_uuid('zoedesigner'),
ARRAY['Design Systems', 'React', 'TypeScript', 'Figma', 'CSS'],
ARRAY['JavaScript', 'TypeScript', 'CSS'],
'{"design": {"Design Systems": {"years": 3, "isLearning": false}, "React": {"years": 4, "isLearning": false}}}',
'mid', true,
ARRAY['design', 'frontend', 'systems'],
'Design engineer specializing in design systems and component libraries. Love bridging design and development.',
'within-day',
'{"enabled": true, "creative_hours": true}',
true, 'system', 'America/Los_Angeles', false,
now() - interval '8 months', now());

-- ================================
-- VALIDATION
-- ================================

-- Verify profiles were inserted correctly
DO $$
DECLARE
  profile_count integer;
  settings_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO settings_count FROM public.user_settings;
  
  IF profile_count != 15 THEN
    RAISE EXCEPTION 'Expected 15 profiles, got %', profile_count;
  END IF;
  
  IF settings_count != 15 THEN
    RAISE EXCEPTION 'Expected 15 user settings, got %', settings_count;
  END IF;
  
  RAISE NOTICE 'Profiles seeded successfully: % profiles, % settings', profile_count, settings_count;
END $$;

COMMIT;

\echo 'Profile seeding completed successfully'