'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  GitCommit,
  Star,
  Rocket,
  Award,
  Code,
  Coffee,
  Users,
  Zap,
  Calendar,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Profile, UserSettings } from '@/db/schema'

interface ActivityTimelineProps {
  profile: Profile
  userSettings?: UserSettings
  stats?: {
    commitStreak: number
    followers: number
    posts: number
  }
}

interface TimelineEvent {
  id: string
  type: 'milestone' | 'project' | 'achievement' | 'activity'
  title: string
  description: string
  date: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  isRecent?: boolean
}

export function ActivityTimeline({ profile, stats }: ActivityTimelineProps) {
  // Mock timeline data - in real app, this would come from database
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'activity',
      title: 'Currently Building',
      description:
        'CodeCave Platform - Modern developer community with real-time collaboration',
      date: 'Now',
      icon: Rocket,
      color: 'bg-orange-500',
      isRecent: true,
    },
    {
      id: '2',
      type: 'achievement',
      title: `${stats?.commitStreak || 47} Day Commit Streak`,
      description:
        'Consistent daily contributions across multiple repositories',
      date: 'Active',
      icon: Zap,
      color: 'bg-green-500',
      isRecent: true,
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Reached 1K+ Followers',
      description:
        'Growing developer community and building meaningful connections',
      date: '2 weeks ago',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      id: '4',
      type: 'project',
      title: 'Launched React Component Library',
      description: 'Open source library with 400+ stars and production usage',
      date: '1 month ago',
      icon: Code,
      color: 'bg-purple-500',
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Became Open Source Maintainer',
      description: 'Started maintaining popular TypeScript utilities package',
      date: '3 months ago',
      icon: Award,
      color: 'bg-yellow-500',
    },
    {
      id: '6',
      type: 'milestone',
      title: 'First 100 GitHub Stars',
      description: 'Personal portfolio project reached 100 stars milestone',
      date: '6 months ago',
      icon: Star,
      color: 'bg-indigo-500',
    },
    {
      id: '7',
      type: 'milestone',
      title: 'Joined CodeCave',
      description: 'Started my journey in the developer community',
      date: profile.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      icon: Coffee,
      color: 'bg-gray-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border border-gray-200 rounded-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-gray-200 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">
                Developer Journey
              </h2>
              <p className="mt-1 text-gray-500 text-sm">
                Milestones, projects, and achievements along the way
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <Clock className="w-4 h-4" />
              <span>Updated in real-time</span>
            </div>
          </div>
        </div>

        {/* Now Section - Pinned Current Activity */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-6 border-orange-200 border-b">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="flex justify-center items-center bg-orange-500 rounded-full w-10 h-10">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="bg-orange-300 mx-auto mt-2 w-0.5 h-6"></div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 border-orange-200 text-orange-800"
                >
                  Now
                </Badge>
                <span className="font-medium text-orange-600 text-xs">
                  Active Project
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 text-lg">
                Building CodeCave Platform
              </h3>
              <p className="mb-3 text-gray-600 text-sm">
                Modern developer community platform with real-time
                collaboration, project showcasing, and networking features.
                Built with Next.js, TypeScript, and Supabase.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center bg-white px-2 py-1 border border-orange-200 rounded text-orange-700 text-xs"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 py-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {timelineEvents.slice(1).map((event, index) => {
              const Icon = event.icon
              const isLast = index === timelineEvents.slice(1).length - 1

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="group flex items-start space-x-4 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                >
                  {/* Timeline dot and line */}
                  <div className="flex flex-col flex-shrink-0 items-center">
                    <div
                      className={`w-8 h-8 ${event.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {!isLast && (
                      <div className="bg-gray-200 mt-2 w-0.5 h-12"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {event.isRecent && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 border-green-200 text-green-800 text-xs"
                          >
                            Active
                          </Badge>
                        )}
                        <span className="text-gray-500 text-xs whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event type badge */}
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${
                          event.type === 'milestone'
                            ? 'bg-blue-100 text-blue-800'
                            : event.type === 'project'
                              ? 'bg-purple-100 text-purple-800'
                              : event.type === 'achievement'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 px-6 py-4 border-gray-200 border-t rounded-b-lg">
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <GitCommit className="w-4 h-4" />
                <span>{stats?.commitStreak || 47} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Member since {new Date(profile.createdAt).getFullYear()}
                </span>
              </div>
            </div>
            <span className="text-xs">🚀 Keep building amazing things!</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
