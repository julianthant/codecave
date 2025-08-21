# Component Rules (`src/components/`)

**STRICT ORGANIZATION**: Follow these exact patterns for component creation and organization.

## Directory Structure (REQUIRED)

```
src/components/
├── ui/                  # Base design system (DO NOT MODIFY without cause)
├── [feature]/           # Feature-based components
│   ├── shared/          # Shared within feature
│   ├── sections/        # Page sections
│   └── modals/          # Feature-specific modals
└── [feature]/           # Additional features
```

### Feature Folders (EXACT NAMES)
- `auth/` - Authentication flows
- `collaborations/` - Collaboration features  
- `connections/` - User networking
- `dashboard/` - Analytics and metrics
- `feed/` - Main navigation and content
- `landing/` - Marketing pages
- `onboarding/` - User setup flow
- `profile/` - User profiles and showcases
- `settings/` - User preferences

## File Naming Convention (EXACT)

### Component Files
- **Format**: `kebab-case.tsx` (e.g., `user-avatar.tsx`)
- **Export**: `PascalCase` (e.g., `export default UserAvatar`)

### Organization Suffixes
- `-container.tsx` - Main feature wrapper (e.g., `connections-container.tsx`)
- `-section.tsx` - Page sections (e.g., `profile-section.tsx`) 
- `-modal.tsx` - Modal dialogs (e.g., `booking-modal.tsx`)
- `-drawer.tsx` - Slide-out panels (e.g., `comments-drawer.tsx`)
- `-card.tsx` - Card components (e.g., `connection-card.tsx`)
- `-sidebar.tsx` - Navigation sidebars (e.g., `feed-sidebar.tsx`)

### Subfolder Organization
```
feature/
├── feature-container.tsx    # Main wrapper
├── shared/                  # Reusable within feature
│   ├── feature-card.tsx
│   └── feature-tabs.tsx
├── sections/               # Page sections
│   ├── main-section.tsx
│   └── sidebar-section.tsx
└── modals/                 # Feature modals
    └── create-modal.tsx
```

## Component Type Rules

### Server Components (DEFAULT)
**WHEN TO USE:**
- Static UI without interactivity
- Data display components
- Layout components
- SEO-critical components

**PATTERN:**
```typescript
import { ComponentProps } from '@/types'

export default function ServerComponent({ data }: ComponentProps) {
  return (
    <div className="container">
      <h1>{data.title}</h1>
      {/* Static content */}
    </div>
  )
}
```

### Client Components ('use client' REQUIRED)
**WHEN TO USE:**
- Event handlers (onClick, onChange, etc.)
- State management (useState, useEffect)
- Browser APIs (localStorage, window)
- Interactive UI elements
- Zustand store usage
- React Query usage

**PATTERN:**
```typescript
'use client'

import { useState } from 'react'
import { useStore } from '@/stores/store-name'

interface Props {
  title: string
  onAction?: () => void
}

export default function ClientComponent({ title, onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useStore()

  return (
    <button onClick={() => setIsOpen(!isOpen)}>
      {title}
    </button>
  )
}
```

## Required Component Patterns

### Props Interface (ALWAYS REQUIRED)
```typescript
interface ComponentNameProps {
  // Required props (no ?)
  title: string
  data: DataType
  
  // Optional props (with ?)
  className?: string
  onAction?: () => void
  
  // Children (when applicable)
  children?: React.ReactNode
}

export default function ComponentName({ 
  title, 
  data, 
  className,
  onAction 
}: ComponentNameProps) {
  // Component logic
}
```

### Import Organization (EXACT ORDER)
```typescript
'use client' // If client component (first line)

// 1. React imports
import React, { useState, useEffect } from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// 3. External libraries
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

// 4. UI components (alphabetical)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 5. Feature components
import { UserAvatar } from '@/components/feed/navbar/user-avatar'

// 6. Icons (grouped)
import { Plus, Edit, Trash } from 'lucide-react'

// 7. Utils and stores
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

// 8. Types
import { User, Post } from '@/types'
```

### State Management Integration

#### Zustand Store Usage
```typescript
'use client'

import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'

export default function StateComponent() {
  // Get state and actions
  const { user, setUser } = useAuthStore()
  const { algorithm, setAlgorithm } = useFeedStore()
  
  // Component logic
}
```

#### React Query Usage  
```typescript
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'

export default function DataComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  })

  const mutation = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    })
  })
}
```

## UI Component Extension Rules

### Extending Base UI Components
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CustomButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'lg'
  className?: string
  children: React.ReactNode
}

export default function CustomButton({ 
  variant = 'primary', 
  className,
  children,
  ...props 
}: CustomButtonProps) {
  return (
    <Button
      className={cn(
        'custom-styles',
        variant === 'primary' && 'bg-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
```

### Compound Component Pattern
```typescript
interface FeatureCardProps {
  children: React.ReactNode
  className?: string
}

interface FeatureCardHeaderProps {
  title: string
  actions?: React.ReactNode
}

interface FeatureCardContentProps {
  children: React.ReactNode
}

function FeatureCard({ children, className }: FeatureCardProps) {
  return (
    <Card className={cn('feature-card', className)}>
      {children}
    </Card>
  )
}

function FeatureCardHeader({ title, actions }: FeatureCardHeaderProps) {
  return (
    <CardHeader className="flex-row items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      {actions}
    </CardHeader>
  )
}

function FeatureCardContent({ children }: FeatureCardContentProps) {
  return <CardContent>{children}</CardContent>
}

// Export as compound component
FeatureCard.Header = FeatureCardHeader
FeatureCard.Content = FeatureCardContent

export default FeatureCard
```

## Responsive Design Rules

### Mobile-First Breakpoints
```typescript
<div className={cn(
  // Mobile (default)
  'flex flex-col p-4',
  // Tablet
  'md:flex-row md:p-6',
  // Desktop  
  'lg:p-8 xl:max-w-7xl'
)}>
```

### Conditional Mobile Components
```typescript
'use client'

import { useMediaQuery } from '@/hooks/use-media-query'

export default function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  if (isMobile) {
    return <MobileComponent />
  }
  
  return <DesktopComponent />
}
```

## CRITICAL RULES

1. **ALWAYS**: Use exact directory structure and naming
2. **ALWAYS**: Add proper TypeScript interfaces for props
3. **ALWAYS**: Follow import order exactly
4. **ALWAYS**: Use 'use client' for interactive components
5. **NEVER**: Modify `/ui` components without understanding impact
6. **ALWAYS**: Use compound components for complex UI
7. **ALWAYS**: Include className prop for customization
8. **ALWAYS**: Use proper state management patterns

## Component Categories by Purpose

### Container Components
- End with `-container.tsx`
- Handle data fetching and state
- Delegate rendering to child components

### Section Components
- End with `-section.tsx`  
- Represent page sections or areas
- Focus on layout and organization

### Modal Components
- End with `-modal.tsx` or `-drawer.tsx`
- Handle overlay interactions
- Always include close functionality

### Card Components
- End with `-card.tsx`
- Display discrete pieces of information
- Should be composable and reusable

### Navigation Components
- Located in feature-specific folders
- Handle routing and user flow
- Integrate with authentication state
