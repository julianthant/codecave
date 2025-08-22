-- ================================
-- PROJECTS SEED DATA
-- ================================
-- Creates portfolio projects showcasing different technologies and approaches
-- Demonstrates the range of work in the developer community

BEGIN;

-- Error handling
\set ON_ERROR_STOP on

-- ================================
-- PROJECTS - Portfolio Items
-- ================================

INSERT INTO public.projects (
  id, user_id, name, description, technologies, github_url, live_url, 
  image_url, is_private,
  created_at, updated_at
) VALUES
-- Sarah's projects
(seed_project_uuid('TaskFlow - Project Management Dashboard', 'sarahchen'), 
seed_user_uuid('sarahchen'),
'TaskFlow - Project Management Dashboard',
'A comprehensive project management dashboard built with React and Node.js. Features real-time collaboration, task tracking, and team analytics.',
ARRAY['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'TypeScript'],
'https://github.com/sarahchen/taskflow',
'https://taskflow-demo.herokuapp.com',
'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
false,
now() - interval '4 months', now() - interval '1 week'),

(seed_project_uuid('E-commerce Analytics Platform', 'sarahchen'), 
seed_user_uuid('sarahchen'),
'E-commerce Analytics Platform',
'Analytics dashboard for e-commerce businesses with real-time sales tracking, customer insights, and inventory management.',
ARRAY['React', 'Python', 'Django', 'PostgreSQL', 'Chart.js'],
'https://github.com/sarahchen/ecommerce-analytics',
'https://ecommerce-analytics-demo.com',
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
false,
now() - interval '8 months', now() - interval '2 months'),

-- Alex's open source projects
(seed_project_uuid('React Component Library', 'alexrodriguez'), 
seed_user_uuid('alexrodriguez'),
'React Component Library',
'A comprehensive React component library with TypeScript support, accessibility features, and comprehensive documentation.',
ARRAY['React', 'TypeScript', 'Storybook', 'Jest', 'Rollup'],
'https://github.com/alexrodriguez/react-ui-library',
'https://alexr-ui-library.netlify.app',
'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
false,
now() - interval '1 year', now() - interval '1 month'),

(seed_project_uuid('Node.js Performance Monitor', 'alexrodriguez'), 
seed_user_uuid('alexrodriguez'),
'Node.js Performance Monitor',
'CLI tool for monitoring Node.js application performance with real-time metrics and automated optimization suggestions.',
ARRAY['Node.js', 'TypeScript', 'CLI', 'Performance', 'Monitoring'],
'https://github.com/alexrodriguez/node-perf-monitor',
'https://www.npmjs.com/package/node-perf-monitor',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
false,
now() - interval '6 months', now() - interval '2 weeks'),

-- Emma's design projects
(seed_project_uuid('Design System Documentation Site', 'emmawilson'), 
seed_user_uuid('emmawilson'),
'Design System Documentation Site',
'Interactive documentation site for design systems built with Vue.js. Features live component previews and design tokens.',
ARRAY['Vue.js', 'Nuxt.js', 'SCSS', 'Figma API', 'TypeScript'],
'https://github.com/emmawilson/design-system-docs',
'https://design-system-docs.netlify.app',
'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
false,
now() - interval '6 months', now() - interval '3 weeks'),

(seed_project_uuid('CSS Animation Library', 'emmawilson'), 
seed_user_uuid('emmawilson'),
'CSS Animation Library',
'Modern CSS animation library with performance-optimized transitions and effects for web applications.',
ARRAY['CSS', 'SCSS', 'Animation', 'Web Performance', 'Documentation'],
'https://github.com/emmawilson/css-animations',
'https://css-animations-demo.netlify.app',
'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
false,
now() - interval '3 months', now() - interval '1 week'),

-- Marcus's DevOps tools
(seed_project_uuid('Infrastructure Monitoring Dashboard', 'marcusjohnson'), 
seed_user_uuid('marcusjohnson'),
'Infrastructure Monitoring Dashboard',
'Real-time infrastructure monitoring dashboard with alerting, log aggregation, and performance metrics.',
ARRAY['Go', 'React', 'InfluxDB', 'Grafana', 'Docker'],
'https://github.com/marcusjohnson/infra-monitor',
'https://infra-monitor-demo.com',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
false,
now() - interval '5 months', now() - interval '2 weeks'),

(seed_project_uuid('Docker Deployment Automation', 'marcusjohnson'), 
seed_user_uuid('marcusjohnson'),
'Docker Deployment Automation',
'Automated Docker deployment pipeline with blue-green deployments, health checks, and rollback capabilities.',
ARRAY['Docker', 'Kubernetes', 'Go', 'Helm', 'GitOps'],
'https://github.com/marcusjohnson/docker-deploy',
null,
'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop',
false,
now() - interval '7 months', now() - interval '1 month'),

-- Priya's mobile apps
(seed_project_uuid('Social Recipe Sharing App', 'priyapatel'), 
seed_user_uuid('priyapatel'),
'Social Recipe Sharing App',
'Cross-platform mobile app for sharing and discovering recipes with social features and meal planning.',
ARRAY['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Redux'],
'https://github.com/priyapatel/recipe-social',
'https://recipe-social-app.com',
'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
false,
now() - interval '7 months', now() - interval '1 month'),

-- David's backend projects
(seed_project_uuid('Microservices API Gateway', 'davidkim'), 
seed_user_uuid('davidkim'),
'Microservices API Gateway',
'Scalable API gateway for microservices with authentication, rate limiting, and request routing.',
ARRAY['Go', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
'https://github.com/davidkim/api-gateway',
null,
'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop',
false,
now() - interval '3 months', now() - interval '1 week'),

-- Jessica's learning projects
(seed_project_uuid('Personal Finance Tracker', 'jessicabrownjs'), 
seed_user_uuid('jessicabrownjs'),
'Personal Finance Tracker',
'Web application for tracking personal finances with budget planning and expense categorization.',
ARRAY['React', 'Node.js', 'Express', 'SQLite', 'Chart.js'],
'https://github.com/jessicabrownjs/finance-tracker',
'https://my-finance-tracker.netlify.app',
'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
false,
now() - interval '2 months', now() - interval '3 days'),

(seed_project_uuid('Weather App with Geolocation', 'jessicabrownjs'), 
seed_user_uuid('jessicabrownjs'),
'Weather App with Geolocation',
'Simple weather application with geolocation support and 5-day forecast. Built as learning project.',
ARRAY['JavaScript', 'HTML', 'CSS', 'API Integration', 'Geolocation'],
'https://github.com/jessicabrownjs/weather-app',
'https://jessica-weather-app.netlify.app',
'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop',
false,
now() - interval '3 months', now() - interval '1 month'),

-- Raj's AI/ML projects
(seed_project_uuid('ML Model Deployment Platform', 'rajsingh'), 
seed_user_uuid('rajsingh'),
'ML Model Deployment Platform',
'Platform for deploying and monitoring machine learning models with automated scaling and performance tracking.',
ARRAY['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'FastAPI'],
'https://github.com/rajsingh/ml-deploy-platform',
'https://ml-deploy-demo.com',
'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=400&fit=crop',
false,
now() - interval '5 months', now() - interval '2 weeks'),

-- Lina's game projects
(seed_project_uuid('Indie Puzzle Game', 'linasweden'), 
seed_user_uuid('linasweden'),
'Indie Puzzle Game - "Quantum Blocks"',
'3D puzzle game built in Unity with physics-based mechanics and procedural level generation.',
ARRAY['Unity', 'C#', '3D Modeling', 'Blender', 'Game Design'],
'https://github.com/linasweden/quantum-blocks',
'https://quantum-blocks.itch.io',
'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
false,
now() - interval '9 months', now() - interval '1 month'),

-- Tom's security tools
(seed_project_uuid('Vulnerability Assessment Tool', 'tomhacker'), 
seed_user_uuid('tomhacker'),
'Vulnerability Assessment Tool',
'Automated vulnerability scanner for web applications with OWASP compliance and detailed reporting.',
ARRAY['Python', 'Security Testing', 'Web Scraping', 'OWASP', 'Reporting'],
'https://github.com/tomhacker/vuln-scanner',
null,
'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
false,
now() - interval '8 months', now() - interval '3 weeks'),

-- Anna's team tools
(seed_project_uuid('Team Performance Analytics', 'annatechlead'), 
seed_user_uuid('annatechlead'),
'Team Performance Analytics',
'Analytics platform for engineering teams to track velocity, code quality, and team health metrics.',
ARRAY['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Analytics'],
'https://github.com/annatechlead/team-analytics',
'https://team-analytics-demo.com',
'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
false,
now() - interval '6 months', now() - interval '1 month'),

-- Carlos's client projects (anonymized)
(seed_project_uuid('E-commerce Platform', 'carlosfreelance'), 
seed_user_uuid('carlosfreelance'),
'E-commerce Platform for Local Business',
'Full-stack e-commerce solution with inventory management, payment processing, and customer portal.',
ARRAY['React', 'Node.js', 'Stripe', 'PostgreSQL', 'AWS'],
'https://github.com/carlosfreelance/ecommerce-template',
null,
'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
false,
now() - interval '4 months', now() - interval '2 weeks'),

-- Samuel's startup projects
(seed_project_uuid('AI Code Review Assistant', 'samuelfounder'), 
seed_user_uuid('samuelfounder'),
'AI Code Review Assistant',
'AI-powered tool that provides automated code reviews with suggestions for improvements and bug detection.',
ARRAY['Python', 'TensorFlow', 'React', 'FastAPI', 'Machine Learning'],
'https://github.com/samuelfounder/ai-code-review',
'https://ai-code-review.com',
'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
false,
now() - interval '10 months', now() - interval '2 weeks'),

-- Zoe's design engineering projects
(seed_project_uuid('Component Library Builder', 'zoedesigner'), 
seed_user_uuid('zoedesigner'),
'Component Library Builder',
'Visual tool for building and maintaining design system component libraries with automated code generation.',
ARRAY['React', 'TypeScript', 'Figma API', 'Code Generation', 'Design Systems'],
'https://github.com/zoedesigner/component-builder',
'https://component-builder.design',
'https://images.unsplash.com/photo-1558655146-364adff25054?w=800&h=400&fit=crop',
false,
now() - interval '5 months', now() - interval '3 weeks'),

-- Mike's student projects
(seed_project_uuid('Algorithm Visualizer', 'mikelearning'), 
seed_user_uuid('mikelearning'),
'Algorithm Visualizer',
'Interactive web application for visualizing sorting and graph algorithms with step-by-step execution.',
ARRAY['JavaScript', 'HTML', 'CSS', 'D3.js', 'Algorithms'],
'https://github.com/mikelearning/algorithm-visualizer',
'https://algo-visualizer.netlify.app',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
false,
now() - interval '2 months', now() - interval '1 week');

-- ================================
-- VALIDATION
-- ================================

-- Verify projects were created correctly
DO $$
DECLARE
  project_count integer;
  invalid_users integer;
  featured_count integer;
BEGIN
  SELECT COUNT(*) INTO project_count FROM public.projects;
  SELECT COUNT(*) INTO featured_count FROM public.projects WHERE is_private = false;
  
  -- Check for invalid user references
  SELECT COUNT(*) INTO invalid_users 
  FROM public.projects p
  LEFT JOIN public.profiles pr ON p.user_id = pr.id
  WHERE pr.id IS NULL;
  
  IF invalid_users > 0 THEN
    RAISE EXCEPTION 'Found % projects with invalid user references', invalid_users;
  END IF;
  
  IF project_count = 0 THEN
    RAISE EXCEPTION 'No projects were created';
  END IF;
  
  RAISE NOTICE 'Projects seeded successfully: % total projects (% public)', 
    project_count, featured_count;
END $$;

COMMIT;

\echo 'Project seeding completed successfully'