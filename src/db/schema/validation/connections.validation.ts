import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod'
import { connectionsTable, connectionInvitationsTable } from '../connections'

// Connections Validation Schemas
export const connectionSelectSchema = createSelectSchema(connectionsTable)
export const connectionInsertSchema = createInsertSchema(connectionsTable)
export const connectionUpdateSchema = createUpdateSchema(connectionsTable)

// Connection Invitations Validation Schemas
export const connectionInvitationSelectSchema = createSelectSchema(
  connectionInvitationsTable
)
export const connectionInvitationInsertSchema = createInsertSchema(
  connectionInvitationsTable,
  {
    message: (schema) =>
      schema.max(500, 'Invitation message must be at most 500 characters'),
  }
)
export const connectionInvitationUpdateSchema = createUpdateSchema(
  connectionInvitationsTable,
  {
    message: (schema) =>
      schema.max(500, 'Invitation message must be at most 500 characters'),
  }
)

// API-specific schemas
export const createConnectionInvitationSchema = z.object({
  receiverUsername: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    ),
  message: z
    .string()
    .max(500, 'Invitation message must be at most 500 characters')
    .optional(),
})

export const respondToInvitationSchema = z.object({
  action: z.enum(['accept', 'decline'], {
    message: 'Action must be either accept or decline',
  }),
})

export const followUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    ),
})

// Query parameter schemas
export const connectionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
})

export const invitationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z
    .enum(['pending', 'accepted', 'declined', 'rejected', 'withdrawn'])
    .optional(),
  type: z.enum(['sent', 'received']).optional(),
})

// Type exports for TypeScript inference
export type ConnectionSelect = z.infer<typeof connectionSelectSchema>
export type ConnectionInsert = z.infer<typeof connectionInsertSchema>
export type ConnectionUpdate = z.infer<typeof connectionUpdateSchema>

export type ConnectionInvitationSelect = z.infer<
  typeof connectionInvitationSelectSchema
>
export type ConnectionInvitationInsert = z.infer<
  typeof connectionInvitationInsertSchema
>
export type ConnectionInvitationUpdate = z.infer<
  typeof connectionInvitationUpdateSchema
>

export type CreateConnectionInvitation = z.infer<
  typeof createConnectionInvitationSchema
>
export type RespondToInvitation = z.infer<typeof respondToInvitationSchema>
export type FollowUser = z.infer<typeof followUserSchema>
export type ConnectionQuery = z.infer<typeof connectionQuerySchema>
export type InvitationQuery = z.infer<typeof invitationQuerySchema>
