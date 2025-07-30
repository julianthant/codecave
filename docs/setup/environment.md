# Environment Setup

This guide covers setting up environment variables and configuration for CodeCave.

## Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## Environment Variables Explained

### Supabase Variables

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Your Supabase project URL
   - Found in: Supabase Dashboard → Settings → API
   - Format: `https://your-project-id.supabase.co`

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Public anonymous key for client-side operations
   - Found in: Supabase Dashboard → Settings → API
   - Safe to expose in browser

3. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Server-side key with elevated permissions
   - Found in: Supabase Dashboard → Settings → API
   - ⚠️ **Keep secret** - never expose in client code

### Site Configuration

1. **`NEXT_PUBLIC_SITE_URL`**
   - Your site's base URL
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
   - Used for OAuth redirects

2. **`NODE_ENV`**
   - Environment mode
   - Values: `development`, `production`, `test`
   - Automatically set by Next.js

## Getting Supabase Credentials

1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Click "New Project"
   # Choose organization and fill details
   ```

2. **Get API Keys**
   - Go to Project Settings → API
   - Copy URL and anon key
   - Copy service role key (for server operations)

3. **Configure Authentication**
   - Go to Authentication → Settings
   - Configure OAuth providers
   - Set Site URL to your domain

## OAuth Provider Setup

### Google OAuth

1. **Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API

2. **Create OAuth Credentials**
   - Go to Credentials → Create Credentials → OAuth 2.0
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```

3. **Configure in Supabase**
   - Authentication → Providers → Google
   - Enable Google provider
   - Add Client ID and Client Secret

### GitHub OAuth

1. **GitHub Developer Settings**
   - Go to Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"

2. **Application Settings**
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback`

3. **Configure in Supabase**
   - Authentication → Providers → GitHub
   - Enable GitHub provider
   - Add Client ID and Client Secret

### Discord OAuth

1. **Discord Developer Portal**
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application

2. **OAuth2 Settings**
   - Go to OAuth2 → General
   - Add redirect: `http://localhost:3000/auth/callback`

3. **Configure in Supabase**
   - Authentication → Providers → Discord
   - Enable Discord provider
   - Add Client ID and Client Secret

## Environment-Specific Configuration

### Development
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Production
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### Testing
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=test
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different projects** for development/production
3. **Rotate keys regularly** in production
4. **Limit service role key usage** to server-side only
5. **Use HTTPS in production** for all URLs

## Troubleshooting

### Common Issues

1. **OAuth redirect mismatch**
   - Ensure callback URLs match exactly
   - Check for trailing slashes
   - Verify HTTP vs HTTPS

2. **Invalid Supabase URL**
   - Check project URL format
   - Ensure project is active
   - Verify region if applicable

3. **Anon key not working**
   - Check key hasn't been rotated
   - Verify RLS policies allow access
   - Ensure key is public-safe

### Environment Loading Issues

```bash
# Check if environment variables are loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

## Next Steps

- [Database Setup](./database.md) - Configure Supabase database
- [OAuth Setup](../auth/oauth-setup.md) - Detailed OAuth configuration