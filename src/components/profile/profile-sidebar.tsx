'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Folder,
  Calendar,
  Coffee,
  Zap,
  MapPin,
  Clock,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConnectCard } from './connect-card'
import type { Profile, UserSettings } from '@/db/schema'

interface ProfileSidebarProps {
  profile: Profile
  userSettings?: UserSettings
  stats: {
    followers: number
    following: number
    posts: number
    projects: number
    totalLikes: number
  }
  isOwnProfile?: boolean
}

export function ProfileSidebar({
  profile,
  userSettings,
  stats,
  isOwnProfile = false,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Connect Card */}
      <ConnectCard
        profile={profile}
        userSettings={userSettings}
        isOwnProfile={isOwnProfile}
      />

      {/* Quick Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Followers</span>
            </div>
            <span className="font-medium text-gray-900">
              {stats.followers.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Posts</span>
            </div>
            <span className="font-medium text-gray-900">{stats.posts}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Projects</span>
            </div>
            <span className="font-medium text-gray-900">{stats.projects}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Total Likes</span>
            </div>
            <span className="font-medium text-gray-900">
              {stats.totalLikes.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Availability Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
      >
        <h3 className="flex items-center mb-4 font-semibold text-gray-900">
          <Coffee className="mr-2 w-4 h-4 text-orange-600" />
          Availability
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${userSettings?.availableForCollab ? 'bg-green-500' : 'bg-gray-400'}`}
            ></div>
            <span
              className={`text-sm font-medium ${userSettings?.availableForCollab ? 'text-green-700' : 'text-gray-600'}`}
            >
              {userSettings?.availableForCollab
                ? 'Available for collaboration'
                : 'Currently unavailable'}
            </span>
          </div>

          {userSettings?.experienceLevel && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Experience Level</span>
              <Badge variant="secondary" className="text-xs">
                {userSettings.experienceLevel.charAt(0).toUpperCase() +
                  userSettings.experienceLevel.slice(1)}
              </Badge>
            </div>
          )}

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Remote • Global</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>Usually responds within 24h</span>
          </div>
        </div>

        {userSettings?.availableForCollab && (
          <Button
            className="bg-orange-600 hover:bg-orange-700 mt-4 w-full text-sm"
            size="sm"
          >
            <Calendar className="mr-2 w-4 h-4" />
            Schedule Meeting
          </Button>
        )}
      </motion.div>

      {/* Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
      >
        <h3 className="flex items-center mb-4 font-semibold text-gray-900">
          <User className="mr-2 w-4 h-4 text-orange-600" />
          Profile Info
        </h3>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">Member since</span>
            <div className="font-medium text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </div>
          </div>

          {userSettings?.skills && userSettings.skills.length > 0 && (
            <div>
              <span className="text-gray-600">Top Skills</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {userSettings.skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
                {userSettings.skills.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-500 text-xs"
                  >
                    +{userSettings.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {userSettings?.languages && userSettings.languages.length > 0 && (
            <div>
              <span className="text-gray-600">Languages</span>
              <div className="mt-1 font-medium text-gray-900">
                {userSettings.languages.slice(0, 2).join(', ')}
                {userSettings.languages.length > 2 &&
                  ` +${userSettings.languages.length - 2}`}
              </div>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <Button
            variant="outline"
            className="hover:bg-orange-50 mt-4 border-orange-200 w-full text-orange-600 text-sm"
            size="sm"
          >
            Edit Profile
          </Button>
        )}
      </motion.div>
    </div>
  )
}
