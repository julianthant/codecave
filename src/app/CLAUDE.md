# App Directory (`src/app/`)

## Overview

This directory contains the Next.js 13+ App Router structure for **CodeCave**, a developer community platform. It follows the file-system based routing pattern with route groups, dynamic routes, and API endpoints.

## Architecture Pattern

- **Framework**: Next.js 13+ App Router
- **Routing**: File-system based with route groups
- **Authentication**: Supabase Auth with middleware protection
- **State Management**: Zustand stores + TanStack Query
- **Styling**: Tailwind CSS with custom components

## Directory Structure

### Route Groups

- `(authenticated)/` - Protected routes requiring user authentication
- `(public)/` - Public marketing/landing pages

### Core Application Files

- `layout.tsx` - Root layout with metadata, providers, and analytics
- `page.tsx` - Landing page (/)
- `providers.tsx` - React Query, auth, and toast providers
- `globals.css` - Global styles and Tailwind imports

## Detailed File Breakdown

### Root Files

- **`layout.tsx`**:
  - Root layout component with comprehensive SEO metadata
  - Includes Vercel Analytics and Speed Insights
  - Sets up security headers and viewport configuration
  - Wraps all pages with `Providers` component

- **`page.tsx`**:
  - Main landing page component
  - Entry point for non-authenticated users

- **`providers.tsx`**:
  - Client-side providers wrapper
  - Sets up TanStack Query with 5-minute stale time
  - Initializes Supabase auth state management
  - Provides toast notifications via Sonner
  - Includes React Query Devtools for development

- **`globals.css`**:
  - Global CSS imports and custom styles
  - Tailwind CSS base, components, and utilities

### Authentication Routes (`auth/`)

- **`login/page.tsx`**: Login page with social auth options
- **`callback/route.ts`**: OAuth callback handler for Supabase
- **`signout/`**: Sign out functionality

### Protected Routes (`(authenticated)/`)

- **`layout.tsx`**: Authenticated layout with navigation
- **`dashboard/`**: User dashboard with metrics and analytics
  - `page.tsx`: Main dashboard view
  - `loading.tsx`: Loading state
  - `error.tsx`: Error boundary
- **`profile/[username]/`**: Dynamic user profile pages
  - `page.tsx`: Profile display
  - `loading.tsx`: Profile loading state
  - `not-found.tsx`: 404 for non-existent profiles
- **`settings/page.tsx`**: User settings and preferences

### Public Routes (`(public)/`)

- **`features/page.tsx`**: Product features showcase
- **`premium/page.tsx`**: Premium subscription information
- **`resources/page.tsx`**: Developer resources and documentation
- **`error/page.tsx`**: Generic error page

### API Routes (`api/`)

- **`posts/`**: Post management endpoints
  - `route.ts`: CRUD operations for posts
  - `[id]/route.ts`: Individual post operations
  - `[id]/like/route.ts`: Post like functionality
- **`users/onboarding/route.ts`**: User onboarding flow

### Application Pages

- **`feed/`**: Main content feed
  - `layout.tsx`: Feed-specific layout
  - `page.tsx`: Post feed display
- **`onboarding/page.tsx`**: New user onboarding flow
- **`instruments/page.tsx`**: Developer tools and utilities

## Route Protection Strategy

- Middleware (`src/middleware.ts`) handles route protection
- `(authenticated)` group requires valid session
- `(public)` group is accessible to all users
- API routes have individual protection logic

## State Management Integration

- Auth state managed by `useAuthStore` (Zustand)
- Profile data fetched and cached via TanStack Query
- Real-time updates through Supabase subscriptions

## Development Guidelines

### Adding New Pages

1. Choose appropriate route group (`(authenticated)` vs `(public)`)
2. Create `page.tsx` with default export
3. Add `loading.tsx` and `error.tsx` for better UX
4. Update navigation components if needed

### Adding New API Routes

1. Create `route.ts` with named HTTP method exports
2. Implement proper error handling
3. Add authentication checks if needed
4. Use TypeScript for request/response types

### Layout Hierarchy

```
Root Layout (layout.tsx)
├── Authenticated Layout ((authenticated)/layout.tsx)
│   ├── Dashboard (dashboard/)
│   ├── Profile (profile/[username]/)
│   └── Settings (settings/)
├── Feed Layout (feed/layout.tsx)
│   └── Feed Page (feed/page.tsx)
└── Public Pages ((public)/)
```

## Key Dependencies

- **Next.js**: App Router framework
- **React**: UI library
- **TanStack Query**: Server state management
- **Supabase**: Authentication and database
- **Zustand**: Client state management
- **Tailwind CSS**: Styling
- **Vercel**: Analytics and deployment

## Common Patterns

- Error boundaries with custom error pages
- Loading states for async operations
- Dynamic imports for code splitting
- Server and client component separation
- Type-safe API routes with proper error handling

## Notes for Claude

- This is a modern Next.js 13+ App Router application
- Authentication is handled via Supabase with middleware protection
- State management uses Zustand for client state and TanStack Query for server state
- All new pages should follow the established patterns for consistency
- API routes should implement proper error handling and type safety
