# Database Rules (`src/db/`)

**CRITICAL REQUIREMENTS**: Follow these exact patterns for all database operations.

## Push-Based Schema Management (PRIMARY WORKFLOW)

CodeCave uses a **schema-first, push-based approach** for rapid development. TypeScript schema is the single source of truth.

### Core Principles
- ✅ **Schema-First**: Define tables in TypeScript, push to database
- ✅ **No Migration Files**: Direct schema synchronization
- ✅ **Validation Included**: Zod schemas for all operations
- ✅ **Serverless Optimized**: Connection reuse and prepared statements

## File Organization (REQUIRED)

```
src/db/
├── schema/                    # MODULAR: Schema definitions split by domain
│   ├── validation/           # ZOD: Validation schemas for API safety
│   │   ├── profiles.validation.ts
│   │   ├── posts.validation.ts
│   │   ├── connections.validation.ts
│   │   ├── collaborations.validation.ts
│   │   ├── notifications.validation.ts
│   │   ├── projects.validation.ts
│   │   └── index.ts          # Re-exports all validations
│   ├── enums.ts              # All enum definitions
│   ├── helpers.ts            # Common column helpers (timestamps, etc.)
│   ├── profiles.ts           # Profile and user settings tables
│   ├── posts.ts              # Posts and post engagement tables
│   ├── connections.ts        # Connections and invitations
│   ├── collaborations.ts     # Collaborations and applications
│   ├── notifications.ts      # Notifications table
│   └── projects.ts           # Projects table
├── schema.ts                 # REQUIRED: Main schema re-exports + validations
├── index.ts                  # REQUIRED: Serverless-optimized database client
└── migrations.archive/       # HISTORICAL: Old migration files (reference only)
```

## Development Workflow (CRITICAL)

### Primary Commands
```bash
# Schema Development
pnpm db:push        # Push schema changes to database (PRIMARY)
pnpm db:push:prod   # Push to production with verbose output
pnpm db:studio      # Open Drizzle Studio UI for inspection

# Schema Utilities
pnpm db:pull        # Pull schema from database to TypeScript
pnpm db:check       # Validate schema consistency
```

### Workflow Steps
1. **Modify** schema files in `src/db/schema/`
2. **Validate** types with `pnpm type-check`
3. **Push** changes with `pnpm db:push`
4. **Verify** in Drizzle Studio: `pnpm db:studio`

## Schema + Validation Pattern (REQUIRED)

### Table Definition (`schema/[domain].ts`)
```typescript
import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'

export const tableName = pgTable('table_name', {
  id: uuid('id').primaryKey().notNull(),
  title: text('title').notNull(),
  ...timestamps,
})

// ALWAYS export inferred types
export type TableName = typeof tableName.$inferSelect
export type NewTableName = typeof tableName.$inferInsert
export type UpdateTableName = Partial<Omit<NewTableName, 'id' | 'createdAt'>>
```

### Validation Schema (`schema/validation/[domain].validation.ts`)
```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { tableName } from '../[domain]'

// Drizzle-Zod generated schemas
export const tableSelectSchema = createSelectSchema(tableName)
export const tableInsertSchema = createInsertSchema(tableName, {
  title: (schema) => schema
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
})
export const tableUpdateSchema = createUpdateSchema(tableName, {
  title: (schema) => schema
    .min(1, 'Title is required') 
    .max(100, 'Title must be at most 100 characters'),
})

// API-specific schemas
export const createTableSchema = z.object({
  title: z.string().min(1).max(100),
  // ... other fields
})

// Type exports
export type TableSelect = z.infer<typeof tableSelectSchema>
export type TableInsert = z.infer<typeof tableInsertSchema>
export type CreateTable = z.infer<typeof createTableSchema>
```

## API Route Integration (REQUIRED)

### Standard API Route Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, validateApiInput, ErrorResponses, createSuccessResponse } from '@/utils/api-errors'
import { createTableSchema, tableSelectSchema } from '@/db/schema'
import { dbService } from '@/services/database'

export const POST = handleApiError(async (request: NextRequest) => {
  // Validate input with Zod
  const validatedData = validateApiInput(createTableSchema, await request.json())
  
  // Database operation
  const result = await dbService.table.create(validatedData)
  
  // Validate output (optional but recommended)
  const validatedResult = tableSelectSchema.parse(result)
  
  return createSuccessResponse(validatedResult, 'Created successfully')
})
```

### Error Handling
```typescript
// Automatic error handling with handleApiError wrapper
export const POST = handleApiError(async (request: NextRequest) => {
  // Any thrown ZodError is automatically formatted
  const data = validateApiInput(schema, body)
  
  // Database errors are caught and formatted
  const result = await dbService.operation(data)
  
  return createSuccessResponse(result)
})

// Manual error responses
if (!authorized) {
  return ErrorResponses.forbidden('Access denied')
}
if (!found) {
  return ErrorResponses.notFound('Resource', id)
}
```

## Serverless Optimization (CRITICAL)

### Connection Management (`db/index.ts`)
```typescript
// Connection and db instance outside function scope for reuse
let client: postgres.Sql | undefined
let db: ReturnType<typeof drizzle> | undefined

// Automatic initialization for serverless environments
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  try {
    initializeConnection()
  } catch (error) {
    console.warn('Database initialization deferred')
  }
}

// Prepared statement caching
export function getPreparedStatement<T>(key: string, statement: () => T): T {
  if (!preparedStatements.has(key)) {
    preparedStatements.set(key, statement())
  }
  return preparedStatements.get(key)
}
```

### API Route Optimization
```typescript
// Use prepared statements for frequently called queries
const statement = getPreparedStatement('find-user-by-id', () =>
  db.select().from(users).where(eq(users.id, placeholder('id'))).prepare()
)
const user = await statement.execute({ id: userId })
```

## Validation Best Practices (REQUIRED)

### Input Validation
```typescript
// ✅ ALWAYS validate API inputs
const validatedData = validateApiInput(createPostSchema, body)

// ✅ Custom validation with refinements
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  content: z.object({
    blocks: z.array(contentBlockSchema).min(1),
  }),
}).refine((data) => data.slug !== 'admin', {
  message: 'Slug cannot be "admin"',
  path: ['slug'],
})
```

### Output Validation
```typescript
// ✅ Validate database responses for type safety
const result = await dbService.posts.create(data)
const validatedResult = postSelectSchema.parse(result)
return createSuccessResponse(validatedResult)
```

### Query Parameter Validation
```typescript
export const postQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(['article', 'snippet']).optional(),
})

// In API route
const query = validateApiInput(postQuerySchema, Object.fromEntries(request.nextUrl.searchParams))
```

## Domain Organization (EXACT STRUCTURE)

### Profiles Domain (`schema/profiles.ts` + `schema/validation/profiles.validation.ts`)
- `profilesTable` - Public user data
- `userSettingsTable` - Private user configuration
- Validation: Profile CRUD, settings updates, user data merging

### Posts Domain (`schema/posts.ts` + `schema/validation/posts.validation.ts`)
- `postsTable` - Content posts
- `postLikesTable`, `postBookmarksTable`, `postCommentsTable`, `postRepostsTable`
- Validation: Content creation, engagement actions, rich content blocks

### Connections Domain (`schema/connections.ts` + `schema/validation/connections.validation.ts`)
- `connectionsTable` - Following/followers
- `connectionInvitationsTable` - Follow requests
- Validation: Social interactions, invitation flows

### Collaborations Domain (`schema/collaborations.ts` + `schema/validation/collaborations.validation.ts`)
- `collaborationsTable` - Project opportunities
- `collaborationApplicationsTable`, `collaborationSavesTable`
- Validation: Opportunity creation, application flows

### Notifications Domain (`schema/notifications.ts` + `schema/validation/notifications.validation.ts`)
- `notificationsTable` - User notifications
- Validation: Notification creation, typed notification data

### Projects Domain (`schema/projects.ts` + `schema/validation/projects.validation.ts`)
- `projectsTable` - Portfolio projects
- Validation: Project CRUD, GitHub integration

## Configuration (`drizzle.config.ts`)

```typescript
export default defineConfig({
  schema: "./src/db/schema",        // Points to schema folder
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  
  // Push-based configuration (no migrations)
  verbose: true,
  strict: true,
  
  introspect: {
    casing: 'camel',               // Convert snake_case when pulling
  },
})
```

## CRITICAL RULES

1. **ALWAYS** use `pnpm db:push` as primary workflow
2. **ALWAYS** validate API inputs/outputs with Zod schemas
3. **ALWAYS** use `handleApiError` wrapper for API routes
4. **ALWAYS** define both table schema AND validation schema
5. **NEVER** edit `migrations.archive/` (historical reference only)
6. **NEVER** use `any` types - leverage Zod inference
7. **NEVER** skip input validation in API routes
8. **ALWAYS** use prepared statements for repeated queries
9. **ALWAYS** test schema changes with `pnpm db:push` first
10. **ALWAYS** use `createSuccessResponse` and `ErrorResponses` helpers

## Error Handling Patterns

```typescript
// ✅ CORRECT: Comprehensive error handling
export const POST = handleApiError(async (request: NextRequest) => {
  const data = validateApiInput(schema, await request.json())
  const result = await dbService.create(data)
  return createSuccessResponse(result)
})

// ❌ WRONG: Manual try/catch (use handleApiError instead)
export async function POST(request: NextRequest) {
  try {
    // ... manual error handling
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' })
  }
}
```

## Performance Guidelines

### Connection Optimization
- Connection reuse across function invocations
- Single connection pool for serverless
- Prepared statement caching for frequent queries

### Query Optimization  
- Use specific field selection over `select()`
- Implement proper indexes in schema
- Use `limit()` for paginated queries
- Leverage joins over N+1 queries

### Validation Optimization
- Cache compiled Zod schemas when possible
- Use partial validation for updates
- Validate at API boundary, trust internally

## Migration from File-Based Approach

If converting from migration files to push-based:

1. ✅ Archive existing migrations: `mv migrations migrations.archive`
2. ✅ Update `drizzle.config.ts` (remove `out` property)
3. ✅ Add validation schemas for all tables
4. ✅ Update API routes to use validation
5. ✅ Run `pnpm db:push` to sync schema
6. ✅ Test all functionality with new validation

The schema will be synchronized directly from TypeScript definitions, providing faster development cycles and better type safety.