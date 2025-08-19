'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InboxIcon, SendIcon } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockInvitations } from '@/lib/mock-data/connections-data'

export function InvitationsSection() {
  const [activeSubTab, setActiveSubTab] = useState('received')
  
  const receivedInvitations = mockInvitations.filter(inv => inv.type === 'received')
  const sentInvitations = mockInvitations.filter(inv => inv.type === 'sent')

  const handleAccept = (invitationId: string) => {
    console.log('Accept invitation:', invitationId)
  }

  const handleDecline = (invitationId: string) => {
    console.log('Decline invitation:', invitationId)
  }

  const handleWithdraw = (invitationId: string) => {
    console.log('Withdraw invitation:', invitationId)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-2">
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
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <InboxIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending invitations
              </h3>
              <p className="text-gray-600">
                When someone sends you a connection request, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {receivedInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`received-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-received"
                  invitation={invitation}
                  compact={true}
                  className="block sm:hidden"
                />
              ))}
              {receivedInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`received-desktop-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-received"
                  invitation={invitation}
                  compact={false}
                  className="hidden sm:block"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentInvitations.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SendIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sent invitations
              </h3>
              <p className="text-gray-600">
                Connection requests you&apos;ve sent will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {sentInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`sent-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-sent"
                  invitation={invitation}
                  compact={true}
                  className="block sm:hidden"
                />
              ))}
              {sentInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`sent-desktop-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-sent"
                  invitation={invitation}
                  compact={false}
                  className="hidden sm:block"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}