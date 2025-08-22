'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InboxIcon, SendIcon, Loader2 } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import type { InvitationWithUser } from '@/types'

export function InvitationsSection() {
  const [activeSubTab, setActiveSubTab] = useState('received')
  const queryClient = useQueryClient()

  // Fetch invitations
  const { data: invitationsData, isLoading, error } = useQuery({
    queryKey: ['connections', 'invitations'],
    queryFn: async () => {
      const response = await fetch('/api/connections/invitations?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch invitations')
      }
      const result = await response.json()
      return result.data
    },
  })

  // Respond to invitation mutation
  const respondMutation = useMutation({
    mutationFn: async ({ invitationId, action }: { invitationId: string; action: 'accept' | 'decline' }) => {
      const response = await fetch(`/api/connections/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        throw new Error('Failed to respond to invitation')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections', 'invitations'] })
      queryClient.invalidateQueries({ queryKey: ['connections', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['connections', 'followers'] })
      queryClient.invalidateQueries({ queryKey: ['connections', 'following'] })
    },
  })

  // Cancel invitation mutation
  const cancelMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/connections/invitations/${invitationId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to cancel invitation')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections', 'invitations'] })
    },
  })

  const receivedInvitations = invitationsData?.invitations?.filter(
    (inv: InvitationWithUser) => inv.type === 'received' && inv.status === 'pending'
  ) || []
  
  const sentInvitations = invitationsData?.invitations?.filter(
    (inv: InvitationWithUser) => inv.type === 'sent' && inv.status === 'pending'
  ) || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading invitations...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="py-12 text-center">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">Unable to load invitations</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <InboxIcon className="w-4 h-4" />
            <span>Received ({receivedInvitations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center space-x-2">
            <SendIcon className="w-4 h-4" />
            <span>Sent ({sentInvitations.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedInvitations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-24 h-24">
                <InboxIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 font-medium text-gray-900 text-lg">
                No pending invitations
              </h3>
              <p className="text-gray-600">
                When someone sends you a connection request, it will appear here.
              </p>
            </div>
          ) : (
            <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {receivedInvitations.map((invitation: InvitationWithUser) => (
                <GlobalConnectionCard
                  key={`received-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-received"
                  invitation={invitation}
                  compact={true}
                  className="sm:hidden block"
                  onAcceptInvitation={() => respondMutation.mutate({ invitationId: invitation.id, action: 'accept' })}
                  onDeclineInvitation={() => respondMutation.mutate({ invitationId: invitation.id, action: 'decline' })}
                  isProcessing={respondMutation.isPending}
                />
              ))}
              {receivedInvitations.map((invitation: InvitationWithUser) => (
                <GlobalConnectionCard
                  key={`received-desktop-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-received"
                  invitation={invitation}
                  compact={false}
                  className="hidden sm:block"
                  onAcceptInvitation={() => respondMutation.mutate({ invitationId: invitation.id, action: 'accept' })}
                  onDeclineInvitation={() => respondMutation.mutate({ invitationId: invitation.id, action: 'decline' })}
                  isProcessing={respondMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentInvitations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-24 h-24">
                <SendIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 font-medium text-gray-900 text-lg">
                No sent invitations
              </h3>
              <p className="text-gray-600">
                Connection requests you&apos;ve sent will appear here.
              </p>
            </div>
          ) : (
            <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sentInvitations.map((invitation: InvitationWithUser) => (
                <GlobalConnectionCard
                  key={`sent-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-sent"
                  invitation={invitation}
                  compact={true}
                  className="sm:hidden block"
                  onCancelInvitation={() => cancelMutation.mutate(invitation.id)}
                  isProcessing={cancelMutation.isPending}
                />
              ))}
              {sentInvitations.map((invitation: InvitationWithUser) => (
                <GlobalConnectionCard
                  key={`sent-desktop-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-sent"
                  invitation={invitation}
                  compact={false}
                  className="hidden sm:block"
                  onCancelInvitation={() => cancelMutation.mutate(invitation.id)}
                  isProcessing={cancelMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
