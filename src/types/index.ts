import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type User = Tables<'users'>
export type Post = Tables<'posts'>
export type Comment = Tables<'comments'>
export type Like = Tables<'likes'>
export type Follow = Tables<'follows'>
export type Notification = Tables<'notifications'>
export type UserSettings = Tables<'user_settings'>

// Block types for posts
export interface Block {
  id: string
  type: 'text' | 'code' | 'image' | 'video' | 'collaborator' | 'poll' | 'divider'
  content: any
  order: number
}

// Extended types with relations
export interface PostWithUser extends Post {
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url' | 'is_pro'>
}

export interface CommentWithUser extends Comment {
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url' | 'is_pro'>
}

// Collaboration preferences type
export interface CollabPreferences {
  remote: boolean
  commitment: string
  interests: string[]
}

// Notification settings types
export interface NotificationSettings {
  email: {
    new_follower: boolean
    post_liked: boolean
    new_comment: boolean
    mentioned: boolean
    collaboration_request: boolean
    weekly_digest: boolean
    marketing: boolean
  }
  push: {
    enabled: boolean
    new_follower: boolean
    post_liked: boolean
    new_comment: boolean
    mentioned: boolean
    collaboration_request: boolean
  }
  in_app: {
    new_follower: boolean
    post_liked: boolean
    new_comment: boolean
    mentioned: boolean
    collaboration_request: boolean
    group_activity: boolean
  }
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private'
  show_email: boolean
  show_location: boolean
  show_online_status: boolean
  allow_messages: 'everyone' | 'followers' | 'none'
  anonymous_mode: boolean
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system'
  code_theme: string
  feed_view: 'chronological' | 'algorithm'
  language: string
  timezone: string
  editor: {
    auto_save: boolean
    auto_format: boolean
    show_line_numbers: boolean
    font_size: number
    tab_size: number
  }
}

// Form types
export interface CreatePostData {
  title: string
  slug: string
  blocks: Block[]
  tags: string[]
  type: Post['type']
  is_published: boolean
}

export interface UpdateUserData {
  display_name?: string
  bio?: string
  avatar_url?: string
  banner_url?: string
  location?: string
  website_url?: string
  github_username?: string
  twitter_username?: string
  discord_username?: string
  linkedin_url?: string
  skills?: string[]
  languages?: string[]
  experience_level?: User['experience_level']
  years_coding?: number
  available_for_collab?: boolean
  collab_preferences?: CollabPreferences
}

// API response types
export interface ApiResponse<T = any> {
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