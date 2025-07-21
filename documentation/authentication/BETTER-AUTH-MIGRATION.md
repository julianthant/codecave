# Better Auth Migration Documentation

## 🎯 **Migration Overview**

This document outlines the complete migration from Supabase authentication to Better Auth with Digital Ocean PostgreSQL database. The migration was completed on **July 20, 2025**.

## 📋 **What Changed**

### **Authentication System**

- **Before**: Supabase Auth with OAuth providers
- **After**: Better Auth with GitHub and Google OAuth providers
- **Database**: Migrated from Supabase to Digital Ocean managed PostgreSQL

### **Key Improvements**

- ✅ Full control over authentication logic
- ✅ Better TypeScript support and type safety
- ✅ More flexible user schema with additional fields
- ✅ Simplified authentication flow
- ✅ No vendor lock-in

## 🏗️ **Technical Architecture**

### **Frontend (Next.js)**

```
apps/web/
├── src/lib/
│   ├── auth.ts              # Better Auth server configuration
│   └── auth-client.ts       # Better Auth React client
├── src/app/api/auth/
│   └── [...all]/route.ts    # Next.js API route handler
└── src/components/landing/
    └── oauth-buttons.tsx    # Updated OAuth buttons
```

### **Backend (NestJS)**

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

## 🗄️ **Database Schema**

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

#### **Required for Better Auth**

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

#### **Removed Supabase Variables**

```env
# These are no longer needed:
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Doppler Configuration**

All environment variables should be configured in Doppler under `codecave -> prd_all` for production environment.

## 🚀 **Authentication Flow**

### **New Authentication Process**

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

## 🏗️ **Infrastructure**

### **Digital Ocean Database**

```terraform
# Terraform configuration for Digital Ocean PostgreSQL
resource "digitalocean_database_cluster" "codecave_postgres" {
  name       = "codecave-postgres-${var.environment}"
  engine     = "pg"
  version    = "15"
  size       = "db-s-1vcpu-1gb"
  region     = "nyc1"
  node_count = 1

  tags = var.tags
}
```

## 🔒 **Security Considerations**

### **Better Auth Security Features**

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

## 🧪 **Testing**

### **Local Development Testing**

```bash
# 1. Start the database
pnpm db:migrate

# 2. Start the API
cd apps/api
pnpm dev

# 3. Start the web app
cd apps/web
pnpm dev

# 4. Test OAuth flows
# - Navigate to http://localhost:3000
# - Click GitHub or Google OAuth button
# - Complete authentication
# - Verify redirect to /home
```

### **Integration Tests**

```typescript
// Example test for authentication flow
describe("Authentication", () => {
  it("should authenticate user with GitHub", async () => {
    // Test implementation
  });

  it("should create user session", async () => {
    // Test implementation
  });

  it("should handle OAuth errors", async () => {
    // Test implementation
  });
});
```

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

## 📚 **Migration Checklist**

### **Completed ✅**

- [x] Better Auth installation and configuration
- [x] Database schema creation
- [x] OAuth provider setup (GitHub, Google)
- [x] Frontend component updates
- [x] Backend service integration
- [x] Supabase code removal
- [x] Environment variable updates
- [x] Documentation creation

### **Next Steps**

- [ ] Deploy database infrastructure via Terraform
- [ ] Configure production OAuth apps
- [ ] Set up production environment variables in Doppler
- [ ] Deploy and test in production environment
- [ ] Monitor authentication metrics

## 🔗 **Related Documentation**

- [Better Auth Official Documentation](https://www.better-auth.com/docs)
- [Digital Ocean Database Documentation](https://docs.digitalocean.com/products/databases/)
- [Terraform Digital Ocean Provider](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs)

## 📞 **Support**

For issues related to this migration:

1. Check this documentation first
2. Review the Better Auth documentation
3. Check the GitHub repository issues
4. Contact the development team

---

**Migration completed on**: July 20, 2025  
**Next review date**: August 20, 2025
