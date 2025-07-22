# OAuth Provider Setup and Implementation Guide

## Overview

This document provides step-by-step instructions for setting up OAuth providers (GitHub and Google) with Better Auth in the CodeCave project. It includes provider setup, configuration, and implementation details.

## GitHub OAuth Setup

### 1. Create GitHub OAuth Application

1. **Navigate to GitHub Developer Settings**:
   - Go to https://github.com/settings/developers
   - Click "OAuth Apps" in the left sidebar
   - Click "New OAuth App"

2. **Configure Application Settings**:
   ```
   Application name: CodeCave
   Homepage URL: http://localhost:3000 (development)
   Application description: CodeCave Authentication
   Authorization callback URL: http://localhost:3001/api/auth/callback/github
   ```

3. **Generate Credentials**:
   - Copy the **Client ID**
   - Click "Generate a new client secret"
   - Copy the **Client Secret** immediately (it won't be shown again)

### 2. GitHub Environment Configuration

Add to your `.env` file:
```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### 3. Production GitHub Setup

For production deployment:
1. **Update OAuth App URLs**:
   ```
   Homepage URL: https://yourdomain.com
   Authorization callback URL: https://api.yourdomain.com/api/auth/callback/github
   ```

2. **Production Environment Variables**:
   ```env
   GITHUB_CLIENT_ID=prod_github_client_id
   GITHUB_CLIENT_SECRET=prod_github_client_secret
   ```

## Google OAuth Setup

### 1. Create Google Cloud Project

1. **Access Google Cloud Console**:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

### 2. Configure OAuth Consent Screen

1. **Setup Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     ```
     App name: CodeCave
     User support email: your-email@domain.com
     Developer contact information: your-email@domain.com
     ```

2. **Add Scopes** (if needed):
   - Add basic scopes like `email`, `profile`, `openid`

### 3. Create OAuth 2.0 Credentials

1. **Create Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"

2. **Configure URLs**:
   ```
   Name: CodeCave Web Client
   Authorized JavaScript origins: http://localhost:3000
   Authorized redirect URIs: http://localhost:3001/api/auth/callback/google
   ```

3. **Download Credentials**:
   - Copy the **Client ID**
   - Copy the **Client Secret**

### 4. Google Environment Configuration

Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 5. Production Google Setup

For production deployment:
1. **Update OAuth 2.0 Client**:
   ```
   Authorized JavaScript origins: https://yourdomain.com
   Authorized redirect URIs: https://api.yourdomain.com/api/auth/callback/google
   ```

2. **Production Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=prod_google_client_id
   GOOGLE_CLIENT_SECRET=prod_google_client_secret
   ```

## Better Auth Configuration

### Backend Configuration (`apps/api/src/lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  
  trustedOrigins: [
    "http://localhost:3000", // Frontend development
    "http://localhost:3001", // API development
    // Add production URLs here
  ],
  
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // Optional: custom scopes
      // scope: ["user:email", "read:user"],
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Optional: force account selection
      // prompt: "select_account",
    },
  },
  
  emailAndPassword: {
    enabled: false, // OAuth only
  },
});
```

### Frontend OAuth Implementation

#### OAuth Buttons Component

```typescript
// apps/web/src/components/landing/oauth-buttons.tsx
"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

const oauthProviders = [
  {
    name: "GitHub",
    provider: "github" as const,
    icon: <GitHubIcon />,
    description: "git clone name@github.com",
  },
  {
    name: "Google",
    provider: "google" as const,
    icon: <GoogleIcon />,
    description: 'import { user } from "google"',
  },
];

export default function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      setLoadingProvider(provider);
      setError(null);
      
      await signIn.social({
        provider,
        callbackURL: "/home",
        errorCallbackURL: "/?error=auth_failed",
      });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {oauthProviders.map((config) => (
        <button
          key={config.provider}
          onClick={() => handleOAuthSignIn(config.provider)}
          disabled={loadingProvider !== null}
          className="oauth-button"
        >
          {loadingProvider === config.provider ? (
            <LoadingSpinner />
          ) : (
            <>
              {config.icon}
              <span>Continue with {config.name}</span>
            </>
          )}
        </button>
      ))}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}
```

## OAuth Flow Explained

### 1. User Initiated Sign-In
```typescript
// User clicks OAuth button
await signIn.social({
  provider: "github", // or "google"
  callbackURL: "/home",
});
```

### 2. OAuth Authorization Flow
1. **Redirect to Provider**: User is redirected to GitHub/Google
2. **User Authorization**: User grants permissions
3. **Callback with Code**: Provider redirects to `/api/auth/callback/{provider}`
4. **Token Exchange**: Better Auth exchanges code for access token
5. **User Creation/Login**: User is created or logged in
6. **Session Creation**: Session cookie is set
7. **Final Redirect**: User is redirected to `callbackURL`

### 3. Session Management
```typescript
// Check current session
const { data: session, isPending } = useSession();

// Sign out
await signOut();
```

## Security Considerations

### Callback URL Security
- Always use HTTPS in production
- Validate callback URLs match registered URLs
- Use state parameter for CSRF protection (Better Auth handles this)

### Environment Variables
```bash
# Development
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=development_secret_key

# Production
BETTER_AUTH_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=strong_production_secret_key
```

### CORS Configuration
```typescript
trustedOrigins: [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.BETTER_AUTH_URL || "http://localhost:3001",
  // Add additional trusted origins as needed
],
```

## Testing OAuth Integration

### 1. Development Testing
```bash
# Start both servers
pnpm run dev

# Test auth endpoints
curl -I http://localhost:3001/api/auth/session
curl -I http://localhost:3001/api/auth/callback/github
```

### 2. Frontend Testing
1. Navigate to `http://localhost:3000`
2. Click "Continue with GitHub" or "Continue with Google"
3. Complete OAuth flow
4. Verify redirect to `/home`
5. Check session persistence

### 3. Error Scenarios
- Test with invalid credentials
- Test network failures
- Test callback URL mismatches
- Test session expiration

## Troubleshooting

### Common Issues

#### 1. "OAuth App Not Found" Error
**Cause**: Incorrect Client ID or app not found
**Solution**: 
- Verify `GITHUB_CLIENT_ID` in environment
- Check OAuth app exists in GitHub settings

#### 2. "Invalid Redirect URI" Error
**Cause**: Callback URL mismatch
**Solution**:
- Verify callback URL in OAuth app settings
- Check `baseURL` in Better Auth config

#### 3. "Invalid Client Secret" Error
**Cause**: Incorrect or expired client secret
**Solution**:
- Regenerate client secret in provider settings
- Update `GITHUB_CLIENT_SECRET` environment variable

#### 4. CORS Errors
**Cause**: Untrusted origin
**Solution**:
- Add frontend URL to `trustedOrigins`
- Verify CORS headers in network tab

### Debug Commands

```bash
# Check environment variables
node -e "console.log('GitHub ID:', process.env.GITHUB_CLIENT_ID)"
node -e "console.log('Google ID:', process.env.GOOGLE_CLIENT_ID)"

# Test database connection
npx prisma db pull

# Check auth configuration
curl -v http://localhost:3001/api/auth/session
```

## Advanced Configuration

### Custom Scopes
```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    scope: ["user:email", "read:user", "public_repo"], // Custom scopes
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    scope: ["openid", "email", "profile"], // Custom scopes
    prompt: "select_account", // Force account selection
  },
},
```

### Custom User Mapping
```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    mapProfileToUser: (profile) => {
      return {
        firstName: profile.name?.split(" ")[0] || "",
        lastName: profile.name?.split(" ")[1] || "",
        username: profile.login,
        bio: profile.bio,
      };
    },
  },
},
```

## Next Steps

- [ ] Add additional OAuth providers (Discord, Twitter)
- [ ] Implement custom scopes for advanced permissions
- [ ] Add user profile synchronization
- [ ] Set up OAuth token refresh handling
- [ ] Configure rate limiting for auth endpoints
