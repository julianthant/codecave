# Utils Rules (`src/utils/`)

**STRICT REQUIREMENTS**: Follow these exact patterns for ALL application-specific utilities.

## File Organization (REQUIRED)

```
utils/
├── feature-utils.ts      # REQUIRED pattern
├── post-utils.ts         # ✅ Correct
├── supabase/             # REQUIRED: Supabase clients ONLY
│   ├── client.ts         # Browser client
│   ├── server.ts         # Server client
│   └── middleware.ts     # Edge runtime client
└── auth-utils.ts         # ✅ Correct
```

### Naming Conventions (EXACT)
- Files: `feature-utils.ts`
- Functions: `camelCase` with descriptive names
- Classes: `FeatureUtils` (static methods only)
- NEVER: Generic names like `utils.ts`, `helpers.ts`

### NEVER Use:
- `utils.ts` (too generic, multiple domains)
- `featureUtil.ts`, `feature_utils.ts`
- Mixed domains in single file
- Business logic in `/lib`

## Purpose Rules (CRITICAL)

### Utils vs Lib Separation (EXACT)
```typescript
// ✅ UTILS: Application-specific, business logic
export function validateCodeCavePost(post: Post) {}
export function formatSupabaseError(error: SupabaseError) {}
export function calculatePostReadingTime(blocks: Block[]) {}

// ✅ LIB: Generic, reusable anywhere  
export function formatDate(date: Date) {}
export function cn(...classes: string[]) {}
export function truncate(text: string, length: number) {}
```

### Required Utility Types (EXACT)
- **Domain validation**: Business rule validation
- **External service integration**: API wrappers, clients
- **Data transformation**: Domain-specific formatting
- **Error handling**: Service-specific error processing

## Function Rules (CRITICAL)

### Pure Function Requirements (REQUIRED)
```typescript
// ✅ CORRECT: Pure function
export function validatePost(post: Post): ValidationResult {
  // No side effects, same input = same output
  const errors: string[] = []
  
  if (!post.title?.trim()) {
    errors.push('Title is required')
  }
  
  return { valid: errors.length === 0, errors }
}

// ❌ NEVER: Side effects in utilities
export function validatePost(post: Post): ValidationResult {
  console.log('Validating post') // Side effect
  localStorage.setItem('lastPost', post.id) // Side effect
  return { valid: true, errors: [] }
}
```

### TypeScript Requirements (CRITICAL)
```typescript
// ✅ CORRECT: Full typing
export function processPostData(
  post: Post, 
  options: ProcessOptions = {}
): ProcessedPost {
  // Implementation
}

interface ProcessOptions {
  includeMetadata?: boolean
  stripHtml?: boolean
}

interface ProcessedPost {
  id: string
  title: string
  readingTime: number
  wordCount: number
}

// ❌ NEVER: Missing types
export function processPostData(post: any, options?: any): any {
  // No type safety
}
```

## Supabase Client Rules (CRITICAL)

### Required File Structure (EXACT)
```typescript
// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

```typescript
// utils/supabase/middleware.ts
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
          // Cookie setting handled by middleware
        },
        remove(name: string, options: any) {
          // Cookie removal handled by middleware  
        },
      },
    }
  )
}
```

### Client Usage Rules (EXACT)

#### Browser Context (REQUIRED)
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'

// ✅ CORRECT: Component-level usage
export function useUserPosts() {
  const supabase = createClient()
  
  return useQuery(['posts'], async () => {
    const { data, error } = await supabase.from('posts').select('*')
    if (error) throw error
    return data
  })
}

// ❌ NEVER: Server context in client file
import { createClient } from '@/utils/supabase/server' // Wrong client
```

#### Server Context (REQUIRED)
```typescript
import { createClient } from '@/utils/supabase/server'

// ✅ CORRECT: API route usage
export async function GET() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('visibility', 'public')
    
  return Response.json({ data, error })
}

// ❌ NEVER: Browser client in server context
import { createClient } from '@/utils/supabase/client' // Wrong client
```

#### Middleware Context (REQUIRED)
```typescript
import { createClient } from '@/utils/supabase/middleware'
import { NextRequest } from 'next/server'

// ✅ CORRECT: Middleware usage  
export async function middleware(request: NextRequest) {
  const supabase = createClient(request)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
```

## Validation Utils (REQUIRED PATTERNS)

### Content Validation (EXACT TEMPLATE)
```typescript
// post-utils.ts
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface PostValidationOptions {
  maxTitleLength?: number
  maxContentLength?: number
  requiredFields?: string[]
}

export function validatePost(
  post: Post, 
  options: PostValidationOptions = {}
): ValidationResult {
  const errors: string[] = []
  const { maxTitleLength = 200, maxContentLength = 50000 } = options
  
  // Title validation
  if (!post.title?.trim()) {
    errors.push('Title is required')
  } else if (post.title.length > maxTitleLength) {
    errors.push(`Title must be ${maxTitleLength} characters or less`)
  }
  
  // Content validation
  if (post.content && post.content.length > maxContentLength) {
    errors.push(`Content must be ${maxContentLength} characters or less`)
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateBlock(block: Block): ValidationResult {
  const errors: string[] = []
  
  switch (block.type) {
    case 'code':
      if (!SUPPORTED_LANGUAGES.includes(block.language)) {
        errors.push(`Unsupported language: ${block.language}`)
      }
      if (block.code.length > 50000) {
        errors.push('Code block too long (max 50,000 characters)')
      }
      break
      
    case 'text':
      if (block.content.length > 10000) {
        errors.push('Text block too long (max 10,000 characters)')
      }
      break
      
    // Add other block types
  }
  
  return { valid: errors.length === 0, errors }
}

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
  'html', 'css', 'scss', 'sql', 'bash', 'shell', 'json',
  'yaml', 'xml', 'markdown', 'dockerfile', 'nginx'
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
```

### Content Processing (EXACT TEMPLATE)
```typescript
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function extractTags(content: string): string[] {
  const tagRegex = /#[\w]+/g
  const matches = content.match(tagRegex) || []
  return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))]
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}
```

## Error Handling (REQUIRED PATTERNS)

### Supabase Error Handler (EXACT TEMPLATE)
```typescript
// supabase-errors.ts
export interface SupabaseErrorInfo {
  message: string
  code: string
  severity: 'low' | 'medium' | 'high'
}

export function handleSupabaseError(error: any): SupabaseErrorInfo {
  switch (error.code) {
    case '23505': // Unique constraint violation
      return {
        message: 'This item already exists',
        code: 'DUPLICATE_ENTRY',
        severity: 'medium'
      }
      
    case 'PGRST301': // Row not found
      return {
        message: 'Item not found',
        code: 'NOT_FOUND', 
        severity: 'low'
      }
      
    case '42501': // Insufficient privilege
      return {
        message: 'Permission denied',
        code: 'UNAUTHORIZED',
        severity: 'high'
      }
      
    default:
      return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        severity: 'high'
      }
  }
}

export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return ''
  if (errors.length === 1) return errors[0]
  return `${errors.length} errors: ${errors.join('; ')}`
}
```

## Integration Rules (CRITICAL)

### Component Integration (REQUIRED)
```typescript
// ✅ CORRECT: Component usage
import { validatePost, estimateReadingTime } from '@/utils/post-utils'

export function PostEditor({ onSave }: { onSave: (post: Post) => void }) {
  const handleSave = useCallback((post: Post) => {
    const validation = validatePost(post)
    
    if (!validation.valid) {
      toast.error(formatValidationErrors(validation.errors))
      return
    }
    
    const readingTime = estimateReadingTime(post.content)
    onSave({ ...post, readingTime })
  }, [onSave])
  
  // Component implementation
}
```

### API Route Integration (REQUIRED)
```typescript
// ✅ CORRECT: API route usage
import { createClient } from '@/utils/supabase/server'
import { validatePost, handleSupabaseError } from '@/utils/post-utils'

export async function POST(request: Request) {
  const supabase = createClient()
  const postData = await request.json()
  
  // Validate using utils
  const validation = validatePost(postData)
  if (!validation.valid) {
    return Response.json(
      { error: formatValidationErrors(validation.errors) },
      { status: 400 }
    )
  }
  
  try {
    const { data, error } = await supabase.from('posts').insert(postData)
    
    if (error) {
      const errorInfo = handleSupabaseError(error)
      return Response.json({ error: errorInfo.message }, { status: 500 })
    }
    
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Forbidden Patterns

### ❌ NEVER Do These:
```typescript
// ❌ Side effects in utilities
export function validatePost(post: Post) {
  console.log('Validating...') // Side effect
  toast.show('Validating post') // Side effect
  return { valid: true }
}

// ❌ Wrong Supabase client usage
'use client'
import { createClient } from '@/utils/supabase/server' // Wrong context

// ❌ Mixed domains in one file
// post-utils.ts
export function validatePost() {}
export function validateUser() {} // Different domain
export function formatDate() {} // Should be in /lib

// ❌ Missing error handling
export async function createPost(data: PostData) {
  const { data: post } = await supabase.from('posts').insert(data)
  return post // No error handling
}

// ❌ Generic utility names  
export function process(data: any) {} // Too generic
export function validate(input: unknown) {} // Too generic

// ❌ Business logic in /lib
// lib/utils.ts
export function validateCodeCavePost() {} // Business logic, belongs in utils
```

### ❌ Wrong File Organization:
```
utils/
├── PostUtils.ts              # Wrong capitalization
├── post_utils.ts             # Wrong separator
├── utils.ts                  # Too generic
├── helpers/                  # Wrong directory structure
└── supabase.ts               # Should be in supabase/
```

## Performance Rules (CRITICAL)

### Memoization (REQUIRED)
```typescript
// ✅ CORRECT: Memoize expensive operations
import { useMemo } from 'react'

function PostPreview({ post }: { post: Post }) {
  const validation = useMemo(() => validatePost(post), [post])
  const readingTime = useMemo(() => estimateReadingTime(post.content), [post.content])
  
  return <div>{/* Component JSX */}</div>
}
```

### Client Reuse (REQUIRED)
```typescript
// ✅ CORRECT: Reuse clients
const supabase = createClient()

// ❌ NEVER: Create new clients repeatedly
useEffect(() => {
  const supabase = createClient() // New client every render
}, [])
```

## CRITICAL REQUIREMENTS

1. **ALWAYS** use pure functions with no side effects
2. **ALWAYS** use correct Supabase client for the context (client/server/middleware)
3. **ALWAYS** validate data before database operations
4. **ALWAYS** handle Supabase errors with proper error formatting
5. **ALWAYS** use TypeScript interfaces for all parameters and return types
6. **ALWAYS** separate business logic (utils) from generic utilities (lib)
7. **NEVER** mix different domains in a single utility file
8. **NEVER** perform side effects in utility functions
9. **NEVER** use generic names like `utils.ts` or `helpers.ts`
10. **NEVER** put business logic in the `/lib` directory
