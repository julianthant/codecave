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
  Clock
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
      description: 'CodeCave Platform - Modern developer community with real-time collaboration',
      date: 'Now',
      icon: Rocket,
      color: 'bg-orange-500',
      isRecent: true,
    },
    {
      id: '2',
      type: 'achievement',
      title: `${stats?.commitStreak || 47} Day Commit Streak`,
      description: 'Consistent daily contributions across multiple repositories',
      date: 'Active',
      icon: Zap,
      color: 'bg-green-500',
      isRecent: true,
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Reached 1K+ Followers',
      description: 'Growing developer community and building meaningful connections',
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
        day: 'numeric'
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Developer Journey</h2>
              <p className="text-sm text-gray-500 mt-1">
                Milestones, projects, and achievements along the way
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Updated in real-time</span>
            </div>
          </div>
        </div>

        {/* Now Section - Pinned Current Activity */}
        <div className="px-6 py-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div className="w-0.5 h-6 bg-orange-300 mx-auto mt-2"></div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  Now
                </Badge>
                <span className="text-xs text-orange-600 font-medium">Active Project</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Building CodeCave Platform
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Modern developer community platform with real-time collaboration, project showcasing, 
                and networking features. Built with Next.js, TypeScript, and Supabase.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-white text-orange-700 border border-orange-200"
                  >
                    {tech}
                  </span>
                ))}
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
                  className="flex items-start space-x-4 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                >
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 ${event.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {event.isRecent && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                            Active
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                    
                    {/* Event type badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${event.type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'project' ? 'bg-purple-100 text-purple-800' :
                          event.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Footer Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <GitCommit className="h-4 w-4" />
                <span>{stats?.commitStreak || 47} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(profile.createdAt).getFullYear()}</span>
              </div>
            </div>
            <span className="text-xs">
              🚀 Keep building amazing things!
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}