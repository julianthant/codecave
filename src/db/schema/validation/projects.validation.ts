import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { projectsTable } from '../projects'

// Projects Validation Schemas
export const projectSelectSchema = createSelectSchema(projectsTable)
export const projectInsertSchema = createInsertSchema(projectsTable, {
  name: (schema) => schema
    .min(1, 'Project name is required')
    .max(100, 'Project name must be at most 100 characters'),
  description: (schema) => schema
    .max(1000, 'Description must be at most 1000 characters'),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  githubUrl: (schema) => schema
    .url('GitHub URL must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  liveUrl: (schema) => schema
    .url('Live URL must be a valid URL'),
  imageUrl: (schema) => schema
    .url('Image URL must be a valid URL'),
  stars: z.number().min(0, 'Stars cannot be negative').max(1000000, 'Stars value too high'),
  forks: z.number().min(0, 'Forks cannot be negative').max(1000000, 'Forks value too high'),
  language: (schema) => schema
    .max(50, 'Language must be at most 50 characters'),
})
export const projectUpdateSchema = createUpdateSchema(projectsTable, {
  name: (schema) => schema
    .min(1, 'Project name is required')
    .max(100, 'Project name must be at most 100 characters'),
  description: (schema) => schema
    .max(1000, 'Description must be at most 1000 characters'),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  githubUrl: (schema) => schema
    .url('GitHub URL must be a valid URL')
    .refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  liveUrl: (schema) => schema
    .url('Live URL must be a valid URL'),
  imageUrl: (schema) => schema
    .url('Image URL must be a valid URL'),
  stars: z.number().min(0, 'Stars cannot be negative').max(1000000, 'Stars value too high'),
  forks: z.number().min(0, 'Forks cannot be negative').max(1000000, 'Forks value too high'),
  language: (schema) => schema
    .max(50, 'Language must be at most 50 characters'),
})

// API-specific schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be at most 100 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 technologies allowed').optional(),
  githubUrl: z.string().url().refine((url) => url.includes('github.com'), 'Must be a GitHub URL').optional(),
  liveUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isPrivate: z.boolean().default(false),
  language: z.string().max(50).optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20).optional(),
  githubUrl: z.string().url().refine((url) => url.includes('github.com')).optional(),
  liveUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isPrivate: z.boolean().optional(),
  language: z.string().max(50).optional(),
})

export const syncGitHubProjectSchema = z.object({
  githubUrl: z.string().url().refine((url) => url.includes('github.com'), 'Must be a GitHub URL'),
  autoSync: z.boolean().default(false),
})

// Query parameter schemas
export const projectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  technology: z.string().optional(),
  language: z.string().optional(),
  isPrivate: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'stars', 'forks', 'createdAt', 'updatedAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  minStars: z.coerce.number().min(0).optional(),
  minForks: z.coerce.number().min(0).optional(),
})

export const userProjectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  includePrivate: z.coerce.boolean().default(false),
  technology: z.string().optional(),
  language: z.string().optional(),
  search: z.string().optional(),
})

// GitHub integration schemas
export const gitHubRepoDataSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  private: z.boolean(),
  topics: z.array(z.string()).optional(),
  updated_at: z.string(),
  created_at: z.string(),
})

// Type exports for TypeScript inference
export type ProjectSelect = z.infer<typeof projectSelectSchema>
export type ProjectInsert = z.infer<typeof projectInsertSchema>
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>

export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type SyncGitHubProject = z.infer<typeof syncGitHubProjectSchema>
export type ProjectQuery = z.infer<typeof projectQuerySchema>
export type UserProjectQuery = z.infer<typeof userProjectQuerySchema>
export type GitHubRepoData = z.infer<typeof gitHubRepoDataSchema>