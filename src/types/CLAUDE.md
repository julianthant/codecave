# Types Directory (`src/types/`)

## Overview

This directory contains **TypeScript type definitions** for **CodeCave**, providing type safety and developer experience across the application. Types are organized by domain and exported from a central index file.

## Architecture Pattern

- **Domain-Driven**: Types organized by business domain (posts, dashboard, users)
- **Database Integration**: Re-exports database types for consistency
- **Type Safety**: Comprehensive typing for all data structures
- **Composition**: Complex types built from simpler primitives
- **API Integration**: Types for API requests and responses

## Type Organization

### Index File (`index.ts`)

#### Purpose

Central export hub that re-exports database types and defines application-specific types.

#### Key Exports

```typescript
// Database types (from Drizzle schema)
export type {
  Profile,
  NewProfile,
  UpdateProfile,
  UserSettings,
  NewUserSettings,
  UpdateUserSettings,
  UserWithProfile,
} from '@/db'

// Application types
export interface UpdateUserData {
  displayName?: string
  bio?: string
  avatarUrl?: string
  githubUsername?: string
  twitterUsername?: string
  discordUsername?: string
  linkedinUrl?: string
  skills?: string[]
  languages?: string[]
  experienceLevel?: UserSettings['experienceLevel']
  availableForCollab?: boolean
}
```

#### API Response Types

```typescript
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  has_more: boolean
}
```

### Dashboard Types (`dashboard.ts`)

#### Purpose

Complete type system for dashboard analytics, metrics, and data visualization components.

#### Core Metrics

```typescript
export interface DashboardMetrics {
  totalViews: number
  followers: number
  totalPosts: number
  engagementRate: number
}

export interface MetricChange {
  value: number
  type: 'increase' | 'decrease' | 'neutral'
  label: string
}
```

#### Chart Data Types

```typescript
export interface ActivityDataPoint {
  date: string // ISO date string
  views: number
  likes: number
  comments: number
}

export interface EngagementMetric {
  date: string // ISO date string
  engagement: number
  reach: number
}
```

#### Component Props

```typescript
export interface DashboardCardProps {
  title: string
  value: string | number
  change?: MetricChange
  icon?: LucideIcon
  className?: string
}

export interface DashboardChartsProps {
  activityData: ActivityDataPoint[]
  engagementData: EngagementMetric[]
  loading?: boolean
}
```

#### Progress Tracking

```typescript
export interface ProgressGoal {
  id: string
  title: string
  description: string
  current: number
  target: number
  icon: LucideIcon
  color: string
  unit?: string // "posts", "followers", etc.
}
```

### Post Types (`post-types.ts`)

#### Purpose

Comprehensive type system for CodeCave's rich content creation platform with multiple post types and block-based content.

#### Content Blocks

The platform uses a block-based content system similar to Notion or modern CMSs:

```typescript
export type BlockType =
  | 'text' // Rich text content
  | 'code' // Syntax-highlighted code
  | 'image' // Images with captions
  | 'prompt' // AI prompts and examples
  | 'math' // Mathematical formulas
  | 'svg' // SVG graphics
  | 'markdown' // Markdown content
  | 'terminal' // Terminal sessions

// Base block interface
export interface BaseBlock {
  id: string
  type: BlockType
  order: number
}
```

#### Specific Block Types

```typescript
// Code blocks with syntax highlighting
export interface CodeBlock extends BaseBlock {
  type: 'code'
  content: {
    code: string
    language: string
    filename?: string
    showLineNumbers?: boolean
  }
}

// AI prompt blocks for sharing prompts
export interface PromptBlock extends BaseBlock {
  type: 'prompt'
  content: {
    prompt: string
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    examples?: Array<{
      input: string
      output: string
    }>
  }
}

// Terminal command sessions
export interface TerminalBlock extends BaseBlock {
  type: 'terminal'
  content: {
    commands: Array<{
      input: string
      output?: string
      type?: 'command' | 'output' | 'error'
    }>
    cwd?: string
    title?: string
  }
}
```

#### Post Types

CodeCave supports multiple post formats:

```typescript
export type PostType =
  | 'article' // Long-form technical articles
  | 'snippet' // Code snippets and solutions
  | 'showcase' // Project showcases and demos
  | 'discussion' // Community discussions

// Article posts - comprehensive technical content
export interface ArticlePost extends BasePost {
  type: 'article'
  subtitle?: string
  reading_time?: number
  featured_image?: string
  published_at?: string
  status: 'draft' | 'published' | 'archived'
}

// Snippet posts - focused code sharing
export interface SnippetPost extends BasePost {
  type: 'snippet'
  language: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  problem_source?: string
  solution_approach?: string
}

// Showcase posts - project demonstrations
export interface ShowcasePost extends BasePost {
  type: 'showcase'
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  project_status: 'in-progress' | 'completed' | 'maintained'
  screenshots?: Array<{
    url: string
    caption?: string
  }>
}
```

#### Author and User Types

```typescript
export interface Author {
  id: string
  username: string
  display_name: string
  avatar_url?: string | null
  leetcode_rank?: string
  is_verified?: boolean
  is_admin?: boolean
  reputation_score?: number
  daily_streak?: number
}
```

#### Post Interaction Types

```typescript
export interface PostInteraction {
  post_id: string
  user_id: string
  type: 'like' | 'bookmark' | 'view' | 'share' | 'comment'
  created_at: string
  metadata?: Record<string, unknown>
}

export interface Comment {
  id: string
  post_id: string
  parent_id?: string // For nested comments
  author: Author
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  is_liked?: boolean
  replies?: Comment[]
}
```

#### Filtering and Search

```typescript
export interface PostFilters {
  type?: PostType | PostType[]
  tags?: string[]
  author_id?: string
  difficulty?: string
  language?: string
  category?: string
  date_range?: {
    start: string
    end: string
  }
  sort_by?: 'created_at' | 'likes_count' | 'views_count' | 'comments_count'
  sort_order?: 'asc' | 'desc'
}
```

## Type Design Patterns

### Database Integration

Types seamlessly integrate with the database schema:

```typescript
// Re-export database types for consistency
export type { Profile, UserSettings } from '@/db'

// Extend database types for UI needs
export interface UserWithProfile extends Profile {
  settings?: UserSettings
}

// API operation types derived from database types
export type UpdateUserData = Partial<
  Pick<Profile, 'displayName' | 'bio' | 'avatarUrl' | 'githubUsername'>
>
```

### Generic Types for Reusability

```typescript
// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Usage examples
type UserResponse = ApiResponse<Profile>
type PostsResponse = ApiResponse<Post[]>
type MetricsResponse = ApiResponse<DashboardMetrics>
```

### Discriminated Unions

```typescript
// Post types use discriminated unions for type safety
export type Post = ArticlePost | SnippetPost | ShowcasePost | DiscussionPost

// TypeScript can narrow types based on discriminant
function renderPost(post: Post) {
  switch (post.type) {
    case 'article':
      // post is now ArticlePost
      return <ArticleRenderer post={post} />
    case 'snippet':
      // post is now SnippetPost
      return <SnippetRenderer post={post} />
    // ... etc
  }
}
```

### Optional and Partial Types

```typescript
// Creation types omit system fields
export interface CreatePostData {
  type: PostType
  title: string
  blocks: Omit<Block, 'id' | 'order'>[]
  tags: string[]
  description?: string
}

// Update types make fields optional
export interface UpdatePostData extends Partial<CreatePostData> {
  id: string // ID is required for updates
}
```

## Development Guidelines

### Adding New Types

#### File Organization

```typescript
// For domain-specific types, create new files
// types/feature-name.ts

export interface FeatureData {
  // Type definition
}

// Re-export from index.ts
export type { FeatureData } from './feature-name'
```

#### Naming Conventions

- **Interfaces**: PascalCase (`UserProfile`, `PostData`)
- **Types**: PascalCase (`PostType`, `BlockType`)
- **Enums**: PascalCase with descriptive names
- **Generic**: Single uppercase letter (`T`, `K`, `V`)

#### Type Composition

```typescript
// Build complex types from simple ones
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

interface User extends BaseEntity {
  email: string
  username: string
}

interface Post extends BaseEntity {
  title: string
  authorId: string
  content: Block[]
}
```

### Type Safety Best Practices

#### Strict Typing

```typescript
// ❌ Avoid any
function processData(data: any) {}

// ✅ Use specific types
function processData(data: PostData) {}

// ✅ Use generics for flexibility
function processData<T extends BaseEntity>(data: T): T {}
```

#### Type Guards

```typescript
// Type guards for runtime type checking
export function isArticlePost(post: Post): post is ArticlePost {
  return post.type === 'article'
}

export function isCodeBlock(block: Block): block is CodeBlock {
  return block.type === 'code'
}

// Usage
if (isArticlePost(post)) {
  // post is now ArticlePost
  console.log(post.reading_time)
}
```

#### Utility Types

```typescript
// Use TypeScript utility types
type PostKeys = keyof Post
type PartialPost = Partial<Post>
type RequiredPost = Required<Post>
type PostTitle = Pick<Post, 'title'>
type PostWithoutId = Omit<Post, 'id'>
```

### Integration Patterns

#### With Components

```typescript
// Component props with proper typing
interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  className?: string
}

function PostCard({ post, onLike, onBookmark, className }: PostCardProps) {
  // TypeScript knows exact shape of post
  return (
    <div className={className}>
      <h3>{post.title}</h3>
      <p>By {post.author.display_name}</p>
    </div>
  )
}
```

#### With API Routes

```typescript
// API route typing
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, Post } from '@/types'

export async function GET(): Promise<NextResponse<ApiResponse<Post[]>>> {
  try {
    const posts = await fetchPosts()
    return NextResponse.json({ data: posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' })
  }
}
```

#### With Forms

```typescript
// Form data types
interface PostFormData {
  title: string
  content: string
  tags: string[]
  type: PostType
}

// React Hook Form integration
import { useForm } from 'react-hook-form'

function PostForm() {
  const { register, handleSubmit } = useForm<PostFormData>()

  const onSubmit = (data: PostFormData) => {
    // data is fully typed
    createPost(data)
  }
}
```

## Future Considerations

### Potential Type Additions

- **Real-time types**: WebSocket message types
- **Analytics types**: Detailed engagement tracking
- **Collaboration types**: Project collaboration structures
- **Notification types**: System notification schemas
- **Search types**: Advanced search and indexing types

### Type Validation

```typescript
// Runtime validation with libraries like Zod
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.array(z.any()),
  tags: z.array(z.string()).max(10),
})

type ValidatedPost = z.infer<typeof PostSchema>
```

## Key Dependencies

- **TypeScript**: Core type system
- **Drizzle ORM**: Database type generation
- **Lucide React**: Icon type definitions
- **React**: Component prop types

## Notes for Claude

- Always use the types defined in this directory for consistency
- `index.ts` is the main export - import types from `@/types` not individual files
- Database types are re-exported here for convenience
- Post types are complex but well-structured - understand the block system
- Dashboard types are comprehensive for analytics features
- Use discriminated unions (like `Post` type) for type safety with different variants
- When adding new features, define types first to guide implementation
- Types should match database schema where applicable
- Use TypeScript utility types for common operations like `Partial`, `Pick`, `Omit`
