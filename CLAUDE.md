# CLAUDE.md - CodeCave Project Instructions

## CRITICAL: Directory-Specific Rules

**ALWAYS read the target directory's CLAUDE.md file before creating or modifying any files.**

| Directory | Rule File | Purpose |
|-----------|-----------|---------|
| `/src/app/` | [`/src/app/CLAUDE.md`](./src/app/CLAUDE.md) | Next.js App Router, SSR/CSR patterns, routing |
| `/src/components/` | [`/src/components/CLAUDE.md`](./src/components/CLAUDE.md) | React components, organization, naming |
| `/src/db/` | [`/src/db/CLAUDE.md`](./src/db/CLAUDE.md) | Drizzle ORM, schema, migrations |
| `/src/stores/` | [`/src/stores/CLAUDE.md`](./src/stores/CLAUDE.md) | Zustand state management patterns |
| `/src/hooks/` | [`/src/hooks/CLAUDE.md`](./src/hooks/CLAUDE.md) | Custom React hooks patterns |
| `/src/types/` | [`/src/types/CLAUDE.md`](./src/types/CLAUDE.md) | TypeScript type definitions |
| `/src/utils/` | [`/src/utils/CLAUDE.md`](./src/utils/CLAUDE.md) | Business logic utilities, Supabase clients |
| `/src/lib/` | [`/src/lib/CLAUDE.md`](./src/lib/CLAUDE.md) | Generic utilities (cn, formatDate, etc.) |

## Project Overview

CodeCave: Next.js 15 developer platform with TypeScript, Supabase (PostgreSQL), and Drizzle ORM.

## Tech Stack

- **Framework**: Next.js 15.4.4 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **State**: Zustand (client) + React Query (server)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth with SSR
- **Forms**: React Hook Form + Zod validation

## Development Commands

```bash
# Development
pnpm dev            # Start development server
pnpm build          # Production build  
pnpm start          # Start production server

# Code Quality (MUST PASS)
pnpm lint           # ESLint - zero warnings required
pnpm lint:fix       # Fix linting issues
pnpm type-check     # TypeScript check - zero errors required

# Database (Drizzle ORM)
pnpm db:generate    # Generate migrations from schema
pnpm db:push        # Push schema changes to database
pnpm db:migrate     # Run pending migrations
pnpm db:studio      # Open Drizzle Studio UI
```

## Critical Requirements

### Code Quality (ZERO TOLERANCE)
- ✅ `pnpm lint` MUST pass with ZERO warnings
- ✅ `pnpm build` MUST succeed without errors
- ✅ `pnmp type-check` MUST pass with ZERO errors
- ✅ NEVER use `any` type - use proper types or `unknown`
- ✅ Use `<Image />` component, NEVER `<img>` tags

### File Organization Rules
- Use `@/` alias for ALL imports: `import { Button } from '@/components/ui/button'`
- Follow strict naming conventions per directory CLAUDE.md
- Database: snake_case (PostgreSQL) ↔ camelCase (TypeScript)
- Drizzle ORM handles automatic field name conversion

### Architecture Patterns
- **Components**: Server components by default, add `'use client'` only when needed
- **State**: Zustand stores with `devtools → persist → immer` middleware stack
- **Database**: Schema-first with Drizzle ORM, type-safe queries
- **Auth**: Middleware-protected routes, Supabase SSR integration

## Environment Variables

Required for development:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
DATABASE_URL=your_database_connection_string
```

## Import Rules

### Required Import Order
```typescript
'use client' // Only if client component (first line)

// 1. React imports
import { useState, useEffect } from 'react'

// 2. Next.js imports  
import Image from 'next/image'
import Link from 'next/link'

// 3. External libraries
import { create } from 'zustand'

// 4. Internal imports (@/ alias)
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types'
```

## Middleware & Authentication

- Routes: Public (`/`, `/features`, `/premium`) vs Protected (`/dashboard`, `/feed`)
- Auth: Supabase with automatic redirects
- Database: RLS policies for data access control
- Session: Automatic renewal via middleware

## Performance Rules

- Use selective Zustand subscriptions: `useStore(state => state.specificValue)`
- Memoize expensive operations with `useMemo`/`useCallback`
- Optimize images with Next.js `<Image />` component
- Database queries: Use indexes, proper joins, avoid N+1 queries

## Quick Reference

### Creating New Features
1. Read target directory's CLAUDE.md file
2. Define types in `/src/types/`
3. Create database schema in `/src/db/schema.ts`
4. Build components following component rules
5. Add state management if needed (Zustand)
6. Test with `pnpm lint` and `pnpm build`

### Common Patterns
- Auth check: `const { user, isAuthenticated } = useAuth()`
- Database: `import { db, profiles } from '@/db'`
- Styling: `className={cn('base-classes', conditionalClass)}`
- Types: `import type { User, Post } from '@/types'`