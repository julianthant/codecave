# Production Supabase Migration Checklist

## 🚀 Production Readiness Status

### ✅ **COMPLETED**

- [x] **API Code**: Fully migrated to Supabase authentication
- [x] **Frontend Code**: Updated OAuth buttons and callback handling
- [x] **Docker Configuration**: Updated `docker-compose.prod.yml`
- [x] **Environment Documentation**: Updated `env.example`
- [x] **Database Schema**: Compatible with Supabase PostgreSQL
- [x] **Prisma Migrations**: Ready for Supabase database

### 🔄 **PENDING MANUAL STEPS**

#### 1. **Environment Variables Update (CRITICAL)**

Update your production environment (Doppler/server) with Supabase values:

```env
# Remove old OAuth variables
# GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, etc.

# Add Supabase variables
SUPABASE_URL=https://romnddskrzjxwgvioxfa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=[GET_FROM_SUPABASE_DASHBOARD]

# Update DATABASE_URL to Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.romnddskrzjxwgvioxfa.supabase.co:5432/postgres
```

#### 2. **Supabase OAuth Configuration**

In Supabase Dashboard → Authentication → Providers:

- ✅ **Enable providers**: GitHub, Google, LinkedIn
- ✅ **Set production URLs**:
  - Site URL: `https://www.codecave.tech`
  - Redirect URLs: `https://www.codecave.tech/auth/callback`
  - Additional redirect: `https://codecave.tech/auth/callback`

#### 3. **Database Migration**

```bash
# Apply Prisma migrations to Supabase database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

#### 4. **Frontend Production Deploy**

Update frontend environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://romnddskrzjxwgvioxfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://api.codecave.tech
```

## 🐳 **Docker Production Deployment**

### **Updated docker-compose.prod.yml**

✅ **Ready to deploy** with Supabase configuration:

```bash
# Deploy with updated configuration
cd /path/to/codecave
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f api
```

### **Docker Benefits for Supabase**

- ✅ **Reduced complexity**: No individual OAuth containers needed
- ✅ **Faster startup**: Fewer environment variables to validate
- ✅ **Better scaling**: Stateless authentication via Supabase
- ✅ **Cost savings**: ~$15/month saved from removing DO PostgreSQL

## 🔧 **Environment Variables by Service**

### **Production API Container**

```env
NODE_ENV=production
PORT=3001

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.romnddskrzjxwgvioxfa.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://romnddskrzjxwgvioxfa.supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
SUPABASE_JWT_SECRET=[JWT_SECRET]

# App JWT
JWT_SECRET=[YOUR_APP_JWT_SECRET]
JWT_REFRESH_SECRET=[YOUR_REFRESH_SECRET]
JWT_EXPIRES_IN=24h

# Services
MEILI_HOST=http://search:7700
RABBITMQ_URL=amqp://admin:password@mq:5672/codecave
REDIS_URL=redis://:password@redis:6379

# CORS
FRONTEND_URL=https://www.codecave.tech
```

### **Frontend (Vercel) Environment**

```env
NEXT_PUBLIC_API_URL=https://api.codecave.tech
NEXT_PUBLIC_SUPABASE_URL=https://romnddskrzjxwgvioxfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
```

## 🧪 **Testing Production Setup**

### **Local Production Test**

```bash
# Test with production Docker config locally
cp .env.example .env.prod
# Fill in production values in .env.prod

# Start with production config
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Test API health
curl -f http://localhost:3001/health

# Test Supabase connection
curl -X POST http://localhost:3001/auth/supabase/callback \
  -H "Content-Type: application/json" \
  -d '{"access_token":"test"}'
```

### **Production Smoke Tests**

1. **OAuth Flow**: Test GitHub/Google/LinkedIn login
2. **User Creation**: Verify users are created in Supabase
3. **API Authentication**: Test protected endpoints
4. **Database Operations**: Verify CRUD operations work

## 📋 **Deployment Sequence**

1. **Update Supabase OAuth settings** (production URLs)
2. **Deploy database migrations** to Supabase
3. **Update environment variables** in Doppler/production
4. **Deploy API** with new Docker config
5. **Deploy frontend** with Supabase environment variables
6. **Test OAuth flows** end-to-end
7. **Remove old OAuth configurations** from Terraform

## 🎯 **Success Metrics**

- ✅ OAuth login works for all providers
- ✅ Users created in Supabase database
- ✅ API responds with valid JWT tokens
- ✅ Frontend stores and uses tokens correctly
- ✅ Database operations work normally
- ✅ Cost reduced by ~$15/month

## 🚨 **Rollback Plan**

If issues arise:

1. Revert `DATABASE_URL` to Digital Ocean PostgreSQL
2. Re-enable old OAuth environment variables
3. Deploy previous API version
4. Restore old frontend OAuth implementation

The production setup is **ready for deployment** once environment variables are updated! 🚀
