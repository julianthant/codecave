# Better Auth Hybrid Implementation - Complete Guide

## Overview

This document provides a comprehensive guide to the CodeCave authentication system using Better Auth with a hybrid implementation approach. The setup combines the `@thallesp/nestjs-better-auth` module with custom configurations for optimal OAuth integration.

## Architecture Summary

- **Backend**: NestJS with Better Auth integration via `@thallesp/nestjs-better-auth`
- **Frontend**: Next.js with Better Auth React client
- **Database**: PostgreSQL with Prisma adapter
- **OAuth Providers**: GitHub and Google
- **Session Management**: HTTP-only cookies with CORS support

## Backend Implementation (NestJS)

### 1. Core Configuration (`apps/api/src/lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "../prisma/prisma.service";

const prisma = new PrismaService();

export const auth = betterAuth({
  // Database configuration
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Base URL for OAuth redirects
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",

  // CORS trusted origins
  trustedOrigins: [
    "http://localhost:3000", // Frontend development
    "http://localhost:3001", // API development
  ],

  // Disable email/password auth - OAuth only
  emailAndPassword: {
    enabled: false,
  },

  // OAuth providers configuration
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
```

### 2. Module Integration (`apps/api/src/app.module.ts`)

```typescript
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Better Auth module with hybrid configuration
    AuthModule.forRoot(auth, {
      disableExceptionFilter: false,
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
    }),
    // Other modules...
  ],
  // Controllers are managed by AuthModule
})
```

### 3. Environment Variables

Required environment variables for backend:

```env
# OAuth Provider Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your_secret_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/codecave
```

## Frontend Implementation (Next.js)

### 1. Auth Client Configuration (`apps/web/src/lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // NestJS backend URL
  credentials: "include", // Include cookies for session management
});

export const {
  signIn,
  signOut,
  useSession,
} = authClient;
```

### 2. OAuth Components (`apps/web/src/components/landing/oauth-buttons.tsx`)

```typescript
"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

const handleOAuthSignIn = async (provider: "github" | "google") => {
  try {
    setLoadingProvider(provider);
    
    await signIn.social({
      provider,
      callbackURL: "/home", // Redirect after successful auth
    });
  } catch (error) {
    console.error(`${provider} sign-in error:`, error);
    setError(`Failed to sign in with ${provider}`);
  } finally {
    setLoadingProvider(null);
  }
};
```

### 3. Authentication Callback (`apps/web/src/app/auth/callback/page.tsx`)

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (session) {
      router.replace("/home");
      return;
    }

    // Timeout for failed auth
    const timeout = setTimeout(() => {
      router.replace("/?error=auth_failed");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
```

### 4. Protected Routes (`apps/web/src/app/home/page.tsx`)

```typescript
"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (!session) return null;

  return (
    <div className="min-h-screen">
      {/* Protected content */}
    </div>
  );
}
```

## OAuth Provider Setup

### GitHub OAuth Application

1. **Create OAuth App**: https://github.com/settings/applications/new
2. **Configuration**:
   - Application name: CodeCave
   - Homepage URL: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
   - Authorization callback URL: `http://localhost:3001/api/auth/callback/github`
3. **Credentials**: Copy Client ID and generate Client Secret

### Google OAuth Application

1. **Create Project**: https://console.cloud.google.com/
2. **Enable Google+ API**: In APIs & Services
3. **Create OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`
4. **Credentials**: Copy Client ID and Client Secret

## API Endpoints

The `@thallesp/nestjs-better-auth` module automatically provides these endpoints:

- `POST /api/auth/sign-in/social` - Initiate OAuth flow
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Sign out user
- `GET /api/auth/user` - Get current user info

## Security Features

### CORS Configuration
- Trusted origins defined in auth configuration
- Automatic CORS handling by Better Auth module
- Credentials included in cross-origin requests

### Session Management
- HTTP-only cookies for security
- Automatic session refresh
- Secure cookie configuration in production

### Environment Security
- All sensitive credentials in environment variables
- `.env` files excluded from version control
- Separate development and production configurations

## Production Deployment

### Environment Variables
```env
# Production OAuth URLs
BETTER_AUTH_URL=https://api.yourdomain.com
GITHUB_CLIENT_ID=prod_github_client_id
GITHUB_CLIENT_SECRET=prod_github_client_secret
GOOGLE_CLIENT_ID=prod_google_client_id
GOOGLE_CLIENT_SECRET=prod_google_client_secret

# Production Database
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/codecave_prod
```

### OAuth Provider Configuration
- Update callback URLs to production domains
- Configure authorized origins for production
- Test OAuth flows in production environment

### Next.js Configuration
```typescript
// apps/web/next.config.ts
images: {
  domains: [
    "lh3.googleusercontent.com", // Google profile pictures
    "avatars.githubusercontent.com", // GitHub profile pictures
  ],
},
```

## Troubleshooting

### Common Issues

1. **404 on OAuth Callbacks**
   - Verify environment variables are loaded correctly
   - Check OAuth app callback URL configuration
   - Ensure AuthModule is properly imported

2. **CORS Errors**
   - Verify trustedOrigins in auth configuration
   - Check frontend auth client baseURL
   - Ensure credentials: "include" is set

3. **Session Not Persisting**
   - Check cookie domain configuration
   - Verify HTTPS in production
   - Confirm database connection

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   node -e "console.log(process.env.GITHUB_CLIENT_ID)"
   ```

2. **Test Auth Endpoints**:
   ```bash
   curl -I http://localhost:3001/api/auth/session
   ```

3. **Verify Database Connection**:
   ```bash
   npx prisma db pull
   ```

## Benefits of Hybrid Approach

1. **Best of Both Worlds**:
   - Leverages `@thallesp/nestjs-better-auth` for NestJS integration
   - Custom auth configuration for specific requirements

2. **Simplified Setup**:
   - Automatic route handling by AuthModule
   - Built-in CORS and security features

3. **Maintainability**:
   - Clean separation of concerns
   - Easy to update and extend

4. **Production Ready**:
   - Proper error handling
   - Security best practices
   - Scalable architecture

## Next Steps

- [ ] Add additional OAuth providers (Discord, Twitter)
- [ ] Implement role-based authorization
- [ ] Add user profile management
- [ ] Configure session persistence options
- [ ] Set up automated OAuth testing
