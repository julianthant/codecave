'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BioEditModal } from './modals/bio-edit-modal'
import type { Profile, UserSettings } from '@/db/schema'

interface ProfileSummaryProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
}

export function ProfileSummary({ 
  profile, 
  userSettings, 
  isOwnProfile = false 
}: ProfileSummaryProps) {
  const [isBioEditOpen, setIsBioEditOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
          </div>
          
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsBioEditOpen(true)}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {profile.bio ? (
          <p className="text-gray-700 leading-relaxed">
            {profile.bio}
          </p>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {isOwnProfile 
                ? "Share a bit about yourself with the community" 
                : "This user hasn't added a bio yet"
              }
            </p>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsBioEditOpen(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Add Bio
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bio Edit Modal */}
      {isOwnProfile && (
        <BioEditModal
          isOpen={isBioEditOpen}
          onClose={() => setIsBioEditOpen(false)}
          profile={profile}
        />
      )}

      {/* Footer with additional info */}
      {(userSettings?.experienceLevel || userSettings?.availableForCollab) && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {userSettings?.experienceLevel && (
              <div className="flex items-center space-x-1">
                <span>Experience:</span>
                <span className="font-medium capitalize text-gray-900">
                  {userSettings.experienceLevel} Level
                </span>
              </div>
            )}
            
            {userSettings?.availableForCollab && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">
                  Available for collaboration
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}