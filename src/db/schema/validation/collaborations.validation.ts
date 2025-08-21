import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { 
  collaborationsTable, 
  collaborationApplicationsTable, 
  collaborationSavesTable 
} from '../collaborations'

// Collaborations Validation Schemas
export const collaborationSelectSchema = createSelectSchema(collaborationsTable)
export const collaborationInsertSchema = createInsertSchema(collaborationsTable, {
  title: (schema) => schema
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: (schema) => schema
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  requirements: z.array(z.string().min(1).max(200)).max(10, 'Maximum 10 requirements allowed').optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  skillsNeeded: z.array(z.string().min(1).max(50)).max(15, 'Maximum 15 skills allowed').optional(),
  teamSizeNeeded: z.number().min(1).max(50).optional(),
  location: (schema) => schema
    .max(100, 'Location must be at most 100 characters'),
  compensationDetails: (schema) => schema
    .max(500, 'Compensation details must be at most 500 characters'),
  githubRepo: (schema) => schema
    .url('GitHub repository must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  projectUrl: (schema) => schema
    .url('Project URL must be a valid URL'),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
})
export const collaborationUpdateSchema = createUpdateSchema(collaborationsTable, {
  title: (schema) => schema
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: (schema) => schema
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  requirements: z.array(z.string().min(1).max(200)).max(10, 'Maximum 10 requirements allowed').optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  skillsNeeded: z.array(z.string().min(1).max(50)).max(15, 'Maximum 15 skills allowed').optional(),
  teamSizeNeeded: z.number().min(1).max(50).optional(),
  location: (schema) => schema
    .max(100, 'Location must be at most 100 characters'),
  compensationDetails: (schema) => schema
    .max(500, 'Compensation details must be at most 500 characters'),
  githubRepo: (schema) => schema
    .url('GitHub repository must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  projectUrl: (schema) => schema
    .url('Project URL must be a valid URL'),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
})

// Collaboration Applications Validation Schemas
export const collaborationApplicationSelectSchema = createSelectSchema(collaborationApplicationsTable)
export const collaborationApplicationInsertSchema = createInsertSchema(collaborationApplicationsTable, {
  message: (schema) => schema
    .min(20, 'Application message must be at least 20 characters')
    .max(1000, 'Application message must be at most 1000 characters'),
  portfolio: (schema) => schema
    .url('Portfolio must be a valid URL'),
  githubProfile: (schema) => schema
    .url('GitHub profile must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  relevantExperience: (schema) => schema
    .max(1000, 'Relevant experience must be at most 1000 characters'),
  availability: (schema) => schema
    .max(500, 'Availability must be at most 500 characters'),
})
export const collaborationApplicationUpdateSchema = createUpdateSchema(collaborationApplicationsTable, {
  message: (schema) => schema
    .min(20, 'Application message must be at least 20 characters')
    .max(1000, 'Application message must be at most 1000 characters'),
  portfolio: (schema) => schema
    .url('Portfolio must be a valid URL'),
  githubProfile: (schema) => schema
    .url('GitHub profile must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  relevantExperience: (schema) => schema
    .max(1000, 'Relevant experience must be at most 1000 characters'),
  availability: (schema) => schema
    .max(500, 'Availability must be at most 500 characters'),
})

// Collaboration Saves Validation Schemas
export const collaborationSaveSelectSchema = createSelectSchema(collaborationSavesTable)
export const collaborationSaveInsertSchema = createInsertSchema(collaborationSavesTable)
export const collaborationSaveUpdateSchema = createUpdateSchema(collaborationSavesTable)

// API-specific schemas
export const createCollaborationSchema = z.object({
  type: z.enum(['project', 'code-review', 'mentorship', 'hackathon', 'open-source', 'study-group', 'startup']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be at most 2000 characters'),
  requirements: z.array(z.string().min(1).max(200)).max(10, 'Maximum 10 requirements allowed').optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  skillsNeeded: z.array(z.string().min(1).max(50)).max(15, 'Maximum 15 skills allowed').optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  timeCommitment: z.enum(['few-hours', 'few-days', 'few-weeks', 'few-months', 'ongoing']).optional(),
  teamSizeNeeded: z.number().min(1).max(50).optional(),
  remote: z.boolean().default(true),
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  deadline: z.string().datetime().optional(),
  compensationType: z.enum(['paid', 'equity', 'volunteer', 'open']).optional(),
  compensationDetails: z.string().max(500, 'Compensation details must be at most 500 characters').optional(),
  githubRepo: z.string().url().refine((url) => url.includes('github.com'), 'Must be a GitHub URL').optional(),
  projectUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
})

export const updateCollaborationSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(2000).optional(),
  requirements: z.array(z.string().min(1).max(200)).max(10).optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20).optional(),
  skillsNeeded: z.array(z.string().min(1).max(50)).max(15).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  timeCommitment: z.enum(['few-hours', 'few-days', 'few-weeks', 'few-months', 'ongoing']).optional(),
  teamSizeNeeded: z.number().min(1).max(50).optional(),
  remote: z.boolean().optional(),
  location: z.string().max(100).optional(),
  deadline: z.string().datetime().optional(),
  compensationType: z.enum(['paid', 'equity', 'volunteer', 'open']).optional(),
  compensationDetails: z.string().max(500).optional(),
  status: z.enum(['open', 'in-progress', 'completed', 'cancelled']).optional(),
  githubRepo: z.string().url().refine((url) => url.includes('github.com')).optional(),
  projectUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
})

export const createApplicationSchema = z.object({
  message: z.string().min(20, 'Application message must be at least 20 characters').max(1000, 'Application message must be at most 1000 characters'),
  portfolio: z.string().url('Portfolio must be a valid URL').optional(),
  githubProfile: z.string().url().refine((url) => url.includes('github.com'), 'Must be a GitHub URL').optional(),
  relevantExperience: z.string().max(1000, 'Relevant experience must be at most 1000 characters').optional(),
  availability: z.string().max(500, 'Availability must be at most 500 characters').optional(),
})

export const respondToApplicationSchema = z.object({
  action: z.enum(['accept', 'decline'], {
    message: 'Action must be either accept or decline',
  }),
})

// Query parameter schemas
export const collaborationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  type: z.enum(['project', 'code-review', 'mentorship', 'hackathon', 'open-source', 'study-group', 'startup']).optional(),
  status: z.enum(['open', 'in-progress', 'completed', 'cancelled']).optional(),
  remote: z.coerce.boolean().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  timeCommitment: z.enum(['few-hours', 'few-days', 'few-weeks', 'few-months', 'ongoing']).optional(),
  compensationType: z.enum(['paid', 'equity', 'volunteer', 'open']).optional(),
  technology: z.string().optional(),
  skill: z.string().optional(),
  search: z.string().optional(),
})

export const applicationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['pending', 'accepted', 'declined', 'rejected', 'withdrawn']).optional(),
  collaborationId: z.string().uuid().optional(),
})

// Type exports for TypeScript inference
export type CollaborationSelect = z.infer<typeof collaborationSelectSchema>
export type CollaborationInsert = z.infer<typeof collaborationInsertSchema>
export type CollaborationUpdate = z.infer<typeof collaborationUpdateSchema>

export type CollaborationApplicationSelect = z.infer<typeof collaborationApplicationSelectSchema>
export type CollaborationApplicationInsert = z.infer<typeof collaborationApplicationInsertSchema>
export type CollaborationApplicationUpdate = z.infer<typeof collaborationApplicationUpdateSchema>

export type CollaborationSaveSelect = z.infer<typeof collaborationSaveSelectSchema>
export type CollaborationSaveInsert = z.infer<typeof collaborationSaveInsertSchema>

export type CreateCollaboration = z.infer<typeof createCollaborationSchema>
export type UpdateCollaborationInput = z.infer<typeof updateCollaborationSchema>
export type CreateApplication = z.infer<typeof createApplicationSchema>
export type RespondToApplication = z.infer<typeof respondToApplicationSchema>
export type CollaborationQuery = z.infer<typeof collaborationQuerySchema>
export type ApplicationQuery = z.infer<typeof applicationQuerySchema>