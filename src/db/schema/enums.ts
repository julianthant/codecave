import { pgEnum } from 'drizzle-orm/pg-core'

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