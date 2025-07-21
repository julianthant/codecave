import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://codecave.tech",
    "https://www.codecave.tech",
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
