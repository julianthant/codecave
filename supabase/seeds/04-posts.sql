-- ================================
-- POSTS SEED DATA
-- ================================
-- Creates diverse content posts with rich content and engagement
-- Includes articles, snippets, thoughts with realistic metadata

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- POSTS - Content for Feed
-- ================================

INSERT INTO public.posts (
  id, author_id, title, slug, content, excerpt, type, visibility, is_published, is_draft,
  tags, reading_time, view_count, like_count, comment_count, repost_count,
  published_at, created_at, updated_at
) VALUES
-- Sarah's React article
(seed_post_uuid('sarahchen', 'building-realtime-collaborative-features-react-websockets'), 
seed_user_uuid('sarahchen'),
'Building Real-time Collaborative Features with React and WebSockets',
'building-realtime-collaborative-features-react-websockets',
'{"blocks": [{"type": "paragraph", "data": {"text": "Real-time collaboration has become essential in modern web applications. In this article, I''ll walk you through building collaborative features using React and WebSockets."}}, {"type": "code", "data": {"code": "// Setting up WebSocket connection\nconst socket = io(process.env.REACT_APP_SOCKET_URL);\n\nsocket.on(''document-change'', (data) => {\n  updateDocument(data);\n});", "language": "javascript"}}, {"type": "paragraph", "data": {"text": "The key to building real-time features is managing state synchronization between multiple clients..."}}]}',
'Learn how to implement real-time collaborative features in React applications using WebSockets. Complete guide with code examples.',
'article', 'public', true, false,
ARRAY['react', 'websockets', 'real-time', 'collaboration'],
'8 min read', 324, 45, 12, 3,
now() - interval '3 days', now() - interval '3 days', now() - interval '3 days'),

-- Alex's open source contribution guide
(seed_post_uuid('alexrodriguez', 'first-open-source-contribution-guide'), 
seed_user_uuid('alexrodriguez'),
'Your First Open Source Contribution: A Complete Guide',
'first-open-source-contribution-guide',
'{"blocks": [{"type": "paragraph", "data": {"text": "Contributing to open source can seem intimidating, but it''s one of the best ways to improve your skills and give back to the community."}}, {"type": "list", "data": {"style": "ordered", "items": ["Find a project that interests you", "Read the contributing guidelines", "Start with small issues", "Write clear commit messages", "Be patient and respectful"]}}, {"type": "paragraph", "data": {"text": "Remember, every expert was once a beginner. The open source community is generally very welcoming to new contributors."}}]}',
'Complete guide for making your first open source contribution. Tips, best practices, and how to get started.',
'article', 'public', true, false,
ARRAY['open-source', 'git', 'beginners', 'community'],
'6 min read', 187, 62, 8, 5,
now() - interval '1 week', now() - interval '1 week', now() - interval '1 week'),

-- Emma's CSS snippet
(seed_post_uuid('emmawilson', 'perfect-center-alignment-modern-css'), 
seed_user_uuid('emmawilson'),
'Perfect Center Alignment with Modern CSS',
'perfect-center-alignment-modern-css',
'{"blocks": [{"type": "paragraph", "data": {"text": "Centering elements in CSS used to be tricky, but modern CSS gives us several elegant solutions."}}, {"type": "code", "data": {"code": ".center-flexbox {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.center-grid {\n  display: grid;\n  place-items: center;\n}\n\n.center-absolute {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}", "language": "css"}}, {"type": "paragraph", "data": {"text": "My personal favorite is the grid approach for its simplicity!"}}]}',
'Three modern CSS techniques for perfect element centering. Choose the best method for your use case.',
'snippet', 'public', true, false,
ARRAY['css', 'frontend', 'layout', 'tips'],
'2 min read', 89, 34, 3, 1,
now() - interval '2 days', now() - interval '2 days', now() - interval '2 days'),

-- Marcus's DevOps thought
(seed_post_uuid('marcusjohnson', 'future-infrastructure-as-code'), 
seed_user_uuid('marcusjohnson'),
'The Future of Infrastructure as Code',
'future-infrastructure-as-code',
'{"blocks": [{"type": "paragraph", "data": {"text": "Infrastructure as Code (IaC) has revolutionized how we manage cloud resources. But where is it heading next?"}}, {"type": "paragraph", "data": {"text": "I believe the next evolution will be AI-assisted infrastructure optimization. Imagine tools that can automatically optimize your cloud costs and performance based on usage patterns."}}, {"type": "paragraph", "data": {"text": "What do you think? Are we ready for AI to manage our infrastructure?"}}]}',
'Thoughts on the evolution of Infrastructure as Code and the role of AI in cloud management.',
'thought', 'public', true, false,
ARRAY['devops', 'infrastructure', 'ai', 'cloud'],
'3 min read', 156, 23, 7, 2,
now() - interval '1 day', now() - interval '1 day', now() - interval '1 day'),

-- Priya's mobile development article
(seed_post_uuid('priyapatel', 'react-native-vs-flutter-2024-comparison'), 
seed_user_uuid('priyapatel'),
'React Native vs Flutter: 2024 Comparison',
'react-native-vs-flutter-2024-comparison',
'{"blocks": [{"type": "paragraph", "data": {"text": "As a mobile developer who''s worked with both React Native and Flutter, I often get asked which one to choose."}}, {"type": "paragraph", "data": {"text": "React Native Pros: Leverages existing React knowledge, large community, mature ecosystem."}}, {"type": "paragraph", "data": {"text": "Flutter Pros: Better performance, consistent UI across platforms, growing rapidly."}}, {"type": "paragraph", "data": {"text": "My recommendation: Choose React Native if you have a React team, Flutter if you''re starting fresh and want the best performance."}}]}',
'Detailed comparison of React Native and Flutter for mobile development in 2024. Which should you choose?',
'article', 'public', true, false,
ARRAY['react-native', 'flutter', 'mobile', 'comparison'],
'7 min read', 267, 41, 15, 4,
now() - interval '5 days', now() - interval '5 days', now() - interval '5 days'),

-- David's backend snippet
(seed_post_uuid('davidkim', 'clean-error-handling-nodejs-apis'), 
seed_user_uuid('davidkim'),
'Clean Error Handling in Node.js APIs',
'clean-error-handling-nodejs-apis',
'{"blocks": [{"type": "paragraph", "data": {"text": "Proper error handling is crucial for robust APIs. Here''s a clean pattern I use in all my Node.js projects."}}, {"type": "code", "data": {"code": "class ApiError extends Error {\n  constructor(statusCode, message, isOperational = true) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = isOperational;\n  }\n}\n\nconst errorHandler = (err, req, res, next) => {\n  if (err instanceof ApiError) {\n    return res.status(err.statusCode).json({\n      error: err.message\n    });\n  }\n  \n  // Log unexpected errors\n  console.error(err);\n  res.status(500).json({ error: ''Internal server error'' });\n};", "language": "javascript"}}, {"type": "paragraph", "data": {"text": "This pattern gives you consistent error responses and proper logging."}}]}',
'A clean pattern for handling errors in Node.js APIs with proper status codes and logging.',
'snippet', 'public', true, false,
ARRAY['nodejs', 'api', 'error-handling', 'backend'],
'3 min read', 145, 28, 5, 2,
now() - interval '4 days', now() - interval '4 days', now() - interval '4 days'),

-- Jessica's learning journey
(seed_post_uuid('jessicabrownjs', 'coding-bootcamp-first-job-journey'), 
seed_user_uuid('jessicabrownjs'),
'My Coding Bootcamp to First Job Journey',
'coding-bootcamp-first-job-journey',
'{"blocks": [{"type": "paragraph", "data": {"text": "Six months ago, I was completely new to programming. Today, I''m working as a junior developer. Here''s my journey."}}, {"type": "paragraph", "data": {"text": "The bootcamp was intense - 12 weeks of non-stop learning. JavaScript, React, Node.js, databases. Everything felt overwhelming at first."}}, {"type": "paragraph", "data": {"text": "The key was building projects. Lots of projects. My portfolio showcased real applications, not just tutorial follow-alongs."}}, {"type": "paragraph", "data": {"text": "To anyone starting this journey: be patient with yourself, build things, and don''t give up. The tech community is amazing and supportive!"}}]}',
'My journey from coding bootcamp graduate to landing my first developer job. Tips and lessons learned.',
'article', 'public', true, false,
ARRAY['bootcamp', 'career', 'junior-developer', 'journey'],
'5 min read', 203, 67, 18, 8,
now() - interval '6 days', now() - interval '6 days', now() - interval '6 days'),

-- Raj's AI/ML article
(seed_post_uuid('rajsingh', 'getting-started-tensorflow-js-browser'), 
seed_user_uuid('rajsingh'),
'Getting Started with TensorFlow.js in the Browser',
'getting-started-tensorflow-js-browser',
'{"blocks": [{"type": "paragraph", "data": {"text": "Machine learning in the browser? TensorFlow.js makes it possible! Here''s how to get started."}}, {"type": "code", "data": {"code": "import * as tf from ''@tensorflow/tfjs'';\n\n// Load a pre-trained model\nconst model = await tf.loadLayersModel(''/model.json'');\n\n// Make predictions\nconst prediction = model.predict(inputData);", "language": "javascript"}}, {"type": "paragraph", "data": {"text": "The possibilities are endless - image classification, natural language processing, all running directly in the browser without server calls."}}]}',
'Introduction to TensorFlow.js for running machine learning models directly in web browsers.',
'article', 'public', true, false,
ARRAY['tensorflow', 'machine-learning', 'javascript', 'browser'],
'9 min read', 178, 31, 9, 3,
now() - interval '8 days', now() - interval '8 days', now() - interval '8 days'),

-- Tom's security snippet
(seed_post_uuid('tomhacker', 'secure-jwt-implementation-nodejs'), 
seed_user_uuid('tomhacker'),
'Secure JWT Implementation in Node.js',
'secure-jwt-implementation-nodejs',
'{"blocks": [{"type": "paragraph", "data": {"text": "JWTs are powerful but can be dangerous if implemented incorrectly. Here''s how to do it securely."}}, {"type": "code", "data": {"code": "const jwt = require(''jsonwebtoken'');\nconst crypto = require(''crypto'');\n\n// Use a strong secret\nconst secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString(''hex'');\n\n// Short expiration times\nconst token = jwt.sign(\n  { userId: user.id },\n  secret,\n  { expiresIn: ''15m'', issuer: ''your-app'' }\n);\n\n// Always verify on protected routes\nconst verified = jwt.verify(token, secret);", "language": "javascript"}}, {"type": "paragraph", "data": {"text": "Remember: short expiration times, strong secrets, and always verify!"}}]}',
'Best practices for implementing JWT authentication securely in Node.js applications.',
'snippet', 'public', true, false,
ARRAY['security', 'jwt', 'nodejs', 'authentication'],
'4 min read', 234, 52, 11, 6,
now() - interval '2 weeks', now() - interval '2 weeks', now() - interval '2 weeks'),

-- Anna's leadership article
(seed_post_uuid('annatechlead', 'senior-developer-tech-lead-lessons'), 
seed_user_uuid('annatechlead'),
'From Senior Developer to Tech Lead: Lessons Learned',
'senior-developer-tech-lead-lessons',
'{"blocks": [{"type": "paragraph", "data": {"text": "Making the transition from senior developer to tech lead was one of the biggest challenges in my career."}}, {"type": "paragraph", "data": {"text": "The hardest part? Realizing that your impact is now measured by your team''s success, not just your individual contributions."}}, {"type": "list", "data": {"style": "unordered", "items": ["Learn to delegate effectively", "Focus on unblocking others", "Communicate context, not just tasks", "Invest in your team''s growth", "Balance technical and people skills"]}}, {"type": "paragraph", "data": {"text": "Leadership is a skill like any other - it can be learned and improved with practice."}}]}',
'Key lessons learned transitioning from senior developer to tech lead. Essential skills for new technical leaders.',
'article', 'public', true, false,
ARRAY['leadership', 'career', 'tech-lead', 'management'],
'6 min read', 298, 73, 22, 9,
now() - interval '10 days', now() - interval '10 days', now() - interval '10 days'),

-- Lina's game development snippet
(seed_post_uuid('linasweden', 'unity-performance-optimization-tips'), 
seed_user_uuid('linasweden'),
'Unity Performance Optimization: 5 Essential Tips',
'unity-performance-optimization-tips',
'{"blocks": [{"type": "paragraph", "data": {"text": "Performance optimization in Unity can make or break your game. Here are my top 5 tips for better frame rates."}}, {"type": "list", "data": {"style": "ordered", "items": ["Use object pooling for frequently instantiated objects", "Optimize draw calls with texture atlases", "Profile early and profile often", "Use LOD (Level of Detail) for complex models", "Cache component references instead of GetComponent calls"]}}, {"type": "code", "data": {"code": "// Good: Cache component reference\npublic class PlayerController : MonoBehaviour {\n    private Rigidbody rb;\n    \n    void Start() {\n        rb = GetComponent<Rigidbody>();\n    }\n    \n    void Update() {\n        rb.AddForce(Vector3.forward);\n    }\n}", "language": "csharp"}}, {"type": "paragraph", "data": {"text": "Small optimizations like these can significantly improve your game''s performance!"}}]}',
'Essential Unity performance optimization tips for better game performance and smoother gameplay.',
'snippet', 'public', true, false,
ARRAY['unity', 'gamedev', 'performance', 'csharp'],
'4 min read', 134, 29, 6, 2,
now() - interval '3 days', now() - interval '3 days', now() - interval '3 days'),

-- Mike's algorithm thought
(seed_post_uuid('mikelearning', 'why-i-love-competitive-programming'), 
seed_user_uuid('mikelearning'),
'Why I Love Competitive Programming',
'why-i-love-competitive-programming',
'{"blocks": [{"type": "paragraph", "data": {"text": "As a CS student, competitive programming has transformed how I think about problem-solving."}}, {"type": "paragraph", "data": {"text": "It''s not just about solving problems fast - it''s about finding elegant solutions under pressure. Every contest teaches me something new about algorithms, data structures, or optimization."}}, {"type": "paragraph", "data": {"text": "The community is amazing too. Helping each other understand complex problems, sharing different approaches, and celebrating breakthroughs together."}}, {"type": "paragraph", "data": {"text": "If you''re a student or early in your career, I highly recommend trying competitive programming. It''ll make you a better problem solver!"}}]}',
'A student''s perspective on how competitive programming improves problem-solving skills and builds community.',
'thought', 'public', true, false,
ARRAY['competitive-programming', 'algorithms', 'student', 'learning'],
'3 min read', 98, 22, 8, 1,
now() - interval '1 day', now() - interval '1 day', now() - interval '1 day'),

-- Zoe's design system article
(seed_post_uuid('zoedesigner', 'building-scalable-design-systems'), 
seed_user_uuid('zoedesigner'),
'Building Scalable Design Systems with React and TypeScript',
'building-scalable-design-systems',
'{"blocks": [{"type": "paragraph", "data": {"text": "Design systems are more than just component libraries - they''re the foundation for consistent, scalable user interfaces."}}, {"type": "paragraph", "data": {"text": "Here''s how I approach building design systems that scale across multiple products and teams."}}, {"type": "code", "data": {"code": "// Design token structure\nexport const tokens = {\n  colors: {\n    primary: {\n      50: ''#f0f9ff'',\n      500: ''#3b82f6'',\n      900: ''#1e3a8a''\n    }\n  },\n  spacing: {\n    xs: ''0.25rem'',\n    sm: ''0.5rem'',\n    md: ''1rem''\n  }\n} as const;", "language": "typescript"}}, {"type": "paragraph", "data": {"text": "The key is starting with design tokens and building components that consume them consistently."}}]}',
'Complete guide to building scalable design systems with React, TypeScript, and design tokens.',
'article', 'public', true, false,
ARRAY['design-systems', 'react', 'typescript', 'frontend'],
'8 min read', 189, 35, 12, 3,
now() - interval '1 week', now() - interval '1 week', now() - interval '1 week'),

-- Carlos's freelancing tips
(seed_post_uuid('carlosfreelance', 'freelance-developer-client-communication'), 
seed_user_uuid('carlosfreelance'),
'Client Communication Tips for Freelance Developers',
'freelance-developer-client-communication',
'{"blocks": [{"type": "paragraph", "data": {"text": "After 5 years of freelancing, I''ve learned that communication is more important than coding skills for client success."}}, {"type": "list", "data": {"style": "unordered", "items": ["Set clear expectations upfront", "Send regular progress updates", "Ask questions early and often", "Document everything in writing", "Be honest about timelines and challenges"]}}, {"type": "paragraph", "data": {"text": "Good communication builds trust, and trust leads to repeat clients and referrals. It''s the foundation of a successful freelance career."}}]}',
'Essential communication strategies for freelance developers to build better client relationships.',
'article', 'public', true, false,
ARRAY['freelancing', 'communication', 'business', 'career'],
'5 min read', 167, 43, 14, 5,
now() - interval '4 days', now() - interval '4 days', now() - interval '4 days'),

-- Samuel's startup thought
(seed_post_uuid('samuelfounder', 'ai-developer-tools-future'), 
seed_user_uuid('samuelfounder'),
'The Future of AI in Developer Tools',
'ai-developer-tools-future',
'{"blocks": [{"type": "paragraph", "data": {"text": "AI is transforming how we build software. As someone building AI-powered developer tools, here''s what I see coming."}}, {"type": "paragraph", "data": {"text": "AI won''t replace developers, but it will amplify our capabilities. Code generation, automated testing, intelligent debugging - these are just the beginning."}}, {"type": "paragraph", "data": {"text": "The developers who thrive will be those who learn to work WITH AI, not against it. Embrace the tools, learn their strengths and limitations."}}]}',
'Founder''s perspective on how AI will transform developer tools and the software development process.',
'thought', 'public', true, false,
ARRAY['ai', 'developer-tools', 'startup', 'future'],
'4 min read', 245, 38, 16, 7,
now() - interval '2 days', now() - interval '2 days', now() - interval '2 days');

-- ================================
-- VALIDATION
-- ================================

-- Verify posts were created correctly
DO $$
DECLARE
  post_count integer;
  invalid_authors integer;
BEGIN
  SELECT COUNT(*) INTO post_count FROM public.posts;
  
  -- Check for invalid author references
  SELECT COUNT(*) INTO invalid_authors 
  FROM public.posts p
  LEFT JOIN public.profiles pr ON p.author_id = pr.id
  WHERE pr.id IS NULL;
  
  IF invalid_authors > 0 THEN
    RAISE EXCEPTION 'Found % posts with invalid author references', invalid_authors;
  END IF;
  
  IF post_count = 0 THEN
    RAISE EXCEPTION 'No posts were created';
  END IF;
  
  RAISE NOTICE 'Posts seeded successfully: % posts created', post_count;
END $$;

COMMIT;

\echo 'Post seeding completed successfully'