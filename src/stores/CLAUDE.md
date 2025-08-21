# Store Rules (`src/stores/`)

**STRICT REQUIREMENTS**: Follow these exact patterns for ALL Zustand stores.

## File Naming (REQUIRED)

```
stores/
├── feature-name.store.ts     # REQUIRED pattern
├── auth.store.ts            # ✅ Correct
├── feed.store.ts            # ✅ Correct  
└── sidebar.store.ts         # ✅ Correct
```

### Naming Conventions (EXACT)
- Files: `feature-name.store.ts`
- Hooks: `useFeatureStore`
- Actions: Verb-based (`setData`, `fetchData`, `resetState`)
- State: Descriptive nouns (`isLoading`, `currentUser`, `filters`)

### NEVER Use:
- `FeatureStore.ts`, `featureStore.ts`
- `feature.store.js`, `feature-store.ts`
- `useStore`, `useFeature` (missing "Store")

## Store Template (EXACT PATTERN)

### Required Middleware Stack
```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface FeatureState {
  // State properties
  data: FeatureData | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setData: (data: FeatureData | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
}

export const useFeatureStore = create<FeatureState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        data: null,
        isLoading: false,
        error: null,
        
        // Actions using Immer
        setData: (data) => set((state) => {
          state.data = data
          state.error = null
        }),
        
        setLoading: (isLoading) => set((state) => {
          state.isLoading = isLoading
        }),
        
        setError: (error) => set((state) => {
          state.error = error
          state.isLoading = false
        }),
        
        resetState: () => set((state) => {
          state.data = null
          state.isLoading = false
          state.error = null
        }),
      })),
      {
        name: 'feature-storage',
        partialize: (state) => ({ 
          data: state.data 
        }), // Only persist necessary fields
      }
    ),
    { name: 'feature-store' }
  )
)
```

## Middleware Rules (CRITICAL)

### Required Order (EXACT)
1. **devtools** (outermost)
2. **persist** (middle) 
3. **immer** (innermost)

### Persistence Configuration (REQUIRED)
```typescript
persist(
  // Store implementation
  immer((set, get) => ({ /* ... */ })),
  {
    name: 'unique-storage-key',           // REQUIRED: Must be unique
    partialize: (state) => ({            // REQUIRED: Choose what to persist
      persistedField: state.persistedField
    }),
  }
)
```

### DevTools Configuration (REQUIRED)
```typescript
devtools(
  // Store implementation
  persist(/* ... */),
  { name: 'store-name-devtools' }        // REQUIRED: Descriptive name
)
```

## Performance Rules (CRITICAL)

### Selective Subscriptions (ALWAYS)
```typescript
// ✅ CORRECT: Selective subscription
const userName = useAuthStore(state => state.user?.name)
const setUser = useAuthStore(state => state.setUser)

// ✅ CORRECT: Multiple specific values  
const { isLoading, error } = useFeatureStore(
  state => ({ isLoading: state.isLoading, error: state.error }),
  shallow // Import from 'zustand/shallow'
)

// ❌ NEVER: Full store subscription
const store = useFeatureStore()
```

### Action Usage (REQUIRED)
```typescript
// ✅ CORRECT: Extract actions outside render
const handleSubmit = () => {
  const { setData, setLoading } = useFeatureStore.getState()
  setLoading(true)
  // ... async operation
  setData(result)
  setLoading(false)
}

// ❌ NEVER: Subscribe to actions
const { data, setData } = useFeatureStore() // Causes unnecessary re-renders
```

## Required Store Types (EXACT)

### Auth Store (MUST EXIST)
```typescript
interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => void
  reset: () => void
}
```

### Feed Store (MUST EXIST)
```typescript
interface FeedState {
  algorithm: 'algorithm' | 'following' | 'trending' | 'latest' | 'showcase' | 'collaborations'
  filters: FeedFilters
  searchQuery: string
  
  setAlgorithm: (algorithm: FeedAlgorithm) => void
  setFilters: (filters: Partial<FeedFilters>) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}
```

### UI Stores (REQUIRED PATTERN)
```typescript
interface SidebarState {
  isCollapsed: boolean
  isViewingPost: boolean
  
  setCollapsed: (collapsed: boolean) => void
  setViewingPost: (viewing: boolean) => void
}
```

## Async Actions (REQUIRED PATTERN)

```typescript
// ALWAYS handle loading and error states
fetchData: async () => {
  set((state) => { 
    state.isLoading = true 
    state.error = null 
  })
  
  try {
    const data = await api.getData()
    set((state) => {
      state.data = data
      state.isLoading = false
    })
  } catch (error) {
    set((state) => {
      state.error = error.message
      state.isLoading = false
    })
  }
}
```

## Integration Rules (STRICT)

### Component Usage (REQUIRED)
```typescript
// ✅ CORRECT: Selective subscriptions
function Component() {
  const isLoading = useStore(state => state.isLoading)
  const data = useStore(state => state.data)
  const actions = useStore(state => ({ 
    setData: state.setData,
    reset: state.reset 
  }))
  
  return <div>{/* Component JSX */}</div>
}
```

### Store Composition (ALLOWED)
```typescript
// ✅ CORRECT: Multiple stores together
function useComposedState() {
  const auth = useAuthStore()
  const feed = useFeedStore() 
  const sidebar = useSidebarStore()
  
  return {
    isReady: auth.isInitialized && !auth.isLoading,
    canViewFeed: auth.user !== null,
    layoutConfig: {
      sidebarCollapsed: sidebar.isCollapsed,
    },
  }
}
```

## Forbidden Patterns

### ❌ NEVER Do These:
```typescript
// ❌ Wrong middleware order
persist(devtools(immer(/* ... */)))

// ❌ Missing middleware
create((set) => ({ /* ... */ }))

// ❌ No type interface
const useStore = create()(/* ... */)

// ❌ Full store subscription
const store = useFeatureStore()

// ❌ Nested state mutations without Immer
set(state => {
  state.nested.property = value // Will mutate directly
})

// ❌ Missing partialize for persistence
persist(/* ... */, { name: 'storage' }) // Will persist everything

// ❌ Synchronous actions that should be async
fetchData: () => {
  const data = api.getData() // Should be async
  set({ data })
}
```

### ❌ Wrong File Organization:
```
stores/
├── AuthStore.ts              # Wrong capitalization
├── auth-store.ts             # Wrong separator  
├── auth.ts                   # Missing .store
├── authStore.ts              # Wrong naming
└── stores.ts                 # Multiple stores in one file
```

## Testing Rules (REQUIRED)

### Store Testing Pattern:
```typescript
beforeEach(() => {
  useFeatureStore.getState().resetState()
})

test('should update state correctly', () => {
  const { result } = renderHook(() => useFeatureStore())
  
  act(() => {
    result.current.setData(testData)
  })
  
  expect(result.current.data).toBe(testData)
})
```

## CRITICAL REQUIREMENTS

1. **ALWAYS** use the exact middleware stack order: `devtools(persist(immer(...)))`
2. **ALWAYS** define TypeScript interfaces for state and actions
3. **ALWAYS** use selective subscriptions, NEVER full store subscriptions
4. **ALWAYS** include `partialize` in persist configuration
5. **ALWAYS** handle loading and error states for async actions
6. **ALWAYS** use Immer for state mutations
7. **NEVER** create stores without devtools integration
8. **NEVER** persist sensitive data or functions
9. **NEVER** use any/unknown types in store definitions
10. **NEVER** mutate state directly without Immer