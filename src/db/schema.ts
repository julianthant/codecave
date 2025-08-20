import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  integer,
  pgEnum,
  jsonb,
  unique,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Enums
export const experienceLevelEnum = pgEnum('experience_level', [
  'student',
  'junior',
  'mid',
  'senior',
  'lead',
])

export const postVisibilityEnum = pgEnum('post_visibility', [
  'public',
  'private', 
  'unlisted',
  'followers',
])

export const postTypeEnum = pgEnum('post_type', [
  'article',
  'snippet',
  'project',
  'thought',
])

export const collaborationTypeEnum = pgEnum('collaboration_type', [
  'project',
  'code-review',
  'mentorship',
  'hackathon',
  'open-source',
  'study-group',
  'startup',
])

export const collaborationExperienceEnum = pgEnum('collaboration_experience', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
])

export const timeCommitmentEnum = pgEnum('time_commitment', [
  'few-hours',
  'few-days',
  'few-weeks',
  'few-months',
  'ongoing',
])

export const compensationTypeEnum = pgEnum('compensation_type', [
  'paid',
  'equity',
  'volunteer',
  'open',
])

export const statusEnum = pgEnum('status', [
  'pending',
  'accepted',
  'declined',
  'rejected',
  'withdrawn',
])

export const collaborationStatusEnum = pgEnum('collaboration_status', [
  'open',
  'in-progress',
  'completed',
  'cancelled',
])

export const notificationTypeEnum = pgEnum('notification_type', [
  'follow',
  'like',
  'comment',
  'mention',
  'collaboration',
  'system',
])

// PUBLIC DATA - Profiles table (publicly readable)
export const profilesTable = pgTable('profiles', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Public profile information
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),
  tagline: text('tagline'),
  
  // Additional profile fields
  isVerified: boolean('is_verified').notNull().default(false),
  location: text('location'),
  portfolioUrl: text('portfolio_url'),

  // Public social links
  githubUsername: text('github_username'),
  twitterUsername: text('twitter_username'),
  discordUsername: text('discord_username'),
  linkedinUrl: text('linkedin_url'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, () => ({
  // Table constraints can be added here when needed
}))

// PRIVATE DATA - User settings (only owner can access)
export const userSettingsTable = pgTable('user_settings', {
  // Links to auth.users.id
  id: uuid('id').primaryKey().notNull(),
  
  // Private developer profile
  skills: text('skills').array().notNull().default([]),
  languages: text('languages').array().notNull().default([]),
  experienceLevel: experienceLevelEnum('experience_level'),
  availableForCollab: boolean('available_for_collab').notNull().default(false),
  
  // Private user preferences  
  emailNotifications: boolean('email_notifications').notNull().default(true),
  theme: text('theme').default('system'), // 'light', 'dark', 'system'
  timezone: text('timezone').default('UTC'),
  privacySettings: jsonb('privacy_settings').default({}),
  
  // System fields
  isPro: boolean('is_pro').notNull().default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// POSTS - With visibility control
export const postsTable = pgTable('posts', {
  id: uuid('id').primaryKey().notNull(),
  
  // Author reference (links to profiles.id)
  authorId: uuid('author_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  
  // Post content
  title: text('title').notNull(),
  slug: text('slug').unique(),
  content: jsonb('content').notNull(), // Rich content blocks
  excerpt: text('excerpt'),
  type: postTypeEnum('type').notNull().default('article'),
  
  // Visibility and status
  visibility: postVisibilityEnum('visibility').notNull().default('public'),
  isPublished: boolean('is_published').notNull().default(false),
  isDraft: boolean('is_draft').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  
  // Metadata
  tags: text('tags').array().notNull().default([]),
  readingTime: text('reading_time'), // "5 min read"
  
  // Stats (updated by triggers)
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  repostCount: integer('repost_count').notNull().default(0),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

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
  noSelfFollow: check('no_self_follow', sql`follower_id != following_id`),
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
  noSelfInvite: check('no_self_invite', sql`sender_id != receiver_id`),
}))

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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueSave: unique('unique_collaboration_save').on(table.collaborationId, table.userId),
}))

// POST ENGAGEMENT TABLES
export const postLikesTable = pgTable('post_likes', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => postsTable.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueLike: unique('unique_post_like').on(table.postId, table.userId),
}))

export const postBookmarksTable = pgTable('post_bookmarks', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => postsTable.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueBookmark: unique('unique_post_bookmark').on(table.postId, table.userId),
}))

export const postCommentsTable = pgTable('post_comments', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => postsTable.id, {
    onDelete: 'cascade',
  }),
  authorId: uuid('author_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  parentId: uuid('parent_id'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const postRepostsTable = pgTable('post_reposts', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => postsTable.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  message: text('message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueRepost: unique('unique_post_repost').on(table.postId, table.userId),
}))

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
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Type exports for tables
export type Profile = typeof profilesTable.$inferSelect
export type NewProfile = typeof profilesTable.$inferInsert
export type UpdateProfile = Partial<Omit<NewProfile, 'id' | 'createdAt'>>

export type UserSettings = typeof userSettingsTable.$inferSelect
export type NewUserSettings = typeof userSettingsTable.$inferInsert
export type UpdateUserSettings = Partial<Omit<NewUserSettings, 'id' | 'createdAt'>>

export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert
export type UpdatePost = Partial<Omit<NewPost, 'id' | 'createdAt'>>

export type Connection = typeof connectionsTable.$inferSelect
export type NewConnection = typeof connectionsTable.$inferInsert

export type ConnectionInvitation = typeof connectionInvitationsTable.$inferSelect
export type NewConnectionInvitation = typeof connectionInvitationsTable.$inferInsert

export type Collaboration = typeof collaborationsTable.$inferSelect
export type NewCollaboration = typeof collaborationsTable.$inferInsert
export type UpdateCollaboration = Partial<Omit<NewCollaboration, 'id' | 'createdAt' | 'createdBy'>>

export type CollaborationApplication = typeof collaborationApplicationsTable.$inferSelect
export type NewCollaborationApplication = typeof collaborationApplicationsTable.$inferInsert

export type CollaborationSave = typeof collaborationSavesTable.$inferSelect
export type NewCollaborationSave = typeof collaborationSavesTable.$inferInsert

export type PostLike = typeof postLikesTable.$inferSelect
export type NewPostLike = typeof postLikesTable.$inferInsert

export type PostBookmark = typeof postBookmarksTable.$inferSelect
export type NewPostBookmark = typeof postBookmarksTable.$inferInsert

export type PostComment = typeof postCommentsTable.$inferSelect
export type NewPostComment = typeof postCommentsTable.$inferInsert

export type PostRepost = typeof postRepostsTable.$inferSelect
export type NewPostRepost = typeof postRepostsTable.$inferInsert

export type Notification = typeof notificationsTable.$inferSelect
export type NewNotification = typeof notificationsTable.$inferInsert

export type Project = typeof projectsTable.$inferSelect
export type NewProject = typeof projectsTable.$inferInsert
export type UpdateProject = Partial<Omit<NewProject, 'id' | 'createdAt' | 'userId'>>

// Combined user types for API responses
export type UserWithProfile = Profile & {
  settings?: UserSettings
}

export type PostWithAuthor = Post & {
  author: Profile
}

export type CollaborationWithAuthor = Collaboration & {
  author: Profile
}

export type CommentWithAuthor = PostComment & {
  author: Profile
  replies?: CommentWithAuthor[]
}