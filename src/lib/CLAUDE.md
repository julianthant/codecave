# Lib Rules (`src/lib/`)

**STRICT REQUIREMENTS**: Follow these exact patterns for ALL generic utility functions.

## Purpose Rules (CRITICAL)

### Lib vs Utils Separation (EXACT)
```typescript
// ✅ LIB: Generic, reusable anywhere
export function formatDate(date: Date): string {}
export function cn(...classes: string[]): string {}
export function truncate(text: string, length: number): string {}

// ❌ NEVER in LIB: Business logic, domain-specific code
export function validateCodeCavePost(post: Post) {} // Belongs in /utils
export function formatSupabaseError(error: Error) {} // Belongs in /utils
export function calculatePostReadingTime(blocks: Block[]) {} // Belongs in /utils
```

### Required Purpose (EXACT)
- **Core utilities ONLY**: Basic functions any React app could use
- **NO business logic**: Domain-specific code belongs in `/utils`
- **NO external integrations**: API clients belong in `/utils`
- **NO framework coupling**: Keep independent of CodeCave specifics

## File Organization (REQUIRED)

```
lib/
├── utils.ts              # REQUIRED: Core utilities ONLY
└── constants.ts          # ALLOWED: Generic constants
```

### NEVER Create:
- Multiple utility files (`date-utils.ts`, `string-utils.ts`)
- Domain-specific files (`post-lib.ts`, `user-lib.ts`)
- Business logic files (`validation.ts`, `api.ts`)

## Core Utilities (REQUIRED FUNCTIONS)

### Class Name Utility (CRITICAL)
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

**Usage Rules (ALWAYS)**:
```typescript
// ✅ CORRECT: Use cn() for all className combinations
<div className={cn(
  'base-classes',
  condition && 'conditional-class',
  variant === 'primary' && 'primary-variant',
  className // Allow prop override
)} />

// ❌ NEVER: Template literals or string concatenation
<div className={`base-classes ${condition ? 'active' : ''}`} />
<div className={'base-classes ' + additionalClass} />
```

### Date Utilities (REQUIRED FUNCTIONS)
```typescript
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(dateObj)
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}
```

### String Utilities (REQUIRED FUNCTIONS)
```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateSlug(title: string): string {
  const slug = slugify(title)
  const timestamp = Date.now().toString(36)
  return slug ? `${slug}-${timestamp}` : timestamp
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).replace(/\s+\S*$/, '') + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
```

### Number Utilities (REQUIRED FUNCTIONS)
```typescript
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
```

### Array Utilities (REQUIRED FUNCTIONS)
```typescript
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```

## Function Rules (CRITICAL)

### Pure Function Requirements (REQUIRED)
```typescript
// ✅ CORRECT: Pure function
export function formatDate(date: Date): string {
  // Same input always produces same output
  // No side effects
  return date.toLocaleDateString()
}

// ❌ NEVER: Side effects
export function formatDate(date: Date): string {
  console.log('Formatting date') // Side effect
  localStorage.setItem('lastDate', date.toString()) // Side effect
  return date.toLocaleDateString()
}

// ❌ NEVER: External dependencies
export function formatUserDate(date: Date): string {
  const userSettings = getUserSettings() // External dependency
  return date.toLocaleDateString(userSettings.locale)
}
```

### TypeScript Requirements (REQUIRED)
```typescript
// ✅ CORRECT: Full typing
export function processItems<T>(
  items: T[],
  processor: (item: T) => T
): T[] {
  return items.map(processor)
}

// ✅ CORRECT: Input validation
export function truncate(text: string, length: number): string {
  if (typeof text !== 'string') {
    throw new Error('Text must be a string')
  }
  if (length < 0) {
    throw new Error('Length must be non-negative')
  }
  
  return text.length <= length ? text : text.slice(0, length) + '...'
}

// ❌ NEVER: Missing types
export function processItems(items: any, processor: any): any {
  return items.map(processor)
}
```

### Error Handling (REQUIRED)
```typescript
// ✅ CORRECT: Graceful error handling
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (!isValidDate(dateObj)) {
      return 'Invalid date'
    }
    
    return dateObj.toLocaleDateString()
  } catch {
    return 'Invalid date'
  }
}
```

## Integration Rules (STRICT)

### Component Usage (REQUIRED)
```typescript
// ✅ CORRECT: Import and use lib utilities
import { cn, formatTimeAgo, truncate } from '@/lib/utils'

export function Card({ title, date, description, className }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-6',
      className
    )}>
      <h3>{truncate(title, 50)}</h3>
      <p className="text-sm text-muted-foreground">
        {formatTimeAgo(date)}
      </p>
      <p>{description}</p>
    </div>
  )
}

// ❌ NEVER: Business logic in components
export function PostCard({ post }: PostCardProps) {
  // Don't validate business rules here - use /utils
  const validation = validateCodeCavePost(post) // Wrong
}
```

### Performance Requirements (CRITICAL)
```typescript
// ✅ CORRECT: Memoize expensive operations
import { useMemo } from 'react'
import { slugify, formatTimeAgo } from '@/lib/utils'

function ItemList({ items }: { items: Item[] }) {
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      slug: slugify(item.title),
      timeAgo: formatTimeAgo(item.date)
    }))
  }, [items])
  
  return <div>{/* Render items */}</div>
}
```

## Forbidden Patterns

### ❌ NEVER Do These:
```typescript
// ❌ Business logic in lib
export function validatePost(post: Post) {} // Belongs in /utils

// ❌ External service integration
export function createSupabaseClient() {} // Belongs in /utils

// ❌ Domain-specific constants
export const POST_TYPES = ['article', 'snippet'] // Belongs in /utils

// ❌ Framework coupling
export function useCodeCaveAuth() {} // Belongs in /hooks

// ❌ Side effects
export function logEvent(event: string) {
  console.log(event) // Side effect
  analytics.track(event) // Side effect
}

// ❌ Mutable state
let cachedValue: string
export function getCachedValue() {
  return cachedValue // Mutable state
}

// ❌ Environment dependencies
export function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL // Environment coupling
}
```

### ❌ Wrong File Organization:
```
lib/
├── date-utils.ts         # Too specific, put in utils.ts
├── post-helpers.ts       # Business logic, belongs in /utils
├── api-utils.ts          # External integration, belongs in /utils
└── codecave-lib.ts       # Domain coupling, wrong purpose
```

## Constants (ALLOWED)
```typescript
// lib/constants.ts

// ✅ ALLOWED: Generic constants
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const URL_REGEX = /^https?:\/\/.+/
export const PHONE_REGEX = /^\+?[\d\s\-\(\)]+$/

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Tokyo'
] as const

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

// ❌ NEVER: Business-specific constants
export const CODECAVE_POST_TYPES = ['article', 'snippet'] // Belongs in /utils
export const SUPABASE_TABLES = ['users', 'posts'] // Belongs in /utils
```

## Testing Rules (REQUIRED)

### Test Structure (EXACT PATTERN)
```typescript
import { cn, formatDate, slugify, truncate } from './utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge classes correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })
    
    it('should handle conditional classes', () => {
      expect(cn('base', false && 'hidden')).toBe('base')
    })
    
    it('should resolve Tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })
  })
  
  describe('formatDate', () => {
    it('should format dates consistently', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('January 15, 2024')
    })
    
    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid date')
    })
  })
  
  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
    })
    
    it('should handle special characters', () => {
      expect(slugify('React & TypeScript')).toBe('react-typescript')
    })
  })
})
```

## CRITICAL REQUIREMENTS

1. **ALWAYS** keep functions pure with no side effects
2. **ALWAYS** use generic, reusable functions only
3. **ALWAYS** use `cn()` for all className combinations
4. **ALWAYS** handle edge cases and invalid inputs gracefully
5. **ALWAYS** include proper TypeScript types
6. **ALWAYS** test all utilities thoroughly
7. **NEVER** include business logic or domain-specific code
8. **NEVER** integrate with external services or APIs
9. **NEVER** use environment variables or external state
10. **NEVER** create multiple utility files - keep everything in `utils.ts`
