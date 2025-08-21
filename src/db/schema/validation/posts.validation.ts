import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { 
  postsTable, 
  postLikesTable, 
  postBookmarksTable, 
  postCommentsTable, 
  postRepostsTable 
} from '../posts'

// Content block validation for rich content
const contentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['paragraph', 'heading', 'code', 'image', 'quote', 'list']),
  content: z.string(),
  props: z.record(z.string(), z.unknown()).optional(),
})

// Posts Validation Schemas
export const postSelectSchema = createSelectSchema(postsTable)
export const postInsertSchema = createInsertSchema(postsTable, {
  title: (schema) => schema
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  slug: (schema) => schema
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be at most 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: (schema) => schema
    .max(300, 'Excerpt must be at most 300 characters'),
  readingTime: (schema) => schema
    .regex(/^\d+\s+(min|mins|minute|minutes)\s+read$/, 'Invalid reading time format'),
})
export const postUpdateSchema = createUpdateSchema(postsTable, {
  title: (schema) => schema
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  slug: (schema) => schema
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be at most 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: (schema) => schema
    .max(300, 'Excerpt must be at most 300 characters'),
  readingTime: (schema) => schema
    .regex(/^\d+\s+(min|mins|minute|minutes)\s+read$/, 'Invalid reading time format'),
})

// Post Likes Validation Schemas
export const postLikeSelectSchema = createSelectSchema(postLikesTable)
export const postLikeInsertSchema = createInsertSchema(postLikesTable)
export const postLikeUpdateSchema = createUpdateSchema(postLikesTable)

// Post Bookmarks Validation Schemas
export const postBookmarkSelectSchema = createSelectSchema(postBookmarksTable)
export const postBookmarkInsertSchema = createInsertSchema(postBookmarksTable)
export const postBookmarkUpdateSchema = createUpdateSchema(postBookmarksTable)

// Post Comments Validation Schemas
export const postCommentSelectSchema = createSelectSchema(postCommentsTable)
export const postCommentInsertSchema = createInsertSchema(postCommentsTable, {
  content: (schema) => schema
    .min(1, 'Comment content is required')
    .max(2000, 'Comment must be at most 2000 characters'),
})
export const postCommentUpdateSchema = createUpdateSchema(postCommentsTable, {
  content: (schema) => schema
    .min(1, 'Comment content is required')
    .max(2000, 'Comment must be at most 2000 characters'),
})

// Post Reposts Validation Schemas
export const postRepostSelectSchema = createSelectSchema(postRepostsTable)
export const postRepostInsertSchema = createInsertSchema(postRepostsTable, {
  message: (schema) => schema
    .max(500, 'Repost message must be at most 500 characters'),
})
export const postRepostUpdateSchema = createUpdateSchema(postRepostsTable, {
  message: (schema) => schema
    .max(500, 'Repost message must be at most 500 characters'),
})

// API-specific schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  content: z.object({
    blocks: z.array(contentBlockSchema).min(1, 'Post must have at least one content block'),
  }),
  excerpt: z.string().max(300, 'Excerpt must be at most 300 characters').optional(),
  type: z.enum(['article', 'snippet', 'project', 'thought']).default('article'),
  visibility: z.enum(['public', 'private', 'unlisted', 'followers']).default('public'),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed').default([]),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.object({
    blocks: z.array(contentBlockSchema).min(1),
  }).optional(),
  excerpt: z.string().max(300).optional(),
  type: z.enum(['article', 'snippet', 'project', 'thought']).optional(),
  visibility: z.enum(['public', 'private', 'unlisted', 'followers']).optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  isPublished: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000, 'Comment must be at most 2000 characters'),
  parentId: z.string().uuid().optional(),
})

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000, 'Comment must be at most 2000 characters'),
})

export const createRepostSchema = z.object({
  message: z.string().max(500, 'Repost message must be at most 500 characters').optional(),
})

// Query parameter schemas
export const postQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(['article', 'snippet', 'project', 'thought']).optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted', 'followers']).optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
})

// Type exports for TypeScript inference
export type PostSelect = z.infer<typeof postSelectSchema>
export type PostInsert = z.infer<typeof postInsertSchema>
export type PostUpdate = z.infer<typeof postUpdateSchema>

export type PostLikeSelect = z.infer<typeof postLikeSelectSchema>
export type PostLikeInsert = z.infer<typeof postLikeInsertSchema>

export type PostBookmarkSelect = z.infer<typeof postBookmarkSelectSchema>
export type PostBookmarkInsert = z.infer<typeof postBookmarkInsertSchema>

export type PostCommentSelect = z.infer<typeof postCommentSelectSchema>
export type PostCommentInsert = z.infer<typeof postCommentInsertSchema>
export type PostCommentUpdate = z.infer<typeof postCommentUpdateSchema>

export type PostRepostSelect = z.infer<typeof postRepostSelectSchema>
export type PostRepostInsert = z.infer<typeof postRepostInsertSchema>

export type CreatePost = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateComment = z.infer<typeof createCommentSchema>
export type UpdateComment = z.infer<typeof updateCommentSchema>
export type CreateRepost = z.infer<typeof createRepostSchema>
export type PostQuery = z.infer<typeof postQuerySchema>

export type ContentBlock = z.infer<typeof contentBlockSchema>