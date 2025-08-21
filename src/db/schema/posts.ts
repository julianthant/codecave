import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  jsonb,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { timestamps } from './helpers'
import { postVisibilityEnum, postTypeEnum } from './enums'
import { profilesTable } from './profiles'

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
  ...timestamps,
})

// POST ENGAGEMENT TABLES
export const postLikesTable = pgTable('post_likes', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => postsTable.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').notNull().references(() => profilesTable.id, {
    onDelete: 'cascade',
  }),
  ...timestamps,
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
  ...timestamps,
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
  ...timestamps,
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
  ...timestamps,
}, (table) => ({
  uniqueRepost: unique('unique_post_repost').on(table.postId, table.userId),
}))

// Type exports
export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert
export type UpdatePost = Partial<Omit<NewPost, 'id' | 'createdAt'>>

export type PostLike = typeof postLikesTable.$inferSelect
export type NewPostLike = typeof postLikesTable.$inferInsert

export type PostBookmark = typeof postBookmarksTable.$inferSelect
export type NewPostBookmark = typeof postBookmarksTable.$inferInsert

export type PostComment = typeof postCommentsTable.$inferSelect
export type NewPostComment = typeof postCommentsTable.$inferInsert

export type PostRepost = typeof postRepostsTable.$inferSelect
export type NewPostRepost = typeof postRepostsTable.$inferInsert