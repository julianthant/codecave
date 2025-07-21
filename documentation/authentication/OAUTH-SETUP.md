# OAuth Provider Setup Guide

This document provides a comprehensive guide on setting up OAuth providers for the application.

## Supported OAuth Providers

The application currently supports the following OAuth providers:

- GitHub
- Google

## Provider Setup Instructions

### GitHub OAuth Setup

1. **Create a GitHub OAuth App**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the application details:
     - **Application Name**: CodeCave
     - **Homepage URL**: `https://your-domain.com` (or `http://localhost:3000` for development)
     - **Application Description**: Developer community platform
     - **Authorization Callback URL**: `https://your-domain.com/api/auth/callback/github` (or `http://localhost:3000/api/auth/callback/github` for development)

2. **Get Client Credentials**:
   - After creating the app, you'll get a **Client ID**
   - Generate a new **Client Secret**
   - Store these securely in your environment variables or Doppler

3. **Configure Environment Variables**:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Google OAuth Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"

2. **Configure OAuth Consent Screen**:
   - Set "User Type" to "External" (or "Internal" for testing)
   - Fill in the application details:
     - **App name**: CodeCave
     - **User support email**: your-email@example.com
     - **Developer contact information**: your-email@example.com
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed

3. **Create OAuth Client ID**:
   - Go to "Credentials" tab
   - Click "Create Credentials" > "OAuth Client ID"
   - Select "Web application" as the application type
   - Add authorized JavaScript origins:
     - `https://your-domain.com` (or `http://localhost:3000` for development)
   - Add authorized redirect URIs:
     - `https://your-domain.com/api/auth/callback/google` (or `http://localhost:3000/api/auth/callback/google` for development)
   - Click "Create"

4. **Get Client Credentials**:
   - After creating the client, you'll get a **Client ID** and **Client Secret**
   - Store these securely in your environment variables or Doppler

5. **Configure Environment Variables**:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## Production OAuth Configuration

For production environments, follow these additional steps:

1. **Use Verified Domains**:
   - Ensure your callback URLs use a verified domain
   - Update all OAuth provider configurations with production URLs

2. **Secure Credential Storage**:
   - Store all OAuth credentials in Doppler
   - Never commit credentials to the repository
   - Use appropriate access controls for credential management

3. **Doppler Configuration**:
   ```
   doppler secrets set GITHUB_CLIENT_ID=your_production_github_client_id
   doppler secrets set GITHUB_CLIENT_SECRET=your_production_github_client_secret
   doppler secrets set GOOGLE_CLIENT_ID=your_production_google_client_id
   doppler secrets set GOOGLE_CLIENT_SECRET=your_production_google_client_secret
   ```

4. **Verify OAuth Flow**:
   - Test the entire authentication flow in production
   - Check for proper error handling
   - Ensure session management works correctly

## Implementing OAuth on Frontend

1. **OAuth Button Component**:
   ```tsx
   import { signIn } from "../lib/auth-client";

   function OAuthButtons() {
     const handleOAuthClick = async (provider: "github" | "google") => {
       try {
         const data = await signIn.social({
           provider,
           callbackURL: `${window.location.origin}/auth/callback`,
         });
         
         if (data.error) {
           console.error("OAuth error:", data.error);
         }
       } catch (error) {
         console.error("Authentication error:", error);
       }
     };

     return (
       <div className="oauth-buttons">
         <button 
           onClick={() => handleOAuthClick("github")}
           className="github-button"
         >
           Continue with GitHub
         </button>
         
         <button 
           onClick={() => handleOAuthClick("google")}
           className="google-button"
         >
           Continue with Google
         </button>
       </div>
     );
   }
   ```

2. **Callback Handler**:
   ```tsx
   // app/auth/callback/page.tsx
   import { redirect } from 'next/navigation';
   import { auth } from '../../../lib/auth';
   
   export default async function AuthCallbackPage({
     searchParams,
   }: {
     searchParams: { [key: string]: string | string[] | undefined };
   }) {
     const authResult = await auth.handleCallback(searchParams);
     
     if (authResult?.error) {
       // Handle error
       return redirect('/auth/error');
     }
     
     // Successful authentication
     return redirect('/dashboard');
   }
   ```

## Troubleshooting

### Common Issues and Solutions

1. **"Invalid redirect_uri" error**:
   - Verify the callback URL in your OAuth provider exactly matches the one in your application
   - Check for typos, protocol mismatches (http vs https), or port differences

2. **"Client ID not found" error**:
   - Confirm the Client ID is correctly set in your environment variables
   - Restart the application after changing environment variables

3. **"Access denied" error**:
   - Check if the requested scopes are configured correctly in the OAuth provider
   - Verify the user has granted all required permissions

4. **Session not persisting**:
   - Check if cookies are being properly set (HTTP-only, secure flags)
   - Verify the session storage configuration

### Testing OAuth Flow

1. **Development Testing**:
   ```bash
   # Start the application
   npm run dev
   
   # Check logs for OAuth-related issues
   ```

2. **OAuth Debug Mode**:
   - Add `debug: true` to the OAuth configuration for detailed logs
   - Monitor network requests during the authentication flow

## Security Best Practices

1. **State Parameter**:
   - Always use the state parameter in OAuth requests to prevent CSRF attacks
   - Verify the state parameter in callbacks

2. **Limited Scopes**:
   - Request only the minimum scopes required for your application

3. **Token Storage**:
   - Never store access tokens in local storage or session storage
   - Use secure, HTTP-only cookies

4. **Regular Audits**:
   - Regularly review OAuth integrations and permissions
   - Update provider configurations when application URLs change

---

**Last Updated**: July 30, 2025 