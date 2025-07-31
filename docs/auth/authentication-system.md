# Authentication System

CodeCave uses a modern OAuth-based authentication system built with Supabase Auth.

## Overview

- **Client-side OAuth flow** with GitHub, Google, and Discord providers
- **Comprehensive onboarding** for new users
- **Route protection** at multiple levels (middleware, layout, component)
- **Session management** with Zustand + React Query
- **Server-side session handling** with HTTP-only cookies

## Architecture

### Components

- **AuthButton**: OAuth provider login buttons with loading states
- **AuthModal**: Modal authentication interface 
- **UserMenu**: User profile dropdown with sign out functionality
- **AuthGuard**: Component-level route protection
- **OnboardingForm**: New user profile setup

### State Management

- **Auth Store** (`src/stores/auth.store.ts`): Central authentication state
- **Providers** (`src/app/providers.tsx`): React Query + auth state initialization
- **Session Sync**: Automatic sync between server and client state

### Route Protection

1. **Middleware** (`src/utils/supabase/middleware.ts`): Session validation
2. **Layout** (`src/app/(authenticated)/layout.tsx`): Server-side user verification
3. **Components**: Client-side auth guards for sensitive UI

## Authentication Flow

### Sign In Process

1. User clicks OAuth provider button
2. Redirected to provider authorization
3. Provider redirects to `/auth/callback`
4. Callback extracts tokens and creates session
5. Check if user profile exists:
   - **No profile**: Redirect to `/onboarding`
   - **Has profile**: Redirect to `/dashboard`

### Onboarding Process

1. New users redirected to `/onboarding`
2. Fill profile form (username, display name, bio, etc.)
3. Username availability check
4. Profile created in database
5. Redirect to `/dashboard`

### Sign Out Process

1. User clicks sign out in UserMenu
2. Local auth state cleared immediately (instant UI feedback)
3. Server-side sign out via `/auth/signout` endpoint
4. Session cookies cleared
5. Redirect to homepage
6. Full page reload to clear all cached state

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### OAuth Providers Setup

Configure in Supabase Dashboard > Authentication > Providers:

- **GitHub**: Client ID, Client Secret, redirect URL
- **Google**: Client ID, Client Secret, authorized domains  
- **Discord**: Client ID, Client Secret, redirect URL

### Database Schema

Users table with RLS policies:
- `users` table references `auth.users(id)`
- Policies allow users to insert/update own profiles
- Public read access for user discovery

## Troubleshooting

### Common Issues

**Sign out not working:**
- Check network connectivity
- Verify `/auth/signout` endpoint exists
- Check browser console for errors

**Onboarding hanging:**
- Verify database connection
- Check RLS policies on users table
- Ensure users table exists and has correct schema

**Session not persisting:**
- Check cookie settings
- Verify middleware configuration
- Check server.ts cookie handling

### Debug Mode

Enable debug logging by adding to onboarding form:
```typescript
console.log('Session check:', await supabase.auth.getSession())
```

## Security Features

- **PKCE flow**: Proof Key for Code Exchange for OAuth
- **HTTP-only cookies**: Session tokens not accessible via JavaScript
- **CSRF protection**: Built into Supabase Auth
- **RLS policies**: Row Level Security on all database tables
- **Session timeout**: Automatic session expiration handling