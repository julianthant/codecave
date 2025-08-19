# Utils Directory (`src/utils/`)

## Overview

This directory contains specialized utility functions and integrations for **CodeCave**. Unlike the core utilities in `/lib`, these are more specific to the application's business logic and external service integrations.

## Architecture Pattern

- **Domain-Specific**: Utilities tied to specific application features
- **Service Integration**: External API and service utilities
- **Business Logic**: Application-specific helper functions
- **Type Safety**: Full TypeScript integration
- **Modular**: Organized by functional domain

## Directory Structure

### Post Utilities (`post-utils.ts`)

#### Purpose

Comprehensive utility library for post content management, validation, and processing. This is a sophisticated system for handling CodeCave's rich content creation platform.

#### Key Features

- **Block Validation**: Validates different content block types
- **Post Processing**: Content analysis and transformation
- **Content Analysis**: Reading time estimation, tag extraction
- **Type Safety**: Full TypeScript integration with post types

#### Block Validation System

```typescript
class PostUtils {
  // Validate individual content blocks
  static validateBlock(block: Block): { valid: boolean; errors: string[] }

  // Validate complete posts
  static validatePost(post: Post): { valid: boolean; errors: string[] }
}
```

**Supported Block Types**:

- **Text blocks**: Rich text with format validation
- **Code blocks**: Programming language validation, length limits
- **Image blocks**: URL validation, layout options
- **Prompt blocks**: AI prompt validation with parameter checks
- **Math blocks**: Mathematical formula validation
- **SVG blocks**: SVG code validation and sanitization
- **Markdown blocks**: Markdown content processing
- **Terminal blocks**: Command session validation

#### Content Analysis

```typescript
// Reading time estimation
PostUtils.estimateReadingTime(blocks: Block[]): number

// Extract hashtags from content
PostUtils.extractTags(content: string): string[]

// Generate URL-friendly slugs
PostUtils.generateSlug(title: string): string

// Format relative dates
PostUtils.formatPostDate(date: string): string
```

#### Usage Examples

```typescript
import { PostUtils } from '@/utils/post-utils'

// Validate a post before saving
const validation = PostUtils.validatePost(post)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  return
}

// Estimate reading time for UI display
const readingTime = PostUtils.estimateReadingTime(post.blocks)
console.log(`${readingTime} min read`)

// Extract tags from content
const tags = PostUtils.extractTags(postContent)
```

#### Validation Rules

- **Text blocks**: Max 10,000 characters
- **Code blocks**: Max 50,000 characters, valid language
- **Image blocks**: Valid URL, supported layout options
- **Prompt blocks**: Max 5,000 characters, valid temperature (0-2)
- **Math blocks**: Max 2,000 characters for formulas
- **SVG blocks**: Max 20,000 characters, valid SVG syntax
- **Terminal blocks**: Max 10,000 characters for commands

#### Supported Languages

```typescript
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'sql',
  'bash',
  'shell',
  'json',
  'yaml',
  'xml',
  'markdown',
  'dockerfile',
  'nginx',
]
```

### Supabase Integration (`supabase/`)

#### Purpose

Centralized Supabase client configuration and utilities for different environments (client, server, middleware).

#### File Structure

- **`client.ts`**: Browser-side Supabase client
- **`server.ts`**: Server-side Supabase client with service role
- **`middleware.ts`**: Edge runtime Supabase client for middleware

#### Client Configuration (`client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Usage Pattern**:

```typescript
import { createClient } from '@/utils/supabase/client'

// In React components and client-side code
function useUserData() {
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      // Handle user data
    })
  }, [supabase])
}
```

#### Server Configuration (`server.ts`)

**Expected Pattern** (based on standard Next.js + Supabase setup):

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

**Usage Pattern**:

```typescript
import { createClient } from '@/utils/supabase/server'

// In API routes and server components
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('visibility', 'public')

  return Response.json({ data, error })
}
```

#### Middleware Configuration (`middleware.ts`)

**Expected Pattern**:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'

export function createClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Handle cookie setting in middleware
        },
        remove(name: string, options: any) {
          // Handle cookie removal in middleware
        },
      },
    }
  )
}
```

## Development Guidelines

### Adding New Utilities

#### When to Add to Utils vs Lib

- **Utils**: Application-specific, business logic, external integrations
- **Lib**: Generic, reusable across any React app, pure functions

Examples:

```typescript
// ✅ Utils - CodeCave specific
function validateCodeCavePost(post: Post) {}
function formatSupabaseError(error: SupabaseError) {}

// ✅ Lib - Generic utilities
function formatDate(date: Date) {}
function cn(...classes: string[]) {}
```

#### File Organization

```typescript
// utils/feature-name.ts
export class FeatureUtils {
  static processFeatureData(data: FeatureData) {
    // Implementation
  }

  static validateFeature(feature: Feature) {
    // Implementation
  }
}

// Or functional approach
export function processFeatureData(data: FeatureData) {}
export function validateFeature(feature: Feature) {}
```

### Integration Patterns

#### With Components

```typescript
import { PostUtils } from '@/utils/post-utils'

function PostEditor({ onSave }) {
  const handleSave = (post: Post) => {
    const validation = PostUtils.validatePost(post)

    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    const readingTime = PostUtils.estimateReadingTime(post.blocks)
    onSave({ ...post, readingTime })
  }
}
```

#### With API Routes

```typescript
import { createClient } from '@/utils/supabase/server'
import { PostUtils } from '@/utils/post-utils'

export async function POST(request: Request) {
  const supabase = createClient()
  const postData = await request.json()

  // Validate using utils
  const validation = PostUtils.validatePost(postData)
  if (!validation.valid) {
    return Response.json({ errors: validation.errors }, { status: 400 })
  }

  // Process with Supabase
  const { data, error } = await supabase.from('posts').insert(postData)

  return Response.json({ data, error })
}
```

### Supabase Client Patterns

#### Client-Side Usage

```typescript
'use client'
import { createClient } from '@/utils/supabase/client'

export function useSupabaseQuery() {
  const supabase = createClient()

  return useQuery(['posts'], async () => {
    const { data, error } = await supabase.from('posts').select('*')

    if (error) throw error
    return data
  })
}
```

#### Server-Side Usage

```typescript
import { createClient } from '@/utils/supabase/server'

export async function getUserPosts(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)

  return { data, error }
}
```

#### Middleware Usage

```typescript
import { createClient } from '@/utils/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### Error Handling Patterns

#### Supabase Error Handling

```typescript
// utils/supabase-errors.ts
export function handleSupabaseError(error: any) {
  switch (error.code) {
    case '23505': // Unique violation
      return 'This item already exists'
    case 'PGRST301': // Row not found
      return 'Item not found'
    default:
      return 'An unexpected error occurred'
  }
}
```

#### Validation Error Formatting

```typescript
// utils/validation-errors.ts
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 1) {
    return errors[0]
  }

  return `Multiple errors: ${errors.join(', ')}`
}
```

## Performance Considerations

### Validation Optimization

```typescript
// Memoize expensive validations
import { useMemo } from 'react'

function PostEditor({ post }) {
  const validation = useMemo(() => {
    return PostUtils.validatePost(post)
  }, [post])

  // Use validation results
}
```

### Supabase Connection Reuse

```typescript
// Reuse Supabase clients
const supabase = createClient() // Create once per component

// ❌ Don't create new clients repeatedly
useEffect(() => {
  const supabase = createClient() // New client every render
}, [])

// ✅ Create once, reuse
const supabase = createClient()
useEffect(() => {
  // Use existing client
}, [supabase])
```

## Future Expansion

### Potential Utility Additions

- **Content processing**: Markdown to HTML conversion, syntax highlighting
- **Image utilities**: Image optimization, placeholder generation
- **Analytics utilities**: Event tracking, performance monitoring
- **SEO utilities**: Meta tag generation, sitemap creation
- **Export utilities**: Content export to various formats
- **Import utilities**: Content import from external sources

### Organization Strategy

```
utils/
├── post-utils.ts (current)
├── supabase/ (current)
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
├── content/
│   ├── markdown.ts
│   ├── syntax-highlighting.ts
│   └── export.ts
├── analytics/
│   ├── events.ts
│   └── tracking.ts
└── seo/
    ├── meta.ts
    └── sitemap.ts
```

## Key Dependencies

- **Supabase**: Database and authentication client
- **TypeScript**: Type safety and developer experience
- **Post Types**: Integration with content type system
- **Next.js**: Framework-specific utilities (cookies, headers)

## Notes for Claude

- `post-utils.ts` is critical for content validation - always use these utilities for post operations
- Supabase clients are environment-specific - use the correct one for your context
- Post validation is comprehensive and should be used before saving any content
- The validation system handles all the complex block types in CodeCave's rich editor
- Always validate posts client-side and server-side for security
- Use the appropriate Supabase client based on where your code runs (client, server, middleware)
- Post utilities include reading time estimation, tag extraction, and slug generation
- The supported languages list should be kept in sync with syntax highlighting capabilities
