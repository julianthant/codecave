import { 
  getDb, 
  profilesTable, 
  userSettingsTable,
  postsTable,
  connectionsTable,
  connectionInvitationsTable,
  collaborationsTable,
  // Future tables - will be used when features are implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collaborationApplicationsTable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collaborationSavesTable,
  postLikesTable,
  postBookmarksTable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postCommentsTable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postRepostsTable,
  notificationsTable,
  projectsTable,
  type Profile,
  type NewProfile,
  type UpdateProfile,
  type UserSettings,
  type NewUserSettings,
  type UpdateUserSettings,
  type UserWithProfile,
  type Post,
  type NewPost,
  type UpdatePost,
  type PostWithAuthor,
  type Connection,
  // Future types - will be used when features are implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewConnection,
  type ConnectionInvitation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewConnectionInvitation,
  type Collaboration,
  type NewCollaboration,
  type UpdateCollaboration,
  type CollaborationWithAuthor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type CollaborationApplication,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewCollaborationApplication,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type CollaborationSave,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewCollaborationSave,
  type PostLike,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewPostLike,
  type PostBookmark,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewPostBookmark,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type PostComment,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewPostComment,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type CommentWithAuthor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type PostRepost,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type NewPostRepost,
  type Notification,
  type NewNotification,
  type Project,
  type NewProject,
  type UpdateProject,
} from '@/db'
import { eq, and, or, desc, count, sql } from 'drizzle-orm'

// Keep asc import for future use in sorting functionality

export const dbService = {
  // Profiles (public data)
  profiles: {
    async create(profileData: Omit<NewProfile, 'createdAt' | 'updatedAt'>): Promise<Profile> {
      const db = getDb()
      const [profile] = await db.insert(profilesTable).values(profileData).returning()
      return profile
    },
    
    async findByUsername(username: string): Promise<Profile | null> {
      const db = getDb()
      const [profile] = await db.select().from(profilesTable)
        .where(eq(profilesTable.username, username.toLowerCase()))
        .limit(1)
      return profile || null
    },
    
    async findById(id: string): Promise<Profile | null> {
      const db = getDb()
      const [profile] = await db.select().from(profilesTable)
        .where(eq(profilesTable.id, id))
        .limit(1)
      return profile || null
    },
    
    async update(id: string, data: UpdateProfile): Promise<Profile> {
      const db = getDb()
      const [updated] = await db.update(profilesTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profilesTable.id, id))
        .returning()
      return updated
    },
    
    async checkUsernameAvailable(username: string): Promise<boolean> {
      const profile = await this.findByUsername(username)
      return !profile
    },

    async searchProfiles(query: string, limit: number = 10): Promise<Profile[]> {
      const db = getDb()
      const searchTerm = `%${query.toLowerCase()}%`
      return await db.select().from(profilesTable)
        .where(or(
          sql`lower(${profilesTable.username}) LIKE ${searchTerm}`,
          sql`lower(${profilesTable.displayName}) LIKE ${searchTerm}`,
          sql`lower(${profilesTable.bio}) LIKE ${searchTerm}`
        ))
        .limit(limit)
    },

    async getProfileStats(userId: string): Promise<{ postCount: number; projectCount: number; followerCount: number }> {
      const db = getDb()
      
      const [followers] = await db.select({ count: count() }).from(connectionsTable)
        .where(eq(connectionsTable.followingId, userId))
      
      const [posts] = await db.select({ count: count() }).from(postsTable)
        .where(and(eq(postsTable.authorId, userId), eq(postsTable.isPublished, true)))
      
      const [projects] = await db.select({ count: count() }).from(projectsTable)
        .where(and(eq(projectsTable.userId, userId), eq(projectsTable.isPrivate, false)))

      return {
        followerCount: followers.count,
        postCount: posts.count,
        projectCount: projects.count,
      }
    }
  },

  // User Settings (private data)  
  userSettings: {
    async create(settingsData: Omit<NewUserSettings, 'createdAt' | 'updatedAt'>): Promise<UserSettings> {
      const db = getDb()
      const [settings] = await db.insert(userSettingsTable).values(settingsData).returning()
      return settings
    },
    
    async findById(id: string): Promise<UserSettings | null> {
      const db = getDb()
      const [settings] = await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.id, id))
        .limit(1)
      return settings || null
    },
    
    async update(id: string, data: UpdateUserSettings): Promise<UserSettings> {
      const db = getDb()
      const [updated] = await db.update(userSettingsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userSettingsTable.id, id))
        .returning()
      return updated
    }
  },

  // Combined user operations
  users: {
    async createComplete(userId: string, profileData: Omit<NewProfile, 'id' | 'createdAt' | 'updatedAt'>, settingsData?: Omit<NewUserSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithProfile> {
      const db = getDb()
      
      // Ensure username is lowercase
      const normalizedProfileData = {
        ...profileData,
        username: profileData.username.toLowerCase()
      }
      
      // Create profile
      const [profile] = await db.insert(profilesTable).values({
        id: userId,
        ...normalizedProfileData
      }).returning()
      
      // Create settings (optional)
      let settings: UserSettings | undefined
      if (settingsData) {
        const [userSettings] = await db.insert(userSettingsTable).values({
          id: userId,
          ...settingsData
        }).returning()
        settings = userSettings
      }
      
      return { ...profile, settings }
    },

    async findWithSettings(id: string): Promise<UserWithProfile | null> {
      const profile = await dbService.profiles.findById(id)
      if (!profile) return null
      
      const settings = await dbService.userSettings.findById(id)
      return { ...profile, settings: settings || undefined }
    },

    async findCompleteProfile(username: string): Promise<UserWithProfile & { stats: { postCount: number; projectCount: number; followerCount: number }; posts: Post[]; projects: Project[] } | null> {
      const profile = await dbService.profiles.findByUsername(username)
      if (!profile) return null
      
      const [settings, stats, posts, projects] = await Promise.all([
        dbService.userSettings.findById(profile.id),
        dbService.profiles.getProfileStats(profile.id),
        dbService.posts.findByAuthor(profile.id),
        dbService.projects.findByUser(profile.id, false), // Only public projects
      ])

      return {
        ...profile,
        settings: settings || undefined,
        stats,
        posts,
        projects,
      }
    }
  },

  // Connections (following/followers)
  connections: {
    async create(followerId: string, followingId: string): Promise<Connection> {
      const db = getDb()
      const [connection] = await db.insert(connectionsTable).values({
        followerId,
        followingId,
      }).returning()
      return connection
    },

    async delete(followerId: string, followingId: string): Promise<void> {
      const db = getDb()
      await db.delete(connectionsTable).where(
        and(
          eq(connectionsTable.followerId, followerId),
          eq(connectionsTable.followingId, followingId)
        )
      )
    },

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
      const db = getDb()
      const [connection] = await db.select().from(connectionsTable)
        .where(and(
          eq(connectionsTable.followerId, followerId),
          eq(connectionsTable.followingId, followingId)
        ))
        .limit(1)
      return !!connection
    },

    async getFollowers(userId: string, limit: number = 50): Promise<Profile[]> {
      const db = getDb()
      return await db.select({
        id: profilesTable.id,
        username: profilesTable.username,
        displayName: profilesTable.displayName,
        bio: profilesTable.bio,
        avatarUrl: profilesTable.avatarUrl,
        coverImageUrl: profilesTable.coverImageUrl,
        tagline: profilesTable.tagline,
        isVerified: profilesTable.isVerified,
        location: profilesTable.location,
        portfolioUrl: profilesTable.portfolioUrl,
        githubUsername: profilesTable.githubUsername,
        twitterUsername: profilesTable.twitterUsername,
        discordUsername: profilesTable.discordUsername,
        linkedinUrl: profilesTable.linkedinUrl,
        createdAt: profilesTable.createdAt,
        updatedAt: profilesTable.updatedAt,
      })
        .from(connectionsTable)
        .innerJoin(profilesTable, eq(connectionsTable.followerId, profilesTable.id))
        .where(eq(connectionsTable.followingId, userId))
        .limit(limit)
        .orderBy(desc(connectionsTable.createdAt))
    },

    async getFollowing(userId: string, limit: number = 50): Promise<Profile[]> {
      const db = getDb()
      return await db.select({
        id: profilesTable.id,
        username: profilesTable.username,
        displayName: profilesTable.displayName,
        bio: profilesTable.bio,
        avatarUrl: profilesTable.avatarUrl,
        coverImageUrl: profilesTable.coverImageUrl,
        tagline: profilesTable.tagline,
        isVerified: profilesTable.isVerified,
        location: profilesTable.location,
        portfolioUrl: profilesTable.portfolioUrl,
        githubUsername: profilesTable.githubUsername,
        twitterUsername: profilesTable.twitterUsername,
        discordUsername: profilesTable.discordUsername,
        linkedinUrl: profilesTable.linkedinUrl,
        createdAt: profilesTable.createdAt,
        updatedAt: profilesTable.updatedAt,
      })
        .from(connectionsTable)
        .innerJoin(profilesTable, eq(connectionsTable.followingId, profilesTable.id))
        .where(eq(connectionsTable.followerId, userId))
        .limit(limit)
        .orderBy(desc(connectionsTable.createdAt))
    },

    async getSuggestions(userId: string, limit: number = 10): Promise<Profile[]> {
      const db = getDb()
      // Simple suggestion: users not already followed
      return await db.select().from(profilesTable)
        .where(and(
          sql`${profilesTable.id} != ${userId}`,
          sql`${profilesTable.id} NOT IN (
            SELECT following_id FROM ${connectionsTable} 
            WHERE follower_id = ${userId}
          )`
        ))
        .limit(limit)
        .orderBy(desc(profilesTable.createdAt))
    },

    async getFollowersCount(userId: string): Promise<number> {
      const db = getDb()
      const [result] = await db.select({ count: count() }).from(connectionsTable)
        .where(eq(connectionsTable.followingId, userId))
      return result.count
    },

    async getFollowingCount(userId: string): Promise<number> {
      const db = getDb()
      const [result] = await db.select({ count: count() }).from(connectionsTable)
        .where(eq(connectionsTable.followerId, userId))
      return result.count
    },

    async findConnection(followerId: string, followingId: string): Promise<Connection | null> {
      const db = getDb()
      const [connection] = await db.select().from(connectionsTable)
        .where(and(
          eq(connectionsTable.followerId, followerId),
          eq(connectionsTable.followingId, followingId)
        ))
        .limit(1)
      return connection || null
    }
  },

  // Connection Invitations
  connectionInvitations: {
    async create(senderId: string, receiverId: string, message?: string): Promise<ConnectionInvitation> {
      const db = getDb()
      const [invitation] = await db.insert(connectionInvitationsTable).values({
        senderId,
        receiverId,
        message,
      }).returning()
      return invitation
    },

    async update(id: string, status: 'accepted' | 'declined', respondedAt?: Date): Promise<ConnectionInvitation> {
      const db = getDb()
      const [updated] = await db.update(connectionInvitationsTable)
        .set({ status, respondedAt: respondedAt || new Date() })
        .where(eq(connectionInvitationsTable.id, id))
        .returning()
      return updated
    },

    async getReceived(userId: string): Promise<ConnectionInvitation[]> {
      const db = getDb()
      return await db.select().from(connectionInvitationsTable)
        .where(eq(connectionInvitationsTable.receiverId, userId))
        .orderBy(desc(connectionInvitationsTable.createdAt))
    },

    async getSent(userId: string): Promise<ConnectionInvitation[]> {
      const db = getDb()
      return await db.select().from(connectionInvitationsTable)
        .where(eq(connectionInvitationsTable.senderId, userId))
        .orderBy(desc(connectionInvitationsTable.createdAt))
    }
  },

  // Posts
  posts: {
    async create(postData: Omit<NewPost, 'createdAt' | 'updatedAt'>): Promise<Post> {
      const db = getDb()
      const [post] = await db.insert(postsTable).values(postData).returning()
      return post
    },

    async findById(id: string): Promise<Post | null> {
      const db = getDb()
      const [post] = await db.select().from(postsTable)
        .where(eq(postsTable.id, id))
        .limit(1)
      return post || null
    },

    async findWithAuthor(id: string): Promise<PostWithAuthor | null> {
      const db = getDb()
      const result = await db.select()
        .from(postsTable)
        .innerJoin(profilesTable, eq(postsTable.authorId, profilesTable.id))
        .where(eq(postsTable.id, id))
        .limit(1)
      
      if (!result.length) return null
      
      const { posts, profiles } = result[0]
      return { ...posts, author: profiles }
    },

    async findPublicPosts(limit: number = 10, offset: number = 0): Promise<PostWithAuthor[]> {
      const db = getDb()
      const results = await db.select()
        .from(postsTable)
        .innerJoin(profilesTable, eq(postsTable.authorId, profilesTable.id))
        .where(and(
          eq(postsTable.visibility, 'public'),
          eq(postsTable.isPublished, true)
        ))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(postsTable.publishedAt))

      return results.map(({ posts, profiles }) => ({ ...posts, author: profiles }))
    },

    async findByAuthor(authorId: string): Promise<Post[]> {
      const db = getDb()
      return await db.select().from(postsTable)
        .where(eq(postsTable.authorId, authorId))
        .orderBy(desc(postsTable.createdAt))
    },

    async update(id: string, data: UpdatePost): Promise<Post> {
      const db = getDb()
      const [updated] = await db.update(postsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(postsTable.id, id))
        .returning()
      return updated
    },

    async incrementViewCount(id: string): Promise<void> {
      const db = getDb()
      await db.update(postsTable)
        .set({ viewCount: sql`${postsTable.viewCount} + 1` })
        .where(eq(postsTable.id, id))
    }
  },

  // Post Likes
  postLikes: {
    async create(postId: string, userId: string): Promise<PostLike> {
      const db = getDb()
      const [like] = await db.insert(postLikesTable).values({ postId, userId }).returning()
      
      // Update post like count
      await db.update(postsTable)
        .set({ likeCount: sql`${postsTable.likeCount} + 1` })
        .where(eq(postsTable.id, postId))
      
      return like
    },

    async delete(postId: string, userId: string): Promise<void> {
      const db = getDb()
      await db.delete(postLikesTable).where(
        and(eq(postLikesTable.postId, postId), eq(postLikesTable.userId, userId))
      )
      
      // Update post like count
      await db.update(postsTable)
        .set({ likeCount: sql`${postsTable.likeCount} - 1` })
        .where(eq(postsTable.id, postId))
    },

    async isLiked(postId: string, userId: string): Promise<boolean> {
      const db = getDb()
      const [like] = await db.select().from(postLikesTable)
        .where(and(eq(postLikesTable.postId, postId), eq(postLikesTable.userId, userId)))
        .limit(1)
      return !!like
    }
  },

  // Post Bookmarks
  postBookmarks: {
    async create(postId: string, userId: string): Promise<PostBookmark> {
      const db = getDb()
      const [bookmark] = await db.insert(postBookmarksTable).values({ postId, userId }).returning()
      return bookmark
    },

    async delete(postId: string, userId: string): Promise<void> {
      const db = getDb()
      await db.delete(postBookmarksTable).where(
        and(eq(postBookmarksTable.postId, postId), eq(postBookmarksTable.userId, userId))
      )
    },

    async isBookmarked(postId: string, userId: string): Promise<boolean> {
      const db = getDb()
      const [bookmark] = await db.select().from(postBookmarksTable)
        .where(and(eq(postBookmarksTable.postId, postId), eq(postBookmarksTable.userId, userId)))
        .limit(1)
      return !!bookmark
    },

    async getUserBookmarks(userId: string): Promise<PostWithAuthor[]> {
      const db = getDb()
      const results = await db.select()
        .from(postBookmarksTable)
        .innerJoin(postsTable, eq(postBookmarksTable.postId, postsTable.id))
        .innerJoin(profilesTable, eq(postsTable.authorId, profilesTable.id))
        .where(eq(postBookmarksTable.userId, userId))
        .orderBy(desc(postBookmarksTable.createdAt))

      return results.map(({ posts, profiles }) => ({ ...posts, author: profiles }))
    }
  },

  // Collaborations
  collaborations: {
    async create(collaborationData: Omit<NewCollaboration, 'createdAt' | 'updatedAt'>): Promise<Collaboration> {
      const db = getDb()
      const [collaboration] = await db.insert(collaborationsTable).values(collaborationData).returning()
      return collaboration
    },

    async findById(id: string): Promise<Collaboration | null> {
      const db = getDb()
      const [collaboration] = await db.select().from(collaborationsTable)
        .where(eq(collaborationsTable.id, id))
        .limit(1)
      return collaboration || null
    },

    async findWithAuthor(id: string): Promise<CollaborationWithAuthor | null> {
      const db = getDb()
      const result = await db.select()
        .from(collaborationsTable)
        .innerJoin(profilesTable, eq(collaborationsTable.createdBy, profilesTable.id))
        .where(eq(collaborationsTable.id, id))
        .limit(1)
      
      if (!result.length) return null
      
      const { collaborations, profiles } = result[0]
      return { ...collaborations, author: profiles }
    },

    async findAll(filters: {
      type?: string
      status?: string
      remote?: boolean
      limit?: number
      offset?: number
    } = {}): Promise<CollaborationWithAuthor[]> {
      const db = getDb()
      const { limit = 20, offset = 0, ...whereFilters } = filters
      
      const whereConditions: Array<ReturnType<typeof eq> | ReturnType<typeof and> | ReturnType<typeof or>> = []
      
      if (whereFilters.type) {
        whereConditions.push(eq(collaborationsTable.type, whereFilters.type as typeof collaborationsTable.type.enumValues[number]))
      }
      if (whereFilters.status) {
        whereConditions.push(eq(collaborationsTable.status, whereFilters.status as typeof collaborationsTable.status.enumValues[number]))
      }
      if (typeof whereFilters.remote === 'boolean') {
        whereConditions.push(eq(collaborationsTable.remote, whereFilters.remote))
      }

      const results = await db.select()
        .from(collaborationsTable)
        .innerJoin(profilesTable, eq(collaborationsTable.createdBy, profilesTable.id))
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(collaborationsTable.createdAt))

      return results.map(({ collaborations, profiles }) => ({ ...collaborations, author: profiles }))
    },

    async findByUser(userId: string): Promise<Collaboration[]> {
      const db = getDb()
      return await db.select().from(collaborationsTable)
        .where(eq(collaborationsTable.createdBy, userId))
        .orderBy(desc(collaborationsTable.createdAt))
    },

    async update(id: string, data: UpdateCollaboration): Promise<Collaboration> {
      const db = getDb()
      const [updated] = await db.update(collaborationsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(collaborationsTable.id, id))
        .returning()
      return updated
    },

    async incrementViewCount(id: string): Promise<void> {
      const db = getDb()
      await db.update(collaborationsTable)
        .set({ viewCount: sql`${collaborationsTable.viewCount} + 1` })
        .where(eq(collaborationsTable.id, id))
    }
  },

  // Projects
  projects: {
    async create(projectData: Omit<NewProject, 'createdAt' | 'updatedAt'>): Promise<Project> {
      const db = getDb()
      const [project] = await db.insert(projectsTable).values(projectData).returning()
      return project
    },

    async findByUser(userId: string, includePrivate: boolean = true): Promise<Project[]> {
      const db = getDb()
      const whereConditions = [eq(projectsTable.userId, userId)]
      
      if (!includePrivate) {
        whereConditions.push(eq(projectsTable.isPrivate, false))
      }

      return await db.select().from(projectsTable)
        .where(and(...whereConditions))
        .orderBy(desc(projectsTable.updatedAt))
    },

    async update(id: string, data: UpdateProject): Promise<Project> {
      const db = getDb()
      const [updated] = await db.update(projectsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projectsTable.id, id))
        .returning()
      return updated
    },

    async delete(id: string): Promise<void> {
      const db = getDb()
      await db.delete(projectsTable).where(eq(projectsTable.id, id))
    }
  },

  // Notifications
  notifications: {
    async create(notificationData: Omit<NewNotification, 'createdAt'>): Promise<Notification> {
      const db = getDb()
      const [notification] = await db.insert(notificationsTable).values(notificationData).returning()
      return notification
    },

    async findByUser(userId: string, limit: number = 50): Promise<Notification[]> {
      const db = getDb()
      return await db.select().from(notificationsTable)
        .where(eq(notificationsTable.userId, userId))
        .limit(limit)
        .orderBy(desc(notificationsTable.createdAt))
    },

    async markAsRead(id: string): Promise<Notification> {
      const db = getDb()
      const [updated] = await db.update(notificationsTable)
        .set({ read: true })
        .where(eq(notificationsTable.id, id))
        .returning()
      return updated
    },

    async markAllAsRead(userId: string): Promise<void> {
      const db = getDb()
      await db.update(notificationsTable)
        .set({ read: true })
        .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.read, false)))
    },

    async getUnreadCount(userId: string): Promise<number> {
      const db = getDb()
      const [result] = await db.select({ count: count() }).from(notificationsTable)
        .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.read, false)))
      return result.count
    }
  }
}