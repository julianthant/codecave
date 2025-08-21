'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingModal } from './modals/booking-modal'
import { toast } from 'sonner'
import type { Profile, UserSettings } from '@/db/schema'

interface ConnectCardProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
}

export function ConnectCard({ profile, userSettings, isOwnProfile = false }: ConnectCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const socialLinks = [
    {
      platform: 'GitHub',
      icon: Github,
      username: profile.githubUsername,
      url: profile.githubUsername ? `https://github.com/${profile.githubUsername}` : null,
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      username: profile.twitterUsername,
      url: profile.twitterUsername ? `https://twitter.com/${profile.twitterUsername}` : null,
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      username: 'LinkedIn',
      url: profile.linkedinUrl,
    },
    {
      platform: 'Email',
      icon: Mail,
      username: 'Email',
      url: null, // Would open a contact form
    },
  ].filter(link => link.url || link.platform === 'Email')

  const handleSocialClick = (link: typeof socialLinks[0]) => {
    if (link.url) {
      window.open(link.url, '_blank')
      toast.success(`Opening ${link.platform}`)
    } else {
      // Mock email contact
      toast.success('Contact form would open here')
    }
  }

  const handleScheduleClick = () => {
    setIsBookingModalOpen(true)
  }

  if (isOwnProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg"
      >
        <h3 className="font-semibold text-gray-900 mb-3">Connect Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage how others can connect with you in your settings.
        </p>
        <Button
          variant="outline"
          className="w-full text-sm border-orange-200 hover:bg-orange-50 text-orange-600"
          size="sm"
        >
          Manage Collaboration Settings
        </Button>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Connect</h3>
          {userSettings?.availableForCollab && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-700 font-medium">Available</span>
            </div>
          )}
        </div>

        {/* Schedule Meeting Button */}
        {userSettings?.availableForCollab && (
          <Button
            onClick={handleScheduleClick}
            className="w-full mb-4 bg-orange-600 hover:bg-orange-700 text-sm"
            size="sm"
          >
            <Calendar className="mr-2 w-4 h-4" />
            Schedule Meeting
          </Button>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
              Social Links
            </p>
            <div className="flex items-center space-x-2">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.platform}
                    onClick={() => handleSocialClick(link)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title={`Connect on ${link.platform}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Collaboration Status */}
        {!userSettings?.availableForCollab && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              Currently not available for collaboration
            </p>
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  )
}