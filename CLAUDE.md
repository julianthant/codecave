# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeCave is a Next.js 15 application with TypeScript, designed as a platform for developers to build together. It features project showcasing, collaboration tools, and a community-focused environment for developers.

## Tech Stack

- **Framework**: Next.js 15.4.4 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4 with CSS-in-JS
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
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

# Database operations (Drizzle ORM)
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema directly to database
pnpm db:studio    # Open Drizzle Studio UI
pnpm db:drop      # Drop migrations
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
  - `dashboard/` - Dashboard metrics and analytics components
  - `profile/` - User profile and showcase components
  - `settings/` - Settings and preferences components
  - `onboarding/` - User onboarding flow components
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions
  - `supabase/` - Supabase client configurations
- `/src/db/` - Database schema and client (Drizzle ORM)
  - `schema.ts` - Database table definitions
  - `index.ts` - Database client and exports
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
   - Drizzle ORM for type-safe database operations
   - Schema-first approach with inferred TypeScript types

3. **Component Architecture**
   - Composition pattern with Radix UI primitives
   - Class Variance Authority for component variants
   - Tailwind Merge for className composition

4. **State Management**

#### Zustand Implementation
- **Global Client State**: Zustand stores for authentication and UI state
- **Server State**: React Query for API caching and synchronization
- **Form State**: React Hook Form with Zod validation

**Current Zustand Stores:**
- `useAuthStore` - Authentication and user profile state with persistence
- `useFeedStore` - Feed algorithm selection and content filtering
- `usePostViewStore` - Post viewing and interaction state management  
- `useSidebarStore` - UI sidebar state for responsive navigation
- Additional stores can be created following the same pattern

**Zustand Store Pattern:**
```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface StoreState {
  // State properties
  data: SomeType | null;
  isLoading: boolean;
  
  // Actions
  setData: (data: SomeType | null) => void;
  reset: () => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        data: null,
        isLoading: false,
        
        // Actions using Immer for mutations
        setData: (data) => set((state) => {
          state.data = data;
        }),
        
        reset: () => set((state) => {
          state.data = null;
          state.isLoading = false;
        }),
      })),
      {
        name: "store-storage", // localStorage key
        partialize: (state) => ({ data: state.data }), // Only persist specific fields
      }
    ),
    { name: "store-devtools" } // Redux DevTools name
  )
);
```

## Important Files

- `src/app/providers.tsx` - Global providers setup (React Query, Auth, Toaster)
- `src/middleware.ts` - Supabase session middleware
- `src/utils/supabase/client.ts` - Browser Supabase client
- `src/utils/supabase/server.ts` - Server-side Supabase client
- `src/db/schema.ts` - Database schema definitions (Drizzle)
- `src/db/index.ts` - Database client and type exports
- `src/types/database.types.ts` - Database type exports (now from Drizzle)

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Application URL for metadata
- `DATABASE_URL` - PostgreSQL connection string (for Drizzle ORM)
- `PROJECT_ID` - Supabase project ID (optional, for reference)

## Development Guidelines

1. **Type Safety**: Always use TypeScript strict mode and avoid `any` types
2. **Component Imports**: Use `@/` alias for imports (maps to `./src/`)
3. **Database Schema**: Update `src/db/schema.ts` then run `pnpm db:generate` and `pnpm db:push`
4. **Authentication**: Check auth state using `useAuth` hook
5. **Error Handling**: Use React Query error boundaries for data fetching
6. **Performance**: Leverage Turbopack in development for fast refresh

## Testing Approach

Check package.json scripts and project documentation for specific test commands. The project uses ESLint and TypeScript for static analysis.

## Recent Changes (Database Migration to Drizzle ORM - 2025)

### Database Migration to Drizzle ORM

**Migration completed on 2025-08-18**: Moved from Supabase auto-generated types to Drizzle ORM for better type safety and developer experience.

#### What Changed:
- **ORM**: Migrated from raw Supabase client to Drizzle ORM
- **Schema Definition**: Database schema now defined in `src/db/schema.ts`
- **Type System**: Cleaner types (`User`, `NewUser`, `UpdateUser`) instead of Row/Insert/Update pattern
- **Field Naming**: Switched to camelCase for better TypeScript ergonomics
- **Build Process**: New scripts for schema migrations and database management

#### Benefits:
- **Type Safety**: Schema-first approach with inferred TypeScript types
- **Better DX**: IDE autocompletion, no manual type generation
- **Maintainable**: Schema defined in code, version controlled
- **Modern**: Uses latest TypeScript patterns and naming conventions

#### Migration Guide:
- Use `User` instead of `Tables<'users'>`
- Field names changed: `display_name` → `displayName`, `avatar_url` → `avatarUrl`, etc.
- Database operations now use Drizzle query builder
- Environment variable `DATABASE_URL` now required

## Previous Changes (Database Simplification - 2025)

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

### 4. Current Database Model (Public/Private Separation - Drizzle Schema)

**Database Architecture:** Separation of public and private data using RLS policies.

#### Profiles Table (Public Data)
```typescript
profiles: {
  id: string (UUID from Supabase Auth)
  username: string (unique)
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  githubUsername: string | null
  twitterUsername: string | null  
  discordUsername: string | null
  linkedinUrl: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### User Settings Table (Private Data)
```typescript
user_settings: {
  id: string (UUID from Supabase Auth)
  skills: string[]
  languages: string[]
  experienceLevel: enum('student', 'junior', 'mid', 'senior', 'lead') | null
  availableForCollab: boolean
  emailNotifications: boolean
  theme: string (default: 'system')
  isPro: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Posts Table (Content with Visibility Control)
```typescript
posts: {
  id: string (UUID)
  authorId: string (references profiles.id)
  title: string
  slug: string | null (unique)
  content: jsonb
  excerpt: string | null
  visibility: enum('public', 'private', 'unlisted', 'followers')
  isPublished: boolean
  isDraft: boolean
  tags: string[]
  readingTime: string | null
  viewCount: string
  likeCount: string
  commentCount: string
  publishedAt: timestamp | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Security Model:**
- `profiles`: Public read, owner write (RLS enabled)
- `user_settings`: Private access only (RLS enabled)
- `posts`: Visibility-based access (RLS enabled with complex rules)

### 5. Authentication Flow (Updated 2025-08-18)
1. User clicks OAuth provider (GitHub/Google/Discord)
2. Redirects to Supabase OAuth
3. Callback at `/auth/callback` 
4. Checks if user profile exists in `profiles` table
5. New users → `/onboarding` to create profile
6. Existing users → `/feed` (main application)
7. Completed onboarding → redirects to `/feed`

**Key Changes:**
- Now checks `profiles` table instead of deprecated `users` table
- Redirects to `/feed` instead of `/dashboard`
- Fixed redirect loops between onboarding and non-existent dashboard

### 6. Mock Data for UI Development
- API routes still return mock posts data for UI testing
- Located in `/src/app/api/posts/route.ts`
- Will be replaced with real database queries once schema is finalized

## Code Quality Standards

### ESLint & TypeScript Configuration

The project enforces strict code quality standards with zero tolerance for warnings:

#### ESLint Rules:
- **No `any` types**: All `any` types must be replaced with proper TypeScript types
- **No unused variables**: All imports and variables must be used
- **React hooks**: All hook dependencies must be properly declared
- **Next.js optimization**: Use `<Image />` component instead of `<img>` tags

#### TypeScript Standards:
- **Strict mode**: TypeScript strict mode enabled
- **Type inference**: Prefer inferred types over explicit when possible
- **Proper typing**: Use `unknown` instead of `any` for generic types
- **Database types**: Use Drizzle-generated types for all database operations

#### Field Naming Convention:
- **Database schema**: snake_case (PostgreSQL standard)
- **TypeScript types**: camelCase (JavaScript standard)
- **Field mapping**: Drizzle handles conversion automatically
  - `display_name` (DB) ↔ `displayName` (TS)
  - `avatar_url` (DB) ↔ `avatarUrl` (TS)
  - `is_pro` (DB) ↔ `isPro` (TS)

### Build Requirements:
- ✅ `pnpm lint` must pass with zero warnings
- ✅ `pnpm build` must complete successfully
- ✅ TypeScript compilation must pass without errors

### Recent Code Quality Improvements (August 2025):

**Fixed ESLint Warnings:**
1. **Type Safety**: Replaced all `any` types with proper TypeScript types
2. **Image Optimization**: Converted all `<img>` tags to Next.js `<Image />` components
3. **React Hooks**: Fixed missing dependencies in useEffect hooks
4. **Database Fields**: Updated field names from snake_case to camelCase for consistency

**Files Updated:**
- `src/types/index.ts` - Fixed `ApiResponse<T = any>` to `ApiResponse<T = unknown>`
- `src/types/post-types.ts` - Updated Record types to use `unknown`
- `src/utils/post-utils.ts` - Improved type safety in utility functions
- `src/stores/auth.store.ts` - Properly typed profile state
- `src/hooks/use-auth.ts` - Fixed function parameter types
- `src/components/**/*.tsx` - Replaced img tags with Image components
- `src/components/ui/hover-button.tsx` - Fixed React hook dependencies

## Current Features

### ✅ Implemented Features
- **Landing Page**: Hero section with animated components and call-to-action
- **Authentication**: Supabase OAuth with GitHub/Google/Discord providers
- **User Profiles**: Comprehensive profile pages with bio, skills, projects showcase
- **Dashboard**: Analytics dashboard with metrics, charts, and post management
- **Settings**: Account, profile, developer, and preference settings management
- **Onboarding**: New user profile creation flow
- **Database**: Drizzle ORM with profiles, user_settings, and posts tables

### 🚧 In Progress / Mock Data
- **Feed**: Basic structure exists, content uses mock data
- **Posts**: Database schema ready, UI uses mock data for development
- **Features/Premium Pages**: Placeholder pages exist
- **Social Features**: Database structure ready, UI not implemented

### 📋 Planned Features
- Real-time feed with algorithm-based content
- Post creation and editing interface
- Collaboration tools and project matching
- Advanced search and filtering
- Notification system

## Development Notes

- The server is always running in another tab (don't test if running)
- Document all significant changes in this file
- Use mock data for testing UI while database design is in progress
- Always use context7 to get the latest documentation before implementing new features
- **Code Quality**: Always run `pnpm lint` and `pnpm build` before committing changes
- **Type Safety**: Never use `any` types - use proper TypeScript types or `unknown` for generics

## Troubleshooting

### Authentication Issues

#### Redirect Loops (Fixed 2025-08-18)
**Problem**: Infinite redirects between `/onboarding` and `/dashboard`
**Cause**: Table name mismatch and missing routes
**Solution**: 
- Ensure all auth code references `profiles` table, not `users`
- Redirect to `/feed` instead of `/dashboard`
- Remove `/dashboard` from protected routes if not implemented

#### Profile Not Loading
**Problem**: User logged in but profile shows as null
**Solution**:
- Check `profiles` table has correct data structure
- Verify `providers.tsx` fetches from `profiles` table
- Check RLS policies allow profile reads

#### Zustand Store Issues
**Problem**: Auth state not persisting or hydrating correctly
**Solution**:
- Check `partialize` config in persist middleware
- Use `skipHydration: true` for SSR if needed
- Ensure store initialization happens after mount

### Common Commands
```bash
# Reset auth state during development
# Delete auth-storage from localStorage in browser DevTools

# Check database connections
pnpm db:studio

# Check RLS policies
# Use Supabase dashboard > Authentication > Policies

# Reset database (development)
pnpm db:push --force
```