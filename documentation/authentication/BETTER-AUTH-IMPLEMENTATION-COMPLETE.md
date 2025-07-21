# Better Auth Backend Implementation Guide

## Overview

This guide describes the complete Better Auth implementation for the CodeCave project, connecting the NestJS backend with the Next.js frontend OAuth buttons.

## Backend Setup (NestJS)

### 1. Auth Configuration (`src/auth/better-auth.config.ts`)

- Configures Better Auth with Prisma adapter
- Sets up GitHub and Google OAuth providers
- Defines trusted origins for CORS
- Uses PostgreSQL database

### 2. Auth Service (`src/auth/better-auth.service.ts`)

- Wraps Better Auth instance for NestJS dependency injection
- Provides session validation methods
- Handles user authentication state

### 3. Auth Controller (`src/auth/better-auth.controller.ts`)

- Exposes `/api/auth/*` routes
- Handles all Better Auth requests (signin, callback, etc.)
- Converts between Express and Web API requests

### 4. Auth Guard (`src/auth/guards/auth.guard.ts`)

- Protects routes requiring authentication
- Validates session tokens from cookies or headers
- Injects user data into request context

### 5. Decorators

- `@Public()`: Marks endpoints as publicly accessible
- `@CurrentUser()`: Injects authenticated user into controller methods

## Frontend Integration (Next.js)

### 1. Auth Client (`src/lib/auth-client.ts`)

- Configures Better Auth React client
- Points to NestJS backend API
- Includes credentials for session cookies

### 2. OAuth Buttons (`src/components/landing/oauth-buttons.tsx`)

- GitHub and Google authentication buttons
- Handles OAuth flow initiation
- Error handling and loading states
- Redirects to dashboard on success

### 3. Callback Page (`src/app/auth/callback/page.tsx`)

- Handles OAuth provider redirects
- Processes authentication results
- Redirects to dashboard or home with error

### 4. Dashboard Page (`src/app/dashboard/page.tsx`)

- Protected route example
- Displays user profile information
- Session management and sign-out

## Database Schema

The existing Prisma schema is compatible with Better Auth:

- `User` model: Stores user profile data
- `Session` model: Manages user sessions
- `Account` model: Links OAuth provider accounts
- `Verification` model: Handles verification tokens

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
BETTER_AUTH_URL=http://localhost:3001

# Frontend URL
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## OAuth Provider Setup

### GitHub

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3001/api/auth/callback/github`
4. Copy Client ID and Client Secret

### Google

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Set Authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
4. Copy Client ID and Client Secret

## Authentication Flow

1. User clicks OAuth button on frontend
2. Frontend calls Better Auth client `signIn.social()`
3. User redirected to OAuth provider (GitHub/Google)
4. Provider redirects to backend callback URL
5. Backend processes OAuth response and creates session
6. User redirected to frontend callback page
7. Frontend callback page redirects to dashboard
8. Dashboard displays user profile from session

## Testing

1. Start the API server: `npm run dev` (in apps/api)
2. Start the web server: `npm run dev` (in apps/web)
3. Visit `http://localhost:3000`
4. Click GitHub or Google OAuth button
5. Complete OAuth flow
6. Should redirect to dashboard with user info

## Security Features

- CSRF protection via trusted origins
- Secure session cookies with httpOnly
- Session token validation
- Cross-subdomain cookie support
- OAuth state parameter validation
- Session expiration and refresh

## Error Handling

- OAuth errors displayed to user
- Session validation failures result in 401
- Automatic redirect to login for protected routes
- Comprehensive error logging with Sentry integration
