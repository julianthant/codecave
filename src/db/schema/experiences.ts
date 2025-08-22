import {
  pgTable,
  text,
  uuid,
  boolean,
  date,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { profilesTable } from './profiles'

// EXPERIENCES - For profile work history showcase
export const experiencesTable = pgTable('experiences', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  
  // Company information
  company: text('company').notNull(),
  position: text('position').notNull(),
  description: text('description'),
  location: text('location'),
  companyUrl: text('company_url'),
  companyLogo: text('company_logo'),
  
  // Employment details
  employmentType: text('employment_type').notNull().default('full-time'), // full-time, part-time, contract, internship, freelance
  startDate: date('start_date').notNull(),
  endDate: date('end_date'), // null means current position
  isCurrent: boolean('is_current').notNull().default(false),
  
  // Technical details
  technologies: text('technologies').array().notNull().default([]),
  achievements: text('achievements').array().notNull().default([]),
  
  // Privacy and display
  isPrivate: boolean('is_private').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: text('sort_order').notNull().default('0'), // for custom ordering
  
  ...timestamps,
})

// Type exports
export type Experience = typeof experiencesTable.$inferSelect
export type NewExperience = typeof experiencesTable.$inferInsert
export type UpdateExperienceData = Partial<Omit<NewExperience, 'id' | 'createdAt' | 'userId'>>