# Services Directory (`src/services/`)

## Overview

This directory contains business logic services for **CodeCave**, providing a clean abstraction layer between the UI components and data operations. Services handle complex business logic, data transformations, and orchestrate multiple data sources.

## Architecture Pattern

- **Service Layer**: Encapsulates business logic separate from UI components
- **Database Abstraction**: Provides high-level operations over raw database queries
- **Type Safety**: Full TypeScript integration with database schema types
- **Composability**: Services can be composed and extended for complex operations
- **Error Handling**: Centralized error handling and validation

## Core Service (`database.ts`)

### Service Structure

The `dbService` provides a comprehensive API for all database operations, organized by domain:

- **`profiles`**: Public user profile operations
- **`userSettings`**: Private user settings management
- **`users`**: Combined user operations (profile + settings)
- **`posts`**: Content management operations

### Profiles Service (`dbService.profiles`)

#### Operations

```typescript
// Create new profile
async create(profileData: Omit<NewProfile, 'createdAt' | 'updatedAt'>): Promise<Profile>

// Find profile by username (public lookup)
async findByUsername(username: string): Promise<Profile | null>

// Find profile by ID
async findById(id: string): Promise<Profile | null>

// Update existing profile
async update(id: string, data: UpdateProfile): Promise<Profile>

// Check username availability
async checkUsernameAvailable(username: string): Promise<boolean>
```

#### Usage Examples

```typescript
import { dbService } from '@/services/database'

// Check if username is available during registration
const isAvailable = await dbService.profiles.checkUsernameAvailable('newuser')

// Fetch user profile for profile page
const profile = await dbService.profiles.findByUsername('john-doe')

// Update user profile
const updated = await dbService.profiles.update(userId, {
  bio: 'Updated bio text',
  githubUsername: 'johndoe',
})
```

### User Settings Service (`dbService.userSettings`)

#### Operations

```typescript
// Create user settings (called during onboarding)
async create(settingsData: Omit<NewUserSettings, 'createdAt' | 'updatedAt'>): Promise<UserSettings>

// Get user's private settings
async findById(id: string): Promise<UserSettings | null>

// Update user settings
async update(id: string, data: UpdateUserSettings): Promise<UserSettings>
```

#### Usage Examples

```typescript
// Create settings during onboarding
const settings = await dbService.userSettings.create({
  id: userId,
  skills: ['React', 'TypeScript', 'Node.js'],
  experienceLevel: 'mid',
  availableForCollab: true,
  emailNotifications: true,
})

// Update user preferences
await dbService.userSettings.update(userId, {
  availableForCollab: false,
  theme: 'dark',
})
```

### Combined User Operations (`dbService.users`)

#### Operations

```typescript
// Create complete user profile (profile + settings)
async createComplete(
  userId: string,
  profileData: Omit<NewProfile, 'id' | 'createdAt' | 'updatedAt'>,
  settingsData?: Omit<NewUserSettings, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserWithProfile>

// Fetch user with settings combined
async findWithSettings(id: string): Promise<UserWithProfile | null>
```

#### Usage Examples

```typescript
// Complete user creation during onboarding
const newUser = await dbService.users.createComplete(
  authUser.id,
  {
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Full-stack developer',
  },
  {
    skills: ['React', 'Python'],
    experienceLevel: 'senior',
    availableForCollab: true,
  }
)

// Fetch complete user data for dashboard
const userData = await dbService.users.findWithSettings(userId)
```

### Posts Service (`dbService.posts`)

#### Operations

```typescript
// Create new post
async create(postData: Omit<NewPost, 'createdAt' | 'updatedAt'>): Promise<Post>

// Find post by ID
async findById(id: string): Promise<Post | null>

// Get public posts for feed
async findPublicPosts(limit?: number, offset?: number): Promise<Post[]>

// Get posts by specific author
async findByAuthor(authorId: string): Promise<Post[]>

// Update existing post
async update(id: string, data: UpdatePost): Promise<Post>
```

#### Usage Examples

```typescript
// Create new blog post
const post = await dbService.posts.create({
  authorId: userId,
  title: 'My First Post',
  content: { blocks: [...] }, // Rich content structure
  excerpt: 'This is my first post about...',
  visibility: 'public',
  isPublished: true,
  isDraft: false,
  tags: ['react', 'typescript']
})

// Fetch posts for user profile
const userPosts = await dbService.posts.findByAuthor(profileId)

// Get public feed
const feedPosts = await dbService.posts.findPublicPosts(10, 0)
```

## Service Design Patterns

### Error Handling Strategy

Services should handle errors gracefully and provide meaningful error messages:

```typescript
// Example error handling in service
async findByUsername(username: string): Promise<Profile | null> {
  try {
    const db = getDb()
    const [profile] = await db.select().from(profilesTable)
      .where(eq(profilesTable.username, username))
      .limit(1)
    return profile || null
  } catch (error) {
    console.error('Failed to find profile by username:', error)
    throw new Error('Profile lookup failed')
  }
}
```

### Type Safety Integration

Services leverage database schema types for complete type safety:

```typescript
// Input types omit system fields
type ProfileInput = Omit<NewProfile, 'createdAt' | 'updatedAt'>

// Update types are partial to allow selective updates
type ProfileUpdate = Partial<Omit<NewProfile, 'id' | 'createdAt'>>

// Return types match database schema exactly
async create(data: ProfileInput): Promise<Profile> {
  // Implementation ensures return type matches schema
}
```

### Validation and Business Rules

Services enforce business logic and validation:

```typescript
// Example business rule enforcement
async checkUsernameAvailable(username: string): Promise<boolean> {
  // Validation rules
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters')
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, hyphens, and underscores')
  }

  // Check availability
  const profile = await this.findByUsername(username)
  return !profile
}
```

## Development Guidelines

### Adding New Services

#### Service Organization

```typescript
// services/feature-name.ts
export const featureService = {
  // Group related operations
  crud: {
    async create() {},
    async read() {},
    async update() {},
    async delete() {},
  },

  // Specialized operations
  async complexOperation() {},

  // Business logic
  validation: {
    async validateSomething() {},
  },
}
```

#### Naming Conventions

- Use descriptive operation names: `findByUsername` vs `getUser`
- Group related operations under logical namespaces
- Use consistent async/await patterns
- Return null for "not found" rather than throwing errors

#### Integration with Components

```typescript
// In React components, use services via hooks or directly
function UserProfile({ username }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await dbService.profiles.findByUsername(username)
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  // Render logic
}
```

### Service Composition

#### Combining Multiple Services

```typescript
// services/dashboard.ts
import { dbService } from './database'

export const dashboardService = {
  async getUserDashboardData(userId: string) {
    const [user, posts, settings] = await Promise.all([
      dbService.profiles.findById(userId),
      dbService.posts.findByAuthor(userId),
      dbService.userSettings.findById(userId),
    ])

    return {
      user,
      posts,
      settings,
      stats: {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.isPublished).length,
      },
    }
  },
}
```

#### Service Dependencies

```typescript
// services/collaboration.ts
import { dbService } from './database'
import { notificationService } from './notifications'

export const collaborationService = {
  async inviteCollaborator(projectId: string, username: string) {
    // Find user to invite
    const invitee = await dbService.profiles.findByUsername(username)
    if (!invitee) {
      throw new Error('User not found')
    }

    // Create collaboration invitation
    const invitation = await dbService.collaborations.create({
      projectId,
      inviteeId: invitee.id,
      status: 'pending',
    })

    // Send notification
    await notificationService.sendInvitation(invitation)

    return invitation
  },
}
```

### Performance Considerations

#### Query Optimization

```typescript
// Efficient queries with proper indexing
async findPublicPostsWithAuthors(limit: number = 10): Promise<PostWithAuthor[]> {
  const db = getDb()

  // Single query with join instead of N+1 queries
  return await db
    .select({
      // Select specific fields to reduce data transfer
      id: postsTable.id,
      title: postsTable.title,
      excerpt: postsTable.excerpt,
      publishedAt: postsTable.publishedAt,
      author: {
        username: profilesTable.username,
        displayName: profilesTable.displayName,
        avatarUrl: profilesTable.avatarUrl
      }
    })
    .from(postsTable)
    .innerJoin(profilesTable, eq(postsTable.authorId, profilesTable.id))
    .where(and(
      eq(postsTable.visibility, 'public'),
      eq(postsTable.isPublished, true)
    ))
    .orderBy(desc(postsTable.publishedAt))
    .limit(limit)
}
```

#### Caching Strategy

```typescript
// Simple in-memory cache for frequently accessed data
const cache = new Map()

export const cachedService = {
  async getPopularTags(): Promise<string[]> {
    const cacheKey = 'popular-tags'

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const tags = await computePopularTags()
    cache.set(cacheKey, tags)

    // Auto-expire cache after 5 minutes
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000)

    return tags
  },
}
```

## Future Expansion

### Potential New Services

- **`analytics.service.ts`**: User engagement and platform analytics
- **`collaboration.service.ts`**: Project collaboration and team management
- **`notification.service.ts`**: Real-time notifications and messaging
- **`search.service.ts`**: Full-text search across users and content
- **`upload.service.ts`**: File and media upload handling
- **`recommendation.service.ts`**: Content and user recommendations

### Service Layer Architecture

```
services/
├── database.ts (current core service)
├── auth.service.ts
├── content/
│   ├── posts.service.ts
│   ├── projects.service.ts
│   └── comments.service.ts
├── social/
│   ├── collaboration.service.ts
│   ├── messaging.service.ts
│   └── notifications.service.ts
└── platform/
    ├── analytics.service.ts
    ├── search.service.ts
    └── recommendations.service.ts
```

## Key Dependencies

- **Drizzle ORM**: Database query builder and type generation
- **Database Schema**: Type definitions from `@/db/schema`
- **Supabase**: Database connection and authentication
- **TypeScript**: Type safety and developer experience

## Notes for Claude

- `dbService` is the primary interface for all database operations - use this instead of direct database queries
- Services provide business logic validation and error handling that raw database operations don't
- All service operations are properly typed with TypeScript for safety
- Services handle the complexity of joins and relationships between tables
- When adding new features, consider whether logic belongs in components or should be extracted to services
- Services should remain stateless and pure - no side effects beyond database operations
- Error handling in services should provide meaningful messages for UI display
- Consider performance implications of service operations, especially for frequently called functions
