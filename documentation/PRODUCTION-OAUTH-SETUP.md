# Production Environment Variables Configuration

## 🚀 **Production OAuth Environment Variables**

### **Required Production Environment Variables**

```bash
# Frontend URL (your deployed frontend)
FRONTEND_URL=https://codecave.tech

# OAuth Callback URLs (your deployed API)
GITHUB_CALLBACK_URL=https://api.codecave.tech/auth/github/callback
GOOGLE_CALLBACK_URL=https://api.codecave.tech/auth/google/callback
LINKEDIN_CALLBACK_URL=https://api.codecave.tech/auth/linkedin/callback

# Database (production)
DATABASE_URL=your_production_database_url

# JWT Secrets (use strong, unique values for production)
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret

# OAuth Credentials (production apps)
GITHUB_CLIENT_ID=your_production_github_client_id
GITHUB_CLIENT_SECRET=your_production_github_client_secret

GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

LINKEDIN_CLIENT_ID=your_production_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_production_linkedin_client_secret

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## 🔧 **Platform-Specific Setup**

### **For Vercel Deployment**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable above
4. Set the **Environment** to "Production"
5. Redeploy your application

### **For Railway Deployment**

1. Go to your Railway project dashboard
2. Click on your service
3. Navigate to **Variables** tab
4. Add each environment variable above
5. Railway will automatically redeploy

### **For Doppler (Recommended)**

1. Create production environment in Doppler
2. Set all variables above
3. Connect Doppler to your deployment platform
4. Variables will sync automatically

## 🔗 **OAuth Provider Configuration**

### **GitHub OAuth App**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://api.codecave.tech/auth/github/callback
   ```

### **Google OAuth App**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://api.codecave.tech/auth/google/callback
   ```

### **LinkedIn OAuth App**

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click on your app
3. Navigate to **Auth** tab
4. Add to **Authorized redirect URLs**:
   ```
   https://api.codecave.tech/auth/linkedin/callback
   ```

## 🚨 **Important Security Notes**

1. **Never commit production secrets** to version control
2. **Use different OAuth apps** for development and production
3. **Generate strong, unique JWT secrets** for production
4. **Enable HTTPS only** for production OAuth apps
5. **Regularly rotate secrets** in production

## 🧪 **Testing Production OAuth**

### **Verification Checklist**

- [ ] Frontend redirects to `https://api.codecave.tech/auth/github`
- [ ] GitHub redirects back to `https://api.codecave.tech/auth/github/callback`
- [ ] API redirects user to `https://codecave.tech/auth/callback`
- [ ] User sees success page on frontend
- [ ] JWT tokens are properly set in browser

### **Debug Commands**

```bash
# Check environment variables in deployment
echo $FRONTEND_URL
echo $GITHUB_CALLBACK_URL

# Test OAuth redirect manually
curl -I https://api.codecave.tech/auth/github
```

## 🔄 **Environment Variable Comparison**

| Variable              | Development                                    | Production                                         |
| --------------------- | ---------------------------------------------- | -------------------------------------------------- |
| FRONTEND_URL          | `http://localhost:3000`                        | `https://codecave.tech`                            |
| GITHUB_CALLBACK_URL   | `http://localhost:3001/auth/github/callback`   | `https://api.codecave.tech/auth/github/callback`   |
| GOOGLE_CALLBACK_URL   | `http://localhost:3001/auth/google/callback`   | `https://api.codecave.tech/auth/google/callback`   |
| LINKEDIN_CALLBACK_URL | `http://localhost:3001/auth/linkedin/callback` | `https://api.codecave.tech/auth/linkedin/callback` |

## 📝 **Quick Fix Steps**

1. **Update environment variables** in your deployment platform
2. **Update OAuth provider callback URLs** in their respective consoles
3. **Redeploy your application**
4. **Test OAuth flow** with production URLs

The issue you're experiencing is because your production environment still has `FRONTEND_URL=http://localhost:3000` instead of `https://codecave.tech`.
