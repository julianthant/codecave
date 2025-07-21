-- Remove linkedinProfile column from users table
ALTER TABLE "users" DROP COLUMN IF EXISTS "linkedinProfile";

-- Note: Cannot directly remove enum value from AuthProvider as it requires recreating the enum
-- This will need to be handled manually if there are existing LINKEDIN records in the database
