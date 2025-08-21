import {
  pgTable,
  text,
  uuid,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { statusEnum } from './enums'
import { profilesTable } from './profiles'

// CONNECTIONS - Following/Followers system
export const connectionsTable = pgTable('connections', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  followerId: uuid('follower_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  followingId: uuid('following_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueConnection: unique('unique_connection').on(table.followerId, table.followingId),
  // noSelfFollow: check('no_self_follow', sql`follower_id != following_id`),
}))

// CONNECTION INVITATIONS
export const connectionInvitationsTable = pgTable('connection_invitations', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  senderId: uuid('sender_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  receiverId: uuid('receiver_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  message: text('message'),
  status: statusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  respondedAt: timestamp('responded_at'),
}, (table) => ({
  uniqueInvitation: unique('unique_invitation').on(table.senderId, table.receiverId),
  // noSelfInvite: check('no_self_invite', sql`sender_id != receiver_id`),
}))

// Type exports
export type Connection = typeof connectionsTable.$inferSelect
export type NewConnection = typeof connectionsTable.$inferInsert

export type ConnectionInvitation = typeof connectionInvitationsTable.$inferSelect
export type NewConnectionInvitation = typeof connectionInvitationsTable.$inferInsert