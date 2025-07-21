import { createAuthClient } from "better-auth/react";

// Determine the base URL based on environment
const getBaseURL = () => {
  // For production, use the API domain
  if (typeof window !== 'undefined') {
    // Client-side: use API URL with proper domain
    const apiDomain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${apiDomain}/api/auth`;
  } else {
    // Server-side rendering
    return process.env.NODE_ENV === "production" 
      ? "https://api.codecave.tech/api/auth" 
      : "http://localhost:3001/api/auth";
  }
};

// Create the authentication client with correct API URL
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: "include", // Include cookies for session management
  },
});

// Export authentication methods for use in components
export const { signIn, signOut, signUp, useSession } = authClient;

// Export auth for route handler
export const auth = authClient;
