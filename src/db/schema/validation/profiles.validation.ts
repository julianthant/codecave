import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { profilesTable, userSettingsTable } from '../profiles'

// Profile Validation Schemas
export const profileSelectSchema = createSelectSchema(profilesTable)
export const profileInsertSchema = createInsertSchema(profilesTable, {
  username: (schema) => schema
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .toLowerCase(),
  displayName: (schema) => schema
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters'),
  bio: (schema) => schema
    .max(500, 'Bio must be at most 500 characters'),
  portfolioUrl: (schema) => schema
    .url('Portfolio URL must be a valid URL'),
  githubUsername: (schema) => schema
    .max(39, 'GitHub username must be at most 39 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'GitHub username can only contain letters, numbers, and hyphens'),
  twitterUsername: (schema) => schema
    .max(15, 'Twitter username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Twitter username can only contain letters, numbers, and underscores'),
  discordUsername: (schema) => schema
    .max(32, 'Discord username must be at most 32 characters'),
  linkedinUrl: (schema) => schema
    .url('LinkedIn URL must be a valid URL')
    .refine((url) => url.includes('linkedin.com'), 'Must be a LinkedIn URL'),
})
export const profileUpdateSchema = createUpdateSchema(profilesTable, {
  username: (schema) => schema
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .toLowerCase(),
  displayName: (schema) => schema
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters'),
  bio: (schema) => schema
    .max(500, 'Bio must be at most 500 characters'),
  portfolioUrl: (schema) => schema
    .url('Portfolio URL must be a valid URL'),
  githubUsername: (schema) => schema
    .max(39, 'GitHub username must be at most 39 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'GitHub username can only contain letters, numbers, and hyphens'),
  twitterUsername: (schema) => schema
    .max(15, 'Twitter username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Twitter username can only contain letters, numbers, and underscores'),
  discordUsername: (schema) => schema
    .max(32, 'Discord username must be at most 32 characters'),
  linkedinUrl: (schema) => schema
    .url('LinkedIn URL must be a valid URL')
    .refine((url) => url.includes('linkedin.com'), 'Must be a LinkedIn URL'),
})

// UserSettings Validation Schemas
export const userSettingsSelectSchema = createSelectSchema(userSettingsTable)
export const userSettingsInsertSchema = createInsertSchema(userSettingsTable, {
  skills: z.array(z.string().min(1).max(50)).max(50, 'Maximum 50 skills allowed'),
  languages: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 languages allowed'),
  skillsData: z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({
        years: z.number().min(0).max(50),
        isLearning: z.boolean(),
      })
    )
  ).optional(),
  collaborationTypes: z.array(z.string()).max(10, 'Maximum 10 collaboration types allowed'),
  collaborationGuidelines: (schema) => schema
    .max(1000, 'Guidelines must be at most 1000 characters'),
  responseTime: z.enum(['within-hour', 'within-day', 'within-week', 'flexible']).optional(),
  calendarUrl: (schema) => schema
    .url('Calendar URL must be a valid URL'),
  officeHours: z.object({
    enabled: z.boolean(),
    monday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    tuesday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    wednesday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    thursday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    friday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    saturday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    sunday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
  }).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  timezone: z.string().max(50, 'Timezone must be at most 50 characters').optional(),
})
export const userSettingsUpdateSchema = createUpdateSchema(userSettingsTable, {
  skills: z.array(z.string().min(1).max(50)).max(50, 'Maximum 50 skills allowed'),
  languages: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 languages allowed'),
  skillsData: z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({
        years: z.number().min(0).max(50),
        isLearning: z.boolean(),
      })
    )
  ).optional(),
  collaborationTypes: z.array(z.string()).max(10, 'Maximum 10 collaboration types allowed'),
  collaborationGuidelines: (schema) => schema
    .max(1000, 'Guidelines must be at most 1000 characters'),
  responseTime: z.enum(['within-hour', 'within-day', 'within-week', 'flexible']).optional(),
  calendarUrl: (schema) => schema
    .url('Calendar URL must be a valid URL'),
  officeHours: z.object({
    enabled: z.boolean(),
    monday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    tuesday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    wednesday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    thursday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    friday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    saturday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    sunday: z.object({
      enabled: z.boolean(),
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
  }).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  timezone: z.string().max(50, 'Timezone must be at most 50 characters').optional(),
})

// API-specific schemas for user operations
export const updateUserDataSchema = z.object({
  // Profile data
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  githubUsername: z.string().max(39).regex(/^[a-zA-Z0-9-]+$/).optional(),
  twitterUsername: z.string().max(15).regex(/^[a-zA-Z0-9_]+$/).optional(),
  discordUsername: z.string().max(32).optional(),
  linkedinUrl: z.string().url().refine((url) => url.includes('linkedin.com')).optional(),
  
  // Settings data
  skills: z.array(z.string().min(1).max(50)).max(50).optional(),
  languages: z.array(z.string().min(1).max(50)).max(20).optional(),
  experienceLevel: z.enum(['student', 'junior', 'mid', 'senior', 'lead']).optional(),
  availableForCollab: z.boolean().optional(),
  collaborationTypes: z.array(z.string()).max(10).optional(),
  collaborationGuidelines: z.string().max(1000).optional(),
  responseTime: z.enum(['within-hour', 'within-day', 'within-week', 'flexible']).optional(),
  emailNotifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

// Type exports for TypeScript inference
export type ProfileSelect = z.infer<typeof profileSelectSchema>
export type ProfileInsert = z.infer<typeof profileInsertSchema>
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>

export type UserSettingsSelect = z.infer<typeof userSettingsSelectSchema>
export type UserSettingsInsert = z.infer<typeof userSettingsInsertSchema>
export type UserSettingsUpdate = z.infer<typeof userSettingsUpdateSchema>

export type UpdateUserData = z.infer<typeof updateUserDataSchema>