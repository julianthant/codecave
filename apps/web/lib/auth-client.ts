import { createAuthClient } from "better-auth/react";

// Determine the base URL based on environment
const getBaseURL = () => {
  // For production, use the API domain
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://api.codecave.tech"
    );
  }

  // For development, use localhost
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "https://codecave.tech",
    "https://www.codecave.tech",
    "https://api.codecave.tech",
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
