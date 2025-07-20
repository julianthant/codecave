export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  provider: string;
  iat?: number;
  exp?: number;
}

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
  linkedinProfile?: string;
}
