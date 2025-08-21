# Hook Rules (`src/hooks/`)

**STRICT REQUIREMENTS**: Follow these exact patterns for ALL custom React hooks.

## File Naming (REQUIRED)

```
hooks/
├── use-feature-name.ts       # REQUIRED pattern
├── use-auth.ts              # ✅ Correct
├── use-posts.ts             # ✅ Correct
└── use-local-storage.ts     # ✅ Correct
```

### Naming Conventions (EXACT)
- Files: `use-feature-name.ts`
- Hook exports: `export function useFeatureName()`
- ALWAYS start with `use` prefix
- ALWAYS use camelCase for function name
- NEVER abbreviate in hook names

### NEVER Use:
- `FeatureHook.ts`, `featureHook.ts`
- `useFeature.js`, `use_feature.ts`
- `hooks.ts` (multiple hooks in one file)
- `helper.ts`, `utility.ts` (not starting with "use")

## Hook Template (EXACT PATTERN)

### Basic Hook Structure
```typescript
import { useState, useEffect, useCallback } from 'react'

interface UseFeatureOptions {
  enabled?: boolean
  onSuccess?: (data: FeatureData) => void
  onError?: (error: Error) => void
}

interface UseFeatureReturn {
  data: FeatureData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useFeature(
  params: FeatureParams,
  options: UseFeatureOptions = {}
): UseFeatureReturn {
  const [data, setData] = useState<FeatureData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchData = useCallback(async () => {
    if (!options.enabled) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await api.fetchFeature(params)
      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [params, options])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return { data, isLoading, error, refetch: fetchData }
}
```

## Return Patterns (REQUIRED)

### Object Return (PREFERRED)
```typescript
// ✅ CORRECT: Object with descriptive properties
export function useFeature(): UseFeatureReturn {
  return {
    data,
    isLoading,
    error,
    refetch,
    isSuccess: !isLoading && !error && data !== null
  }
}
```

### Array Return (ONLY for useState-like hooks)
```typescript
// ✅ ALLOWED: Only for simple state hooks
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(prev => !prev), [])
  return [value, toggle]
}
```

### NEVER Return:
```typescript
// ❌ Mixed return types
export function useFeature() {
  if (condition) return { data, error }
  return [data, error] // Inconsistent
}

// ❌ Direct primitive returns
export function useFeature() {
  return data // Should return object
}
```

## Required Hook Patterns

### Data Fetching Hook (EXACT TEMPLATE)
```typescript
import { useState, useEffect, useCallback } from 'react'

interface UseFetchOptions<T> {
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
): {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
} {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchData = useCallback(async () => {
    if (!options.enabled) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(response.statusText)
      const result = await response.json()
      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [url, options])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return { data, isLoading, error, refetch: fetchData }
}
```

### Local Storage Hook (EXACT TEMPLATE)
```typescript
import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })
  
  const setStoredValue = useCallback((value: T | ((prev: T) => T)) => {
    setValue(prevValue => {
      const newValue = typeof value === 'function' 
        ? (value as (prev: T) => T)(prevValue)
        : value
        
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
      
      return newValue
    })
  }, [key])
  
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setValue(defaultValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, defaultValue])
  
  return [value, setStoredValue, removeValue]
}
```

### Debounced Hook (EXACT TEMPLATE)
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

## Store Integration (REQUIRED PATTERNS)

### Auth Hook (MUST EXIST)
```typescript
import { useAuthStore } from '@/stores/auth.store'

interface UseAuthReturn {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (provider: AuthProvider) => Promise<void>
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore(state => state.user)
  const profile = useAuthStore(state => state.profile)
  const isLoading = useAuthStore(state => state.isLoading)
  const setUser = useAuthStore(state => state.setUser)
  const setProfile = useAuthStore(state => state.setProfile)
  
  const signIn = useCallback(async (provider: AuthProvider) => {
    // Implementation
  }, [setUser])
  
  const signOut = useCallback(async () => {
    setUser(null)
    setProfile(null)
  }, [setUser, setProfile])
  
  return {
    user,
    profile,
    isLoading,
    isAuthenticated: user !== null,
    signIn,
    signOut
  }
}
```

### Query Hook Pattern (REQUIRED)
```typescript
import { useQuery } from '@tanstack/react-query'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

## Dependency Rules (CRITICAL)

### useEffect Dependencies (REQUIRED)
```typescript
// ✅ CORRECT: All dependencies declared
useEffect(() => {
  fetchData(userId, filters)
}, [userId, filters, fetchData])

// ✅ CORRECT: Memoized callback
const fetchData = useCallback(async (id: string, filters: Filters) => {
  // Implementation
}, [])

useEffect(() => {
  fetchData(userId, filters)
}, [userId, filters, fetchData])

// ❌ NEVER: Missing dependencies
useEffect(() => {
  fetchData(userId) // userId not in deps
}, [fetchData])
```

### useCallback Dependencies (REQUIRED)
```typescript
// ✅ CORRECT: All external values in dependencies
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data, userId, options)
}, [onSubmit, userId, options])

// ❌ NEVER: Missing dependencies
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data, userId) // userId not in deps
}, [onSubmit])
```

## Performance Rules (CRITICAL)

### Memoization (REQUIRED)
```typescript
import { useMemo, useCallback } from 'react'

export function useExpensiveCalculation(data: ComplexData[]) {
  // ✅ CORRECT: Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item))
  }, [data])
  
  // ✅ CORRECT: Memoize callbacks
  const handleUpdate = useCallback((id: string) => {
    updateItem(id, processedData)
  }, [processedData])
  
  return { processedData, handleUpdate }
}
```

### Selective Store Subscriptions (REQUIRED)
```typescript
// ✅ CORRECT: Selective subscriptions
export function usePostData(postId: string) {
  const post = usePostStore(state => 
    state.posts.find(p => p.id === postId)
  )
  const isLoading = usePostStore(state => state.isLoading)
  
  return { post, isLoading }
}

// ❌ NEVER: Full store subscription
export function usePostData() {
  const store = usePostStore() // Subscribes to everything
  return store
}
```

## Forbidden Patterns

### ❌ NEVER Do These:
```typescript
// ❌ Hooks inside conditions
function Component({ condition }) {
  if (condition) {
    const data = useFeature() // Violates Rules of Hooks
  }
}

// ❌ Hooks inside loops
function Component({ items }) {
  items.forEach(item => {
    const data = useItemData(item.id) // Violates Rules of Hooks
  })
}

// ❌ Multiple hooks in one file
export function useFeatureA() { /* ... */ }
export function useFeatureB() { /* ... */ } // Should be separate files

// ❌ Missing dependencies
useEffect(() => {
  fetchData(userId)
}, []) // Missing userId dependency

// ❌ Infinite loops
useEffect(() => {
  setData(processData(data))
}, [data]) // Will cause infinite loop

// ❌ Synchronous side effects in render
export function useBadHook() {
  localStorage.setItem('key', 'value') // Side effect in render
  return data
}
```

### ❌ Wrong File Organization:
```
hooks/
├── FeatureHook.ts            # Wrong capitalization
├── feature-hook.ts           # Wrong prefix
├── useFeature.js             # Wrong extension
├── hooks.ts                  # Multiple hooks
└── auth-helpers.ts           # Not starting with "use"
```

## Testing Rules (REQUIRED)

### Hook Testing Pattern:
```typescript
import { renderHook, act } from '@testing-library/react'
import { useFeature } from './use-feature'

describe('useFeature', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useFeature())
    
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })
  
  it('should handle async operations', async () => {
    const { result } = renderHook(() => useFeature())
    
    await act(async () => {
      result.current.refetch()
    })
    
    expect(result.current.data).toBeDefined()
  })
})
```

## CRITICAL REQUIREMENTS

1. **ALWAYS** start hook names with `use` prefix
2. **ALWAYS** declare all dependencies in useEffect and useCallback
3. **ALWAYS** return object for complex hooks, array only for simple state
4. **ALWAYS** handle loading and error states for async operations
5. **ALWAYS** use TypeScript interfaces for parameters and return types
6. **ALWAYS** memoize callbacks and expensive calculations
7. **NEVER** use hooks conditionally or in loops
8. **NEVER** perform side effects during render
9. **NEVER** create multiple hooks in one file
10. **NEVER** ignore ESLint exhaustive-deps warnings
