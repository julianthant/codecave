-- Initial database setup for CodeCave development
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful for the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a simple users table as an example
-- (This will likely be replaced by Supabase schema later)
CREATE TABLE IF NOT EXISTS users_example (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test user for development
INSERT INTO users_example (email) 
VALUES ('test@codecave.tech') 
ON CONFLICT (email) DO NOTHING;

-- Log completion
\echo 'Database initialization completed successfully!' 