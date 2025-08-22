// Database types (from Drizzle schema)
export type { 
  Profile, 
  NewProfile, 
  UpdateProfile, 
  UserSettings, 
  NewUserSettings, 
  UpdateUserSettings, 
  UserWithProfile,
  Connection,
  NewConnection,
  ConnectionInvitation,
  NewConnectionInvitation
} from '@/db'
import type { UserSettings, UserWithProfile, ConnectionInvitation } from '@/db'

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

// Connection-related types
export interface ConnectionUser {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  mutualConnections?: number
  isFollowing?: boolean
  followsYou?: boolean
}

export interface InvitationWithSender {
  id: string
  senderId: string
  receiverId: string
  message: string | null
  status: 'pending' | 'accepted' | 'declined' | 'rejected' | 'withdrawn'
  createdAt: Date
  respondedAt: Date | null
  sender: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export interface InvitationWithReceiver {
  id: string
  senderId: string
  receiverId: string
  message: string | null
  status: 'pending' | 'accepted' | 'declined' | 'rejected' | 'withdrawn'
  createdAt: Date
  respondedAt: Date | null
  receiver: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export interface InvitationWithUser extends Omit<ConnectionInvitation, 'createdAt' | 'respondedAt'> {
  user: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
  type: 'sent' | 'received'
  sentAt: Date
}

export interface NetworkStats {
  following: number
  followers: number
  connections: number
  pendingInvitations: number
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