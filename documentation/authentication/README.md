# Authentication Documentation

This directory contains comprehensive authentication system documentation for CodeCave.

## 📚 **Contents**

- [**Authentication System Guide**](AUTHENTICATION-GUIDE.md) - **Complete authentication implementation**
  - Better Auth configuration and setup
  - OAuth integration (GitHub, Google)
  - Global authentication strategy
  - Session management
  - Frontend and backend implementation
  - Security features and best practices
  - Complete API documentation
  - Troubleshooting and testing

## 🔐 **Authentication System Overview**

CodeCave uses **Better Auth** with OAuth providers for a secure, modern authentication system that was migrated from Supabase Auth on July 20, 2025.

### **Key Features**

- ✅ **OAuth-only Authentication**: GitHub and Google OAuth providers
- ✅ **Global Authentication Guard**: All routes protected by default with `@Public()` opt-out
- ✅ **Session-based Security**: HTTP-only cookies with CSRF protection
- ✅ **Better Auth Integration**: Hybrid NestJS implementation
- ✅ **Custom User Fields**: Extended user model with CodeCave-specific fields
- ✅ **Database Integration**: PostgreSQL with Prisma ORM
- ✅ **Frontend Integration**: Better Auth React client

### **System Architecture**

```
Authentication Flow:
├── Frontend (Next.js)
│   ├── Better Auth React Client
│   ├── OAuth Buttons Component
│   └── Session Management
├── Backend (NestJS)
│   ├── Global Auth Guard
│   ├── Better Auth Server
│   ├── OAuth Route Handler
│   └── User Management Service
└── Database (PostgreSQL)
    ├── User Table (Better Auth + Extensions)
    ├── Session Table
    ├── Account Table (OAuth)
    └── Verification Table
```

## 🚀 **Quick Start**

### **For Developers**

1. **Read the complete guide**: [Authentication System Guide](AUTHENTICATION-GUIDE.md)
2. **Set up OAuth apps**: Configure GitHub and Google OAuth applications
3. **Configure environment**: Set up OAuth credentials in Doppler or `.env`
4. **Test authentication**: Use the development endpoints to verify setup

### **Key Implementation Points**

- **All routes are protected by default** - Use `@Public()` decorator for public routes
- **OAuth-only authentication** - No email/password authentication
- **Session-based** - Uses HTTP-only cookies for security
- **Database-driven** - Complete user management with Prisma

## 🛠️ **Common Authentication Tasks**

### **Testing Authentication**

```bash
# Test public endpoints
curl http://localhost:3001/health
curl http://localhost:3001/sentry-test

# Test auth session endpoint
curl http://localhost:3001/api/auth/session

# Test protected endpoint (will return 401 without auth)
curl http://localhost:3001/users/profile
```

### **OAuth Development Setup**

#### **GitHub OAuth App**

- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3001/api/auth/callback/github`

#### **Google OAuth App**

- Authorized origins: `http://localhost:3000`
- Callback URL: `http://localhost:3001/api/auth/callback/google`

### **Environment Configuration**

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-32-character-secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth Credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev
```

## 🔧 **Authentication Components**

### **Backend Components**

- **Global Auth Guard**: `@UseGuards(AuthGuard)` applied globally
- **Auth Controller**: Handles all `/api/auth/*` routes
- **Users Service**: User CRUD operations and management
- **Better Auth Config**: OAuth providers and database adapter setup

### **Frontend Components**

- **OAuth Buttons**: `oauth-buttons.tsx` - GitHub and Google login buttons
- **Auth Client**: `auth-client.ts` - Better Auth React client setup
- **Session Hook**: `useSession()` - React hook for session management
- **Protected Routes**: Authentication checking in page components

### **Database Schema**

- **User Table**: Extended Better Auth user model with CodeCave fields
- **Session Table**: Active user sessions with device tracking
- **Account Table**: OAuth provider account linkage
- **Verification Table**: Email verification and password reset tokens

## 🔐 **Security Features**

### **Built-in Security**

- **HTTP-only Cookies**: Session tokens not accessible via JavaScript
- **CSRF Protection**: Built into Better Auth framework
- **SQL Injection Prevention**: Prisma parameterized queries
- **Global Authentication**: All routes protected unless explicitly public
- **OAuth 2.0 Compliance**: Proper state parameter and security handling

### **Implementation Security**

- **Non-root Container Users**: Production containers run as non-root
- **Environment Variables**: Secrets managed via Doppler
- **Secure Origins**: CORS configured for trusted domains only
- **Token Rotation**: Automatic session token rotation

## 📊 **Authentication Endpoints**

### **Automatic Better Auth Endpoints**

- `POST /api/auth/sign-in/social` - Initiate OAuth flow
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Sign out user

### **Protected Application Endpoints**

- `GET /users/profile` - Current user profile (requires authentication)

### **Public Application Endpoints**

- `GET /` - Hello world (marked with `@Public()`)
- `GET /health` - Health check (marked with `@Public()`)

## 🚨 **Common Issues & Solutions**

### **OAuth Callback Errors**

**Issue**: 404 on OAuth callbacks

```bash
# Check OAuth app configuration
# Ensure callback URLs match exactly:
# Development: http://localhost:3001/api/auth/callback/github
# Production: https://api.codecave.tech/api/auth/callback/github
```

### **Session Not Persisting**

**Issue**: User gets logged out on page refresh

```bash
# Check browser cookies
# Look for 'better-auth.session_token' cookie
# Verify CORS configuration includes credentials: true
```

### **Authentication Errors**

**Issue**: All routes returning 401

```bash
# Check if global auth guard is working
# Verify @Public() decorator on public routes
# Check Better Auth configuration and environment variables
```

## 📈 **Migration History**

### **Better Auth Migration (July 20, 2025)**

The system was migrated from Supabase Auth to Better Auth with the following improvements:

- **Enhanced NestJS Integration**: Better TypeScript support and decorators
- **Improved Security**: Global authentication guard with opt-out model
- **Flexible User Management**: Custom user fields and extended functionality
- **Better Session Management**: More control over session lifecycle
- **OAuth-only Authentication**: Simplified auth flow focused on OAuth providers

## 🔗 **Related Documentation**

- [Local Development Guide](../development/LOCAL-DEVELOPMENT-GUIDE.md) - Setting up authentication in development
- [Backend Implementation Guide](../backend/BACKEND-IMPLEMENTATION-GUIDE.md) - Complete backend auth implementation
- [Environment & Third-Party Setup](../infrastructure/DOPPLER-AND-THIRD-PARTY-SETUP.md) - OAuth provider setup

## 🤝 **Contributing to Authentication**

When making authentication changes:

1. **Test thoroughly** with both OAuth providers
2. **Verify security** - ensure no authentication bypasses
3. **Update documentation** for any new auth features
4. **Test in production environment** before deploying
5. **Monitor Sentry** for authentication errors

### **Authentication Standards**

- **All new routes protected by default** - Use `@Public()` only when necessary
- **Use TypeScript types** for all auth-related data
- **Implement proper error handling** for OAuth failures
- **Log authentication events** for security monitoring
- **Follow OAuth 2.0 best practices** for provider integration

---

**💡 Pro Tip**: The [Authentication System Guide](AUTHENTICATION-GUIDE.md) contains everything you need to understand and work with CodeCave's authentication system. It's designed to be a complete reference from setup to production.

**Last Updated**: January 2025
