'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react'

export type FeedAlgorithm = 'for-you' | 'following' | 'trending' | 'recent'

interface FeedFiltersProps {
  algorithm: FeedAlgorithm
  onAlgorithmChange: (algorithm: FeedAlgorithm) => void
}

const algorithmOptions = [
  {
    value: 'for-you' as FeedAlgorithm,
    label: 'For You',
    icon: Sparkles,
    description: 'Personalized content',
    color: 'text-orange-600',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    isNew: true
  },
  {
    value: 'following' as FeedAlgorithm,
    label: 'Following',
    icon: Users,
    description: 'From people you follow',
    color: 'text-blue-600',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isNew: false
  },
  {
    value: 'trending' as FeedAlgorithm,
    label: 'Trending',
    icon: TrendingUp,
    description: 'Popular right now',
    color: 'text-green-600',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    isNew: false
  },
  {
    value: 'recent' as FeedAlgorithm,
    label: 'Recent',
    icon: Clock,
    description: 'Latest posts',
    color: 'text-purple-600',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    isNew: false
  }
]

export function FeedFilters({ algorithm, onAlgorithmChange }: FeedFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-1 mr-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 hidden sm:inline">Filter:</span>
        </div>
        
        {algorithmOptions.map((option) => {
          const Icon = option.icon
          const isActive = algorithm === option.value
          
          return (
            <div key={option.value} className="relative">
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onAlgorithmChange(option.value)}
                className={`relative flex items-center space-x-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{option.label}</span>
                
                {/* Mobile: Show only icon */}
                <span className="sm:hidden sr-only">{option.label}</span>
              </Button>
              
              {/* New Badge */}
              {option.isNew && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="bg-red-500 text-white text-xs px-1 py-0.5 border-0">
                    New
                  </Badge>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}