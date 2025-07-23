# CodeCave Authentication System Guide

## 🔐 **Overview**

CodeCave uses **Better Auth** with PostgreSQL database as the complete authentication solution. This guide covers the entire authentication system, from setup to implementation.

## 🏗️ **Authentication Architecture**

### **Key Features**

- ✅ OAuth-based authentication (GitHub, Google)
- ✅ Session-based authentication with HTTP-only cookies
- ✅ Email verification (Magic Link) - _ready but not enabled_
- ✅ Custom user fields and metadata
- ✅ Secure token storage and management
- ✅ CSRF protection
- ✅ Global authentication with `@Public()` decorator
- ✅ Hybrid NestJS integration

### **System Components**

#### **Backend (NestJS)**

```
apps/api/
├── src/lib/
│   └── auth.ts                    # Better Auth server configuration
├── src/auth/
│   └── auth.controller.ts         # Auth route handler
├── src/users/
│   ├── users.controller.ts        # User profile endpoints
│   ├── users.service.ts           # User CRUD operations
│   └── entities/
│       ├── user.entity.ts         # User type definitions
│       └── oauth-profile.ts       # OAuth profile interface
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/
│       └── 001_better_auth_schema.sql  # Auth schema migration
└── src/app.module.ts              # Global auth guard setup
```

#### **Frontend (Next.js)**

```
apps/web/
├── src/lib/
│   └── auth-client.ts             # Better Auth React client
├── src/app/api/auth/
│   └── [...all]/route.ts          # Next.js API route handler
├── src/app/auth/
│   └── callback/page.tsx          # OAuth callback handling
└── src/components/landing/
    └── oauth-buttons.tsx          # OAuth UI components
```

## 🗄️ **Database Schema**

### **Better Auth Tables**

The authentication system uses the following database tables:

#### **User Table**

```sql
CREATE TABLE "user" (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- CodeCave-specific fields
  bio TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  company VARCHAR(255),
  skills VARCHAR(255)[] DEFAULT '{}',
  provider AuthProvider DEFAULT 'GITHUB',
  providerId VARCHAR(255),
  githubUsername VARCHAR(255),
  projectsCount INT DEFAULT 0,
  followersCount INT DEFAULT 0,
  followingCount INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  isPro BOOLEAN DEFAULT FALSE
);
```

#### **Account Table** (OAuth Providers)

```sql
CREATE TABLE "account" (
  id VARCHAR(255) PRIMARY KEY,
  accountId VARCHAR(255) NOT NULL,
  providerId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) REFERENCES "user"(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TIMESTAMP,
  refreshTokenExpiresAt TIMESTAMP,
  scope TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Session Table**

```sql
CREATE TABLE "session" (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) REFERENCES "user"(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  ipAddress VARCHAR(255),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Verification Table**

```sql
CREATE TABLE "verification" (
  id VARCHAR(255) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ⚙️ **Backend Implementation**

### **Better Auth Configuration**

#### **Core Setup** (`apps/api/src/lib/auth.ts`)

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
    "https://codecave.tech", // Production frontend
    "https://www.codecave.tech", // Production frontend with www
    "https://api.codecave.tech", // Production API
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

#### **NestJS Module Integration**

The system uses a hybrid approach with `@thallesp/nestjs-better-auth`:

```typescript
// apps/api/src/app.module.ts
import { AuthModule, AuthGuard } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";

@Module({
  imports: [
    AuthModule.forRoot(auth, {
      disableExceptionFilter: false,
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
    }),
    // Other modules...
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Global authentication
    },
  ],
})
export class AppModule {}
```

#### **Auth Controller** (`apps/api/src/auth/auth.controller.ts`)

```typescript
import { Controller, All, Req, Res, Logger } from "@nestjs/common";
import { Public } from "@thallesp/nestjs-better-auth";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Public() // Mark all auth routes as public
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Auth request: ${req.method} ${req.url}`);
      const handler = toNodeHandler(auth);
      return handler(req, res);
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`, error.stack);
      res.status(500).json({
        error: "Authentication failed",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
}
```

### **User Management**

#### **User Service** (`apps/api/src/users/users.service.ts`)

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, AuthProvider, CreateUserInput } from "./entities/user.entity";
import { OAuthProfile } from "./entities/oauth-profile";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(
    profile: OAuthProfile,
    provider: AuthProvider
  ): Promise<User> {
    const userData: CreateUserInput = {
      email: profile.email,
      name: profile.name,
      emailVerified: true, // OAuth users are email verified
      image: profile.avatar,
      avatar: profile.avatar,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
      company: profile.company,
      skills: [],
      provider,
      providerId: profile.id,
      githubUsername: profile.githubUsername,
    };

    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
```

#### **Protected Routes**

```typescript
// apps/api/src/users/users.controller.ts
import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@thallesp/nestjs-better-auth";

@Controller("users")
@UseGuards(AuthGuard) // Route-level protection (optional with global guard)
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@Request() req: Request) {
    return { user: req.user };
  }
}

// Public routes use @Public() decorator
@Controller()
export class AppController {
  @Public()
  @Get("health")
  getHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
```

## 🌐 **Frontend Implementation**

### **Auth Client Setup**

#### **Client Configuration** (`apps/web/src/lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BACKEND_URL || "http://localhost:3001",
  credentials: "include", // Include cookies for session management
});

export const { signIn, signOut, useSession } = authClient;
```

### **OAuth Components**

#### **OAuth Buttons** (`apps/web/src/components/landing/oauth-buttons.tsx`)

```typescript
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

### **Authentication Callback**

#### **Callback Handler** (`apps/web/src/app/auth/callback/page.tsx`)

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

### **Protected Routes**

#### **Protected Page Example** (`apps/web/src/app/home/page.tsx`)

```typescript
"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Welcome, {session.user.name}!</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Protected content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <pre>{JSON.stringify(session.user, null, 2)}</pre>
      </main>
    </div>
  );
}
```

## 🔧 **OAuth Provider Setup**

### **GitHub OAuth Application**

1. **Create OAuth App**:
   - Go to: https://github.com/settings/applications/new
   - Application name: `CodeCave`
   - Homepage URL: `http://localhost:3000` (dev) / `https://codecave.tech` (prod)
   - Authorization callback URL: `http://localhost:3001/api/auth/callback/github`

2. **Get Credentials**:
   - Copy **Client ID**
   - Generate and copy **Client Secret**

3. **Environment Variables**:
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### **Google OAuth Application**

1. **Create Google Cloud Project**:
   - Go to: https://console.cloud.google.com/
   - Create new project: `CodeCave`

2. **Enable APIs**:
   - Enable Google+ API in APIs & Services

3. **Configure OAuth Consent Screen**:
   - User type: External
   - App name: `CodeCave`
   - User support email: your email
   - Developer contact: your email

4. **Create OAuth 2.0 Credentials**:
   - Application type: Web application
   - Name: `CodeCave Web Client`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`

5. **Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## 🔑 **Environment Configuration**

### **Required Environment Variables**

#### **Development**

```env
# Better Auth
BETTER_AUTH_SECRET=development_secret_key_32_characters_minimum
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Development Apps)
GITHUB_CLIENT_ID=your_dev_github_client_id
GITHUB_CLIENT_SECRET=your_dev_github_client_secret
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_client_secret

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

#### **Production**

```env
# Better Auth
BETTER_AUTH_SECRET=strong_production_secret_32_characters_minimum
BETTER_AUTH_URL=https://codecave.tech

# OAuth Providers (Production Apps)
GITHUB_CLIENT_ID=your_prod_github_client_id
GITHUB_CLIENT_SECRET=your_prod_github_client_secret
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_client_secret

# Database
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# URLs
FRONTEND_URL=https://codecave.tech
BACKEND_URL=https://api.codecave.tech
```

## 🔄 **Authentication Flow**

### **OAuth Sign-In Process**

1. **User clicks OAuth button** → `signIn.social({ provider: "github" })`
2. **Better Auth handles redirect** → User sent to GitHub/Google
3. **User authorizes app** → Provider redirects to callback URL
4. **Callback processing** → Better Auth exchanges code for tokens
5. **User creation/login** → User record created or updated
6. **Session creation** → HTTP-only session cookie set
7. **Redirect to app** → User redirected to `/home`

### **Session Management**

```typescript
// Check current session
const { data: session, isPending } = useSession();

// Session data structure
{
  user: {
    id: "uuid",
    name: "User Name",
    email: "user@example.com",
    image: "https://avatar.url",
    // ... other user fields
  },
  session: {
    id: "session_id",
    userId: "user_id",
    expiresAt: "2025-02-01T00:00:00.000Z"
  }
}

// Sign out
await signOut();
```

## 🔐 **Security Features**

### **Built-in Security**

- ✅ **HTTP-only cookies** - Session tokens not accessible via JavaScript
- ✅ **CSRF protection** - Built into Better Auth
- ✅ **SQL injection prevention** - Prisma parameterized queries
- ✅ **Secure session management** - Automatic token rotation
- ✅ **OAuth 2.0 compliance** - Proper state parameter handling

### **Global Authentication**

The system uses a global auth guard with opt-out for public routes:

```typescript
// All routes protected by default
@Controller()
export class SomeController {
  @Get("protected")
  protectedRoute() {
    // Automatically requires authentication
  }

  @Public() // Opt out of authentication
  @Get("public")
  publicRoute() {
    // Accessible without authentication
  }
}
```

## 🧪 **Testing Authentication**

### **Development Testing**

```bash
# Test auth endpoints
curl -I http://localhost:3001/api/auth/session

# Test OAuth endpoints
curl -I http://localhost:3001/api/auth/callback/github
curl -I http://localhost:3001/api/auth/callback/google

# Test protected endpoint
curl http://localhost:3001/users/profile
# Should return 401 Unauthorized

# Test public endpoint
curl http://localhost:3001/health
# Should return 200 OK
```

### **Frontend Testing**

1. Navigate to `http://localhost:3000`
2. Click "Continue with GitHub" or "Continue with Google"
3. Complete OAuth flow
4. Verify redirect to `/home`
5. Check session persistence on page refresh
6. Test sign out functionality

## 🚨 **Troubleshooting**

### **Common Issues**

#### **OAuth Callback Errors**

**Issue**: 404 on OAuth callbacks

```bash
# Check environment variables
echo $GITHUB_CLIENT_ID
echo $GITHUB_CLIENT_SECRET

# Verify OAuth app settings
# Callback URL must match exactly
```

**Issue**: "Invalid redirect URI"

```bash
# Development callback URLs
http://localhost:3001/api/auth/callback/github
http://localhost:3001/api/auth/callback/google

# Production callback URLs
https://api.codecave.tech/api/auth/callback/github
https://api.codecave.tech/api/auth/callback/google
```

#### **CORS Errors**

```typescript
// Verify trustedOrigins in auth.ts
trustedOrigins: [
  "http://localhost:3000",
  "https://codecave.tech",
  // Add your domains
],
```

#### **Session Not Persisting**

```bash
# Check cookie settings
# Ensure HTTPS in production
# Verify domain configuration

# Check browser developer tools
# Application > Cookies
# Look for better-auth.session_token
```

#### **Database Connection Issues**

```bash
# Test database connection
cd apps/api
npx prisma db pull

# Check migration status
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy
```

### **Debug Commands**

```bash
# Check environment variables
node -e "console.log('GitHub ID:', process.env.GITHUB_CLIENT_ID)"
node -e "console.log('Better Auth URL:', process.env.BETTER_AUTH_URL)"

# Test auth configuration
curl -v http://localhost:3001/api/auth/session

# Check database schema
cd apps/api
npx prisma studio
```

## 📊 **API Endpoints**

### **Authentication Endpoints**

The `@thallesp/nestjs-better-auth` module automatically provides:

- `POST /api/auth/sign-in/social` - Initiate OAuth flow
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Sign out user
- `GET /api/auth/user` - Get current user info

### **User Management Endpoints**

- `GET /users/profile` - Get current user profile (authenticated)

### **Public Endpoints**

- `GET /` - Hello world
- `GET /health` - Health check

## 🔄 **Migration History**

### **Better Auth Migration (July 20, 2025)**

The system was migrated from Supabase Auth to Better Auth:

1. **Old Schema**: Basic user table with OAuth provider enum
2. **New Schema**: Complete Better Auth schema with sessions, accounts, verification
3. **Migration File**: `001_better_auth_schema.sql`
4. **Benefits**:
   - Better NestJS integration
   - More flexible user management
   - Enhanced security features
   - Better session management

## 🚀 **Production Deployment**

### **Environment Setup**

All environment variables should be configured in Doppler:

```bash
# Configure Doppler
doppler configure set project codecave config prd_all

# Deploy with Doppler
doppler run -- docker-compose -f docker-compose.prod.yml up -d
```

### **OAuth Production Setup**

1. **Update OAuth app URLs** to production domains
2. **Generate new production secrets** with strong entropy
3. **Configure HTTPS** for all authentication endpoints
4. **Set up monitoring** for authentication failures

## 📚 **Additional Resources**

- [Better Auth Documentation](https://better-auth.com/)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Last Updated**: January 2025
