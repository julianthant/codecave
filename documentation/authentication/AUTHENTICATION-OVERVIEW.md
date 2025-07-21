# Authentication System Overview

## 🔐 **Authentication System Architecture**

The application uses **Better Auth** with Digital Ocean PostgreSQL database as the authentication system. The system was migrated from Supabase Auth on **July 20, 2025**.

### **Key Features**

- ✅ OAuth-based authentication (GitHub, Google)
- ✅ Session-based authentication with HTTP-only cookies
- ✅ Email verification (Magic Link)
- ✅ Custom user fields and metadata
- ✅ Secure token storage and management
- ✅ CSRF protection

### **Architecture Components**

#### **Frontend (Next.js)**

```
apps/web/
├── src/lib/
│   ├── auth.ts              # Better Auth server configuration
│   └── auth-client.ts       # Better Auth React client
├── src/app/api/auth/
│   └── [...all]/route.ts    # Next.js API route handler
└── src/components/landing/
    └── oauth-buttons.tsx    # OAuth buttons component
```

#### **Backend (NestJS)**

```
apps/api/
├── src/auth/
│   ├── better-auth.service.ts    # Better Auth service
│   ├── better-auth.module.ts     # Better Auth module
│   ├── better-auth.controller.ts # Better Auth controller
│   ├── auth.service.ts           # Legacy auth service (JWT)
│   └── auth.controller.ts        # Auth endpoints
└── migrations/
    └── 001_better_auth_schema.sql # Database schema
```

## 📊 **Database Schema**

### **Better Auth Tables**

```sql
-- Users table with additional CodeCave-specific fields
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- CodeCave-specific fields
  bio TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  company VARCHAR(255),
  github_username VARCHAR(255),
  linkedin_profile VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_pro BOOLEAN DEFAULT FALSE
);

-- OAuth accounts
CREATE TABLE accounts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification
CREATE TABLE verification_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Required Environment Variables**

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000  # or your production URL

# OAuth Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### **Doppler Configuration**

All environment variables are configured in Doppler under `codecave -> prd_all` for production environment.

## 🚀 **Authentication Flow**

### **OAuth Authentication Process**

1. **User clicks OAuth button** → Better Auth handles OAuth redirect
2. **Provider authentication** → User authenticates with GitHub/Google
3. **Callback handling** → Better Auth processes the callback
4. **Session creation** → Better Auth creates user session
5. **Redirect to app** → User is redirected to `/home`

### **Code Examples**

#### **Frontend OAuth Button**

```tsx
import { signIn } from "../lib/auth-client";

async function handleOAuthClick(provider: "github" | "google") {
  const data = await signIn.social({
    provider,
    callbackURL: `${window.location.origin}/auth/callback`,
  });

  if (data.error) {
    console.error("OAuth error:", data.error);
  }
}
```

#### **Session Management**

```tsx
import { useSession } from "../lib/auth-client";

function UserProfile() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

## 🔒 **Security Considerations**

### **Security Features**

- ✅ Secure session management with HTTP-only cookies
- ✅ CSRF protection built-in
- ✅ SQL injection prevention through parameterized queries
- ✅ Rate limiting capabilities
- ✅ Secure password hashing (when email/password is enabled)

### **OAuth Security**

- ✅ Proper OAuth 2.0 implementation
- ✅ State parameter for CSRF protection
- ✅ Secure token storage
- ✅ Token refresh handling

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Build Warnings**

```
ERROR [Better Auth]: You are using the default secret
```

**Solution**: Set `BETTER_AUTH_SECRET` environment variable

```
WARN [Better Auth]: Social provider github is missing clientId or clientSecret
```

**Solution**: Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables

#### **Database Connection Issues**

- Verify `DATABASE_URL` is correctly formatted
- Ensure database is accessible from application
- Check firewall rules for database connections

#### **OAuth Provider Issues**

- Verify OAuth app configuration in GitHub/Google console
- Check redirect URLs match exactly
- Ensure client credentials are correct

## 📚 **Related Documentation**

- [OAuth Setup Guide](../authentication/OAUTH-SETUP.md)
- [Better Auth Quick Reference](../authentication/BETTER-AUTH-QUICK-REFERENCE.md)
- [Production OAuth Setup](../authentication/PRODUCTION-OAUTH-SETUP.md)

---

**Last Updated**: July 30, 2025 