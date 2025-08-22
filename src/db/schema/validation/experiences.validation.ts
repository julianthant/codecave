import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { experiencesTable } from '../experiences'

// Drizzle-Zod generated schemas
export const experienceSelectSchema = createSelectSchema(experiencesTable)
export const experienceInsertSchema = createInsertSchema(experiencesTable, {
  company: (schema) => schema
    .min(1, 'Company name is required')
    .max(100, 'Company name must be at most 100 characters'),
  position: (schema) => schema
    .min(1, 'Position is required')
    .max(100, 'Position must be at most 100 characters'),
  description: (schema) => schema
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  location: (schema) => schema
    .max(100, 'Location must be at most 100 characters')
    .optional(),
  companyUrl: (schema) => schema
    .url('Company URL must be a valid URL')
    .optional(),
  technologies: (schema) => schema
    .max(20, 'Maximum 20 technologies allowed'),
  achievements: (schema) => schema
    .max(10, 'Maximum 10 achievements allowed'),
})

export const experienceUpdateSchema = createUpdateSchema(experiencesTable, {
  company: (schema) => schema
    .min(1, 'Company name is required')
    .max(100, 'Company name must be at most 100 characters'),
  position: (schema) => schema
    .min(1, 'Position is required')
    .max(100, 'Position must be at most 100 characters'),
  description: (schema) => schema
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  location: (schema) => schema
    .max(100, 'Location must be at most 100 characters')
    .optional(),
  companyUrl: (schema) => schema
    .url('Company URL must be a valid URL')
    .optional(),
  technologies: (schema) => schema
    .max(20, 'Maximum 20 technologies allowed'),
  achievements: (schema) => schema
    .max(10, 'Maximum 10 achievements allowed'),
})

// API-specific schemas
export const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  description: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  companyUrl: z.string().url('Must be a valid URL').optional(),
  companyLogo: z.string().url('Must be a valid URL').optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).default('full-time'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
  isCurrent: z.boolean().default(false),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').default([]),
  achievements: z.array(z.string().min(1).max(200)).max(10, 'Maximum 10 achievements allowed').default([]),
  isPrivate: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
}).refine((data) => {
  // If not current, end date is required
  if (!data.isCurrent && !data.endDate) {
    return false
  }
  // If current, end date should not be provided
  if (data.isCurrent && data.endDate) {
    return false
  }
  // Start date should be before end date
  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    return false
  }
  return true
}, {
  message: 'Invalid date configuration',
  path: ['endDate'],
})

export const updateExperienceSchema = createExperienceSchema.partial()

// Type exports
export type ExperienceSelect = z.infer<typeof experienceSelectSchema>
export type ExperienceInsert = z.infer<typeof experienceInsertSchema>
export type CreateExperience = z.infer<typeof createExperienceSchema>
export type UpdateExperience = z.infer<typeof updateExperienceSchema>