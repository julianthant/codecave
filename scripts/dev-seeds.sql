-- Development seed data for CodeCave
-- This file is automatically loaded during database initialization in development

BEGIN;

-- Create development users if they don't exist
INSERT INTO users (id, email, name, created_at, updated_at) VALUES
('dev-user-1', 'admin@codecave.tech', 'Development Admin', NOW(), NOW()),
('dev-user-2', 'user@codecave.tech', 'Development User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create development projects if they don't exist
INSERT INTO projects (id, name, description, created_at, updated_at, user_id) VALUES
('dev-project-1', 'Sample Project', 'A sample project for development', NOW(), NOW(), 'dev-user-1'),
('dev-project-2', 'Test Project', 'A test project for development', NOW(), NOW(), 'dev-user-2')
ON CONFLICT (id) DO NOTHING;

-- Add sample code snippets if they don't exist
INSERT INTO code_snippets (id, title, description, content, language, created_at, updated_at, project_id, user_id) VALUES
('dev-snippet-1', 'Hello World', 'Basic hello world example', 'console.log("Hello, World!");', 'javascript', NOW(), NOW(), 'dev-project-1', 'dev-user-1'),
('dev-snippet-2', 'API Endpoint', 'Sample API endpoint', 'app.get("/api/hello", (req, res) => res.json({ message: "Hello!" }));', 'javascript', NOW(), NOW(), 'dev-project-1', 'dev-user-1')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Log development seed completion
\echo 'Development seed data loaded successfully!'
