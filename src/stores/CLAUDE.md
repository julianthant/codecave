# Stores Directory (`src/stores/`)

## Overview

This directory contains **Zustand** state management stores for **CodeCave**. These stores provide reactive, global state that persists across component re-renders and can optionally persist to localStorage.

## Architecture Pattern

- **Zustand**: Lightweight state management with minimal boilerplate
- **TypeScript**: Full type safety with interfaces and proper typing
- **Middleware**: Persistence, devtools, and immutability support
- **Reactive**: Components automatically re-render when store state changes
- **Composable**: Stores can be combined and used together

## Store Inventory

### Authentication Store (`auth.store.ts`)

#### Purpose

Central authentication state management for user login status, profile data, and auth-related loading states.

#### State Interface

```typescript
interface AuthState {
  user: User | null // Supabase auth user object
  profile: Profile | null // User profile from database
  isLoading: boolean // Loading state during auth operations
  isInitialized: boolean // Whether auth state has been initialized

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => void
  reset: () => void
}
```

#### Key Features

- **Persistence**: User data persists to localStorage (partial - only user object)
- **Immer Integration**: Immutable state updates with simple syntax
- **DevTools**: Redux DevTools integration for debugging
- **Session Management**: Handles user sessions and profile data

#### Usage Patterns

```typescript
import { useAuthStore } from '@/stores/auth.store'

// In components
function UserProfile() {
  const { user, profile, isLoading, setProfile } = useAuthStore()

  if (isLoading) return <LoadingSpinner />
  if (!user) return <SignInPrompt />

  return <ProfileDisplay profile={profile} />
}

// Actions
const { setUser, reset, initialize } = useAuthStore.getState()
setUser(newUser)  // Update user
reset()           // Clear all auth state
initialize()      // Mark as initialized
```

#### Persistence Strategy

- Only `user` object persists to localStorage
- `profile` and loading states are session-only
- Storage key: `"auth-storage"`

### Feed Store (`feed.store.ts`)

#### Purpose

Manages content feed state including algorithm selection, filtering options, and search functionality.

#### State Interface

```typescript
export type FeedAlgorithm =
  | 'algorithm' // Personalized algorithm
  | 'following' // Following users only
  | 'trending' // Trending content
  | 'latest' // Chronological latest
  | 'showcase' // Project showcases
  | 'collaborations' // Collaboration opportunities

export interface FeedFilters {
  languages: string[] // Programming languages
  tags: string[] // Content tags
  postTypes: PostType[] // Article, snippet, showcase, discussion
  timeRange?: '24h' | '7d' | '30d' | 'all'
}

interface FeedState {
  algorithm: FeedAlgorithm
  filters: FeedFilters
  searchQuery: string

  // Actions
  setAlgorithm: (algorithm: FeedAlgorithm) => void
  setFilters: (filters: Partial<FeedFilters>) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}
```

#### Key Features

- **Algorithm Selection**: Multiple feed algorithms for different content discovery
- **Advanced Filtering**: Filter by languages, tags, post types, and time ranges
- **Search Integration**: Global search query state
- **Filter Reset**: Easy reset to default state
- **DevTools**: Redux DevTools integration

#### Usage Patterns

```typescript
import { useFeedStore } from '@/stores/feed.store'

// Feed controls
function FeedControls() {
  const { algorithm, filters, setAlgorithm, setFilters } = useFeedStore()

  return (
    <div>
      <AlgorithmSelector
        current={algorithm}
        onChange={setAlgorithm}
      />
      <FilterPanel
        filters={filters}
        onChange={setFilters}
      />
    </div>
  )
}

// Search integration
function SearchBar() {
  const { searchQuery, setSearchQuery } = useFeedStore()

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  )
}
```

#### Filter Management

```typescript
// Partial filter updates (merges with existing filters)
const { setFilters } = useFeedStore.getState()

setFilters({ languages: ['javascript', 'typescript'] }) // Update languages only
setFilters({ postTypes: ['article'] }) // Update post types only
setFilters({ timeRange: '7d' }) // Update time range only

// Reset all filters
const { resetFilters } = useFeedStore.getState()
resetFilters()
```

### Sidebar Store (`sidebar.store.ts`)

#### Purpose

Manages UI layout state for responsive sidebar behavior and content viewing modes.

#### State Interface

```typescript
interface SidebarState {
  isCollapsed: boolean // Sidebar collapsed state
  isViewingPost: boolean // Whether viewing individual post

  setCollapsed: (collapsed: boolean) => void
  setViewingPost: (viewing: boolean) => void
}
```

#### Key Features

- **Persistence**: Sidebar preferences persist across sessions
- **Responsive**: Controls sidebar behavior on different screen sizes
- **View Mode**: Tracks when user is viewing individual content
- **Storage**: Uses localStorage to remember user preferences

#### Usage Patterns

```typescript
import { useSidebarStore } from '@/stores/sidebar.store'

// Layout components
function AppLayout({ children }) {
  const { isCollapsed, isViewingPost, setCollapsed } = useSidebarStore()

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={isCollapsed}
        onToggle={setCollapsed}
        hidden={isViewingPost}
      />
      <MainContent collapsed={isCollapsed}>
        {children}
      </MainContent>
    </div>
  )
}

// Post view
function PostPage() {
  const { setViewingPost } = useSidebarStore()

  useEffect(() => {
    setViewingPost(true)
    return () => setViewingPost(false)
  }, [setViewingPost])

  return <PostContent />
}
```

#### Responsive Behavior

```typescript
// Auto-collapse on mobile
function useMobileCollapse() {
  const { setCollapsed } = useSidebarStore()
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile, setCollapsed])
}
```

### Post View Store (`postView.store.ts`)

#### Purpose

Manages state specific to individual post viewing, including comments, likes, and reading progress.

**Note**: This store is referenced in the project structure but the file contents weren't examined. Based on the naming pattern, it likely contains:

```typescript
// Expected interface (inferred)
interface PostViewState {
  currentPost: Post | null
  isLoading: boolean
  comments: Comment[]
  showComments: boolean
  readingProgress: number

  // Actions
  setCurrentPost: (post: Post) => void
  setComments: (comments: Comment[]) => void
  toggleComments: () => void
  updateProgress: (progress: number) => void
}
```

## Store Design Patterns

### Zustand Configuration

All stores follow consistent configuration patterns:

```typescript
export const useStoreExample = create<StoreState>()(
  devtools(
    // Redux DevTools integration
    persist(
      // Optional: localStorage persistence
      immer((set, get) => ({
        // Immer for immutable updates
        // Initial state
        value: defaultValue,

        // Actions using Immer
        setValue: (newValue) =>
          set((state) => {
            state.value = newValue
          }),

        // Computed values using get()
        getComputed: () => {
          const state = get()
          return computeFromState(state)
        },
      })),
      {
        name: 'store-name', // localStorage key
        partialize: (state) => ({
          // Choose what to persist
          persistedField: state.persistedField,
        }),
      }
    ),
    {
      name: 'store-devtools-name', // DevTools display name
    }
  )
)
```

### Action Patterns

#### Simple State Updates

```typescript
// Direct value setting
setValue: (value) => set({ value })

// Boolean toggles
toggle: () => set((state) => ({ flag: !state.flag }))
```

#### Complex State Updates (with Immer)

```typescript
// Array operations
addItem: (item) => set((state) => {
  state.items.push(item)
}),

removeItem: (id) => set((state) => {
  state.items = state.items.filter(item => item.id !== id)
}),

updateItem: (id, updates) => set((state) => {
  const item = state.items.find(item => item.id === id)
  if (item) {
    Object.assign(item, updates)
  }
})
```

#### Async Actions

```typescript
// Async operations
fetchData: async () => {
  set({ isLoading: true })
  try {
    const data = await api.getData()
    set({ data, isLoading: false })
  } catch (error) {
    set({ error, isLoading: false })
  }
}
```

### Integration Patterns

#### With React Components

```typescript
// Selective subscriptions (prevents unnecessary re-renders)
function Component() {
  const value = useStore(state => state.value)          // Only re-render when value changes
  const action = useStore(state => state.action)        // Actions don't cause re-renders

  return <div onClick={action}>{value}</div>
}

// Multiple values
function Component() {
  const { value1, value2, action } = useStore(
    state => ({
      value1: state.value1,
      value2: state.value2,
      action: state.action
    }),
    shallow                     // Shallow comparison for object selection
  )
}
```

#### Store Composition

```typescript
// Using multiple stores together
function useComposedState() {
  const auth = useAuthStore()
  const feed = useFeedStore()
  const sidebar = useSidebarStore()

  return {
    isReady: auth.isInitialized && !auth.isLoading,
    canViewFeed: auth.user !== null,
    layoutConfig: {
      sidebarCollapsed: sidebar.isCollapsed,
      showPersonalized: auth.user !== null,
    },
  }
}
```

## Development Guidelines

### Creating New Stores

#### File Structure

```typescript
// stores/feature-name.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Types
interface FeatureState {
  // State properties
  data: FeatureData[]
  isLoading: boolean

  // Actions
  setData: (data: FeatureData[]) => void
  fetchData: () => Promise<void>
}

// Store
export const useFeatureStore = create<FeatureState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Implementation
      })),
      { name: 'feature-storage' }
    ),
    { name: 'feature-store' }
  )
)
```

#### Naming Conventions

- Store files: `feature-name.store.ts`
- Store hooks: `useFeatureStore`
- Action names: Verb-based (`setData`, `fetchData`, `resetState`)
- State properties: Descriptive nouns (`isLoading`, `currentUser`, `filters`)

#### Performance Considerations

```typescript
// ❌ Bad: Causes re-render on any store change
const state = useStore()

// ✅ Good: Only re-renders when specific values change
const value = useStore((state) => state.specificValue)

// ✅ Good: Use shallow comparison for objects
const { val1, val2 } = useStore(
  (state) => ({ val1: state.val1, val2: state.val2 }),
  shallow
)
```

### Testing Strategies

#### Store Testing

```typescript
import { renderHook } from '@testing-library/react-hooks'
import { useFeatureStore } from './feature.store'

describe('FeatureStore', () => {
  beforeEach(() => {
    useFeatureStore.getState().reset() // Reset between tests
  })

  it('should update state correctly', () => {
    const { result } = renderHook(() => useFeatureStore())

    act(() => {
      result.current.setValue('test')
    })

    expect(result.current.value).toBe('test')
  })
})
```

#### Integration Testing

```typescript
// Test component integration with stores
function TestComponent() {
  const { value, setValue } = useFeatureStore()
  return <button onClick={() => setValue('clicked')}>{value}</button>
}

test('component updates store', () => {
  render(<TestComponent />)
  fireEvent.click(screen.getByRole('button'))
  expect(useFeatureStore.getState().value).toBe('clicked')
})
```

## Key Dependencies

- **Zustand**: Core state management library
- **Zustand Middleware**: Persistence, devtools, and Immer integration
- **Immer**: Immutable state updates with mutable syntax
- **TypeScript**: Type safety and developer experience

## Notes for Claude

- Use stores for global state that needs to be shared across components
- `useAuthStore` is the primary authentication state - always check this for user status
- `useFeedStore` controls content discovery and filtering throughout the app
- `useSidebarStore` manages layout state - important for responsive design
- All stores have DevTools integration for debugging
- Stores use Immer for easy immutable updates
- Authentication and sidebar stores persist to localStorage
- Use selective subscriptions to prevent unnecessary re-renders
- When adding new stores, follow the established patterns for consistency
