# Type Rules (`src/types/`)

**STRICT REQUIREMENTS**: Follow these exact patterns for ALL TypeScript type definitions.

## File Organization (REQUIRED)

```
types/
├── index.ts              # REQUIRED: Central export ONLY
├── feature-types.ts      # Domain-specific types
├── dashboard-types.ts    # ✅ Correct
├── post-types.ts         # ✅ Correct
└── api-types.ts          # ✅ Correct
```

### Naming Conventions (EXACT)
- Files: `feature-types.ts` 
- Interfaces/Types: `PascalCase`
- Generics: Single uppercase letter (`T`, `K`, `V`)
- Union types: `PascalCase` (e.g., `PostType`, `BlockType`)

### NEVER Use:
- `featureTypes.ts`, `Feature-Types.ts`
- `types.ts` (multiple domains in one file)
- `snake_case`, `camelCase` for interface names
- `any` or `unknown` without specific reason

## Index File Rules (CRITICAL)

### Required Structure (EXACT)
```typescript
// SECTION 1: Database type re-exports (ALWAYS FIRST)
export type {
  Profile,
  NewProfile,
  UpdateProfile,
  UserSettings,
  NewUserSettings,
  UpdateUserSettings,
} from '@/db'

// SECTION 2: Domain type re-exports (ALPHABETICAL)
export type * from './api-types'
export type * from './dashboard-types'
export type * from './post-types'

// SECTION 3: Application-specific types (MINIMAL)
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

### NEVER in Index File:
```typescript
// ❌ Complex type definitions (move to domain files)
export interface ComplexPostData { /* ... */ }

// ❌ Database type redefinition
export interface Profile { /* ... */ } // Use database types

// ❌ Implementation details
export interface InternalHelperType { /* ... */ }
```

## Type Definition Patterns (EXACT)

### Interface Template (REQUIRED)
```typescript
// Base interfaces
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Specific interfaces extending base
export interface FeatureData extends BaseEntity {
  name: string
  description: string
  isActive: boolean
  metadata: Record<string, unknown>
}

// Related operation types
export type NewFeatureData = Omit<FeatureData, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateFeatureData = Partial<NewFeatureData> & { id: string }
```

### Discriminated Unions (REQUIRED PATTERN)
```typescript
// Union types with discriminant
export type PostType = 'article' | 'snippet' | 'showcase' | 'discussion'

export interface BasePost {
  id: string
  type: PostType
  title: string
  author: Author
  createdAt: string
}

export interface ArticlePost extends BasePost {
  type: 'article'
  subtitle?: string
  readingTime?: number
  featuredImage?: string
}

export interface SnippetPost extends BasePost {
  type: 'snippet'
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// Union export (REQUIRED)
export type Post = ArticlePost | SnippetPost | ShowcasePost | DiscussionPost
```

### Generic Types (REQUIRED PATTERN)
```typescript
// API response wrapper (ALWAYS USE)
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Paginated response (REQUIRED FOR LISTS)
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form types (REQUIRED PATTERN)
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isDirty: boolean
}
```

## Component Prop Types (REQUIRED)

### Component Interface Pattern (EXACT)
```typescript
// Base props interface
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Specific component props
export interface FeatureCardProps extends BaseComponentProps {
  feature: FeatureData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

// Event handler types (REQUIRED)
export type FeatureCardHandler = (feature: FeatureData) => void
export type FeatureCardAsyncHandler = (feature: FeatureData) => Promise<void>
```

### Hook Types (REQUIRED PATTERN)
```typescript
// Hook parameter interfaces
export interface UseFeatureOptions {
  enabled?: boolean
  refetchInterval?: number
  onSuccess?: (data: FeatureData) => void
  onError?: (error: Error) => void
}

// Hook return interfaces
export interface UseFeatureReturn {
  data: FeatureData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  isSuccess: boolean
}
```

## Store Integration (CRITICAL)

### Store State Types (REQUIRED)
```typescript
// Store state interface
export interface FeatureStoreState {
  // Data properties
  items: FeatureData[]
  currentItem: FeatureData | null
  
  // Status properties
  isLoading: boolean
  error: string | null
  
  // Pagination
  pagination: {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
}

// Store actions interface
export interface FeatureStoreActions {
  // Data actions
  setItems: (items: FeatureData[]) => void
  setCurrentItem: (item: FeatureData | null) => void
  
  // Async actions
  fetchItems: () => Promise<void>
  createItem: (data: NewFeatureData) => Promise<void>
  updateItem: (id: string, data: UpdateFeatureData) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  
  // State actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

// Combined store type
export type FeatureStore = FeatureStoreState & FeatureStoreActions
```

## Database Integration Rules (CRITICAL)

### Database Type Usage (REQUIRED)
```typescript
// ✅ CORRECT: Re-export database types
export type { Profile, UserSettings } from '@/db'

// ✅ CORRECT: Extend database types for UI
export interface UserWithSettings extends Profile {
  settings?: UserSettings
}

// ✅ CORRECT: Derive operation types
export type UpdateUserRequest = Partial<Pick<Profile, 'displayName' | 'bio' | 'avatarUrl'>>

// ❌ NEVER: Redefine database types
export interface Profile {
  id: string
  username: string
  // ... DON'T DO THIS
}
```

### Field Naming Rules (CRITICAL)
```typescript
// Database schema uses snake_case
// TypeScript interfaces use camelCase
// Drizzle handles conversion automatically

// ✅ CORRECT: Use database types directly
const user: Profile = {
  id: '123',
  displayName: 'John', // camelCase in TypeScript
  avatarUrl: 'url',    // camelCase in TypeScript
}

// Database stores as:
// display_name, avatar_url (snake_case)
```

## Type Guard Rules (REQUIRED)

### Type Guard Implementation (EXACT PATTERN)
```typescript
// Type guards for discriminated unions
export function isArticlePost(post: Post): post is ArticlePost {
  return post.type === 'article'
}

export function isCodeBlock(block: Block): block is CodeBlock {
  return block.type === 'code'
}

// Runtime type checking
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// Array type guards
export function isPostArray(value: unknown): value is Post[] {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && item !== null && 'type' in item
  )
}
```

## Utility Type Usage (REQUIRED)

### Standard Utility Types (ALWAYS USE)
```typescript
// ✅ CORRECT: Use TypeScript utility types
export type PostKeys = keyof Post
export type PartialPost = Partial<Post>
export type RequiredPost = Required<Post>
export type PostTitle = Pick<Post, 'title' | 'author'>
export type PostWithoutMeta = Omit<Post, 'createdAt' | 'updatedAt'>

// ✅ CORRECT: Custom utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type WithId<T> = T & { id: string }
export type Timestamp = { createdAt: string; updatedAt: string }
```

## API Integration (REQUIRED PATTERNS)

### Request/Response Types (EXACT PATTERN)
```typescript
// API endpoint types
export interface CreatePostRequest {
  title: string
  content: Block[]
  tags: string[]
  type: PostType
}

export interface CreatePostResponse extends ApiResponse<Post> {
  data: Post
}

// API error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// API pagination
export interface ApiPaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## Forbidden Patterns

### ❌ NEVER Do These:
```typescript
// ❌ Using any type
export interface BadInterface {
  data: any // Use specific types
}

// ❌ Redefining database types
export interface Profile {
  id: string
  name: string // Should use database types
}

// ❌ Complex logic in type definitions
export type ComplexType<T> = T extends string 
  ? T extends `${infer U}${'_'}${infer V}` 
    ? U extends 'valid' 
      ? V 
      : never 
    : never 
  : never // Too complex

// ❌ Mixing naming conventions
export interface user_profile { // Use PascalCase
  user_name: string // Use camelCase
}

// ❌ Non-descriptive generic names
export interface DataContainer<A, B, C, D> { // Use descriptive names
  stuff: A
}

// ❌ Deeply nested generics
export type DeepGeneric<T extends Record<string, Record<string, unknown>>> = {
  [K in keyof T]: T[K] extends Record<string, infer U> ? U : never
} // Too complex
```

### ❌ Wrong File Organization:
```
types/
├── Types.ts              # Wrong capitalization
├── feature.types.ts      # Wrong separator
├── featureTypes.ts       # Wrong naming
├── index.tsx             # Wrong extension
└── all-types.ts          # Multiple domains
```

## Testing Integration (REQUIRED)

### Test Type Definitions (EXACT PATTERN)
```typescript
// Mock data types
export interface MockFeatureData extends FeatureData {
  __isMock: true
}

// Test utility types
export type TestApiResponse<T> = Omit<ApiResponse<T>, 'success'> & {
  success: true
  __testData: true
}

// Factory function types
export type FeatureDataFactory = (overrides?: Partial<FeatureData>) => FeatureData
```

## CRITICAL REQUIREMENTS

1. **ALWAYS** import types from `@/types`, NEVER from individual files
2. **ALWAYS** re-export database types from `@/db`, NEVER redefine them
3. **ALWAYS** use PascalCase for interfaces and types
4. **ALWAYS** use discriminated unions for variant types
5. **ALWAYS** define operation types (Create, Update, Delete) for entities
6. **ALWAYS** include proper generic constraints
7. **NEVER** use `any` type unless absolutely necessary
8. **NEVER** define database schema types in this directory
9. **NEVER** mix naming conventions (camelCase vs snake_case)
10. **NEVER** create deeply nested or overly complex utility types
