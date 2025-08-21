import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { profilesTable } from './profiles'

// PROJECTS - For profile showcase
export const projectsTable = pgTable('projects', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  name: text('name').notNull(),
  description: text('description'),
  technologies: text('technologies').array(),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  imageUrl: text('image_url'),
  stars: integer('stars').notNull().default(0),
  forks: integer('forks').notNull().default(0),
  isPrivate: boolean('is_private').notNull().default(false),
  language: text('language'),
  ...timestamps,
})

// Type exports
export type Project = typeof projectsTable.$inferSelect
export type NewProject = typeof projectsTable.$inferInsert
export type UpdateProject = Partial<Omit<NewProject, 'id' | 'createdAt' | 'userId'>>