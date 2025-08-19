'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  FileText,
  Code,
  Heart,
  Zap,
  Coffee,
  Moon,
  Sun,
  Clock,
  Target,
  TrendingUp,
  GitCommit,
  Star,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileStatsProps {
  followers: number
  following: number
  posts: number
  projects: number
  totalLikes: number
  commitStreak?: number
}

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: number | string
  delay: number
  suffix?: string
  color?: string
  isSpecial?: boolean
}

interface DeveloperMetric {
  icon: React.ElementType
  label: string
  value: number | string
  suffix?: string
  color: string
  description: string
}

function StatItem({
  icon: Icon,
  label,
  value,
  delay,
  suffix = '',
  color = 'orange',
  isSpecial = false,
}: StatItemProps) {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className={`text-center p-4 rounded-lg transition-colors ${isSpecial ? 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200' : 'hover:bg-gray-50'}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.orange}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: delay + 0.2,
              type: 'spring',
              stiffness: 200,
            }}
            className="font-bold text-gray-900 text-2xl"
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </motion.p>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ContributionHeatmap() {
  // Mock contribution data for the last 12 weeks
  const weeks = 12
  const daysPerWeek = 7
  // Use deterministic values instead of Math.random() to avoid hydration mismatch
  const contributions = Array.from({ length: weeks * daysPerWeek }, (_, i) => {
    // Create pseudo-random but deterministic pattern
    return Math.floor(((i * 17 + 23) % 37) / 7.4) // Will give values 0-4
  })

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-green-200'
    if (count === 2) return 'bg-green-300'
    if (count === 3) return 'bg-green-400'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 text-sm">
        Contribution Activity
      </h4>
      <div className="gap-1 grid grid-cols-12">
        {contributions.map((count, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`w-3 h-3 rounded-sm ${getIntensity(count)} tooltip`}
            title={`${count} contributions`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-gray-500 text-xs">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="bg-gray-100 rounded-sm w-3 h-3" />
          <div className="bg-green-200 rounded-sm w-3 h-3" />
          <div className="bg-green-300 rounded-sm w-3 h-3" />
          <div className="bg-green-400 rounded-sm w-3 h-3" />
          <div className="bg-green-500 rounded-sm w-3 h-3" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

function CodingTimeChart() {
  const timeSlots = [
    { hour: '6AM', activity: 15 },
    { hour: '9AM', activity: 45 },
    { hour: '12PM', activity: 30 },
    { hour: '3PM', activity: 60 },
    { hour: '6PM', activity: 80 },
    { hour: '9PM', activity: 95 },
    { hour: '12AM', activity: 25 },
  ]

  const maxActivity = Math.max(...timeSlots.map((slot) => slot.activity))

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 text-sm">
        Daily Coding Pattern
      </h4>
      <div className="flex items-end space-x-2 h-16">
        {timeSlots.map((slot, index) => (
          <motion.div
            key={slot.hour}
            initial={{ height: 0 }}
            animate={{ height: `${(slot.activity / maxActivity) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-1 bg-gradient-to-t from-orange-400 to-orange-600 rounded-t-sm min-h-[4px]"
            title={`${slot.hour}: ${slot.activity}% active`}
          />
        ))}
      </div>
      <div className="flex justify-between text-gray-500 text-xs">
        {timeSlots.map((slot) => (
          <span key={slot.hour}>{slot.hour}</span>
        ))}
      </div>
    </div>
  )
}

export function ProfileStats({
  followers,
  following,
  posts,
  projects,
  totalLikes,
  commitStreak = 47,
}: ProfileStatsProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'basic' | 'developer'>('basic')

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const basicStats = [
    {
      icon: Users,
      label: 'Followers',
      value: followers,
      delay: 0,
      color: 'blue',
    },
    {
      icon: Users,
      label: 'Following',
      value: following,
      delay: 0.1,
      color: 'blue',
    },
    {
      icon: FileText,
      label: 'Posts',
      value: posts,
      delay: 0.2,
      color: 'green',
    },
    {
      icon: Code,
      label: 'Projects',
      value: projects,
      delay: 0.3,
      color: 'purple',
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: totalLikes,
      delay: 0.4,
      color: 'red',
    },
  ]

  // Get coding pattern (mock data)
  const hour = currentTime?.getHours() || 14 // Default to 2 PM if not mounted
  const isNightOwl = hour >= 22 || hour <= 6
  const codingPattern = isNightOwl
    ? 'Night Owl'
    : hour >= 6 && hour <= 12
      ? 'Early Bird'
      : 'Day Coder'

  const developerMetrics: DeveloperMetric[] = [
    {
      icon: Zap,
      label: 'Commit Streak',
      value: commitStreak,
      suffix: ' days',
      color: 'yellow',
      description: 'Consecutive days with commits',
    },
    {
      icon: Coffee,
      label: 'Coffee Index',
      value: 8.5,
      suffix: '/10',
      color: 'orange',
      description: 'Daily caffeine dependency level',
    },
    {
      icon: isNightOwl ? Moon : Sun,
      label: 'Coding Style',
      value: codingPattern,
      color: isNightOwl ? 'purple' : 'yellow',
      description: 'Peak productivity hours',
    },
    {
      icon: Target,
      label: 'Code Quality',
      value: 94,
      suffix: '%',
      color: 'green',
      description: 'Average code review score',
    },
    {
      icon: GitCommit,
      label: 'Total Commits',
      value: 2847,
      color: 'blue',
      description: 'Lifetime git contributions',
    },
    {
      icon: Star,
      label: 'Stars Earned',
      value: 1243,
      color: 'yellow',
      description: 'GitHub stars across all repos',
    },
  ]

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
                {viewMode === 'basic'
                  ? 'Profile Statistics'
                  : 'Developer Analytics'}
              </h2>
              <p className="mt-1 text-gray-500 text-sm">
                {viewMode === 'basic'
                  ? 'Community engagement and content metrics'
                  : 'Coding patterns, productivity insights, and technical metrics'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('basic')}
                className={
                  viewMode === 'basic'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : ''
                }
              >
                <Activity className="mr-1 w-4 h-4" />
                Basic
              </Button>
              <Button
                variant={viewMode === 'developer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('developer')}
                className={
                  viewMode === 'developer'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : ''
                }
              >
                <TrendingUp className="mr-1 w-4 h-4" />
                Developer
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {viewMode === 'basic' ? (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="gap-4 grid grid-cols-2 sm:grid-cols-5"
              >
                {basicStats.map((stat) => (
                  <StatItem
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    delay={stat.delay}
                    color={stat.color}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="developer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Developer Metrics Grid */}
                <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                  {developerMetrics.map((metric, index) => (
                    <StatItem
                      key={metric.label}
                      icon={metric.icon}
                      label={metric.label}
                      value={metric.value}
                      suffix={metric.suffix}
                      delay={index * 0.1}
                      color={metric.color}
                      isSpecial={metric.label === 'Commit Streak'}
                    />
                  ))}
                </div>

                {/* Charts Section */}
                <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ContributionHeatmap />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <CodingTimeChart />
                  </div>
                </div>

                {/* Fun Stats */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border border-orange-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-700 text-sm">
                    🎯 Fun Developer Facts
                  </h4>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">2,847</div>
                      <div className="text-gray-600">Total git commits</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">
                        156,892
                      </div>
                      <div className="text-gray-600">Lines of code written</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">42</div>
                      <div className="text-gray-600">Bugs fixed this month</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-gray-200 border-t rounded-b-lg">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>
              📊{' '}
              {viewMode === 'basic' ? 'Community stats' : 'Developer analytics'}{' '}
              • Updated in real-time
            </span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                Last updated:{' '}
                {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
