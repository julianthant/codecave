'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Code, Settings as SettingsIcon, Shield, Users } from 'lucide-react'
import { ProfileSettings } from './profile-settings'
import { DeveloperSettings } from './developer-settings'
import { CollaborationSettings } from './collaboration-settings'
import { PreferencesSettings } from './preferences-settings'
import { AccountSettings } from './account-settings'

const settingsTabs = [
  {
    value: 'profile',
    label: 'Profile',
    icon: User,
    component: ProfileSettings,
  },
  {
    value: 'developer',
    label: 'Developer',
    icon: Code,
    component: DeveloperSettings,
  },
  {
    value: 'collaboration',
    label: 'Collaboration',
    icon: Users,
    component: CollaborationSettings,
  },
  {
    value: 'preferences',
    label: 'Preferences',
    icon: SettingsIcon,
    component: PreferencesSettings,
  },
  {
    value: 'account',
    label: 'Account',
    icon: Shield,
    component: AccountSettings,
  },
]

export function SettingsContainer() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <nav className="sticky top-8 space-y-1">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tab List */}
          <TabsList className="grid w-full grid-cols-5 lg:hidden mb-8">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 px-2 py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tab Content */}
          {settingsTabs.map((tab) => {
            const Component = tab.component
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Component />
                </motion.div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}