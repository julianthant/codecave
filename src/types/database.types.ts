export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          banner_url: string | null
          location: string | null
          timezone: string
          website_url: string | null
          github_username: string | null
          twitter_username: string | null
          discord_username: string | null
          linkedin_url: string | null
          skills: string[]
          languages: string[]
          experience_level: 'student' | 'junior' | 'mid' | 'senior' | 'lead' | null
          years_coding: number | null
          available_for_collab: boolean
          collab_preferences: Json
          is_pro: boolean
          pro_since: string | null
          stripe_customer_id: string | null
          reputation_score: number
          created_at: string
          updated_at: string
          last_seen_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          location?: string | null
          timezone?: string
          website_url?: string | null
          github_username?: string | null
          twitter_username?: string | null
          discord_username?: string | null
          linkedin_url?: string | null
          skills?: string[]
          languages?: string[]
          experience_level?: 'student' | 'junior' | 'mid' | 'senior' | 'lead' | null
          years_coding?: number | null
          available_for_collab?: boolean
          collab_preferences?: Json
          is_pro?: boolean
          pro_since?: string | null
          stripe_customer_id?: string | null
          reputation_score?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          location?: string | null
          timezone?: string
          website_url?: string | null
          github_username?: string | null
          twitter_username?: string | null
          discord_username?: string | null
          linkedin_url?: string | null
          skills?: string[]
          languages?: string[]
          experience_level?: 'student' | 'junior' | 'mid' | 'senior' | 'lead' | null
          years_coding?: number | null
          available_for_collab?: boolean
          collab_preferences?: Json
          is_pro?: boolean
          pro_since?: string | null
          stripe_customer_id?: string | null
          reputation_score?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          search_vector?: unknown | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          blocks: Json
          tags: string[]
          type: 'article' | 'snippet' | 'showcase' | 'discussion' | 'collaboration'
          is_published: boolean
          is_featured: boolean
          published_at: string | null
          view_count: number
          unique_viewers: string[]
          like_count: number
          comment_count: number
          share_count: number
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          blocks?: Json
          tags?: string[]
          type?: 'article' | 'snippet' | 'showcase' | 'discussion' | 'collaboration'
          is_published?: boolean
          is_featured?: boolean
          published_at?: string | null
          view_count?: number
          unique_viewers?: string[]
          like_count?: number
          comment_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          blocks?: Json
          tags?: string[]
          type?: 'article' | 'snippet' | 'showcase' | 'discussion' | 'collaboration'
          is_published?: boolean
          is_featured?: boolean
          published_at?: string | null
          view_count?: number
          unique_viewers?: string[]
          like_count?: number
          comment_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          parent_id?: string | null
          content?: string
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'like' | 'comment' | 'follow' | 'mention' | 'collaboration_request' | 'collaboration_accepted' | 'group_invite' | 'group_post' | 'new_follower_post'
          title: string
          body: string | null
          link: string | null
          data: Json
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'like' | 'comment' | 'follow' | 'mention' | 'collaboration_request' | 'collaboration_accepted' | 'group_invite' | 'group_post' | 'new_follower_post'
          title: string
          body?: string | null
          link?: string | null
          data?: Json
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'like' | 'comment' | 'follow' | 'mention' | 'collaboration_request' | 'collaboration_accepted' | 'group_invite' | 'group_post' | 'new_follower_post'
          title?: string
          body?: string | null
          link?: string | null
          data?: Json
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          notifications: Json
          privacy: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          notifications?: Json
          privacy?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          notifications?: Json
          privacy?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}