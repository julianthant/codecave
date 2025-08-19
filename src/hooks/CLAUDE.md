# Hooks Directory (`src/hooks/`)

## Overview

This directory contains custom React hooks for **CodeCave**, providing reusable logic for authentication, responsive design, route protection, and UI interactions.

## Architecture Pattern

- **Custom Hooks**: Encapsulate complex stateful logic
- **React Standards**: Follow React hooks conventions and rules
- **Type Safety**: Full TypeScript support with proper typing
- **Composition**: Hooks can be composed together for complex functionality
- **Side Effects**: Proper cleanup and dependency management

## Hook Inventory

### Authentication Hooks

#### `use-auth.ts`

**Purpose**: Primary authentication hook that provides user state and auth operations.

**Key Features**:

- Integrates with `useAuthStore` (Zustand) for state management
- Provides sign-out functionality with proper cleanup
- Handles profile updates with optimistic UI
- Includes loading states and error handling
- Auto-redirects and state reset on sign-out

**API**:

```typescript
const {
  user, // Current authenticated user from Supabase
  profile, // User profile data from database
  isLoading, // Loading state during auth operations
  isAuthenticated, // Boolean convenience property
  signOut, // Sign out function with cleanup
  updateProfile, // Update user profile function
} = useAuth()
```

**Usage Patterns**:

- Checking authentication status in components
- Performing auth-protected operations
- Displaying user-specific data
- Handling sign-out flow

**Dependencies**:

- `@/stores/auth.store` (Zustand store)
- `@/utils/supabase/client` (Database client)
- `sonner` (Toast notifications)

#### `use-require-auth.ts`

**Purpose**: Route protection hook that enforces authentication requirements.

**Key Features**:

- Redirects unauthenticated users to sign-in
- Handles loading states during auth check
- Prevents flash of protected content
- Returns user data when authenticated

**Usage Pattern**:

```typescript
function ProtectedPage() {
  const { user, isLoading } = useRequireAuth()

  if (isLoading) return <LoadingSpinner />

  // User is guaranteed to be authenticated here
  return <ProtectedContent user={user} />
}
```

### Responsive Design Hooks

#### `use-media-query.ts`

**Purpose**: Responsive design hook for handling media query breakpoints.

**Key Features**:

- Listens to CSS media queries in JavaScript
- Returns boolean indicating if query matches
- Properly handles server-side rendering
- Automatic cleanup of event listeners
- Type-safe with TypeScript

**API**:

```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
```

**Common Usage Patterns**:

```typescript
// Conditional rendering based on screen size
const isMobile = useMediaQuery("(max-width: 768px)")
return isMobile ? <MobileNav /> : <DesktopNav />

// Responsive component behavior
const isLargeScreen = useMediaQuery("(min-width: 1200px)")
const itemsPerRow = isLargeScreen ? 4 : 2
```

**Browser Compatibility**: Uses `matchMedia` API with proper fallbacks

### UI Interaction Hooks

#### `useScrollDirection.ts`

**Purpose**: Detects scroll direction for dynamic UI behaviors (like hiding/showing navigation).

**Key Features**:

- Tracks scroll direction (up/down)
- Debounced for performance
- Handles edge cases (top of page, rapid scrolling)
- Used for smart navigation bar behavior

**Expected API** (based on common patterns):

```typescript
const { scrollDirection, isAtTop } = useScrollDirection()
// scrollDirection: 'up' | 'down' | null
// isAtTop: boolean
```

**Usage Pattern**:

```typescript
function SmartNavbar() {
  const { scrollDirection, isAtTop } = useScrollDirection()

  const shouldHideNav = scrollDirection === 'down' && !isAtTop

  return (
    <nav className={cn(
      "transition-transform duration-300",
      shouldHideNav && "-translate-y-full"
    )}>
      {/* Navigation content */}
    </nav>
  )
}
```

## Development Guidelines

### Creating New Hooks

#### Hook Naming Convention

- Prefix with `use` (React convention)
- Use camelCase: `useFeatureName`
- Be descriptive: `useUserPreferences` vs `usePrefs`

#### File Structure

```typescript
// use-feature-name.ts
import { useState, useEffect } from 'react'

export function useFeatureName(params?: FeatureParams) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    // Setup side effects

    return () => {
      // Cleanup
    }
  }, [dependencies])

  return {
    // Return object with descriptive properties
    state,
    actions: {
      // Group related actions
    },
  }
}
```

#### TypeScript Best Practices

```typescript
// Define clear parameter types
interface UseFeatureParams {
  enabled?: boolean
  interval?: number
}

// Define clear return types
interface UseFeatureReturn {
  data: FeatureData | null
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

export function useFeature(params: UseFeatureParams): UseFeatureReturn {
  // Implementation
}
```

### Hook Composition Patterns

#### Combining Hooks

```typescript
// Custom hook that combines multiple hooks
export function useResponsiveAuth() {
  const auth = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return {
    ...auth,
    isMobile,
    shouldShowMobileMenu: isMobile && auth.isAuthenticated,
  }
}
```

#### Conditional Hook Usage

```typescript
// Use hooks conditionally with consistent return shape
export function useConditionalData(condition: boolean) {
  const data = condition ? useDataHook() : null

  return {
    data: data?.data || null,
    isLoading: condition ? data?.isLoading || false : false,
    error: data?.error || null,
  }
}
```

### Performance Considerations

#### Memoization

```typescript
import { useMemo, useCallback } from 'react'

export function useExpensiveOperation(input: string) {
  const result = useMemo(() => {
    return expensiveCalculation(input)
  }, [input])

  const callback = useCallback(() => {
    return performAction(result)
  }, [result])

  return { result, callback }
}
```

#### Cleanup

```typescript
export function useWebSocket(url: string) {
  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onmessage = handleMessage

    // Always cleanup in useEffect
    return () => {
      ws.close()
    }
  }, [url])
}
```

### Testing Hooks

#### Testing Strategy

- Use `@testing-library/react-hooks` for isolated hook testing
- Test different scenarios and edge cases
- Mock external dependencies (Supabase, localStorage)
- Test cleanup behavior

#### Example Test Structure

```typescript
import { renderHook } from '@testing-library/react-hooks'
import { useAuth } from './use-auth'

describe('useAuth', () => {
  it('should return authenticated state when user exists', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeDefined()
  })
})
```

## Common Integration Patterns

### With Zustand Stores

```typescript
// Hook that bridges Zustand store with component logic
export function useFeatureWithStore() {
  const store = useFeatureStore()
  const [localState, setLocalState] = useState()

  // Sync local state with store when needed
  useEffect(() => {
    if (store.data) {
      setLocalState(processData(store.data))
    }
  }, [store.data])

  return {
    ...store,
    localState,
    updateLocal: setLocalState,
  }
}
```

### With TanStack Query

```typescript
// Hook that combines React Query with local logic
export function useDataWithQuery(id: string) {
  const query = useQuery(['data', id], () => fetchData(id))
  const [selection, setSelection] = useState<string>()

  return {
    ...query,
    selection,
    setSelection,
    selectedItem: query.data?.find((item) => item.id === selection),
  }
}
```

## Key Dependencies

- **React**: Core hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- **Zustand**: State management integration
- **Supabase**: Authentication and database operations
- **Sonner**: Toast notifications
- **TypeScript**: Type safety and developer experience

## Notes for Claude

- These hooks follow React's rules of hooks - they can only be called at the top level of components
- `use-auth.ts` is the primary authentication interface - use this instead of directly accessing stores
- `use-media-query.ts` is essential for responsive behavior throughout the app
- `use-require-auth.ts` should be used for any protected routes or components
- When creating new hooks, follow the established patterns for consistency
- Always include proper TypeScript types and cleanup in useEffect
- Consider performance implications and use memoization when appropriate
