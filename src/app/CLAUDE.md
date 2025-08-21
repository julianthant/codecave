# App Directory Rules (`src/app/`)

**STRICT REQUIREMENTS**: Follow these exact patterns when creating files in the app directory.

## Route Organization

### Route Groups (REQUIRED)
```
src/app/
├── (authenticated)/     # Protected routes - requires auth
├── (public)/           # Public routes - no auth needed
├── auth/               # Authentication flow
├── api/                # API endpoints
└── [feature]/          # Standalone features (feed, onboarding)
```

### File Naming Convention (EXACT)

**Pages:**
- `page.tsx` - Route component (REQUIRED for routes)
- `layout.tsx` - Layout wrapper (optional, inherits from parent)
- `loading.tsx` - Loading UI (REQUIRED for data-fetching pages)
- `error.tsx` - Error boundary (REQUIRED for data-fetching pages)
- `not-found.tsx` - 404 page (optional, for dynamic routes)

**API Routes:**
- `route.ts` - API handler with HTTP method exports
- `[dynamic]/route.ts` - Dynamic API routes

## SSR/CSR Decision Matrix

### Server Components (DEFAULT - NO 'use client')
**WHEN TO USE:**
- Static pages with metadata
- Data fetching from database
- SEO-critical pages
- Authentication checking

**PATTERN:**
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | CodeCave',
  description: 'Page description',
}

export default function PageName() {
  // Server-side logic
  return <div>Content</div>
}
```

### Client Components ('use client' REQUIRED)
**WHEN TO USE:**
- Interactive UI (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- State management (useState, useEffect, etc.)
- Event handlers

**PATTERN:**
```typescript
'use client'

import { useState } from 'react'

export default function ClientComponent() {
  const [state, setState] = useState(false)
  return <button onClick={() => setState(!state)}>Click</button>
}
```

## Required File Patterns

### Pages (`page.tsx`)
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feature Name | CodeCave',
  description: 'Feature description for SEO',
}

export default function FeaturePage() {
  return (
    <div>
      <h1>Feature Title</h1>
      {/* Content */}
    </div>
  )
}
```

### Layouts (`layout.tsx`)
```typescript
export default function FeatureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="feature-layout">
      {/* Layout-specific UI */}
      {children}
    </div>
  )
}
```

### Loading (`loading.tsx`)
```typescript
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  )
}
```

### Error (`error.tsx`)
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### API Routes (`route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Logic here
    return NextResponse.json({ data: 'success' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // POST logic
}
```

## Route Protection Rules

### Protected Routes (`(authenticated)/`)
- **ALL FILES** require authentication
- Middleware redirects unauthenticated users
- **MUST HAVE**: loading.tsx, error.tsx for each page

### Public Routes (`(public)/`)
- **NO AUTHENTICATION** required
- Accessible to all users
- **RECOMMENDED**: Add metadata for SEO

### Feature Routes (root level)
- `/feed/` - Main app feed (requires auth)
- `/onboarding/` - New user setup (requires auth)
- `/instruments/` - Developer tools (auth optional)

## Data Fetching Patterns

### Server-Side Data Fetching
```typescript
import { db } from '@/db'
import { profiles } from '@/db/schema'

export default async function ProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, params.username))
    .limit(1)

  if (!profile[0]) {
    notFound()
  }

  return <ProfileDisplay profile={profile[0]} />
}
```

### Client-Side Data Fetching
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export default function ClientDataPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Error loading data</div>
  
  return <div>{/* Render data */}</div>
}
```

## CRITICAL RULES

1. **ALWAYS**: Add `metadata` export to pages
2. **ALWAYS**: Use `loading.tsx` for pages with data fetching
3. **ALWAYS**: Use `error.tsx` for pages that can fail
4. **NEVER**: Mix server and client logic in same component
5. **ALWAYS**: Use proper route groups for organization
6. **ALWAYS**: Follow exact file naming conventions
7. **ALWAYS**: Use TypeScript with proper types

## Import Rules

```typescript
// Correct import patterns
import { ComponentName } from '@/components/feature/component-name'
import { db } from '@/db'
import { useStore } from '@/stores/store-name'
import { NextRequest, NextResponse } from 'next/server'
```

## Authentication Integration

```typescript
// Server component auth check
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return <div>Protected content</div>
}

// Client component auth check
'use client'
import { useAuth } from '@/hooks/use-auth'

export default function ClientProtectedPage() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  if (!user) return <div>Please log in</div>
  
  return <div>Protected content</div>
}
```
