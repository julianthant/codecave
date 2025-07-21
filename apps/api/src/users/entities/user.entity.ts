import { User as PrismaUser } from "../../../generated/prisma";

// Re-export Prisma types
export { AuthProvider } from "../../../generated/prisma";

// Extend Prisma User type if needed
export interface User extends PrismaUser {
  // Add any additional computed fields or methods here if needed
}

// Type for creating a new user (omit auto-generated fields)
export type CreateUserInput = Omit<
  PrismaUser,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "projectsCount"
  | "followersCount"
  | "followingCount"
  | "isActive"
  | "isPro"
>;

// Type for updating a user (make all fields optional except id)
export type UpdateUserInput = Partial<
  Omit<PrismaUser, "id" | "createdAt" | "updatedAt">
>;
