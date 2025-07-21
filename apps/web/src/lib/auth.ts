import { betterAuth } from "better-auth";
import { Pool } from "pg";

/**
 * Creates database configuration for Better Auth
 * Extracted from main config to reduce complexity
 */
function createDatabaseConfig() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

/**
 * Creates social providers configuration
 * Extracted to separate OAuth provider concerns
 */
function createSocialProvidersConfig() {
  return {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  };
}

/**
 * Creates user additional fields configuration
 * Extracted to separate user schema concerns
 */
function createUserFieldsConfig() {
  return {
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
  } as const;
}

/**
 * Creates email verification configuration
 * Extracted to separate email concerns
 */
function createEmailVerificationConfig() {
  return {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string };
      url: string;
    }) => {
      // TODO: Implement email sending logic
      console.log(`Send verification email to ${user.email}: ${url}`);
    },
  };
}

/**
 * Creates security and advanced configuration
 * Extracted to separate security concerns
 */
function createSecurityConfig() {
  return {
    secret:
      process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development-only",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
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
  };
}

export const auth = betterAuth({
  database: createDatabaseConfig(),
  socialProviders: createSocialProvidersConfig(),
  user: {
    additionalFields: createUserFieldsConfig(),
  },
  emailVerification: createEmailVerificationConfig(),
  ...createSecurityConfig(),
});
