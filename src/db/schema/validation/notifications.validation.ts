import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { notificationsTable } from '../notifications'

// Notifications Validation Schemas
export const notificationSelectSchema = createSelectSchema(notificationsTable)
export const notificationInsertSchema = createInsertSchema(notificationsTable, {
  title: (schema) => schema
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  message: (schema) => schema
    .max(500, 'Message must be at most 500 characters'),
})
export const notificationUpdateSchema = createUpdateSchema(notificationsTable, {
  title: (schema) => schema
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  message: (schema) => schema
    .max(500, 'Message must be at most 500 characters'),
})

// API-specific schemas
export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum(['follow', 'like', 'comment', 'mention', 'collaboration', 'system']),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  message: z.string().max(500, 'Message must be at most 500 characters').optional(),
  data: z.record(z.string(), z.unknown()).optional(),
})

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
})

export const markAllNotificationsReadSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
})

// Query parameter schemas
export const notificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  type: z.enum(['follow', 'like', 'comment', 'mention', 'collaboration', 'system']).optional(),
  read: z.coerce.boolean().optional(),
  since: z.string().datetime().optional(),
})

// Notification data type definitions for different notification types
export const followNotificationDataSchema = z.object({
  followerId: z.string().uuid(),
  followerUsername: z.string(),
  followerDisplayName: z.string().optional(),
  followerAvatarUrl: z.string().url().optional(),
})

export const likeNotificationDataSchema = z.object({
  postId: z.string().uuid(),
  postTitle: z.string(),
  likerId: z.string().uuid(),
  likerUsername: z.string(),
  likerDisplayName: z.string().optional(),
  likerAvatarUrl: z.string().url().optional(),
})

export const commentNotificationDataSchema = z.object({
  postId: z.string().uuid(),
  postTitle: z.string(),
  commentId: z.string().uuid(),
  commentContent: z.string().max(100), // Truncated for notification
  commenterId: z.string().uuid(),
  commenterUsername: z.string(),
  commenterDisplayName: z.string().optional(),
  commenterAvatarUrl: z.string().url().optional(),
})

export const mentionNotificationDataSchema = z.object({
  postId: z.string().uuid().optional(),
  commentId: z.string().uuid().optional(),
  content: z.string().max(100), // Truncated content where mention occurred
  mentionerId: z.string().uuid(),
  mentionerUsername: z.string(),
  mentionerDisplayName: z.string().optional(),
  mentionerAvatarUrl: z.string().url().optional(),
})

export const collaborationNotificationDataSchema = z.object({
  collaborationId: z.string().uuid(),
  collaborationTitle: z.string(),
  type: z.enum(['application', 'acceptance', 'rejection', 'invitation']),
  relatedUserId: z.string().uuid(),
  relatedUsername: z.string(),
  relatedDisplayName: z.string().optional(),
  relatedAvatarUrl: z.string().url().optional(),
})

export const systemNotificationDataSchema = z.object({
  category: z.enum(['maintenance', 'feature', 'security', 'policy']),
  actionUrl: z.string().url().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
})

// Type exports for TypeScript inference
export type NotificationSelect = z.infer<typeof notificationSelectSchema>
export type NotificationInsert = z.infer<typeof notificationInsertSchema>
export type NotificationUpdate = z.infer<typeof notificationUpdateSchema>

export type CreateNotification = z.infer<typeof createNotificationSchema>
export type MarkNotificationRead = z.infer<typeof markNotificationReadSchema>
export type MarkAllNotificationsRead = z.infer<typeof markAllNotificationsReadSchema>
export type NotificationQuery = z.infer<typeof notificationQuerySchema>

export type FollowNotificationData = z.infer<typeof followNotificationDataSchema>
export type LikeNotificationData = z.infer<typeof likeNotificationDataSchema>
export type CommentNotificationData = z.infer<typeof commentNotificationDataSchema>
export type MentionNotificationData = z.infer<typeof mentionNotificationDataSchema>
export type CollaborationNotificationData = z.infer<typeof collaborationNotificationDataSchema>
export type SystemNotificationData = z.infer<typeof systemNotificationDataSchema>