# OAuth Provider Setup Instructions

## 🔧 Required OAuth Provider Configuration

### 1. GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App" or edit your existing app
3. Set the following values:

**Application name:** CodeCave
**Homepage URL:** `https://www.codecave.tech`
**Authorization callback URLs:**

```
http://localhost:3001/auth/github/callback
https://api.codecave.tech/auth/github/callback
```

4. Copy your Client ID and Client Secret to your .env file

### 2. Google OAuth App Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Set the following values:

**Authorized JavaScript origins:**

```
http://localhost:3000
https://www.codecave.tech
```

**Authorized redirect URIs:**

```
http://localhost:3001/auth/google/callback
https://api.codecave.tech/auth/google/callback
```

7. Copy your Client ID and Client Secret to your .env file

### 3. LinkedIn OAuth App Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app or edit existing app
3. In the "Auth" tab, set the following:

**Authorized Redirect URLs:**

```
http://localhost:3001/auth/linkedin/callback
https://api.codecave.tech/auth/linkedin/callback
```

**OAuth 2.0 scopes:** Request access to:

- `openid` (Sign In with LinkedIn using OpenID Connect)
- `profile` (Retrieve authenticated member's basic profile)
- `email` (Retrieve authenticated member's email address)

4. Copy your Client ID and Client Secret to your .env file

## 🚨 Important Notes

1. **LinkedIn API Changes**: LinkedIn deprecated the old `r_emailaddress` and `r_liteprofile` scopes. The new scopes are `openid`, `profile`, and `email`.

2. **Multiple Callback URLs**: You need both localhost (development) and production callback URLs in each OAuth provider.

3. **HTTPS Required**: Production callback URLs must use HTTPS.

4. **Domain Verification**: Make sure your domains are properly configured:
   - `www.codecave.tech` → Frontend
   - `api.codecave.tech` → Backend API

## 🧪 Testing

### Development Testing:

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`
- Callback: `http://localhost:3001/auth/{provider}/callback`

### Production Testing:

- Frontend: `https://www.codecave.tech`
- API: `https://api.codecave.tech`
- Callback: `https://api.codecave.tech/auth/{provider}/callback`

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**: The callback URL in your OAuth provider doesn't match the one being used
2. **"invalid_client"**: Client ID or Secret is incorrect
3. **"access_denied"**: User declined authorization or scope issues
4. **LinkedIn network error**: Usually indicates incorrect scopes or expired app credentials

### Debugging Steps:

1. Check server console logs for detailed error messages
2. Verify environment variables are loaded correctly
3. Test with different user accounts to isolate user-specific issues
4. Check OAuth provider's developer console for any restrictions or warnings
