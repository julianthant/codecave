'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

// Mock user data with LeetCode stats - In a real app, this would come from auth store and LeetCode API
const mockUser = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  subtitle: 'Software Engineer @ TechCorp Inc.',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  coverUrl:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop',
  leetcode: {
    username: 'john_codes',
    currentStreak: 47,
    maxStreak: 73,
    totalSolved: 234,
    totalProblems: 3000,
    easy: { solved: 142, total: 1200 },
    medium: { solved: 78, total: 1500 },
    hard: { solved: 14, total: 300 },
    globalRank: 127489,
    contestRating: 1847,
  },
}

export function MiniProfile() {
  const { leetcode } = mockUser

  // Calculate percentages for difficulty breakdown
  const easyPercent = Math.round(
    (leetcode.easy.solved / leetcode.totalSolved) * 100
  )
  const mediumPercent = Math.round(
    (leetcode.medium.solved / leetcode.totalSolved) * 100
  )
  const hardPercent = Math.round(
    (leetcode.hard.solved / leetcode.totalSolved) * 100
  )

  return (
    <Card className="bg-white hover:shadow-sm py-0 border-gray-200 overflow-hidden transition-all duration-200">
      <CardContent className="p-0">
        {/* Cover Photo with Profile Photo */}
        <div className="relative bg-gradient-to-r from-orange-400 to-orange-600 h-24">
          {mockUser.coverUrl ? (
            <Image
              src={mockUser.coverUrl}
              alt="Cover photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600" />
          )}

          {/* Profile Photo positioned in cover photo */}
          <div className="-bottom-5 left-5 absolute">
            <Avatar className="shadow-lg border-4 border-white w-16 h-16">
              <AvatarImage
                src={mockUser.avatarUrl}
                alt={mockUser.displayName}
              />
              <AvatarFallback className="bg-orange-500 text-white">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-5 pt-7">
          {/* Header Info below avatar */}
          <div className="mb-4">
            <h3 className="mb-1 font-semibold text-gray-900 text-lg">
              {mockUser.displayName}
            </h3>
            <p className="text-gray-600 text-sm">{mockUser.subtitle}</p>
          </div>

          {/* Divider */}
          <div className="mb-4 border-gray-200 border-t"></div>

          {/* LeetCode Stats Header */}
          <div className="mb-4">
            <div className="mb-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
              LEETCODE STATS
            </div>

            {/* Current Streak */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 text-sm">Current Streak</span>
              <span className="font-mono font-semibold text-orange-600 text-sm">
                {leetcode.currentStreak} days
              </span>
            </div>

            {/* Total Solved */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-sm">Total Solved</span>
              <span className="font-mono font-semibold text-gray-900 text-sm">
                {leetcode.totalSolved}
              </span>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="mb-4">
            <div className="mb-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
              DIFFICULTY BREAKDOWN
            </div>

            <div className="space-y-2">
              {/* Easy */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 rounded-full w-2 h-2"></div>
                  <span className="text-gray-600 text-xs">Easy</span>
                </div>
                <span className="font-mono text-gray-900 text-xs">
                  {leetcode.easy.solved} ({easyPercent}%)
                </span>
              </div>

              {/* Medium */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-500 rounded-full w-2 h-2"></div>
                  <span className="text-gray-600 text-xs">Medium</span>
                </div>
                <span className="font-mono text-gray-900 text-xs">
                  {leetcode.medium.solved} ({mediumPercent}%)
                </span>
              </div>

              {/* Hard */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-500 rounded-full w-2 h-2"></div>
                  <span className="text-gray-600 text-xs">Hard</span>
                </div>
                <span className="font-mono text-gray-900 text-xs">
                  {leetcode.hard.solved} ({hardPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Global Rank */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm">Global Rank</span>
            <span className="font-mono font-semibold text-gray-900 text-sm">
              #{leetcode.globalRank.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
