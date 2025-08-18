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