export type CollaborationType =
  | 'project'
  | 'code-review'
  | 'mentorship'
  | 'hackathon'
  | 'open-source'
  | 'study-group'
  | 'startup'

export type CollaborationStatus =
  | 'open'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type TimeCommitment =
  | 'few-hours'
  | 'few-days'
  | 'few-weeks'
  | 'few-months'
  | 'ongoing'

export type ExperienceLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'

export interface CollaborationUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio?: string
  skills: string[]
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  isVerified?: boolean
  isPro?: boolean
}

export interface Collaboration {
  id: string
  type: CollaborationType
  title: string
  description: string
  requirements?: string[]
  technologies: string[]
  skillsNeeded: string[]
  experienceLevel: ExperienceLevel
  timeCommitment: TimeCommitment
  teamSize?: {
    current: number
    needed: number
  }
  remote: boolean
  location?: string
  deadline?: Date
  compensation?: {
    type: 'paid' | 'equity' | 'volunteer' | 'open'
    details?: string
  }
  status: CollaborationStatus
  createdBy: CollaborationUser
  createdAt: Date
  updatedAt: Date
  applicants?: number
  views?: number
  saves?: number
  githubRepo?: string
  projectUrl?: string
  tags?: string[]
}

export interface CollaborationApplication {
  id: string
  collaborationId: string
  applicant: CollaborationUser
  message: string
  portfolio?: string
  githubProfile?: string
  relevantExperience?: string
  availability: string
  appliedAt: Date
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
}

export interface CollaborationInvitation {
  id: string
  collaboration: Collaboration
  invitedBy: CollaborationUser
  invitedUser: CollaborationUser
  message?: string
  sentAt: Date
  status: 'pending' | 'accepted' | 'declined'
}
