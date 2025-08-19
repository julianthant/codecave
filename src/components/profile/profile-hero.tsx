'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Github,
  Twitter,
  MessageSquare,
  Linkedin,
  Clock,
  UserPlus,
  Settings,
  User,
  Coffee,
  Code,
  Zap,
  Camera,
} from 'lucide-react'
import type { Profile, UserSettings } from '@/db/schema'
import Link from 'next/link'
import { CoverPhotoModal } from './modals/cover-photo-modal'
import { toast } from 'sonner'

interface ProfileHeroProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
  isFollowing?: boolean
}

const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string
  delay?: number
}) => {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          setIndex(index + 1)
        }
      },
      delay + index * 50
    )

    return () => clearTimeout(timeout)
  }, [index, text, delay])

  return <span className="font-mono">{displayText}</span>
}

export function ProfileHero({
  profile,
  userSettings,
  isOwnProfile = false,
  isFollowing = false,
}: ProfileHeroProps) {
  const [following, setFollowing] = useState(isFollowing)
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false)

  const handleFollowToggle = () => {
    setFollowing(!following)
    console.log('Follow toggle:', !following)
  }

  const handleCoverPhotoSave = async (file: File) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would upload to your storage service
    console.log('Uploading cover photo:', file.name)
    
    // Mock success - in real app, you'd update the profile data
    toast.success('Cover photo updated successfully!')
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles', // Could be dynamic based on user
    })
  }

  const [currentTime, setCurrentTime] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(getCurrentTime())

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Create animated background pattern with fixed positions to avoid hydration mismatch
  const backgroundPattern = Array.from({ length: 20 }, (_, i) => {
    // Use index-based deterministic positions instead of Math.random()
    const left = (i * 37) % 100 // Pseudo-random but deterministic
    const top = (i * 73) % 100 // Pseudo-random but deterministic
    const duration = 3 + ((i * 17) % 20) / 10 // 3.0 to 5.0 seconds
    const delay = (i * 0.2) % 4 // 0 to 4 seconds

    return (
      <motion.div
        key={i}
        className="absolute bg-white/20 rounded-full w-1 h-1"
        style={{
          left: `${left}%`,
          top: `${top}%`,
        }}
        animate={{
          y: [-10, 10, -10],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          delay: delay,
        }}
      />
    )
  })
  const socialLinks = [
    {
      icon: Github,
      url: profile.githubUsername
        ? `https://github.com/${profile.githubUsername}`
        : null,
      username: profile.githubUsername,
      label: 'GitHub',
    },
    {
      icon: Twitter,
      url: profile.twitterUsername
        ? `https://twitter.com/${profile.twitterUsername}`
        : null,
      username: profile.twitterUsername,
      label: 'Twitter',
    },
    {
      icon: MessageSquare,
      url: null,
      username: profile.discordUsername,
      label: 'Discord',
    },
    {
      icon: Linkedin,
      url: profile.linkedinUrl || null,
      username: profile.linkedinUrl ? 'LinkedIn' : null,
      label: 'LinkedIn',
    },
  ].filter((link) => link.username)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"
    >
      {/* Cover Banner - Card-based */}
      <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 h-32 overflow-hidden group">
        {backgroundPattern}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        
        {/* Edit Cover Button - Only show for own profile */}
        {isOwnProfile && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCoverModalOpen(true)}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Camera className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Main Profile Content */}
      <div className="relative -mt-8 p-6">
        <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-6">
          {/* Left Section - Profile Info */}
          <div className="flex items-start space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="shadow-lg border-4 border-white w-24 h-24">
                <AvatarImage
                  src={profile.avatarUrl || undefined}
                  alt={profile.displayName || profile.username}
                />
                <AvatarFallback className="bg-orange-500 text-white text-xl">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-grow pt-5 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="font-mono font-bold text-gray-900 text-2xl">
                  {profile.displayName || profile.username}
                </h1>
                <p className="mb-2 text-gray-600 text-sm">
                  @{profile.username}
                </p>

                {/* Status Indicators */}
                <div className="flex flex-wrap items-center gap-3 text-gray-500 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>PST {isMounted ? currentTime : '--:--'}</span>
                  </div>

                  {userSettings?.availableForCollab && (
                    <div className="flex items-center space-x-1">
                      <Coffee className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">
                        Available for collaboration
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-orange-600" />
                    <span>Active developer</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col md:items-end space-y-4 pt-5">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex space-x-2"
            >
              {isOwnProfile ? (
                <Link href="/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-orange-50 border-orange-200 text-orange-600"
                  >
                    <Settings className="mr-1 w-3 h-3" />
                    Edit
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    onClick={handleFollowToggle}
                    size="sm"
                    className={
                      following
                        ? 'bg-gray-600 hover:bg-gray-700 text-xs'
                        : 'bg-orange-600 hover:bg-orange-700 text-xs'
                    }
                  >
                    <UserPlus className="mr-1 w-3 h-3" />
                    {following ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Social Links - Icons Only */}
        {socialLinks.length > 0 && (
          <div className="flex items-center space-x-4 mt-4 pt-4 border-gray-100 border-t">
            {socialLinks.map((link) => {
              const Icon = link.icon
              const content = (
                <Icon className="w-5 h-5 text-gray-500 hover:text-orange-600 transition-colors" />
              )

              return link.url ? (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.username || ''}
                >
                  {content}
                </a>
              ) : (
                <div key={link.label} title={link.username || ''}>
                  {content}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cover Photo Modal */}
      <CoverPhotoModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSave={handleCoverPhotoSave}
      />
    </motion.div>
  )
}
