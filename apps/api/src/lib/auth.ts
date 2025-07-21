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
}) as any;
