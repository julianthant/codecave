// Better Auth User Interface - matches Prisma User model
export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // CodeCave-specific fields
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  skills?: string[];
  provider: string;
  providerId?: string;
  githubUsername?: string;
  projectsCount: number;
  followersCount: number;
  followingCount: number;
  isActive: boolean;
  isPro: boolean;
}

// Better Auth Session Interface
export interface BetterAuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// OAuth Profile Interface - for creating users from OAuth providers
export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  githubUsername?: string;
}

// Session Response Interface
export interface SessionData {
  user: BetterAuthUser;
  session: BetterAuthSession;
}

export interface SessionResponse {
  data: SessionData | null;
  error?: string;
}

// User session interface for Better Auth integration
export interface UserSession {
  id: string;
  email: string;
  name: string;
  image?: string;
  isActive: boolean;
}
