-- ================================
-- COLLABORATIONS SEED DATA
-- ================================
-- Creates realistic collaboration opportunities and applications
-- Includes diverse project types, requirements, and compensation models

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- COLLABORATIONS - Project Opportunities
-- ================================

INSERT INTO public.collaborations (
  id, created_by, type, title, description, requirements, technologies, skills_needed,
  experience_level, time_commitment, team_size_current, team_size_needed, remote, location,
  deadline, compensation_type, compensation_details, status, github_repo, project_url, tags,
  view_count, save_count, application_count, created_at, updated_at
) VALUES
-- Sarah's React project
(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), 
seed_user_uuid('sarahchen'), 'project',
'Real-time Collaborative Code Editor', 
'Building a web-based collaborative code editor similar to CodePen but with real-time collaboration features. Looking for frontend and backend developers to join our small team.',
ARRAY['Experience with React', 'WebSocket knowledge', 'Git proficiency'],
ARRAY['React', 'Node.js', 'WebSocket', 'TypeScript', 'MongoDB'],
ARRAY['React', 'Node.js', 'Real-time systems', 'TypeScript'],
'intermediate', 'few-months', 2, 3, true, 'Remote',
now() + interval '3 months', 'volunteer', 'Open source project - great for portfolio building',
'open', 'https://github.com/sarahchen/collab-editor', null,
ARRAY['react', 'real-time', 'collaboration', 'open-source'],
156, 23, 8, now() - interval '2 weeks', now()),

-- Alex's Open Source
(seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez'),
seed_user_uuid('alexrodriguez'), 'open-source',
'JavaScript Package Performance Optimizer',
'Developing a CLI tool that analyzes and optimizes JavaScript packages for better performance. Looking for contributors with experience in AST manipulation and performance analysis.',
ARRAY['JavaScript expertise', 'CLI tool development', 'Performance optimization knowledge'],
ARRAY['JavaScript', 'Node.js', 'AST', 'CLI', 'npm'],
ARRAY['JavaScript', 'Node.js', 'Performance optimization', 'AST manipulation'],
'advanced', 'ongoing', 1, 4, true, 'Remote',
null, 'volunteer', 'Open source - potential to become popular npm package',
'open', 'https://github.com/alexrodriguez/js-optimizer', 'https://js-optimizer.dev',
ARRAY['javascript', 'performance', 'cli', 'npm', 'open-source'],
89, 34, 12, now() - interval '1 month', now()),

-- Samuel's Startup
(seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder'),
seed_user_uuid('samuelfounder'), 'startup',
'AI-Powered Developer Assistant',
'Building an AI assistant that helps developers with code reviews, bug detection, and optimization suggestions. Seeking co-founders and early team members.',
ARRAY['AI/ML experience', 'Full-stack development', 'Startup experience preferred'],
ARRAY['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
ARRAY['Machine Learning', 'Python', 'React', 'API development'],
'advanced', 'ongoing', 2, 5, true, 'Boston, MA (Remote OK)',
null, 'equity', '0.5-2% equity depending on role and experience',
'open', 'https://github.com/startup/ai-assistant', 'https://aidevassistant.com',
ARRAY['ai', 'startup', 'machine-learning', 'developer-tools'],
234, 45, 15, now() - interval '3 weeks', now()),

-- Marcus's DevOps project
(seed_collab_uuid('Kubernetes Deployment Dashboard', 'marcusjohnson'),
seed_user_uuid('marcusjohnson'), 'project',
'Kubernetes Deployment Dashboard',
'Creating a modern dashboard for managing Kubernetes deployments with real-time monitoring and automated rollbacks.',
ARRAY['Kubernetes experience', 'Go or React knowledge', 'DevOps background'],
ARRAY['Kubernetes', 'Go', 'React', 'Docker', 'Helm'],
ARRAY['Kubernetes', 'Go', 'React', 'DevOps', 'Monitoring'],
'intermediate', 'few-months', 1, 2, true, 'Remote',
now() + interval '4 months', 'paid', '$3000-5000 depending on contribution',
'open', 'https://github.com/marcus/k8s-dashboard', null,
ARRAY['kubernetes', 'devops', 'monitoring', 'dashboard'],
67, 12, 5, now() - interval '1 week', now()),

-- Priya's Mobile App
(seed_collab_uuid('Cross-Platform Fitness Tracking App', 'priyapatel'),
seed_user_uuid('priyapatel'), 'project',
'Cross-Platform Fitness Tracking App',
'Developing a React Native app for fitness tracking with social features. Looking for mobile developers and backend developers.',
ARRAY['React Native or Flutter experience', 'Mobile development background'],
ARRAY['React Native', 'Node.js', 'Firebase', 'Redux', 'TypeScript'],
ARRAY['React Native', 'Mobile development', 'Firebase', 'TypeScript'],
'intermediate', 'few-months', 2, 3, true, 'Toronto, Canada (Remote OK)',
now() + interval '5 months', 'open', 'Potential revenue sharing for successful launch',
'open', 'https://github.com/priya/fitness-app', null,
ARRAY['react-native', 'mobile', 'fitness', 'social'],
123, 28, 9, now() - interval '5 days', now()),

-- Anna's Mentorship Program
(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'),
seed_user_uuid('annatechlead'), 'mentorship',
'Tech Leadership Mentorship Program',
'Starting a structured mentorship program for developers transitioning into tech leadership roles. Looking for experienced mentors and program coordinators.',
ARRAY['5+ years development experience', 'Leadership experience', 'Mentoring background'],
ARRAY['Leadership', 'Communication', 'Project Management'],
ARRAY['Leadership', 'Mentoring', 'Communication', 'Project Management'],
'expert', 'ongoing', 3, 8, true, 'Remote',
null, 'volunteer', 'Community contribution - great networking opportunity',
'open', null, 'https://techleadershipmentorship.org',
ARRAY['mentorship', 'leadership', 'community', 'career-development'],
178, 52, 18, now() - interval '10 days', now()),

-- Tom's Security Project
(seed_collab_uuid('Web Application Security Scanner', 'tomhacker'),
seed_user_uuid('tomhacker'), 'project',
'Web Application Security Scanner',
'Building an automated security scanner for web applications. Looking for security researchers and full-stack developers.',
ARRAY['Security background', 'Web development experience', 'Penetration testing knowledge'],
ARRAY['Python', 'Web Security', 'Penetration Testing', 'Flask', 'React'],
ARRAY['Security', 'Python', 'Web development', 'Penetration testing'],
'advanced', 'few-months', 1, 3, true, 'Remote',
now() + interval '6 months', 'paid', '$4000-8000 based on expertise',
'open', 'https://github.com/tom/security-scanner', null,
ARRAY['security', 'web-security', 'penetration-testing', 'automation'],
91, 16, 7, now() - interval '3 days', now()),

-- David's Backend API
(seed_collab_uuid('GraphQL API for E-commerce Platform', 'davidkim'),
seed_user_uuid('davidkim'), 'project',
'GraphQL API for E-commerce Platform',
'Rebuilding legacy e-commerce APIs using GraphQL, microservices architecture. Looking for backend developers with GraphQL experience.',
ARRAY['GraphQL experience', 'Microservices knowledge', 'Database design skills'],
ARRAY['GraphQL', 'Node.js', 'PostgreSQL', 'Docker', 'Microservices'],
ARRAY['GraphQL', 'Node.js', 'PostgreSQL', 'Microservices', 'API design'],
'intermediate', 'few-months', 2, 2, true, 'Remote',
now() + interval '4 months', 'paid', '$5000-7000 for 3-4 months work',
'open', 'https://github.com/david/ecommerce-api', null,
ARRAY['graphql', 'microservices', 'e-commerce', 'api'],
78, 19, 6, now() - interval '1 day', now()),

-- Emma's Hackathon
(seed_collab_uuid('Climate Change Hackathon Team', 'emmawilson'),
seed_user_uuid('emmawilson'), 'hackathon',
'Climate Change Hackathon Team',
'Forming a team for the upcoming Global Climate Hackathon. Focus on building apps that help track and reduce carbon footprint.',
ARRAY['Frontend development', 'Environmental interest', 'Hackathon experience preferred'],
ARRAY['React', 'Vue.js', 'Node.js', 'Data Visualization'],
ARRAY['Frontend development', 'Data visualization', 'Environmental APIs'],
'beginner', 'few-days', 1, 3, true, 'Remote',
now() + interval '2 weeks', 'volunteer', 'Hackathon prizes - great for portfolio',
'open', null, 'https://climatehackathon.org',
ARRAY['hackathon', 'climate', 'environment', 'frontend'],
45, 8, 4, now() - interval '2 hours', now()),

-- Mike's Study Group
(seed_collab_uuid('Algorithm Study Group', 'mikelearning'),
seed_user_uuid('mikelearning'), 'study-group',
'Algorithm Study Group',
'Weekly study group focused on algorithms and data structures preparation for technical interviews. Looking for motivated learners.',
ARRAY['Basic programming knowledge', 'Commitment to weekly meetings'],
ARRAY['Algorithms', 'Data Structures', 'Problem Solving'],
ARRAY['Programming fundamentals', 'Problem solving', 'Algorithms'],
'beginner', 'ongoing', 3, 5, true, 'Remote',
null, 'volunteer', 'Knowledge sharing - interview preparation',
'open', 'https://github.com/mike/algorithm-study', null,
ARRAY['algorithms', 'study-group', 'interview-prep', 'learning'],
62, 15, 11, now() - interval '4 days', now());

-- ================================
-- COLLABORATION APPLICATIONS
-- ================================

INSERT INTO public.collaboration_applications (
  collaboration_id, applicant_id, message, portfolio, github_profile, 
  relevant_experience, availability, status, applied_at, responded_at
) VALUES
-- Applications for Sarah's Code Editor
(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), 
seed_user_uuid('jessicabrownjs'),
'Hi Sarah! I''m a junior developer very interested in real-time applications. I''ve built a small chat app with WebSockets and would love to contribute to your project.',
'https://jessicabrown.dev/portfolio', 'https://github.com/jessicabrownjs',
'Built a real-time chat application using Socket.io and React. Also contributed to a collaborative document editor as a side project.',
'20 hours per week, evenings and weekends', 'pending', now() - interval '2 days', null),

(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), 
seed_user_uuid('emmawilson'),
'Hi! I''m Emma, a frontend developer with React experience. Your collaborative editor project sounds amazing and aligns perfectly with my skills.',
'https://emmawilson.design', 'https://github.com/emmawilson',
'3+ years of React development, experience with real-time features using WebSockets. Built several collaborative tools for my current team.',
'15 hours per week, flexible schedule', 'accepted', now() - interval '5 days', now() - interval '3 days'),

(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), 
seed_user_uuid('davidkim'),
'I''m interested in the backend architecture for this project. I have experience with Node.js and real-time systems.',
'https://davidkim.dev', 'https://github.com/davidkim',
'5 years backend development, built several real-time applications with Node.js and WebSockets. Experience with MongoDB and scalable architectures.',
'10-15 hours per week', 'pending', now() - interval '1 day', null),

-- Applications for Alex's JS Optimizer
(seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez'), 
seed_user_uuid('marcusjohnson'),
'Hey Alex! DevOps engineer here but very interested in JavaScript performance optimization. Would love to contribute to this open source project.',
'https://marcusj.cloud', 'https://github.com/marcusjohnson',
'While primarily DevOps, I have deep knowledge of JavaScript performance from optimizing CI/CD pipelines. Experience with AST manipulation for build tools.',
'5-10 hours per week', 'accepted', now() - interval '1 week', now() - interval '5 days'),

(seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez'), 
seed_user_uuid('rajsingh'),
'Hi Alex! Data scientist with strong JavaScript background. Interested in the performance analysis aspects of your tool.',
'https://rajsingh.ai', 'https://github.com/rajsingh',
'PhD in Computer Science, experience with performance profiling and optimization. Built several analysis tools for JavaScript applications.',
'8-12 hours per week', 'pending', now() - interval '3 days', null),

-- Applications for Samuel's AI Assistant
(seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder'), 
seed_user_uuid('rajsingh'),
'Hi Samuel! Data scientist very interested in AI-powered developer tools. Your startup idea is exactly what I''ve been looking for.',
'https://rajsingh.ai', 'https://github.com/rajsingh',
'5+ years in ML/AI, experience with TensorFlow and PyTorch. Built several developer tools using machine learning for code analysis.',
'Full-time availability', 'pending', now() - interval '4 days', null),

(seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder'), 
seed_user_uuid('sarahchen'),
'Hey Samuel! Senior full-stack developer interested in the technical co-founder role. Love the vision for AI-powered development.',
'https://sarahchen.dev', 'https://github.com/sarahchen',
'8+ years full-stack development, experience scaling applications at TechCorp. Interest in AI/ML applications for developer productivity.',
'Negotiable - very interested in co-founder opportunity', 'accepted', now() - interval '1 week', now() - interval '4 days'),

-- Applications for Marcus's K8s Dashboard
(seed_collab_uuid('Kubernetes Deployment Dashboard', 'marcusjohnson'), 
seed_user_uuid('davidkim'),
'Hi Marcus! Backend engineer with Kubernetes experience. Your dashboard project looks very useful.',
'https://davidkim.dev', 'https://github.com/davidkim',
'Experience with Kubernetes in production, Go development, and building monitoring solutions. Currently using similar tools at work.',
'10 hours per week', 'pending', now() - interval '2 days', null),

-- Applications for Priya's Fitness App
(seed_collab_uuid('Cross-Platform Fitness Tracking App', 'priyapatel'), 
seed_user_uuid('jessicabrownjs'),
'Hi Priya! Junior developer interested in mobile development. Your fitness app sounds like a great project to learn React Native.',
'https://jessicabrown.dev', 'https://github.com/jessicabrownjs',
'Web development background, very eager to learn React Native. Built several React web apps and interested in mobile development.',
'15-20 hours per week', 'pending', now() - interval '1 day', null),

-- Applications for Anna's Mentorship Program
(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'), 
seed_user_uuid('sarahchen'),
'Hi Anna! I''d love to be a mentor in your program. I''ve been mentoring junior developers at my company and would like to expand this.',
'https://sarahchen.dev', 'https://github.com/sarahchen',
'Senior developer with 3+ years of formal mentoring experience. Led several junior developers from bootcamp to senior roles.',
'5 hours per week for mentoring sessions', 'accepted', now() - interval '6 days', now() - interval '2 days'),

(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'), 
seed_user_uuid('alexrodriguez'),
'Hey Anna! Open source maintainer here. I mentor contributors regularly and would love to join your structured program.',
'https://alexr.io', 'https://github.com/alexrodriguez',
'Extensive mentoring experience through open source projects. Helped 50+ developers make their first contributions.',
'3-5 hours per week', 'accepted', now() - interval '4 days', now() - interval '1 day'),

-- Applications for Tom's Security Scanner
(seed_collab_uuid('Web Application Security Scanner', 'tomhacker'), 
seed_user_uuid('davidkim'),
'Hi Tom! Backend developer interested in security. Would love to contribute to building security tools.',
'https://davidkim.dev', 'https://github.com/davidkim',
'Backend experience with API security, input validation, and secure coding practices. Interested in expanding security knowledge.',
'8-10 hours per week', 'pending', now() - interval '2 days', null),

-- Applications for David's GraphQL API
(seed_collab_uuid('GraphQL API for E-commerce Platform', 'davidkim'), 
seed_user_uuid('marcusjohnson'),
'Hi David! DevOps engineer with GraphQL experience. Interested in the infrastructure and deployment aspects of your e-commerce API.',
'https://marcusj.cloud', 'https://github.com/marcusjohnson',
'Experience with GraphQL deployments, API infrastructure, and microservices orchestration. Can help with scaling and monitoring.',
'6-8 hours per week', 'pending', now() - interval '1 day', null),

-- Applications for Emma's Hackathon
(seed_collab_uuid('Climate Change Hackathon Team', 'emmawilson'), 
seed_user_uuid('mikelearning'),
'Hi Emma! CS student passionate about environmental issues. Would love to join your hackathon team!',
'https://mikechen.student', 'https://github.com/mikelearning',
'Strong programming fundamentals, experience with data visualization for environmental projects. Passionate about climate tech.',
'Full weekend availability', 'accepted', now() - interval '1 hour', now() - interval '30 minutes'),

-- Applications for Mike's Study Group
(seed_collab_uuid('Algorithm Study Group', 'mikelearning'), 
seed_user_uuid('jessicabrownjs'),
'Hi Mike! Junior developer looking to improve my algorithm skills for interviews. Would love to join your study group.',
'https://jessicabrown.dev', 'https://github.com/jessicabrownjs',
'Basic programming knowledge, currently preparing for technical interviews. Completed several algorithm courses online.',
'2 hours per week for group sessions', 'accepted', now() - interval '3 days', now() - interval '1 day');

-- ================================
-- COLLABORATION SAVES
-- ================================

INSERT INTO public.collaboration_saves (collaboration_id, user_id, created_at) VALUES
-- Popular collaborations get saved frequently
(seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez'), seed_user_uuid('sarahchen'), now() - interval '1 week'),
(seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder'), seed_user_uuid('sarahchen'), now() - interval '3 days'),
(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'), seed_user_uuid('sarahchen'), now() - interval '5 days'),

-- Cross-saves showing interest patterns
(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), seed_user_uuid('alexrodriguez'), now() - interval '2 weeks'),
(seed_collab_uuid('Web Application Security Scanner', 'tomhacker'), seed_user_uuid('alexrodriguez'), now() - interval '1 day'),

-- Frontend developers saving relevant projects
(seed_collab_uuid('Cross-Platform Fitness Tracking App', 'priyapatel'), seed_user_uuid('emmawilson'), now() - interval '3 days'),
(seed_collab_uuid('Climate Change Hackathon Team', 'emmawilson'), seed_user_uuid('zoedesigner'), now() - interval '1 hour'),

-- Junior developers saving learning opportunities
(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'), seed_user_uuid('jessicabrownjs'), now() - interval '1 week'),
(seed_collab_uuid('Algorithm Study Group', 'mikelearning'), seed_user_uuid('jessicabrownjs'), now() - interval '2 days'),
(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), seed_user_uuid('jessicabrownjs'), now() - interval '4 days'),

-- Students saving learning opportunities
(seed_collab_uuid('Tech Leadership Mentorship Program', 'annatechlead'), seed_user_uuid('mikelearning'), now() - interval '2 weeks'),
(seed_collab_uuid('JavaScript Package Performance Optimizer', 'alexrodriguez'), seed_user_uuid('mikelearning'), now() - interval '1 week'),

-- Specialists saving relevant projects
(seed_collab_uuid('Web Application Security Scanner', 'tomhacker'), seed_user_uuid('priyapatel'), now() - interval '1 day'),
(seed_collab_uuid('Kubernetes Deployment Dashboard', 'marcusjohnson'), seed_user_uuid('davidkim'), now() - interval '2 days'),
(seed_collab_uuid('AI-Powered Developer Assistant', 'samuelfounder'), seed_user_uuid('rajsingh'), now() - interval '4 days'),

-- Design-focused saves
(seed_collab_uuid('Real-time Collaborative Code Editor', 'sarahchen'), seed_user_uuid('zoedesigner'), now() - interval '3 days'),
(seed_collab_uuid('Cross-Platform Fitness Tracking App', 'priyapatel'), seed_user_uuid('zoedesigner'), now() - interval '2 days');

-- ================================
-- VALIDATION
-- ================================

-- Verify collaboration data integrity
DO $$
DECLARE
  collaboration_count integer;
  application_count integer;
  save_count integer;
  invalid_refs integer;
BEGIN
  SELECT COUNT(*) INTO collaboration_count FROM public.collaborations;
  SELECT COUNT(*) INTO application_count FROM public.collaboration_applications;
  SELECT COUNT(*) INTO save_count FROM public.collaboration_saves;
  
  -- Check for invalid foreign key references
  SELECT COUNT(*) INTO invalid_refs 
  FROM public.collaborations c
  LEFT JOIN public.profiles p ON c.created_by = p.id
  WHERE p.id IS NULL;
  
  IF invalid_refs > 0 THEN
    RAISE EXCEPTION 'Found % invalid collaboration creator references', invalid_refs;
  END IF;
  
  IF collaboration_count = 0 THEN
    RAISE EXCEPTION 'No collaborations were created';
  END IF;
  
  RAISE NOTICE 'Collaborations seeded successfully: % collaborations, % applications, % saves', 
    collaboration_count, application_count, save_count;
END $$;

COMMIT;

\echo 'Collaboration seeding completed successfully'