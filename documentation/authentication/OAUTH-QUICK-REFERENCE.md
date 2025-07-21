# OAuth Authentication Quick Reference

## 🚀 **Quick Start Commands**

### **Development Setup**

```bash
# 1. Start Database (if using Docker)
docker-compose up -d postgres

# 2. Run Database Migration
cd apps/api && pnpm exec prisma migrate dev

# 3. Start Backend Server
cd apps/api && pnpm dev

# 4. Start Frontend Server (new terminal)
cd apps/web && pnpm dev
```

### **Database Operations**

```bash
# Reset database (development only)
cd apps/api && pnpm exec prisma migrate reset --force

# View database in browser
cd apps/api && pnpm exec prisma studio

# Generate Prisma client after schema changes
cd apps/api && pnpm exec prisma generate

# Create new migration
cd apps/api && pnpm exec prisma migrate dev --name your_migration_name
```

## 🔗 **Test URLs**

### **Local Development**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: http://localhost:5555

### **OAuth Test Flow**

1. Go to http://localhost:3000
2. Click any OAuth provider button
3. Complete OAuth with provider
4. Should redirect to http://localhost:3000/auth/callback
5. Check browser localStorage for tokens

## 🔑 **API Quick Tests**

### **Check Current User**

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:3001/auth/me
```

### **Refresh Tokens**

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}' \
     http://localhost:3001/auth/refresh
```

### **Logout**

```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:3001/auth/logout
```

## 📁 **File Structure Overview**

### **Backend (apps/api/)**

```
src/
├── auth/
│   ├── auth.controller.ts       # OAuth endpoints
│   ├── auth.service.ts          # Auth business logic
│   ├── auth.module.ts           # Auth module config
│   ├── guards/
│   │   └── jwt-auth.guard.ts    # Route protection
│   ├── strategies/
│   │   ├── jwt.strategy.ts      # JWT validation
│   │   ├── github.strategy.ts   # GitHub OAuth
│   │   ├── google.strategy.ts   # Google OAuth
│   │   └── google.strategy.ts    # Google OAuth
│   └── interfaces/
│       └── auth.interface.ts    # Type definitions
├── users/
│   ├── users.service.ts         # User management
│   ├── users.module.ts          # Users module
│   └── entities/
│       └── user.entity.ts       # User types
└── prisma/
    ├── prisma.service.ts        # Database service
    └── prisma.module.ts         # Database module
```

### **Frontend (apps/web/)**

```
src/
├── lib/
│   └── auth.ts                  # Auth utilities
├── components/landing/
│   └── oauth-buttons.tsx        # OAuth buttons
└── app/auth/callback/
    └── page.tsx                 # OAuth callback handler
```

## 🔧 **Environment Variables**

### **Required for Backend (.env)**

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codecave_dev

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# OAuth GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OAuth Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### **Required for Frontend (.env.local)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🛠️ **Common Issues & Solutions**

### **"Database not found"**

```bash
# Create database
cd apps/api && pnpm exec prisma migrate dev
```

### **"OAuth redirect mismatch"**

- Check OAuth app callback URLs match exactly:
  - GitHub: `http://localhost:3001/auth/github/callback`
  - Google: `http://localhost:3001/auth/google/callback`
  - LinkedIn: `http://localhost:3001/auth/linkedin/callback`

### **"JWT secret not defined"**

- Copy `.env.example` to `.env` and fill in values
- Ensure JWT_SECRET is set in backend environment

### **"CORS error"**

- Verify FRONTEND_URL is set correctly in backend
- Check both servers are running on correct ports

## 📊 **Database Schema Quick Reference**

### **User Table Fields**

```sql
id               UUID (Primary Key)
email            String (Unique)
name             String
avatar           String (Optional)
provider         Enum (GITHUB, GOOGLE, LINKEDIN)
providerId       String (OAuth provider ID)
githubUsername   String (Optional)
linkedinProfile  String (Optional)
isActive         Boolean (Default: true)
createdAt        DateTime
updatedAt        DateTime
```

### **Useful Queries**

```sql
-- List all users
SELECT email, name, provider, "createdAt" FROM users;

-- Count by provider
SELECT provider, COUNT(*) FROM users GROUP BY provider;

-- Recent signups
SELECT * FROM users ORDER BY "createdAt" DESC LIMIT 10;
```

## 🎯 **Next Steps After Testing**

1. **Create Protected Routes**: Implement auth middleware for frontend
2. **User Dashboard**: Build user profile and settings pages
3. **Project Integration**: Connect users to their projects
4. **Social Features**: Implement following, likes, comments
5. **Production Setup**: Configure Doppler and deploy

## 📞 **Need Help?**

- Check the main documentation: `OAUTH-AUTHENTICATION-IMPLEMENTATION.md`
- Verify environment variables are set correctly
- Ensure both servers are running
- Check browser console and network tab for errors
- Review server logs for OAuth callback issues
