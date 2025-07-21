import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development-only",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      website: {
        type: "string",
        required: false,
      },
      location: {
        type: "string",
        required: false,
      },
      company: {
        type: "string",
        required: false,
      },
      githubUsername: {
        type: "string",
        required: false,
      },
      linkedinProfile: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      isPro: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending logic
      console.log(`Send verification email to ${user.email}: ${url}`);
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: "codecave_session",
      },
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.BACKEND_URL || "http://localhost:3001",
  ],
});
