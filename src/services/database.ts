import { 
  getDb, 
  profilesTable, 
  userSettingsTable,
  postsTable,
  type Profile,
  type NewProfile,
  type UpdateProfile,
  type UserSettings,
  type NewUserSettings,
  type UpdateUserSettings,
  type UserWithProfile,
  type Post,
  type NewPost,
  type UpdatePost
} from '@/db'
import { eq, and } from 'drizzle-orm'

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
        .where(eq(profilesTable.username, username))
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
      
      // Create profile
      const [profile] = await db.insert(profilesTable).values({
        id: userId,
        ...profileData
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

    async findPublicPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
      const db = getDb()
      return await db.select().from(postsTable)
        .where(and(
          eq(postsTable.visibility, 'public'),
          eq(postsTable.isPublished, true)
        ))
        .limit(limit)
        .offset(offset)
        .orderBy(postsTable.publishedAt)
    },

    async findByAuthor(authorId: string): Promise<Post[]> {
      const db = getDb()
      return await db.select().from(postsTable)
        .where(eq(postsTable.authorId, authorId))
        .orderBy(postsTable.createdAt)
    },

    async update(id: string, data: UpdatePost): Promise<Post> {
      const db = getDb()
      const [updated] = await db.update(postsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(postsTable.id, id))
        .returning()
      return updated
    }
  }
}