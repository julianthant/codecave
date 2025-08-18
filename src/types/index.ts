// Database types (from Drizzle schema)
export type { Profile, NewProfile, UpdateProfile, UserSettings, NewUserSettings, UpdateUserSettings, UserWithProfile } from '@/db'
import type { UserSettings, UserWithProfile } from '@/db'

// User-related types
export interface UpdateUserData {
  displayName?: string
  bio?: string
  avatarUrl?: string
  githubUsername?: string
  twitterUsername?: string
  discordUsername?: string
  linkedinUrl?: string
  skills?: string[]
  languages?: string[]
  experienceLevel?: UserSettings['experienceLevel']
  availableForCollab?: boolean
}

// Future feature types (when implemented)
export interface PostWithUser {
  user: Pick<UserWithProfile, 'id' | 'username' | 'displayName' | 'avatarUrl'> & {
    isPro?: boolean
  }
}

export interface CollabPreferences {
  remote: boolean
  commitment: string
  interests: string[]
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  has_more: boolean
}