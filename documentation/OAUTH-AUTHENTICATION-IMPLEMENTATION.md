# OAuth Authentication Implementation Guide

## 🎯 **Overview**

This document outlines the comprehensive OAuth authentication system implemented for CodeCave.tech, supporting GitHub, Google, and LinkedIn authentication providers using NestJS backend with Prisma ORM and Next.js frontend.

## 📋 **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Backend Implementation](#backend-implementation)
3. [Database Schema](#database-schema)
4. [Frontend Implementation](#frontend-implementation)
5. [Environment Configuration](#environment-configuration)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [Testing & Verification](#testing--verification)
9. [Production Considerations](#production-considerations)

## 🏗️ **Architecture Overview**

### **Technology Stack**

- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with refresh token support
- **OAuth Providers**: GitHub, Google, LinkedIn
- **Frontend**: Next.js 15 with TypeScript
- **State Management**: Custom auth service with localStorage

### **Authentication Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant O as OAuth Provider

    U->>F: Click OAuth Button
    F->>B: Redirect to /auth/{provider}
    B->>O: OAuth Authorization Request
    O->>U: Login Form
    U->>O: Credentials
    O->>B: Authorization Code
    B->>O: Exchange for Access Token
    O->>B: User Profile Data
    B->>B: Create/Update User
    B->>F: Redirect with JWT Tokens
    F->>F: Store Tokens
    F->>U: Redirect to Dashboard
```

## 🔧 **Backend Implementation**

### **New Files Created**

#### **1. Database & ORM Setup**

- `apps/api/prisma/schema.prisma` - Complete database schema
- `apps/api/src/prisma/prisma.service.ts` - Prisma service for database connections
- `apps/api/src/prisma/prisma.module.ts` - Global Prisma module

#### **2. User Management**

- `apps/api/src/users/entities/user.entity.ts` - User type definitions with Prisma integration
- `apps/api/src/users/users.service.ts` - User CRUD operations
- `apps/api/src/users/users.module.ts` - Users module configuration

#### **3. Authentication Core**

- `apps/api/src/auth/interfaces/auth.interface.ts` - Authentication type definitions
- `apps/api/src/auth/auth.service.ts` - Core authentication logic
- `apps/api/src/auth/auth.controller.ts` - OAuth endpoints and token management
- `apps/api/src/auth/auth.module.ts` - Authentication module configuration

#### **4. Authentication Strategies**

- `apps/api/src/auth/strategies/jwt.strategy.ts` - JWT token validation
- `apps/api/src/auth/strategies/github.strategy.ts` - GitHub OAuth strategy
- `apps/api/src/auth/strategies/google.strategy.ts` - Google OAuth strategy
- `apps/api/src/auth/strategies/linkedin.strategy.ts` - LinkedIn OAuth strategy

#### **5. Guards & Security**

- `apps/api/src/auth/guards/jwt-auth.guard.ts` - JWT authentication guard

### **Key Features Implemented**

#### **🔐 JWT Authentication**

- Access tokens (24h expiry)
- Refresh tokens (7d expiry)
- Automatic token refresh mechanism
- Secure token validation

#### **👤 User Profile Management**

- OAuth profile data extraction
- Account linking prevention
- User data updates on login
- Comprehensive user fields

#### **🛡️ Security Features**

- Password-less authentication
- Provider-based user identification
- Secure token generation
- CORS configuration

## 💾 **Database Schema**

### **User Model**

```sql
model User {
  id               String      @id @default(uuid())
  email            String      @unique
  name             String
  avatar           String?
  bio              String?
  website          String?
  location         String?
  company          String?
  skills           String[]    @default([])
  provider         AuthProvider
  providerId       String
  githubUsername   String?
  linkedinProfile  String?
  projectsCount    Int         @default(0)
  followersCount   Int         @default(0)
  followingCount   Int         @default(0)
  isActive         Boolean     @default(true)
  isPro            Boolean     @default(false)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}
```

### **Future-Ready Models**

- **Project**: For user projects and code sharing
- **Comment**: For project discussions
- **Like**: For project engagement
- **Follow**: For user following system

### **Migration Commands**

```bash
# Reset database (development only)
pnpm exec prisma migrate reset --force

# Create new migration
pnpm exec prisma migrate dev --name init

# Generate Prisma client
pnpm exec prisma generate
```

## 🎨 **Frontend Implementation**

### **New Files Created**

#### **1. Authentication Utilities**

- `apps/web/src/lib/auth.ts` - Authentication service class
- `apps/web/.env.local` - Frontend environment variables

#### **2. OAuth Integration**

- `apps/web/src/components/landing/oauth-buttons.tsx` - Functional OAuth buttons
- `apps/web/src/app/auth/callback/page.tsx` - OAuth callback handler

### **Key Features**

#### **🔄 OAuth Buttons**

- GitHub, Google, LinkedIn providers
- Automatic API URL detection
- Responsive design with hover effects
- Server-side redirect to OAuth endpoints

#### **🎫 Token Management**

- localStorage token storage
- Automatic token refresh
- Secure token validation
- Clean logout functionality

#### **📱 Auth Service**

```typescript
class AuthService {
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<boolean>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}
```

## ⚙️ **Environment Configuration**

### **Required Environment Variables**

#### **Backend (.env)**

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:3001/auth/linkedin/callback
```

#### **Frontend (.env.local)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **Production with Doppler**

For production, all environment variables are managed through Doppler as specified in your requirements. The system is designed to work seamlessly with Doppler's secret management.

## 🔗 **API Endpoints**

### **Authentication Endpoints**

#### **OAuth Initiation**

```
GET /auth/github     - Start GitHub OAuth flow
GET /auth/google     - Start Google OAuth flow
GET /auth/linkedin   - Start LinkedIn OAuth flow
```

#### **OAuth Callbacks**

```
GET /auth/github/callback     - GitHub OAuth callback
GET /auth/google/callback     - Google OAuth callback
GET /auth/linkedin/callback   - LinkedIn OAuth callback
```

#### **Token Management**

```
POST /auth/refresh   - Refresh JWT tokens
GET /auth/me         - Get current user profile
POST /auth/logout    - Logout current user
```

### **Request/Response Examples**

#### **Token Refresh**

```typescript
// Request
POST /auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Current User**

```typescript
// Request
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://github.com/avatar.jpg",
  "provider": "GITHUB",
  "githubUsername": "johndoe",
  // ... other user fields
}
```

## 🔄 **Authentication Flow**

### **Step-by-Step Process**

#### **1. User Initiates OAuth**

```typescript
// Frontend - OAuth button click
function handleOAuthClick(providerName: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  window.location.href = `${baseUrl}/auth/${providerName.toLowerCase()}`;
}
```

#### **2. Backend OAuth Strategy**

```typescript
// Backend - OAuth validation
async validate(accessToken, refreshToken, profile, done) {
  const oauthProfile = {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName,
    // ... extract profile data
  };

  const user = await this.authService.validateOAuthUser(oauthProfile, provider);
  done(null, user);
}
```

#### **3. User Creation/Update**

```typescript
// Backend - User management
async validateOAuthUser(profile: OAuthProfile, provider: AuthProvider) {
  let user = await this.usersService.findByProviderAndId(provider, profile.id);

  if (!user) {
    user = await this.usersService.createUser(profile, provider);
  } else {
    user = await this.usersService.updateUser(user.id, profileUpdates);
  }

  await this.usersService.updateLastLogin(user.id);
  return user;
}
```

#### **4. Token Generation**

```typescript
// Backend - JWT token creation
async generateAuthTokens(user: User) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
  };

  const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
  const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

  return { accessToken, refreshToken, user };
}
```

#### **5. Frontend Token Storage**

```typescript
// Frontend - Token management
localStorage.setItem("accessToken", token);
localStorage.setItem("refreshToken", refresh);
window.location.href = "/home";
```

## 🧪 **Testing & Verification**

### **Manual Testing Steps**

#### **1. Start Development Servers**

```bash
# Backend
cd apps/api && pnpm dev

# Frontend
cd apps/web && pnpm dev
```

#### **2. Test OAuth Flow**

1. Navigate to `http://localhost:3000`
2. Click on any OAuth provider button
3. Complete OAuth flow with provider
4. Verify redirect to `/auth/callback`
5. Confirm token storage in localStorage
6. Test `/auth/me` endpoint with stored token

#### **3. Test Token Refresh**

1. Wait for token expiry or manually expire
2. Make authenticated request
3. Verify automatic token refresh
4. Confirm continued session

#### **4. Test Logout**

1. Call logout endpoint
2. Verify token removal from localStorage
3. Confirm session termination

### **Database Verification**

```sql
-- Check user creation
SELECT * FROM users ORDER BY "createdAt" DESC LIMIT 5;

-- Verify OAuth provider data
SELECT email, name, provider, "githubUsername", "createdAt" FROM users;

-- Check user activity
SELECT COUNT(*) as total_users, provider FROM users GROUP BY provider;
```

### **API Testing with curl**

```bash
# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/auth/me

# Test token refresh
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}' \
     http://localhost:3001/auth/refresh
```

## 🚀 **Production Considerations**

### **Security Hardening**

#### **Environment Variables**

- Use Doppler for production secret management
- Rotate OAuth client secrets regularly
- Use strong JWT secrets (256-bit minimum)
- Enable HTTPS for all OAuth callbacks

#### **Database Security**

- Enable SSL connections in production
- Use connection pooling (PgBouncer)
- Regular database backups
- Monitor for suspicious activity

#### **Token Security**

- Implement token blacklisting for logout
- Monitor for token theft/abuse
- Use secure cookies for sensitive data
- Implement rate limiting on auth endpoints

### **Performance Optimizations**

#### **Database**

- Index frequently queried fields (email, providerId)
- Use database connection pooling
- Implement query optimization
- Monitor slow queries

#### **Caching**

- Cache user profiles in Redis
- Implement session storage optimization
- Use CDN for static OAuth assets

### **Monitoring & Logging**

#### **Authentication Events**

- Log all login attempts
- Monitor failed authentication
- Track token refresh patterns
- Alert on suspicious activity

#### **Performance Metrics**

- OAuth flow completion rates
- Token refresh frequency
- Database query performance
- API response times

## 📚 **Additional Resources**

### **OAuth Provider Documentation**

- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth 2.0](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)

### **Framework Documentation**

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Next.js App Router](https://nextjs.org/docs/app)

### **Security Best Practices**

- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🔧 **Troubleshooting**

### **Common Issues**

#### **OAuth Redirect Mismatch**

```
Error: redirect_uri_mismatch
Solution: Ensure callback URLs match exactly in OAuth app settings
```

#### **Database Connection**

```
Error: Can't reach database server
Solution: Check PostgreSQL is running and DATABASE_URL is correct
```

#### **Token Validation Failed**

```
Error: JsonWebTokenError: invalid signature
Solution: Verify JWT_SECRET matches between token generation and validation
```

#### **CORS Issues**

```
Error: Access-Control-Allow-Origin
Solution: Configure CORS in NestJS for frontend domain
```

### **Debug Commands**

```bash
# Check database connection
cd apps/api && pnpm exec prisma db push

# Verify environment variables
cd apps/api && node -e "console.log(process.env.GITHUB_CLIENT_ID)"

# Test API endpoints
curl http://localhost:3001/auth/github

# Check Prisma schema
cd apps/api && pnpm exec prisma studio
```

---

## ✅ **Implementation Complete**

The OAuth authentication system is now fully implemented with:

- ✅ **Backend**: NestJS with Prisma ORM
- ✅ **Database**: PostgreSQL with complete schema
- ✅ **OAuth**: GitHub, Google, LinkedIn providers
- ✅ **Security**: JWT tokens with refresh mechanism
- ✅ **Frontend**: Next.js integration with auth service
- ✅ **Environment**: Development and production configurations
- ✅ **Documentation**: Comprehensive implementation guide

The system is ready for testing and production deployment following the security and performance guidelines outlined above.
