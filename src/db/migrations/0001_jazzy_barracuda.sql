CREATE TYPE "public"."post_visibility" AS ENUM('public', 'private', 'unlisted', 'followers');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"author_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"content" jsonb NOT NULL,
	"excerpt" text,
	"visibility" "post_visibility" DEFAULT 'public' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_draft" boolean DEFAULT true NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"reading_time" text,
	"view_count" text DEFAULT '0',
	"like_count" text DEFAULT '0',
	"comment_count" text DEFAULT '0',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"bio" text,
	"avatar_url" text,
	"github_username" text,
	"twitter_username" text,
	"discord_username" text,
	"linkedin_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"languages" text[] DEFAULT '{}' NOT NULL,
	"experience_level" "experience_level",
	"available_for_collab" boolean DEFAULT false NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"theme" text DEFAULT 'system',
	"is_pro" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;