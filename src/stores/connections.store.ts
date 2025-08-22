import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Profile, ConnectionInvitation } from '@/db/schema'

export type ConnectionStatus = 'not_connected' | 'pending_sent' | 'pending_received' | 'connected'

interface ConnectionState {
  // User connection data
  following: Profile[]
  followers: Profile[]
  suggestions: Profile[]
  
  // Invitations
  sentInvitations: ConnectionInvitation[]
  receivedInvitations: ConnectionInvitation[]
  
  // Connection status cache
  connectionStatus: Record<string, ConnectionStatus>
  
  // UI state
  isLoading: boolean
  error: string | null
  isInvitationModalOpen: boolean
  targetUser: Profile | null
  
  // Stats
  stats: {
    followingCount: number
    followersCount: number
    pendingInvitationsCount: number
  }
  
  // Actions
  setFollowing: (following: Profile[]) => void
  setFollowers: (followers: Profile[]) => void
  setSuggestions: (suggestions: Profile[]) => void
  addFollowing: (user: Profile) => void
  removeFollowing: (userId: string) => void
  addFollower: (user: Profile) => void
  removeFollower: (userId: string) => void
  
  // Invitation actions
  setSentInvitations: (invitations: ConnectionInvitation[]) => void
  setReceivedInvitations: (invitations: ConnectionInvitation[]) => void
  addSentInvitation: (invitation: ConnectionInvitation) => void
  removeSentInvitation: (invitationId: string) => void
  updateReceivedInvitation: (invitationId: string, status: 'accepted' | 'declined') => void
  
  // Connection status
  setConnectionStatus: (userId: string, status: ConnectionStatus) => void
  getConnectionStatus: (userId: string) => ConnectionStatus
  
  // Modal actions
  openInvitationModal: (user: Profile) => void
  closeInvitationModal: () => void
  
  // State management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateStats: () => void
  resetState: () => void
}

export const useConnectionsStore = create<ConnectionState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        following: [],
        followers: [],
        suggestions: [],
        sentInvitations: [],
        receivedInvitations: [],
        connectionStatus: {},
        isLoading: false,
        error: null,
        isInvitationModalOpen: false,
        targetUser: null,
        stats: {
          followingCount: 0,
          followersCount: 0,
          pendingInvitationsCount: 0,
        },
        
        // Actions
        setFollowing: (following) => set((state) => {
          state.following = following
          state.stats.followingCount = following.length
          
          // Update connection status for following users
          following.forEach(user => {
            state.connectionStatus[user.id] = 'connected'
          })
        }),
        
        setFollowers: (followers) => set((state) => {
          state.followers = followers
          state.stats.followersCount = followers.length
        }),
        
        setSuggestions: (suggestions) => set((state) => {
          state.suggestions = suggestions
        }),
        
        addFollowing: (user) => set((state) => {
          if (!state.following.find(f => f.id === user.id)) {
            state.following.unshift(user)
            state.stats.followingCount = state.following.length
            state.connectionStatus[user.id] = 'connected'
          }
        }),
        
        removeFollowing: (userId) => set((state) => {
          state.following = state.following.filter(f => f.id !== userId)
          state.stats.followingCount = state.following.length
          state.connectionStatus[userId] = 'not_connected'
        }),
        
        addFollower: (user) => set((state) => {
          if (!state.followers.find(f => f.id === user.id)) {
            state.followers.unshift(user)
            state.stats.followersCount = state.followers.length
          }
        }),
        
        removeFollower: (userId) => set((state) => {
          state.followers = state.followers.filter(f => f.id !== userId)
          state.stats.followersCount = state.followers.length
        }),
        
        // Invitation actions
        setSentInvitations: (invitations) => set((state) => {
          state.sentInvitations = invitations
          
          // Update connection status for sent invitations
          invitations.forEach(inv => {
            if (inv.status === 'pending') {
              state.connectionStatus[inv.receiverId] = 'pending_sent'
            }
          })
        }),
        
        setReceivedInvitations: (invitations) => set((state) => {
          state.receivedInvitations = invitations
          state.stats.pendingInvitationsCount = invitations.filter(inv => inv.status === 'pending').length
          
          // Update connection status for received invitations
          invitations.forEach(inv => {
            if (inv.status === 'pending') {
              state.connectionStatus[inv.senderId] = 'pending_received'
            }
          })
        }),
        
        addSentInvitation: (invitation) => set((state) => {
          state.sentInvitations.unshift(invitation)
          state.connectionStatus[invitation.receiverId] = 'pending_sent'
        }),
        
        removeSentInvitation: (invitationId) => set((state) => {
          const invitation = state.sentInvitations.find(inv => inv.id === invitationId)
          if (invitation) {
            state.sentInvitations = state.sentInvitations.filter(inv => inv.id !== invitationId)
            state.connectionStatus[invitation.receiverId] = 'not_connected'
          }
        }),
        
        updateReceivedInvitation: (invitationId, status) => set((state) => {
          const invitation = state.receivedInvitations.find(inv => inv.id === invitationId)
          if (invitation) {
            invitation.status = status
            invitation.respondedAt = new Date()
            
            if (status === 'accepted') {
              state.connectionStatus[invitation.senderId] = 'connected'
              // Remove from pending count
              state.stats.pendingInvitationsCount = state.receivedInvitations.filter(inv => inv.status === 'pending').length
            } else {
              state.connectionStatus[invitation.senderId] = 'not_connected'
              state.stats.pendingInvitationsCount = state.receivedInvitations.filter(inv => inv.status === 'pending').length
            }
          }
        }),
        
        // Connection status
        setConnectionStatus: (userId, status) => set((state) => {
          state.connectionStatus[userId] = status
        }),
        
        getConnectionStatus: (userId) => {
          const state = get()
          return state.connectionStatus[userId] || 'not_connected'
        },
        
        // Modal actions
        openInvitationModal: (user) => set((state) => {
          state.isInvitationModalOpen = true
          state.targetUser = user
        }),
        
        closeInvitationModal: () => set((state) => {
          state.isInvitationModalOpen = false
          state.targetUser = null
        }),
        
        // State management
        setLoading: (loading) => set((state) => {
          state.isLoading = loading
        }),
        
        setError: (error) => set((state) => {
          state.error = error
          state.isLoading = false
        }),
        
        updateStats: () => set((state) => {
          state.stats.followingCount = state.following.length
          state.stats.followersCount = state.followers.length
          state.stats.pendingInvitationsCount = state.receivedInvitations.filter(inv => inv.status === 'pending').length
        }),
        
        resetState: () => set((state) => {
          state.following = []
          state.followers = []
          state.suggestions = []
          state.sentInvitations = []
          state.receivedInvitations = []
          state.connectionStatus = {}
          state.isLoading = false
          state.error = null
          state.isInvitationModalOpen = false
          state.targetUser = null
          state.stats = {
            followingCount: 0,
            followersCount: 0,
            pendingInvitationsCount: 0,
          }
        }),
      })),
      {
        name: 'connections-storage',
        partialize: (state) => ({ 
          following: state.following,
          followers: state.followers,
          connectionStatus: state.connectionStatus,
          stats: state.stats
        }),
      }
    ),
    { name: 'connections-store' }
  )
)