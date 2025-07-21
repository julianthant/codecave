# Better Auth Implementation Guide

## Overview

This document describes the complete Better Auth implementation in CodeCave, including OAuth providers, database integration, session management, and security configurations.

## Architecture

### Authentication Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   NestJS API     │    │   Database      │
│   (Next.js)     │    │   (Better Auth)  │    │   (PostgreSQL)  │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│                 │    │                  │    │                 │
│ 1. Login Button │───▶│ OAuth Provider   │    │ User Storage    │
│                 │    │ (GitHub/Google)  │    │ Session Storage │
│                 │    │                  │    │ Account Links   │
│ 2. User State   │◀───│ Session Mgmt     │◀───│ Auth Tables     │
│                 │    │                  │    │                 │
│ 3. Protected    │───▶│ JWT Validation   │    │ Permissions     │
│    Routes       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Implementation Details

### 1. Core Configuration (`auth/better-auth.config.ts`)

```typescript
export const betterAuthConfig = {
  database: new PrismaAdapter(prisma),
  emailAndPassword: {
    enabled: false, // OAuth only for now
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: ["http://localhost:3000"],
};
```

### 2. Database Schema (Prisma)

**User Model:**

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Better Auth relations
  accounts Account[]
  sessions Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

### 3. NestJS Integration

**Better Auth Module (`auth/better-auth.module.ts`):**

```typescript
@Module({
  providers: [BetterAuthService],
  exports: [BetterAuthService],
})
export class BetterAuthModule {}
```

**Better Auth Service:**

```typescript
@Injectable()
export class BetterAuthService {
  private auth: ReturnType<typeof createAuth>;

  constructor() {
    this.auth = createAuth(betterAuthConfig);
  }

  getAuthInstance() {
    return this.auth;
  }

  async validateSession(sessionToken: string) {
    return await this.auth.api.getSession({
      headers: { cookie: `better-auth.session_token=${sessionToken}` },
    });
  }
}
```

**Controller Integration (`auth/better-auth.controller.ts`):**

```typescript
@Controller("api/auth")
export class BetterAuthController {
  constructor(private betterAuthService: BetterAuthService) {}

  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const auth = this.betterAuthService.getAuthInstance();
    return auth.handler(req, res);
  }
}
```

### 4. Frontend Integration

**Auth Client (`lib/auth-client.ts`):**

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  trustedOrigins: ["http://localhost:3000"],
});

export const { signIn, signOut, useSession, signUp } = authClient;
```

**Login Component Example:**

```typescript
"use client";

import { signIn } from "@/lib/auth-client";

export function LoginButton() {
  const handleGitHubLogin = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={handleGitHubLogin}>
        Sign in with GitHub
      </button>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
```

**Session Hook Usage:**

```typescript
"use client";

import { useSession } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (!session) return <div>Please sign in</div>;

  return (
    <div>
      <img src={session.user.image} alt="Profile" />
      <h1>Welcome, {session.user.name}!</h1>
      <p>{session.user.email}</p>
    </div>
  );
}
```

### 5. Authentication Guards

**NestJS Guard (`auth/guards/auth.guard.ts`):**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private betterAuthService: BetterAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionToken = this.extractSessionFromRequest(request);

    if (!sessionToken) {
      throw new UnauthorizedException("No session token provided");
    }

    const session = await this.betterAuthService.validateSession(sessionToken);

    if (!session.session) {
      throw new UnauthorizedException("Invalid session");
    }

    request.user = session.user;
    request.session = session.session;

    return true;
  }

  private extractSessionFromRequest(request: any): string | null {
    const cookie = request.headers.cookie;
    if (!cookie) return null;

    const match = cookie.match(/better-auth\.session_token=([^;]+)/);
    return match ? match[1] : null;
  }
}
```

**Public Decorator:**

```typescript
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Current User Decorator:**

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

### 6. Route Protection

**Protected API Route:**

```typescript
@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }
}
```

**Next.js Middleware (`middleware.ts`):**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect to login if accessing protected page without session
  if (isProtectedPage && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect to dashboard if accessing auth pages with session
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
```

## OAuth Provider Setup

### 1. GitHub OAuth Application

**Settings:**

- **Application Name**: CodeCave
- **Homepage URL**: `https://codecave.tech`
- **Authorization Callback URL**: `http://localhost:3000/api/auth/callback/github`
- **Production Callback**: `https://api.codecave.tech/api/auth/callback/github`

**Required Scopes:**

- `user:email` - Access user email addresses
- `read:user` - Access user profile information

**Environment Variables:**

```bash
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### 2. Google OAuth 2.0

**Google Cloud Console Setup:**

1. Create new project or select existing
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure consent screen

**Authorized Redirect URIs:**

```
http://localhost:3000/api/auth/callback/google
https://api.codecave.tech/api/auth/callback/google
```

**Environment Variables:**

```bash
GOOGLE_CLIENT_ID="your_google_client_id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## Security Configuration

### 1. Session Management

**Configuration:**

- **Storage**: Database (PostgreSQL)
- **Cookie Settings**: HttpOnly, Secure (production), SameSite=Lax
- **Session Lifetime**: 30 days
- **Cookie Cache**: 5 minutes for performance

**Security Features:**

- CSRF protection enabled
- Session rotation on privilege escalation
- Secure cookie settings in production
- IP-based session validation (optional)

### 2. Environment Variables

**Development (`.env.local`):**

```bash
# Better Auth
BETTER_AUTH_SECRET="your-secret-key-for-development"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="dev_github_client_id"
GITHUB_CLIENT_SECRET="dev_github_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="dev_google_client_id"
GOOGLE_CLIENT_SECRET="dev_google_client_secret"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/codecave_dev"
```

**Production (Doppler - `prd_all`):**

```bash
# Better Auth
BETTER_AUTH_SECRET="production-secret-key-256-bit"
BETTER_AUTH_URL="https://api.codecave.tech"

# GitHub OAuth (Production App)
GITHUB_CLIENT_ID="prod_github_client_id"
GITHUB_CLIENT_SECRET="prod_github_client_secret"

# Google OAuth (Production App)
GOOGLE_CLIENT_ID="prod_google_client_id"
GOOGLE_CLIENT_SECRET="prod_google_client_secret"

# Database (Managed PostgreSQL)
DATABASE_URL="postgresql://codecave_app_user:password@db-host:25060/codecave_production?sslmode=require"
```

### 3. CORS Configuration

**API CORS Settings:**

```typescript
app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://codecave.tech",
    "https://www.codecave.tech",
    "https://*.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
});
```

## Database Migrations

### Initial Migration

```sql
-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create accounts table (OAuth providers)
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create sessions table
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_idx" ON "accounts"("provider", "providerAccountId");
```

### Running Migrations

```bash
# Development
npx prisma migrate dev --name init-better-auth

# Production
npx prisma migrate deploy
```

## Testing & Development

### 1. Local Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your OAuth credentials

# 3. Set up database
npx prisma migrate dev

# 4. Start development servers
pnpm dev
```

### 2. Testing Authentication Flow

**Manual Testing Checklist:**

- [ ] GitHub OAuth login works
- [ ] Google OAuth login works
- [ ] User profile is created/updated
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout clears session properly
- [ ] CORS allows frontend requests

**Test API Endpoints:**

```bash
# Test session validation
curl -b "better-auth.session_token=YOUR_TOKEN" \
  http://localhost:3001/users/profile

# Test auth endpoints
curl http://localhost:3001/api/auth/session
```

### 3. Debugging Common Issues

**Issue: OAuth callback errors**

- Check redirect URI configuration
- Verify client ID/secret
- Check network requests in dev tools

**Issue: Session not persisting**

- Verify cookie settings
- Check CORS configuration
- Ensure database connection

**Issue: CORS errors**

- Update origin allowlist
- Check credentials: true setting
- Verify preflight handling

## Production Deployment

### 1. Environment Setup

```bash
# Configure production secrets in Doppler
doppler secrets set GITHUB_CLIENT_ID="prod_client_id"
doppler secrets set GITHUB_CLIENT_SECRET="prod_client_secret"
doppler secrets set GOOGLE_CLIENT_ID="prod_google_id"
doppler secrets set GOOGLE_CLIENT_SECRET="prod_google_secret"
doppler secrets set BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
```

### 2. Database Migration

```bash
# SSH to production server
ssh root@134.199.238.129

# Run database migrations
cd /root/codecave
doppler run --config=prd_all --project=codecave -- npx prisma migrate deploy
```

### 3. SSL/HTTPS Considerations

**Production Requirements:**

- HTTPS enforced for all auth endpoints
- Secure cookie flags enabled
- SameSite=None for cross-domain (if needed)
- HSTS headers configured

## Monitoring & Observability

### 1. Auth Metrics

**Key Metrics to Track:**

- Login success/failure rates
- Session duration average
- OAuth provider usage distribution
- Authentication errors by type

### 2. Security Monitoring

**Security Events:**

- Failed authentication attempts
- Suspicious session activity
- OAuth token refresh failures
- Cross-origin request violations

### 3. Performance Monitoring

**Performance Metrics:**

- Auth endpoint response times
- Database query performance
- Session lookup speed
- Cookie cache hit rate

## Future Enhancements

### 1. Additional Features

**Planned Implementations:**

- [ ] Email/password authentication
- [ ] Two-factor authentication (2FA)
- [ ] Social provider linking/unlinking
- [ ] Account deletion with data cleanup
- [ ] OAuth scope management

### 2. Security Improvements

**Security Roadmap:**

- [ ] Rate limiting on auth endpoints
- [ ] IP-based session validation
- [ ] Suspicious activity detection
- [ ] Auth event logging and alerting
- [ ] Regular security audit automation

### 3. Performance Optimizations

**Performance Improvements:**

- [ ] Redis session storage
- [ ] JWT-based stateless sessions
- [ ] Auth caching strategies
- [ ] CDN for auth assets

## Related Documentation

- [Development Environment Setup](../development/LOCAL-DEVELOPMENT.md)
- [OAuth Provider Setup Guide](./OAUTH-PROVIDER-SETUP.md)
- [Database Configuration](../infrastructure/DATABASE.md)
- [Security Best Practices](../security/README.md)
