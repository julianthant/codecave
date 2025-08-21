import {
  pgTable,
  text,
  uuid,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { experienceLevelEnum } from './enums'

// PUBLIC DATA - Profiles table (publicly readable)
export const profilesTable = pgTable('profiles', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Public profile information
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),
  tagline: text('tagline'),
  
  // Additional profile fields
  isVerified: boolean('is_verified').notNull().default(false),
  location: text('location'),
  portfolioUrl: text('portfolio_url'),

  // Public social links
  githubUsername: text('github_username'),
  twitterUsername: text('twitter_username'),
  discordUsername: text('discord_username'),
  linkedinUrl: text('linkedin_url'),

  // Timestamps
  ...timestamps,
}, () => ({
  // Table constraints can be added here when needed
}))

// PRIVATE DATA - User settings (only owner can access)
export const userSettingsTable = pgTable('user_settings', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Private developer profile
  skills: text('skills').array().notNull().default([]),
  languages: text('languages').array().notNull().default([]),
  
  // Structured skills data
  skillsData: jsonb('skills_data').default({}), // { category: { skillName: { years: number, isLearning: boolean } } }
  
  experienceLevel: experienceLevelEnum('experience_level'),
  availableForCollab: boolean('available_for_collab').notNull().default(false),
  
  // Collaboration settings
  collaborationTypes: text('collaboration_types').array().notNull().default([]), // ['coffee', 'pair', 'mentoring', etc.]
  collaborationGuidelines: text('collaboration_guidelines'), // Custom guidelines text
  responseTime: text('response_time'), // 'within-hour', 'within-day', etc.
  calendarUrl: text('calendar_url'), // External calendar integration
  officeHours: jsonb('office_hours').default({}), // { enabled: boolean, monday: { enabled: boolean, start: '09:00', end: '17:00' }, ... }
  
  // Private user preferences  
  emailNotifications: boolean('email_notifications').notNull().default(true),
  theme: text('theme').default('system'), // 'light', 'dark', 'system'
  timezone: text('timezone').default('UTC'),
  privacySettings: jsonb('privacy_settings').default({}),
  
  // System fields
  isPro: boolean('is_pro').notNull().default(false),
  
  // Timestamps
  ...timestamps,
})

// Type exports
export type Profile = typeof profilesTable.$inferSelect
export type NewProfile = typeof profilesTable.$inferInsert
export type UpdateProfile = Partial<Omit<NewProfile, 'id' | 'createdAt'>>

export type UserSettings = typeof userSettingsTable.$inferSelect
export type NewUserSettings = typeof userSettingsTable.$inferInsert
export type UpdateUserSettings = Partial<Omit<NewUserSettings, 'id' | 'createdAt'>>