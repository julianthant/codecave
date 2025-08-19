'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Compass, UserPlus, UserCheck, Heart } from 'lucide-react'
import { DiscoverSection } from './discover/discover-section'
import { MyNetworkSection } from './network/my-network-section'
import { InvitationsSection } from './invitations/invitations-section'
import { FollowingSection } from './follow/following-section'
import { FollowersSection } from './follow/followers-section'
import { ConnectionsSidebar } from './connections-sidebar'
import { ConnectionsTabs } from './shared/connections-tabs'

const connectionsTabs = [
  {
    value: 'discover',
    label: 'Discover',
    icon: Compass,
    component: DiscoverSection,
  },
  {
    value: 'network',
    label: 'My Network',
    icon: Users,
    component: MyNetworkSection,
  },
  {
    value: 'invitations',
    label: 'Invitations',
    icon: UserPlus,
    component: InvitationsSection,
  },
  {
    value: 'following',
    label: 'Following',
    icon: UserCheck,
    component: FollowingSection,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: Heart,
    component: FollowersSection,
  },
]

export function ConnectionsContainer() {
  const [activeTab, setActiveTab] = useState('discover')

  // Get the active component based on current tab
  const getActiveComponent = () => {
    const activeTabData = connectionsTabs.find(tab => tab.value === activeTab)
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Content Area */}
      <div className="lg:col-span-9">
        {/* Professional Tab Navigation */}
        <ConnectionsTabs
          tabs={connectionsTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Active Tab Content */}
        {getActiveComponent()}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-8">
          <ConnectionsSidebar />
        </div>
      </div>
    </div>
  )
}