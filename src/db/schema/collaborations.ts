import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { 
  collaborationTypeEnum, 
  collaborationExperienceEnum, 
  timeCommitmentEnum, 
  compensationTypeEnum, 
  statusEnum, 
  collaborationStatusEnum 
} from './enums'
import { profilesTable } from './profiles'

// COLLABORATIONS - Project collaboration opportunities
export const collaborationsTable = pgTable('collaborations', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdBy: uuid('created_by').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  type: collaborationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').array(),
  technologies: text('technologies').array(),
  skillsNeeded: text('skills_needed').array(),
  experienceLevel: collaborationExperienceEnum('experience_level'),
  timeCommitment: timeCommitmentEnum('time_commitment'),
  teamSizeCurrent: integer('team_size_current').notNull().default(1),
  teamSizeNeeded: integer('team_size_needed'),
  remote: boolean('remote').notNull().default(true),
  location: text('location'),
  deadline: timestamp('deadline'),
  compensationType: compensationTypeEnum('compensation_type'),
  compensationDetails: text('compensation_details'),
  status: collaborationStatusEnum('status').notNull().default('open'),
  githubRepo: text('github_repo'),
  projectUrl: text('project_url'),
  tags: text('tags').array(),
  viewCount: integer('view_count').notNull().default(0),
  saveCount: integer('save_count').notNull().default(0),
  applicationCount: integer('application_count').notNull().default(0),
  ...timestamps,
})

// COLLABORATION APPLICATIONS
export const collaborationApplicationsTable = pgTable('collaboration_applications', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  collaborationId: uuid('collaboration_id').notNull().references(() => collaborationsTable.id, {
    onDelete: 'cascade',
  }),
  applicantId: uuid('applicant_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  message: text('message').notNull(),
  portfolio: text('portfolio'),
  githubProfile: text('github_profile'),
  relevantExperience: text('relevant_experience'),
  availability: text('availability'),
  status: statusEnum('status').notNull().default('pending'),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  respondedAt: timestamp('responded_at'),
}, (table) => ({
  uniqueApplication: unique('unique_collaboration_application').on(table.collaborationId, table.applicantId),
}))

// COLLABORATION SAVES
export const collaborationSavesTable = pgTable('collaboration_saves', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  collaborationId: uuid('collaboration_id').notNull().references(() => collaborationsTable.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  ...timestamps,
}, (table) => ({
  uniqueSave: unique('unique_collaboration_save').on(table.collaborationId, table.userId),
}))

// Type exports
export type Collaboration = typeof collaborationsTable.$inferSelect
export type NewCollaboration = typeof collaborationsTable.$inferInsert
export type UpdateCollaboration = Partial<Omit<NewCollaboration, 'id' | 'createdAt' | 'createdBy'>>

export type CollaborationApplication = typeof collaborationApplicationsTable.$inferSelect
export type NewCollaborationApplication = typeof collaborationApplicationsTable.$inferInsert

export type CollaborationSave = typeof collaborationSavesTable.$inferSelect
export type NewCollaborationSave = typeof collaborationSavesTable.$inferInsert