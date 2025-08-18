import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core'

// Enums
export const experienceLevelEnum = pgEnum('experience_level', [
  'student',
  'junior',
  'mid',
  'senior',
  'lead',
])

export const postVisibilityEnum = pgEnum('post_visibility', [
  'public',
  'private', 
  'unlisted',
  'followers',
])

// PUBLIC DATA - Profiles table (publicly readable)
export const profilesTable = pgTable('profiles', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Public profile information
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),

  // Public social links
  githubUsername: text('github_username'),
  twitterUsername: text('twitter_username'),
  discordUsername: text('discord_username'),
  linkedinUrl: text('linkedin_url'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// PRIVATE DATA - User settings (only owner can access)
export const userSettingsTable = pgTable('user_settings', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Private developer profile
  skills: text('skills').array().notNull().default([]),
  languages: text('languages').array().notNull().default([]),
  experienceLevel: experienceLevelEnum('experience_level'),
  availableForCollab: boolean('available_for_collab').notNull().default(false),
  
  // Private user preferences  
  emailNotifications: boolean('email_notifications').notNull().default(true),
  theme: text('theme').default('system'), // 'light', 'dark', 'system'
  
  // System fields
  isPro: boolean('is_pro').notNull().default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// POSTS - With visibility control
export const postsTable = pgTable('posts', {
  id: uuid('id').primaryKey().notNull(),
  
  // Author reference (links to profiles.id)
  authorId: uuid('author_id').notNull().references(() => profilesTable.id),
  
  // Post content
  title: text('title').notNull(),
  slug: text('slug').unique(),
  content: jsonb('content').notNull(), // Rich content blocks
  excerpt: text('excerpt'),
  
  // Visibility and status
  visibility: postVisibilityEnum('visibility').notNull().default('public'),
  isPublished: boolean('is_published').notNull().default(false),
  isDraft: boolean('is_draft').notNull().default(true),
  
  // Metadata
  tags: text('tags').array().notNull().default([]),
  readingTime: text('reading_time'), // "5 min read"
  
  // Stats (will be updated by triggers later)
  viewCount: text('view_count').default('0'),
  likeCount: text('like_count').default('0'),
  commentCount: text('comment_count').default('0'),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Type exports
export type Profile = typeof profilesTable.$inferSelect
export type NewProfile = typeof profilesTable.$inferInsert
export type UpdateProfile = Partial<Omit<NewProfile, 'id' | 'createdAt'>>

export type UserSettings = typeof userSettingsTable.$inferSelect
export type NewUserSettings = typeof userSettingsTable.$inferInsert
export type UpdateUserSettings = Partial<Omit<NewUserSettings, 'id' | 'createdAt'>>

export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert
export type UpdatePost = Partial<Omit<NewPost, 'id' | 'createdAt'>>

// Combined user type (for API responses)
export type UserWithProfile = Profile & {
  settings?: UserSettings
}
