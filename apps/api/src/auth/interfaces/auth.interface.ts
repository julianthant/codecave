// Better Auth compatible interfaces
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

// User session interface for Better Auth integration
export interface UserSession {
  id: string;
  email: string;
  name: string;
  image?: string;
  isActive: boolean;
}
