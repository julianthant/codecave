import {
  pgTable,
  text,
  uuid,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { notificationTypeEnum } from './enums'
import { profilesTable } from './profiles'

// NOTIFICATIONS
export const notificationsTable = pgTable('notifications', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  data: jsonb('data'),
  read: boolean('read').notNull().default(false),
  ...timestamps,
})

// Type exports
export type Notification = typeof notificationsTable.$inferSelect
export type NewNotification = typeof notificationsTable.$inferInsert