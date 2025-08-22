import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useConnectionsStore } from '@/stores/connections.store'
import type { Profile, ConnectionInvitation } from '@/db/schema'
import type { ConnectionStatus } from '@/stores/connections.store'

// API response types
interface ConnectionsResponse {
  following?: Profile[]
  followers?: Profile[]
  suggestions?: Profile[]
}

interface InvitationsResponse {
  invitations: (ConnectionInvitation & { user: Profile; type: 'sent' | 'received'; sentAt: Date })[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

interface SendInvitationData {
  receiverUsername: string
  message?: string
}

interface RespondToInvitationData {
  invitationId: string
  action: 'accept' | 'decline'
}

// Query keys for consistent caching
export const connectionKeys = {
  all: ['connections'] as const,
  following: (userId?: string) => ['connections', 'following', userId] as const,
  followers: (userId?: string) => ['connections', 'followers', userId] as const,
  suggestions: () => ['connections', 'suggestions'] as const,
  invitations: (type?: 'sent' | 'received') => ['connections', 'invitations', type] as const,
  stats: (userId?: string) => ['connections', 'stats', userId] as const,
}

// API functions
async function fetchFollowing(): Promise<Profile[]> {
  const response = await fetch('/api/connections/following')
  if (!response.ok) {
    throw new Error('Failed to fetch following')
  }
  const data: ConnectionsResponse = await response.json()
  return data.following || []
}

async function fetchFollowers(): Promise<Profile[]> {
  const response = await fetch('/api/connections/followers')
  if (!response.ok) {
    throw new Error('Failed to fetch followers')
  }
  const data: ConnectionsResponse = await response.json()
  return data.followers || []
}

async function fetchSuggestions(): Promise<Profile[]> {
  const response = await fetch('/api/connections/suggestions')
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions')
  }
  const data: ConnectionsResponse = await response.json()
  return data.suggestions || []
}

async function fetchInvitations(type?: 'sent' | 'received'): Promise<InvitationsResponse> {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  
  const response = await fetch(`/api/connections/invitations?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch invitations')
  }
  return response.json()
}

async function sendConnectionInvitation(data: SendInvitationData): Promise<ConnectionInvitation> {
  const response = await fetch('/api/connections/invitations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to send invitation')
  }

  return response.json()
}

async function respondToInvitation(data: RespondToInvitationData): Promise<void> {
  const response = await fetch(`/api/connections/invitations/${data.invitationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: data.action }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to respond to invitation')
  }
}

async function withdrawInvitation(invitationId: string): Promise<void> {
  const response = await fetch(`/api/connections/invitations/${invitationId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to withdraw invitation')
  }
}

async function followUser(username: string): Promise<void> {
  const response = await fetch(`/api/profiles/${username}/follow`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to follow user')
  }
}

async function unfollowUser(username: string): Promise<void> {
  const response = await fetch(`/api/profiles/${username}/follow`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to unfollow user')
  }
}

// Hooks
export function useFollowing() {
  const { setFollowing } = useConnectionsStore()
  
  const query = useQuery({
    queryKey: connectionKeys.following(),
    queryFn: fetchFollowing,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      setFollowing(query.data)
    }
  }, [query.data, setFollowing])
  
  return query
}

export function useFollowers() {
  const { setFollowers } = useConnectionsStore()
  
  const query = useQuery({
    queryKey: connectionKeys.followers(),
    queryFn: fetchFollowers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      setFollowers(query.data)
    }
  }, [query.data, setFollowers])
  
  return query
}

export function useSuggestions() {
  const { setSuggestions } = useConnectionsStore()
  
  const query = useQuery({
    queryKey: connectionKeys.suggestions(),
    queryFn: fetchSuggestions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  useEffect(() => {
    if (query.data) {
      setSuggestions(query.data)
    }
  }, [query.data, setSuggestions])
  
  return query
}

export function useInvitations(type?: 'sent' | 'received') {
  const { setSentInvitations, setReceivedInvitations } = useConnectionsStore()
  
  const query = useQuery({
    queryKey: connectionKeys.invitations(type),
    queryFn: () => fetchInvitations(type),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  useEffect(() => {
    if (query.data) {
      const data = query.data as InvitationsResponse
      if (type === 'sent') {
        setSentInvitations(data.invitations.filter(inv => inv.type === 'sent'))
      } else if (type === 'received') {
        setReceivedInvitations(data.invitations.filter(inv => inv.type === 'received'))
      } else {
        // Both types
        setSentInvitations(data.invitations.filter(inv => inv.type === 'sent'))
        setReceivedInvitations(data.invitations.filter(inv => inv.type === 'received'))
      }
    }
  }, [query.data, type, setSentInvitations, setReceivedInvitations])
  
  return query
}

export function useSendInvitation() {
  const queryClient = useQueryClient()
  const { addSentInvitation, setConnectionStatus } = useConnectionsStore()

  return useMutation({
    mutationFn: sendConnectionInvitation,
    onSuccess: (invitation) => {
      // Add to store
      addSentInvitation(invitation)
      
      // Update connection status
      setConnectionStatus(invitation.receiverId, 'pending_sent')
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: connectionKeys.invitations('sent')
      })
      queryClient.invalidateQueries({
        queryKey: connectionKeys.suggestions()
      })
    },
  })
}

export function useRespondToInvitation() {
  const queryClient = useQueryClient()
  const { updateReceivedInvitation } = useConnectionsStore()

  return useMutation({
    mutationFn: respondToInvitation,
    onSuccess: (_, variables) => {
      // Update store - convert action to status
      const status = variables.action === 'accept' ? 'accepted' : 'declined'
      updateReceivedInvitation(variables.invitationId, status)
      
      if (variables.action === 'accept') {
        // Note: We'd need the user data to add to following
        // This would typically come from the API response
        // setConnectionStatus('sender-id', 'connected') // Would need actual sender ID
      } else {
        // setConnectionStatus('sender-id', 'not_connected') // Would need actual sender ID
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: connectionKeys.invitations('received')
      })
      queryClient.invalidateQueries({
        queryKey: connectionKeys.following()
      })
      queryClient.invalidateQueries({
        queryKey: connectionKeys.followers()
      })
    },
  })
}

export function useWithdrawInvitation() {
  const queryClient = useQueryClient()
  const { removeSentInvitation } = useConnectionsStore()

  return useMutation({
    mutationFn: withdrawInvitation,
    onSuccess: (_, invitationId) => {
      // Remove from store
      removeSentInvitation(invitationId)
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: connectionKeys.invitations('sent')
      })
    },
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Update connection status
      // Note: We'd need the user ID, not username
      // setConnectionStatus(userId, 'connected')
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: connectionKeys.following()
      })
      queryClient.invalidateQueries({
        queryKey: connectionKeys.suggestions()
      })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      // Update connection status
      // Note: We'd need the user ID, not username
      // setConnectionStatus(userId, 'not_connected')
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: connectionKeys.following()
      })
    },
  })
}

// Utility hook to get connection status for a specific user
export function useConnectionStatus(userId: string): {
  status: ConnectionStatus
  isLoading: boolean
  canConnect: boolean
  canAccept: boolean
  canWithdraw: boolean
} {
  const { getConnectionStatus, sentInvitations, receivedInvitations } = useConnectionsStore()
  
  const status = getConnectionStatus(userId)
  
  // Check if there are pending invitations
  const sentInvitation = sentInvitations.find(inv => inv.receiverId === userId && inv.status === 'pending')
  const receivedInvitation = receivedInvitations.find(inv => inv.senderId === userId && inv.status === 'pending')
  
  return {
    status,
    isLoading: false, // Could track loading states per user if needed
    canConnect: status === 'not_connected' && !sentInvitation && !receivedInvitation,
    canAccept: status === 'pending_received' && !!receivedInvitation,
    canWithdraw: status === 'pending_sent' && !!sentInvitation,
  }
}

// Hook to get overall connection stats
export function useConnectionStats() {
  const { stats } = useConnectionsStore()
  
  return {
    followingCount: stats.followingCount,
    followersCount: stats.followersCount,
    pendingInvitationsCount: stats.pendingInvitationsCount,
  }
}