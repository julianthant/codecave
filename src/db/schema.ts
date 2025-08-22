// Re-export all tables, types, and enums from modular schema files
export * from './schema/enums'
export * from './schema/helpers'
export * from './schema/profiles'
export * from './schema/posts'
export * from './schema/connections'
export * from './schema/collaborations'
export * from './schema/notifications'
export * from './schema/projects'
export * from './schema/experiences'

// Re-export all validation schemas
export * from './schema/validation'

// Import types for combined API response types
import type { Profile, UserSettings } from './schema/profiles'
import type { Post } from './schema/posts'
import type { PostComment } from './schema/posts'
import type { Collaboration } from './schema/collaborations'

// Combined user types for API responses
export type UserWithProfile = Profile & {
  settings?: UserSettings
}

export type PostWithAuthor = Post & {
  author: Profile
}

export type CollaborationWithAuthor = Collaboration & {
  author: Profile
}

export type CommentWithAuthor = PostComment & {
  author: Profile
  replies?: CommentWithAuthor[]
}