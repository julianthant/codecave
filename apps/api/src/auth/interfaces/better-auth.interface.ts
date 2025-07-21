export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // CodeCave-specific fields
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  githubUsername?: string;
  twitterHandle?: string;
  skills?: string;
  experience?: string;
  portfolioUrl?: string;
}

export interface BetterAuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  user: BetterAuthUser;
  session: BetterAuthSession;
}

export interface SessionResponse {
  data: SessionData | null;
  error?: string;
}
