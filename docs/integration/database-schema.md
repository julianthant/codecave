# Database Schema

[← Back to Index](./codecave-index.md) | [Previous: Technical Architecture](./technical-architecture.md) | [Next: Project Setup →](./project-setup.md)

## Overview

The database is built on PostgreSQL 15 via Supabase, utilizing advanced features like JSONB, arrays, full-text search, and Row Level Security (RLS).

## Complete Schema

### Extensions

```sql
-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Encryption functions
```

### Users Table

```sql
-- Core user information
CREATE TABLE users (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
```

### Posts Table

```sql
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
```

### Groups Table

```sql
-- Developer communities
CREATE TABLE groups (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,

  -- Details
  description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Settings
  is_private BOOLEAN DEFAULT FALSE,
  require_approval BOOLEAN DEFAULT FALSE,

  -- Stats
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,

  -- Rules & Info
  rules JSONB DEFAULT '[]', -- [{title, description}]
  links JSONB DEFAULT '{}', -- {website, github, discord, etc}

  -- Ownership
  created_by UUID NOT NULL REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_groups_slug ON groups(slug);
CREATE INDEX idx_groups_is_private ON groups(is_private);
CREATE INDEX idx_groups_tags ON groups USING GIN(tags);
CREATE INDEX idx_groups_created_by ON groups(created_by);
```

### Group Relationships

```sql
-- Group membership
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role in group
  role TEXT NOT NULL DEFAULT 'member' CHECK (
    role IN ('member', 'moderator', 'admin')
  ),

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('pending', 'active', 'banned')
  ),

  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (group_id, user_id)
);

-- Indexes
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_status ON group_members(status);

-- Posts in groups
CREATE TABLE group_posts (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,

  -- Group-specific
  pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMPTZ,
  pinned_by UUID REFERENCES users(id),

  PRIMARY KEY (post_id, group_id)
);

-- Indexes
CREATE INDEX idx_group_posts_group ON group_posts(group_id);
CREATE INDEX idx_group_posts_pinned ON group_posts(pinned, pinned_at DESC)
  WHERE pinned = true;
```

### Collaborations Table

```sql
-- Collaboration opportunities
CREATE TABLE collaborations (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

  -- Project details
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Requirements
  tech_stack TEXT[] DEFAULT '{}',
  skills_needed TEXT[] DEFAULT '{}',
  commitment_hours TEXT,

  -- Settings
  is_remote BOOLEAN DEFAULT TRUE,
  has_equity BOOLEAN DEFAULT FALSE,
  team_size INTEGER,
  current_team TEXT[] DEFAULT '{}', -- Usernames

  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'in_progress', 'closed')
  ),

  -- Generated resources
  notion_template_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_collaborations_post ON collaborations(post_id);
CREATE INDEX idx_collaborations_status ON collaborations(status);
CREATE INDEX idx_collaborations_tech ON collaborations USING GIN(tech_stack);
CREATE INDEX idx_collaborations_skills ON collaborations USING GIN(skills_needed);

-- Applications for collaborations
CREATE TABLE collaboration_applications (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collaboration_id UUID NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Application details
  message TEXT NOT NULL,
  portfolio_links TEXT[] DEFAULT '{}',
  availability TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected', 'withdrawn')
  ),

  -- Response
  response_message TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(collaboration_id, user_id)
);

-- Indexes
CREATE INDEX idx_collab_apps_collaboration ON collaboration_applications(collaboration_id);
CREATE INDEX idx_collab_apps_user ON collaboration_applications(user_id);
CREATE INDEX idx_collab_apps_status ON collaboration_applications(status);
```

### Code Snippets Table

```sql
-- Standalone code snippets
CREATE TABLE code_snippets (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  title TEXT,
  description TEXT,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  formatted_code TEXT, -- Prettier formatted version
  filename TEXT,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,

  -- Forking
  fork_count INTEGER DEFAULT 0,
  forked_from UUID REFERENCES code_snippets(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_snippets_user ON code_snippets(user_id);
CREATE INDEX idx_snippets_language ON code_snippets(language);
CREATE INDEX idx_snippets_public ON code_snippets(is_public);
CREATE INDEX idx_snippets_tags ON code_snippets USING GIN(tags);
CREATE INDEX idx_snippets_forked_from ON code_snippets(forked_from);

-- Snippet collections
CREATE TABLE snippet_collections (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Details
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,

  -- Snippets in collection
  snippet_ids UUID[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_collections_user ON snippet_collections(user_id);
CREATE INDEX idx_collections_public ON snippet_collections(is_public);
```

### Social Features Tables

```sql
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
```

### Notifications Table

```sql
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
```

### User Settings Table

```sql
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
```

### Analytics Tables

```sql
-- User activity tracking for feed algorithm
CREATE TABLE analytics_events (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT,

  -- Event details
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'view', 'like', 'unlike', 'comment', 'share',
      'click', 'bookmark', 'follow', 'unfollow'
    )
  ),

  -- Related entities
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,

  -- Event data
  duration INTEGER, -- Time spent in seconds (for views)
  data JSONB DEFAULT '{}', -- Additional event data

  -- Context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_post ON analytics_events(post_id, event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- Aggregated stats (updated periodically)
CREATE TABLE post_stats (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,

  -- Engagement metrics
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  avg_time_seconds INTEGER DEFAULT 0,

  -- Interaction metrics
  like_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage
  comment_rate DECIMAL(5, 2) DEFAULT 0,
  share_rate DECIMAL(5, 2) DEFAULT 0,

  -- Timestamps
  last_calculated TIMESTAMPTZ DEFAULT NOW()
);
```

### Helper Functions

```sql
-- Update user reputation
CREATE OR REPLACE FUNCTION update_user_reputation() RETURNS TRIGGER AS $
BEGIN
  -- Simple reputation calculation
  UPDATE users SET reputation_score = (
    SELECT
      (COUNT(DISTINCT p.id) * 10) + -- Posts created
      (COUNT(DISTINCT l.post_id) * 1) + -- Likes received
      (COUNT(DISTINCT c.id) * 2) + -- Comments received
      (COUNT(DISTINCT f.follower_id) * 5) -- Followers
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id AND p.is_published = true
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN follows f ON f.following_id = u.id
    WHERE u.id = NEW.user_id
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Update post counts
CREATE OR REPLACE FUNCTION update_counts() RETURNS TRIGGER AS $
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

  -- Update member_count
  IF TG_TABLE_NAME = 'group_members' THEN
    UPDATE groups SET member_count = (
      SELECT COUNT(*) FROM group_members
      WHERE group_id = NEW.group_id AND status = 'active'
    ) WHERE id = NEW.group_id;
  END IF;

  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_counts();

CREATE TRIGGER update_comments_count
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_counts();

CREATE TRIGGER update_group_members_count
  AFTER INSERT OR UPDATE OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_counts();
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

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

-- Groups policies
CREATE POLICY "Public groups viewable by everyone" ON groups
  FOR SELECT USING (
    is_private = false OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = id AND user_id = auth.uid() AND status = 'active'
    )
  );

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
```

## Performance Considerations

### 1. Indexing Strategy

- Primary keys on all tables
- Foreign key indexes for joins
- GIN indexes for array and JSONB columns
- Partial indexes for filtered queries
- Full-text search indexes

### 2. Query Optimization

```sql
-- Example: Optimized feed query
CREATE VIEW feed_posts AS
SELECT
  p.*,
  u.username,
  u.display_name,
  u.avatar_url,
  u.is_pro,
  COALESCE(l.liked, false) as user_liked,
  array_agg(DISTINCT t.name) as tag_names
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = auth.uid()
LEFT JOIN unnest(p.tags) t(name) ON true
WHERE p.is_published = true
GROUP BY p.id, u.id, l.liked
ORDER BY p.published_at DESC;
```

### 3. Materialized Views

```sql
-- Trending posts (refresh every hour)
CREATE MATERIALIZED VIEW trending_posts AS
SELECT
  p.*,
  (p.like_count * 2 + p.comment_count * 3 + p.share_count * 5) as engagement_score
FROM posts p
WHERE
  p.is_published = true AND
  p.published_at > NOW() - INTERVAL '7 days'
ORDER BY engagement_score DESC
LIMIT 100;

CREATE INDEX idx_trending_posts_score ON trending_posts(engagement_score DESC);
```

## Migration Strategy

### Initial Setup

```bash
# Run migrations in order
supabase migration new initial_schema
# Copy all SQL from this file
supabase db push
```

### Future Migrations

```sql
-- Example: Adding a new column
ALTER TABLE users ADD COLUMN streak_days INTEGER DEFAULT 0;

-- Always include rollback
-- ALTER TABLE users DROP COLUMN streak_days;
```

## Next Steps

Continue to [Project Setup](./04-project-setup.md) →
