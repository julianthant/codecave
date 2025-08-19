# Lib Directory (`src/lib/`)

## Overview

This directory contains core utility functions and helper libraries for **CodeCave**. It serves as the foundation for common operations used throughout the application.

## Architecture Pattern

- **Pure Functions**: Stateless utility functions without side effects
- **Type Safety**: Full TypeScript support with proper typing
- **Tree Shaking**: Modular exports for optimal bundle size
- **Reusability**: Functions designed for use across multiple components
- **Performance**: Optimized implementations for common operations

## Core Utilities (`utils.ts`)

### Class Name Utilities

#### `cn()` Function

**Purpose**: Combines and merges CSS class names intelligently using `clsx` and `tailwind-merge`.

```typescript
function cn(...inputs: ClassValue[]): string
```

**Key Features**:

- Handles conditional classes with `clsx`
- Merges conflicting Tailwind classes with `tailwind-merge`
- Removes duplicate classes
- Handles falsy values gracefully

**Usage Examples**:

```typescript
// Basic usage
cn('px-4', 'py-2', 'bg-blue-500')
// → "px-4 py-2 bg-blue-500"

// Conditional classes
cn('base-class', {
  'active-class': isActive,
  'disabled-class': isDisabled
})

// Tailwind class merging (conflicting classes resolved)
cn('px-2 px-4 py-1 py-2')
// → "px-4 py-2" (later classes override earlier ones)

// Component pattern
<button className={cn(
  'base-button-classes',
  variant === 'primary' && 'primary-classes',
  size === 'large' && 'large-classes',
  className // Allow external class override
)}>
```

**Why This Matters**: Essential for building flexible, composable UI components where class conflicts need intelligent resolution.

### Date Formatting Utilities

#### `formatDate()` Function

**Purpose**: Formats dates into human-readable strings.

```typescript
function formatDate(date: string | Date): string
```

**Format**: "Month Day, Year" (e.g., "January 15, 2024")

**Usage**:

```typescript
formatDate(new Date())
// → "January 15, 2024"

formatDate('2024-01-15T10:30:00Z')
// → "January 15, 2024"
```

#### `formatTimeAgo()` Function

**Purpose**: Converts dates to relative time strings (time ago format).

```typescript
function formatTimeAgo(date: string | Date): string
```

**Time Ranges**:

- `< 1 minute`: "just now"
- `< 1 hour`: "Xm ago"
- `< 1 day`: "Xh ago"
- `< 1 month`: "Xd ago"
- `≥ 1 month`: Falls back to `formatDate()`

**Usage**:

```typescript
formatTimeAgo(new Date(Date.now() - 30000))
// → "just now"

formatTimeAgo(new Date(Date.now() - 300000))
// → "5m ago"

formatTimeAgo(new Date(Date.now() - 7200000))
// → "2h ago"
```

**Perfect For**: Social media feeds, comments, activity timelines.

### String Manipulation Utilities

#### `slugify()` Function

**Purpose**: Converts strings into URL-friendly slugs.

```typescript
function slugify(text: string): string
```

**Transformations**:

- Converts to lowercase
- Removes special characters (keeps alphanumeric, spaces, hyphens)
- Replaces spaces/underscores with hyphens
- Removes leading/trailing hyphens
- Collapses multiple consecutive hyphens

**Usage**:

```typescript
slugify('Hello World! This is a Test')
// → "hello-world-this-is-a-test"

slugify('React.js & TypeScript Guide')
// → "reactjs-typescript-guide"

slugify('  Special---Characters!!!  ')
// → "special-characters"
```

#### `generateSlug()` Function

**Purpose**: Creates unique slugs by combining `slugify()` with timestamps.

```typescript
function generateSlug(title: string): string
```

**Format**: `{slugified-title}-{timestamp-in-base36}`

**Usage**:

```typescript
generateSlug('My Blog Post')
// → "my-blog-post-km8zr2x" (timestamp varies)
```

**Use Case**: Generating unique URLs for posts, projects, or any content that needs guaranteed uniqueness.

#### `truncate()` Function

**Purpose**: Truncates text to specified length with ellipsis.

```typescript
function truncate(text: string, length: number): string
```

**Behavior**:

- Returns original text if within length limit
- Truncates and adds "..." if exceeds limit
- Clean cut without word breaking

**Usage**:

```typescript
truncate('This is a very long text that needs truncation', 20)
// → "This is a very long..."

truncate('Short text', 50)
// → "Short text" (unchanged)
```

## Development Guidelines

### Adding New Utilities

#### Function Design Principles

1. **Pure Functions**: No side effects, same input = same output
2. **Single Responsibility**: Each function does one thing well
3. **Type Safety**: Proper TypeScript types for parameters and returns
4. **Edge Case Handling**: Handle null, undefined, empty strings gracefully
5. **Performance**: Consider efficiency for frequently used functions

#### Naming Conventions

- Use descriptive, verb-based names: `formatDate`, `slugify`, `truncate`
- Prefer full words over abbreviations: `formatTimeAgo` vs `fmtTimeAgo`
- Group related functions with consistent prefixes when logical

#### Example New Utility

```typescript
/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Generates random color from predefined palette
 * @param seed - Optional seed for consistent color generation
 * @returns Hex color string
 */
export function generateAvatarColor(seed?: string): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']

  if (seed) {
    // Generate consistent color based on seed
    const hash = seed.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  return colors[Math.floor(Math.random() * colors.length)]
}
```

### Usage Patterns

#### Component Integration

```typescript
import { cn, formatTimeAgo, truncate } from '@/lib/utils'

function PostCard({ post, className }) {
  return (
    <div className={cn(
      'post-card-base-classes',
      className
    )}>
      <h3>{truncate(post.title, 60)}</h3>
      <p className="text-sm text-gray-500">
        {formatTimeAgo(post.createdAt)}
      </p>
    </div>
  )
}
```

#### API Integration

```typescript
import { generateSlug, slugify } from '@/lib/utils'

// Creating a new post
async function createPost(title: string, content: string) {
  const slug = generateSlug(title)

  return await api.posts.create({
    title,
    slug,
    content,
  })
}
```

### Performance Considerations

#### Memoization for Expensive Operations

```typescript
import { useMemo } from 'react'

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      slug: slugify(item.title),
      timeAgo: formatTimeAgo(item.date)
    }))
  }, [data])

  return <div>{/* Render processed data */}</div>
}
```

#### Bundle Size Optimization

- Export functions individually for tree shaking
- Keep utility functions small and focused
- Avoid importing large external libraries for simple operations

### Testing Strategy

#### Unit Testing Example

```typescript
import { slugify, formatTimeAgo, cn } from './utils'

describe('utils', () => {
  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(slugify('React & TypeScript')).toBe('react-typescript')
    })
  })

  describe('formatTimeAgo', () => {
    it('should return "just now" for recent times', () => {
      const recent = new Date(Date.now() - 30000)
      expect(formatTimeAgo(recent)).toBe('just now')
    })
  })
})
```

## Future Expansion

### Potential Additions

- **Validation utilities**: Email, URL, phone number validation
- **Number formatting**: Currency, file sizes, percentages
- **Color utilities**: Hex to RGB, color palette generation
- **Text processing**: Markdown parsing, syntax highlighting helpers
- **API utilities**: Request/response formatters, error handling
- **Local storage**: Type-safe localStorage wrappers

### Organization Strategy

As the utility library grows, consider organizing into subdirectories:

```
lib/
├── utils.ts (current core utilities)
├── validation/
│   ├── email.ts
│   ├── forms.ts
│   └── index.ts
├── formatting/
│   ├── numbers.ts
│   ├── dates.ts
│   └── index.ts
└── api/
    ├── transforms.ts
    ├── errors.ts
    └── index.ts
```

## Key Dependencies

- **clsx**: Conditional class name utility
- **tailwind-merge**: Intelligent Tailwind CSS class merging
- **TypeScript**: Type safety and developer experience

## Notes for Claude

- `cn()` is the most critical utility - used in virtually every component for class management
- Always use `cn()` instead of template literals for combining classes in components
- Date utilities are used throughout the app for user-generated content timestamps
- String utilities are essential for content creation and URL generation
- Keep utilities pure and stateless - no side effects or external dependencies
- When adding new utilities, consider if they belong in this file or should be in a more specific location
- Test edge cases thoroughly, especially for string manipulation functions
- Consider performance implications for utilities used in render loops
