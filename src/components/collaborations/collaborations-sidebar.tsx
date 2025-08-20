'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Code,
  Sparkles,
  GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollaborationsSidebarProps {
  onCreateClick: () => void
}

// Mock data for suggested collaborators
const suggestedCollaborators = [
  {
    id: '1',
    username: 'alexdev',
    displayName: 'Alex Chen',
    skills: ['React', 'Node.js', 'TypeScript'],
    matchPercentage: 92,
    avatarColor: 'bg-blue-500',
  },
  {
    id: '2',
    username: 'sarahcode',
    displayName: 'Sarah Johnson',
    skills: ['Python', 'Machine Learning', 'Django'],
    matchPercentage: 85,
    avatarColor: 'bg-purple-500',
  },
  {
    id: '3',
    username: 'mikebuild',
    displayName: 'Mike Wilson',
    skills: ['Vue.js', 'Laravel', 'MySQL'],
    matchPercentage: 78,
    avatarColor: 'bg-green-500',
  },
]

// Mock trending topics
const trendingTopics = [
  { name: 'AI/ML Projects', count: 152, icon: Sparkles, trend: 'up' },
  { name: 'Open Source', count: 98, icon: GitBranch, trend: 'up' },
  { name: 'Web3 Development', count: 76, icon: Code, trend: 'down' },
  { name: 'Mobile Apps', count: 64, icon: Code, trend: 'stable' },
]

// Quick filters
const quickFilters = [
  { label: 'Remote Only', icon: MapPin, active: false },
  { label: 'Paid Projects', icon: DollarSign, active: false },
  { label: 'Short-term', icon: Clock, active: false },
  { label: 'Beginner Friendly', icon: Users, active: false },
]

export function CollaborationsSidebar({
  onCreateClick,
}: CollaborationsSidebarProps) {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Create Collaboration CTA */}
      <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold text-gray-900">
            Looking for collaborators?
          </h3>
          <p className="mb-4 text-gray-600 text-sm">
            Post your project and find the perfect team members to bring your
            ideas to life.
          </p>
          <Button
            onClick={onCreateClick}
            className="bg-orange-600 hover:bg-orange-700 w-full text-white"
          >
            <Plus className="mr-2 w-4 h-4" />
            Post Collaboration
          </Button>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card className="bg-white py-4 border-gray-200">
        <CardContent className="space-y-1">
          {quickFilters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.label}
                className="group flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-md w-full text-left transition-colors duration-150"
              >
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                <span className="font-semibold text-gray-900 group-hover:text-gray-700 text-sm">
                  {filter.label}
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <div
                key={topic.name}
                className="group flex justify-between items-center hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 group-hover:text-gray-900 text-sm">
                    {topic.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">{topic.count}</span>
                  {topic.trend === 'up' && (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                  {topic.trend === 'down' && (
                    <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Suggested Collaborators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <Users className="w-4 h-4" />
            Suggested Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedCollaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="group flex items-start space-x-3 hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={cn(
                    'text-white text-xs font-semibold',
                    collaborator.avatarColor
                  )}
                >
                  {getInitials(collaborator.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 group-hover:text-orange-600 text-sm truncate">
                    {collaborator.displayName}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 px-1.5 py-0 text-green-700 text-xs"
                  >
                    {collaborator.matchPercentage}% match
                  </Badge>
                </div>
                <p className="text-gray-500 text-xs truncate">
                  @{collaborator.username}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {collaborator.skills.slice(0, 2).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="px-1.5 py-0 h-4 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View More Suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="gap-4 grid grid-cols-2 text-center">
            <div>
              <p className="font-bold text-gray-900 text-2xl">1,234</p>
              <p className="text-gray-600 text-xs">Active Projects</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-2xl">5,678</p>
              <p className="text-gray-600 text-xs">Developers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
