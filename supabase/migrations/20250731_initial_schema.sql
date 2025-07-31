-- CodeCave Database Schema
-- Based on docs/integration/database-schema.md

-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Encryption functions

-- =============================================================================
-- USERS TABLE
-- =============================================================================

-- Core user information
CREATE TABLE users (
  -- Identity  
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,

  -- Profile
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,

  -- Location & Contact
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  website_url TEXT,

  -- Social Links
  github_username TEXT,
  twitter_username TEXT,
  discord_username TEXT,
  linkedin_url TEXT,

  -- Skills & Experience
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}', -- Programming languages
  experience_level TEXT CHECK (
    experience_level IN ('student', 'junior', 'mid', 'senior', 'lead')
  ),
  years_coding INTEGER,

  -- Collaboration
  available_for_collab BOOLEAN DEFAULT TRUE,
  collab_preferences JSONB DEFAULT '{
    "remote": true,
    "commitment": "10-20hrs",
    "interests": []
  }',

  -- Subscription
  is_pro BOOLEAN DEFAULT FALSE,
  pro_since TIMESTAMPTZ,
  stripe_customer_id TEXT,

  -- Reputation
  reputation_score INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_skills ON users USING GIN(skills);
CREATE INDEX idx_users_languages ON users USING GIN(languages);
CREATE INDEX idx_users_available ON users(available_for_collab)
  WHERE available_for_collab = true;

-- Full-text search
ALTER TABLE users ADD COLUMN search_vector tsvector;
CREATE INDEX idx_users_search ON users USING GIN(search_vector);

-- Update search vector on changes
CREATE FUNCTION update_users_search() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.display_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.username, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(NEW.skills, ' ')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_search_update
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_users_search();

-- =============================================================================
-- POSTS TABLE
-- =============================================================================

-- User-generated posts
CREATE TABLE posts (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',

  -- Post type
  type TEXT NOT NULL DEFAULT 'article' CHECK (
    type IN ('article', 'snippet', 'showcase', 'discussion', 'collaboration')
  ),

  -- Publishing
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_viewers TEXT[] DEFAULT '{}', -- User IDs who viewed
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC)
  WHERE is_published = true;
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_featured ON posts(is_featured, published_at DESC)
  WHERE is_featured = true;

-- Full-text search
ALTER TABLE posts ADD COLUMN search_vector tsvector;
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

CREATE FUNCTION update_posts_search() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', array_to_string(NEW.tags, ' ')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_search_update
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_posts_search();

-- =============================================================================
-- SOCIAL FEATURES
-- =============================================================================

-- Following relationships
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX idx_follows_following ON follows(following_id);

-- Post likes
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, post_id)
);

-- Indexes
CREATE INDEX idx_likes_post ON likes(post_id);

-- Comments
CREATE TABLE comments (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Threading
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,

  -- Moderation
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

-- User notifications
CREATE TABLE notifications (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Notification details
  type TEXT NOT NULL CHECK (
    type IN (
      'like', 'comment', 'follow', 'mention',
      'collaboration_request', 'collaboration_accepted',
      'group_invite', 'group_post', 'new_follower_post'
    )
  ),

  -- Content
  title TEXT NOT NULL,
  body TEXT,
  link TEXT, -- Where to navigate when clicked

  -- Related entities
  data JSONB DEFAULT '{}', -- {post_id, user_id, group_id, etc}

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =============================================================================
-- USER SETTINGS
-- =============================================================================

-- User preferences and settings
CREATE TABLE user_settings (
  -- Identity
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Notification preferences
  notifications JSONB DEFAULT '{
    "email": {
      "new_follower": true,
      "post_liked": true,
      "new_comment": true,
      "mentioned": true,
      "collaboration_request": true,
      "weekly_digest": true,
      "marketing": false
    },
    "push": {
      "enabled": false,
      "new_follower": true,
      "post_liked": true,
      "new_comment": true,
      "mentioned": true,
      "collaboration_request": true
    },
    "in_app": {
      "new_follower": true,
      "post_liked": true,
      "new_comment": true,
      "mentioned": true,
      "collaboration_request": true,
      "group_activity": true
    }
  }',

  -- Privacy settings
  privacy JSONB DEFAULT '{
    "profile_visibility": "public",
    "show_email": false,
    "show_location": true,
    "show_online_status": true,
    "allow_messages": "followers",
    "anonymous_mode": false
  }',

  -- App preferences
  preferences JSONB DEFAULT '{
    "theme": "system",
    "code_theme": "vscode-dark",
    "feed_view": "algorithm",
    "language": "en",
    "timezone": "UTC",
    "editor": {
      "auto_save": true,
      "auto_format": true,
      "show_line_numbers": true,
      "font_size": 14,
      "tab_size": 2
    }
  }',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update post counts
CREATE OR REPLACE FUNCTION update_counts() RETURNS TRIGGER AS $$
BEGIN
  -- Update like_count
  IF TG_TABLE_NAME = 'likes' THEN
    UPDATE posts SET like_count = (
      SELECT COUNT(*) FROM likes WHERE post_id = NEW.post_id
    ) WHERE id = NEW.post_id;
  END IF;

  -- Update comment_count
  IF TG_TABLE_NAME = 'comments' THEN
    UPDATE posts SET comment_count = (
      SELECT COUNT(*) FROM comments
      WHERE post_id = NEW.post_id AND is_deleted = false
    ) WHERE id = NEW.post_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_counts();

CREATE TRIGGER update_comments_count
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_counts();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (is_published = true OR user_id = auth.uid());

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Likes policies
CREATE POLICY "Likes viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);