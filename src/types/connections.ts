export interface ConnectionUser {
  id: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  skills: string[]
  experienceLevel: 'student' | 'junior' | 'mid' | 'senior' | 'lead'
  availableForCollab: boolean
  mutualConnections?: number
  githubUsername?: string
  twitterUsername?: string
  linkedinUrl?: string
  location?: string
  connectedAt?: Date
  lastActive?: Date
}

export interface ConnectionInvitation {
  id: string
  user: ConnectionUser
  message?: string
  sentAt: Date
  type: 'received' | 'sent'
}

export interface NetworkStats {
  totalConnections: number
  newThisWeek: number
  newThisMonth: number
  networkReach: number
  profileViews: number
  growthRate: number
}

export interface ConnectionFilters {
  skills: string[]
  experienceLevels: string[]
  availability: boolean | null
  location: string[]
}

export interface ConnectionsData {
  suggestions: ConnectionUser[]
  myConnections: ConnectionUser[]
  invitations: ConnectionInvitation[]
  following: ConnectionUser[]
  followers: ConnectionUser[]
  stats: NetworkStats
}