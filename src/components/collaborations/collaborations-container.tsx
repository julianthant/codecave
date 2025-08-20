'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Users, FileText, Mail, Bookmark, Plus } from 'lucide-react'
import { DiscoverCollaborations } from './sections/discover-collaborations'
import { MyCollaborations } from './sections/my-collaborations'
import { PostedCollaborations } from './sections/posted-collaborations'
import { CollaborationInvitations } from './sections/collaboration-invitations'
import { SavedCollaborations } from './sections/saved-collaborations'
import { CollaborationsSidebar } from './collaborations-sidebar'
import { CollaborationsTabs } from './shared/collaborations-tabs'
import { CreateCollaborationModal } from './modals/create-collaboration-modal'
import { Button } from '@/components/ui/button'

const collaborationTabs = [
  {
    value: 'discover',
    label: 'Discover Projects',
    icon: Compass,
    component: DiscoverCollaborations,
  },
  {
    value: 'my-collaborations',
    label: 'My Collaborations',
    icon: Users,
    component: MyCollaborations,
  },
  {
    value: 'posted',
    label: 'Posted by Me',
    icon: FileText,
    component: PostedCollaborations,
  },
  {
    value: 'invitations',
    label: 'Invitations',
    icon: Mail,
    component: CollaborationInvitations,
    badge: 3, // Number of pending invitations
  },
  {
    value: 'saved',
    label: 'Saved',
    icon: Bookmark,
    component: SavedCollaborations,
  },
]

export function CollaborationsContainer() {
  const [activeTab, setActiveTab] = useState('discover')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Get the active component based on current tab
  const getActiveComponent = () => {
    const activeTabData = collaborationTabs.find(
      (tab) => tab.value === activeTab
    )
    if (!activeTabData) return null

    const Component = activeTabData.component
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Component />
      </motion.div>
    )
  }

  return (
    <>
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-12">
        {/* Content Area */}
        <div className="lg:col-span-9 pb-20 lg:pb-0">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center mb-6">
            <CollaborationsTabs
              tabs={collaborationTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Mobile Create Button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </Button>
          </div>

          {/* Active Tab Content */}
          {getActiveComponent()}
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="lg:top-8 lg:sticky">
            <CollaborationsSidebar
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Create Collaboration Modal */}
      <CreateCollaborationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}
