# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeCave is a Next.js 15 application with TypeScript, designed as a platform for developers to build together. It features project showcasing, collaboration tools, and a community-focused environment for developers.

## Tech Stack

- **Framework**: Next.js 15.4.4 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4 with CSS-in-JS
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **State Management**: Zustand for client state, React Query for server state
- **Authentication**: Supabase Auth with SSR support
- **UI Components**: Radix UI primitives with custom components
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics and Speed Insights

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Code quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript type checking

# Database operations
pnpm db:generate  # Generate TypeScript types from Supabase
pnpm db:push      # Push migrations to Supabase
pnpm db:reset     # Reset database
pnpm db:migrate   # Reset and push migrations
```

## Architecture

### Directory Structure

- `/src/app/` - Next.js App Router pages and API routes
  - `(authenticated)/` - Protected routes requiring authentication
  - `(public)/` - Public marketing pages
  - `auth/` - Authentication pages and callbacks
  - `api/` - API route handlers
- `/src/components/` - Reusable React components
  - `ui/` - Base UI components (buttons, inputs, etc.)
  - `auth/` - Authentication-related components
  - `feed/` - Feed and navigation components
  - `landing/` - Landing page components
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions
  - `supabase/` - Supabase client configurations
- `/src/types/` - TypeScript type definitions
- `/src/stores/` - Zustand state stores

### Key Patterns

1. **Authentication Flow**
   - Supabase Auth with SSR support via middleware
   - Auth state managed in Zustand store
   - Protected routes use auth guards
   - Session updates handled in providers.tsx

2. **Data Fetching**
   - React Query for server state management
   - Supabase client for database operations
   - Type-safe database queries using generated types

3. **Component Architecture**
   - Composition pattern with Radix UI primitives
   - Class Variance Authority for component variants
   - Tailwind Merge for className composition

4. **State Management**
   - Zustand for global client state
   - React Query for server state caching
   - Form state with React Hook Form

## Important Files

- `src/app/providers.tsx` - Global providers setup (React Query, Auth, Toaster)
- `src/middleware.ts` - Supabase session middleware
- `src/utils/supabase/client.ts` - Browser Supabase client
- `src/utils/supabase/server.ts` - Server-side Supabase client
- `src/types/database.types.ts` - Generated database types

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Application URL for metadata
- `PROJECT_ID` - Supabase project ID for type generation

## Development Guidelines

1. **Type Safety**: Always use TypeScript strict mode and avoid `any` types
2. **Component Imports**: Use `@/` alias for imports (maps to `./src/`)
3. **Database Types**: Run `pnpm db:generate` after schema changes
4. **Authentication**: Check auth state using `useAuth` hook
5. **Error Handling**: Use React Query error boundaries for data fetching
6. **Performance**: Leverage Turbopack in development for fast refresh

## Testing Approach

Check package.json scripts and project documentation for specific test commands. The project uses ESLint and TypeScript for static analysis.

## Recent Changes (Database Simplification - 2025)

### 1. Simplified Database Schema
- **Removed tables**: posts, follows, likes, comments, notifications, user_settings
- **Kept only**: users table for authentication and profile management
- **Reason**: Focusing on core authentication first, will expand schema as design solidifies

### 2. Authentication Middleware Updates
- **Fixed redirect issue**: Public routes (/, /features, /premium, /resources) are now accessible without authentication
- **Protected routes**: Only /dashboard, /feed, /onboarding require authentication
- **Redirect path**: Changed from `/login` to `/auth/login` for consistency

### 3. Environment Variables Documentation
- Created `.env.example` file with all required Supabase configuration
- Includes instructions for obtaining values from Supabase dashboard
- Added optional SEO verification tokens

### 4. Current Database Model (Users Only)
```typescript
users: {
  id: string (UUID from Supabase Auth)
  email: string
  username: string (unique)
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  social_links: github, twitter, discord, linkedin
  skills: string[]
  languages: string[]
  experience_level: enum
  available_for_collab: boolean
  is_pro: boolean
  created_at: string
  updated_at: string
}
```

### 5. Authentication Flow
1. User clicks OAuth provider (GitHub/Google/Discord)
2. Redirects to Supabase OAuth
3. Callback at `/auth/callback` 
4. Checks if user profile exists
5. New users → `/onboarding` to create profile
6. Existing users → `/dashboard`

### 6. Mock Data for UI Development
- API routes still return mock posts data for UI testing
- Located in `/src/app/api/posts/route.ts`
- Will be replaced with real database queries once schema is finalized

## Development Notes

- The server is always running in another tab (don't test if running)
- Document all significant changes in this file
- Use mock data for testing UI while database design is in progress