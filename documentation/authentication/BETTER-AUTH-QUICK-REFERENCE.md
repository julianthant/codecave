# Better Auth Quick Reference

## 🚀 **Quick Start Commands**

### **Development Setup**

```bash
# Install dependencies
pnpm install

# Setup database (run migrations)
cd apps/api && pnpm prisma migrate dev

# Start development servers
pnpm dev  # Runs both web and api

# Or start individually:
cd apps/web && pnpm dev    # Frontend on :3000
cd apps/api && pnpm dev    # Backend on :3001
```

### **Database Commands**

```bash
# Run migrations
cd apps/api && pnpm prisma migrate dev

# Reset database
cd apps/api && pnpm prisma migrate reset

# Generate Prisma client
cd apps/api && pnpm prisma generate

# Open Prisma Studio
cd apps/api && pnpm prisma studio
```

## 🔧 **Environment Variables**

### **Required Variables**

```env
# Copy to .env.local in apps/web and .env in apps/api

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/codecave"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-minimum-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth (Development)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"
```

### **OAuth Setup Links**

- **GitHub**: https://github.com/settings/applications/new
- **Google**: https://console.developers.google.com/apis/credentials

## 📋 **Common Code Patterns**

### **Frontend Authentication**

#### **Check Authentication Status**

```tsx
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

#### **OAuth Sign In**

```tsx
import { signIn } from "@/lib/auth-client";

async function handleSignIn(provider: "github" | "google") {
  const data = await signIn.social({
    provider,
    callbackURL: `${window.location.origin}/auth/callback`,
  });

  if (data.error) {
    console.error("Sign in error:", data.error);
  }
}
```

#### **Sign Out**

```tsx
import { signOut } from "@/lib/auth-client";

async function handleSignOut() {
  await signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
}
```

### **Backend Authentication**

#### **Verify Session in NestJS**

```typescript
import { BetterAuthService } from "@/auth/better-auth.service";

@Controller("protected")
export class ProtectedController {
  constructor(private betterAuth: BetterAuthService) {}

  @Get("profile")
  async getProfile(@Headers("authorization") authHeader: string) {
    const session = await this.betterAuth.verifySession(authHeader);
    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    return session.user;
  }
}
```

#### **Extract User from Request**

```typescript
// Custom decorator for user extraction
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Set by auth middleware
  },
);

// Usage
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}
```

## 🗄️ **Database Schema Quick Reference**

### **Main Tables**

```sql
-- Users (main table)
users: id, email, name, image, email_verified, created_at, updated_at
       bio, website, location, company, github_username
       is_active, is_pro

-- OAuth accounts
accounts: id, user_id, provider, provider_account_id, access_token,
          refresh_token, expires_at, created_at, updated_at

-- Sessions
sessions: id, user_id, token, expires_at, created_at, updated_at

-- Email verification
verification_tokens: id, user_id, token, expires_at, created_at
```

### **User Fields Available**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Custom fields
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  githubUsername?: string;
  isActive: boolean;
  isPro: boolean;
}
```

## 🐛 **Common Issues & Solutions**

### **Build Errors**

```
ERROR: You are using the default secret
```

**Fix**: Set `BETTER_AUTH_SECRET` in environment variables

```
WARN: Social provider github is missing clientId
```

**Fix**: Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### **Database Issues**

```
Error: Can't reach database server
```

**Fix**: Check `DATABASE_URL` and ensure database is running

```
Error: Table 'users' doesn't exist
```

**Fix**: Run `pnpm prisma migrate dev` to create tables

### **OAuth Issues**

```
OAuth error: redirect_uri_mismatch
```

**Fix**: Ensure OAuth app redirect URL matches `BETTER_AUTH_URL`

## 📖 **API Endpoints**

### **Better Auth Endpoints**

```
POST /api/auth/sign-in/social     # OAuth sign in
POST /api/auth/sign-out          # Sign out
GET  /api/auth/session           # Get current session
POST /api/auth/callback          # OAuth callback
```

### **Custom API Endpoints**

```
GET  /api/users/profile          # Get user profile
PUT  /api/users/profile          # Update user profile
GET  /api/users                  # List users (admin)
```

## 🔄 **Development Workflow**

### **Adding New OAuth Provider**

1. Add provider to Better Auth config (`apps/web/lib/auth.ts`)
2. Add environment variables for client ID/secret
3. Update OAuth buttons component
4. Test authentication flow

### **Adding User Fields**

1. Update Better Auth config with new fields
2. Run database migration to add columns
3. Update TypeScript types if needed
4. Update frontend forms/components

### **Testing Changes**

```bash
# Run tests
pnpm test

# Check types
pnpm type-check

# Lint code
pnpm lint

# Build for production
pnpm build
```

## 📚 **Useful Links**

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Better Auth Examples](https://www.better-auth.com/examples)
- [OAuth Provider Docs](https://www.better-auth.com/docs/authentication/oauth)
- [Database Schema](https://www.better-auth.com/docs/concepts/database)

## 🆘 **Emergency Commands**

### **Reset Everything**

```bash
# Reset database
cd apps/api && pnpm prisma migrate reset --force

# Clear node_modules
rm -rf node_modules apps/*/node_modules
pnpm install

# Restart dev servers
pnpm dev
```

### **Check Configuration**

```bash
# Verify environment variables
cd apps/web && node -e "console.log(process.env.BETTER_AUTH_SECRET ? 'SECRET: Set' : 'SECRET: Missing')"
cd apps/web && node -e "console.log(process.env.DATABASE_URL ? 'DB: Set' : 'DB: Missing')"

# Test database connection
cd apps/api && pnpm prisma db pull
```

---

**Last updated**: July 20, 2025
