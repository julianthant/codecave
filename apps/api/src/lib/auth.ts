import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "../prisma/prisma.service";

// Create instance of PrismaService
const prisma = new PrismaService();

// Configure better-auth with Prisma adapter and OAuth providers
export const auth = betterAuth({
  // Configure the database adapter using Prisma
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Configure base URL for redirects
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.codecave.tech"
      : "http://localhost:3001"),

  // Configure trusted origins for CORS
  trustedOrigins: [
    "http://localhost:3000", // Frontend development
    "http://localhost:3001", // API development
    "https://codecave.tech", // Production frontend
    "https://www.codecave.tech", // Production frontend with www
    "https://api.codecave.tech", // Production API
  ],

  // Disable email/password authentication
  emailAndPassword: {
    enabled: false,
  },

  // Configure social providers - GitHub and Google only
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
