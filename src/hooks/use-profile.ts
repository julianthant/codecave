import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Profile, UserSettings, Post } from '@/db/schema'

// Transform Project type for UI components
export interface ProjectData {
  id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  stars: number
  forks: number
  isPrivate: boolean
  lastUpdated: string
  language: string
}

export interface ProfileStats {
  followers: number
  following: number
  posts: number
  projects: number
  totalLikes: number
}

export interface ProfileData {
  profile: Profile
  userSettings?: UserSettings
  posts: Post[]
  projects: ProjectData[]
  stats: ProfileStats
  isOwnProfile: boolean
}

// Query keys for consistent caching
export const profileKeys = {
  all: ['profiles'] as const,
  detail: (username: string) => ['profiles', username] as const,
  posts: (username: string) => ['profiles', username, 'posts'] as const,
  projects: (username: string) => ['profiles', username, 'projects'] as const,
}

// Fetch profile data by username
async function fetchProfile(username: string): Promise<ProfileData> {
  const response = await fetch(`/api/profiles/${username}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Profile not found')
    }
    throw new Error('Failed to fetch profile')
  }

  return response.json()
}

// Hook to fetch profile data
export function useProfile(username: string) {
  return useQuery({
    queryKey: profileKeys.detail(username),
    queryFn: () => fetchProfile(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry 404 errors or server errors
      if (error.message === 'Profile not found' || error.message.includes('Failed to fetch profile')) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Hook to update profile (for own profile)
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      username, 
      updates 
    }: { 
      username: string
      updates: Partial<Profile>
    }) => {
      const response = await fetch(`/api/profiles/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      return response.json()
    },
    onSuccess: (data, { username }) => {
      // Update the cached profile data
      queryClient.setQueryData(
        profileKeys.detail(username),
        (old: ProfileData | undefined) =>
          old ? { ...old, profile: data.profile } : undefined
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(username)
      })
    },
  })
}

// Hook to follow/unfollow a user
export function useToggleFollow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      username, 
      action 
    }: { 
      username: string
      action: 'follow' | 'unfollow'
    }) => {
      const response = await fetch(`/api/profiles/${username}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`)
      }

      return response.json()
    },
    onSuccess: (data, { username }) => {
      // Update the cached profile stats
      queryClient.setQueryData(
        profileKeys.detail(username),
        (old: ProfileData | undefined) => {
          if (!old) return old
          return {
            ...old,
            stats: {
              ...old.stats,
              followers: data.followerCount,
            },
          }
        }
      )
    },
  })
}

// Hook to fetch user's own profile data (includes private settings)
export function useOwnProfile(username?: string) {
  return useQuery({
    queryKey: profileKeys.detail(username || ''),
    queryFn: () => fetchProfile(username || ''),
    enabled: Boolean(username),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter since it includes private data)
  })
}

// Hook to update user settings
export function useUpdateUserSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      username,
      settings
    }: {
      username: string
      settings: Partial<UserSettings>
    }) => {
      const response = await fetch(`/api/profiles/${username}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      return response.json()
    },
    onSuccess: (data, { username }) => {
      // Update the cached profile data
      queryClient.setQueryData(
        profileKeys.detail(username),
        (old: ProfileData | undefined) =>
          old ? { ...old, userSettings: data.settings } : undefined
      )
    },
  })
}