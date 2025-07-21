/**
 * OAuth Profile Interface
 * Represents standardized profile data returned from OAuth providers
 */
export interface OAuthProfile {
  // Core fields
  id: string;
  email: string;
  name: string;
  
  // Profile image
  avatar?: string;
  
  // Additional profile info
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  
  // Provider-specific fields
  githubUsername?: string;
} 