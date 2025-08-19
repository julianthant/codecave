# Database Directory (`src/db/`)

## Overview

This directory contains the database configuration, schema definitions, and migrations for **CodeCave**. The application uses **Drizzle ORM** with **PostgreSQL** (via Supabase) for type-safe database operations.

## Architecture Pattern

- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL hosted on Supabase
- **Migrations**: SQL-based with Drizzle Kit
- **Schema**: Code-first schema definition with TypeScript
- **Security**: Row Level Security (RLS) policies in Supabase

## File Structure

- `index.ts` - Database connection and query client setup
- `schema.ts` - Complete database schema with tables and types
- `migrations/` - SQL migration files and metadata

## Database Schema Design

### Core Tables

#### `profiles` Table (Public Data)

```typescript
// Links to auth.users.id from Supabase Auth
{
  id: uuid(PK) // References auth.users.id
  username: string(unique) // @username handle
  displayName: string // Public display name
  bio: text // Profile bio/description
  avatarUrl: string // Profile picture URL

  // Social links (all public)
  githubUsername: string
  twitterUsername: string
  discordUsername: string
  linkedinUrl: string

  createdAt: timestamp
  updatedAt: timestamp
}
```

**Access**: Publicly readable, owner can update

#### `user_settings` Table (Private Data)

```typescript
// Private user configuration and preferences
{
  id: uuid (PK) // References auth.users.id

  // Developer profile (private)
  skills: string[] // Technical skills array
  languages: string[] // Programming languages
  experienceLevel: enum // student|junior|mid|senior|lead
  availableForCollab: boolean // Open to collaboration

  // App preferences
  emailNotifications: boolean
  theme: string // light|dark|system

  // System fields
  isPro: boolean // Premium subscription status

  createdAt: timestamp
  updatedAt: timestamp
}
```

**Access**: Only owner can read/write

#### `posts` Table (Content)

```typescript
// User-generated content with visibility controls
{
  id: uuid (PK)
  authorId: uuid (FK -> profiles.id)

  // Content
  title: string
  slug: string (unique) // URL-friendly identifier
  content: jsonb // Rich content blocks (structured data)
  excerpt: string // Short description

  // Visibility & Status
  visibility: enum // public|private|unlisted|followers
  isPublished: boolean
  isDraft: boolean

  // Metadata
  tags: string[] // Topic tags
  readingTime: string // "5 min read"

  // Engagement stats (updated by triggers)
  viewCount: string
  likeCount: string
  commentCount: string

  publishedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Access**: Based on visibility setting and author relationship

### Database Enums

- **`experience_level`**: `student`, `junior`, `mid`, `senior`, `lead`
- **`post_visibility`**: `public`, `private`, `unlisted`, `followers`

## Type System

### Generated Types

Drizzle automatically generates TypeScript types from schema:

```typescript
// Table types
export type Profile = typeof profilesTable.$inferSelect
export type NewProfile = typeof profilesTable.$inferInsert
export type UpdateProfile = Partial<Omit<NewProfile, 'id' | 'createdAt'>>

export type UserSettings = typeof userSettingsTable.$inferSelect
export type NewUserSettings = typeof userSettingsTable.$inferInsert
export type UpdateUserSettings = Partial<
  Omit<NewUserSettings, 'id' | 'createdAt'>
>

export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert
export type UpdatePost = Partial<Omit<NewPost, 'id' | 'createdAt'>>
```

### Composite Types

```typescript
// Combined user data for API responses
export type UserWithProfile = Profile & {
  settings?: UserSettings
}
```

## Database Connection (`index.ts`)

### Drizzle Setup

- Configures PostgreSQL connection via Supabase
- Sets up query client with proper typing
- Exports database instance for use throughout application

### Usage Pattern

```typescript
import { db } from '@/db'
import { profilesTable } from '@/db/schema'

// Type-safe queries
const profiles = await db.select().from(profilesTable)
```

## Migrations System

### Migration Files (`migrations/`)

- **SQL Files**: `0000_*.sql`, `0001_*.sql` - Sequential migration scripts
- **Metadata**: `meta/` folder contains migration tracking and snapshots
- **Journal**: `_journal.json` tracks applied migrations

### Migration Workflow

1. Modify `schema.ts` with new tables/columns
2. Run `drizzle-kit generate` to create migration
3. Review generated SQL in `migrations/`
4. Run `drizzle-kit migrate` to apply to database

### Example Migration Structure

```sql
-- 0000_quick_golden_guardian.sql
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY NOT NULL,
  "username" text NOT NULL,
  "display_name" text,
  -- ... rest of table definition
);
```

## Security Model

### Supabase RLS (Row Level Security)

Database security is enforced at the PostgreSQL level via Supabase:

#### Profiles Table

- **SELECT**: Public read access to all profiles
- **INSERT**: Only authenticated users can create their own profile
- **UPDATE**: Users can only update their own profile
- **DELETE**: Users can only delete their own profile

#### User Settings Table

- **SELECT**: Only owner can read their settings
- **INSERT/UPDATE/DELETE**: Only owner can modify their settings

#### Posts Table

- **SELECT**: Based on visibility setting and user relationship
- **INSERT**: Authenticated users can create posts
- **UPDATE/DELETE**: Only post author can modify

### Authentication Integration

- Database `id` fields reference `auth.users.id` from Supabase Auth
- All operations respect user authentication state
- API routes handle additional business logic validation

## Development Guidelines

### Schema Changes

1. **Always create migrations** - Never modify database directly
2. **Test migrations** on development database first
3. **Backup before production** migrations
4. **Consider data migration** for breaking changes

### Query Patterns

```typescript
// Use Drizzle's query builder for type safety
const userWithPosts = await db
  .select()
  .from(profilesTable)
  .where(eq(profilesTable.username, username))
  .leftJoin(postsTable, eq(postsTable.authorId, profilesTable.id))
```

### Type Safety

- Always use generated types from schema
- Leverage Drizzle's `$inferSelect` and `$inferInsert`
- Create composite types for complex API responses

### Performance Considerations

- Add database indexes for frequently queried columns
- Use proper joins instead of N+1 queries
- Implement pagination for large result sets
- Consider database connection pooling

## Key Dependencies

- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Migration and schema management
- **PostgreSQL**: Primary database engine
- **Supabase**: Database hosting and authentication
- **@supabase/supabase-js**: Database client

## Common Operations

### User Profile Operations

```typescript
// Create profile after auth signup
const newProfile = await db.insert(profilesTable).values({
  id: user.id,
  username: username,
  displayName: displayName,
})

// Update profile
await db
  .update(profilesTable)
  .set({ bio: newBio })
  .where(eq(profilesTable.id, userId))
```

### Post Operations

```typescript
// Fetch user posts with engagement
const posts = await db
  .select()
  .from(postsTable)
  .where(eq(postsTable.authorId, userId))
  .orderBy(desc(postsTable.createdAt))
```

## Future Considerations

- **Analytics tables**: For tracking user engagement and platform metrics
- **Collaboration tables**: For project collaboration features
- **Notification system**: For real-time user notifications
- **Search optimization**: Full-text search capabilities
- **Media storage**: Integration with Supabase Storage for file uploads

## Notes for Claude

- This database uses Drizzle ORM for type-safe operations - always use the generated types
- Security is handled by Supabase RLS policies, not application-level checks
- Schema changes require migrations - never modify the database directly
- The separation between `profiles` (public) and `user_settings` (private) is intentional for privacy
- All user IDs reference Supabase Auth's `auth.users.id` field
- Posts use JSONB content for flexible rich text storage
- Migration files are auto-generated and should not be manually edited
