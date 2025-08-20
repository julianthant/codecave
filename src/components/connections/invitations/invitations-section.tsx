'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InboxIcon, SendIcon } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockInvitations } from '@/lib/mock-data/connections-data'

export function InvitationsSection() {
  const [activeSubTab, setActiveSubTab] = useState('received')

  const receivedInvitations = mockInvitations.filter(
    (inv) => inv.type === 'received'
  )
  const sentInvitations = mockInvitations.filter((inv) => inv.type === 'sent')

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
                When someone sends you a connection request, it will appear
                here.
              </p>
            </div>
          ) : (
            <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {receivedInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`received-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-received"
                  invitation={invitation}
                  compact={true}
                  className="sm:hidden block"
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
              {sentInvitations.map((invitation) => (
                <GlobalConnectionCard
                  key={`sent-mobile-${invitation.id}`}
                  user={invitation.user}
                  variant="invitation-sent"
                  invitation={invitation}
                  compact={true}
                  className="sm:hidden block"
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
