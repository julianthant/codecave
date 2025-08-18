CREATE TYPE "public"."experience_level" AS ENUM('student', 'junior', 'mid', 'senior', 'lead');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"bio" text,
	"avatar_url" text,
	"github_username" text,
	"twitter_username" text,
	"discord_username" text,
	"linkedin_url" text,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"languages" text[] DEFAULT '{}' NOT NULL,
	"experience_level" "experience_level",
	"available_for_collab" boolean DEFAULT false NOT NULL,
	"is_pro" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
