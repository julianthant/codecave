'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp,
  Hash,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

// Mock trending topics data
const trendingTopics = [
  {
    tag: 'React 19',
    posts: 342,
    trend: 'up',
    percentage: 15,
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    tag: 'TypeScript',
    posts: 287,
    trend: 'up',
    percentage: 8,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    tag: 'Next.js 15',
    posts: 156,
    trend: 'up',
    percentage: 23,
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    tag: 'AI/ML',
    posts: 234,
    trend: 'up',
    percentage: 12,
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    tag: 'Rust',
    posts: 89,
    trend: 'up',
    percentage: 31,
    color: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    tag: 'DevOps',
    posts: 167,
    trend: 'up',
    percentage: 5,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  }
]

export function TrendingTopics() {
  const handleTopicClick = (topic: string) => {
    toast.success(`Filtering feed by #${topic}`)
  }

  const handleSeeAll = () => {
    toast.success('Opening trending topics page...')
  }

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>Trending Topics</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSeeAll}
            className="text-xs text-orange-600 hover:text-orange-700 p-1 h-auto"
          >
            See all
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <button
              onClick={() => handleTopicClick(topic.tag)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200 group-hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="h-3 w-3 text-gray-400" />
                  <span className="font-medium text-sm text-gray-900">{topic.tag}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    +{topic.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {topic.posts} posts
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${topic.color}`}
                >
                  Hot
                </Badge>
              </div>
            </button>
          </motion.div>
        ))}

        {/* Explore More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2 border-t border-gray-100"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.success('Opening topics explorer...')}
            className="w-full text-sm text-gray-600 hover:text-orange-600 justify-start"
          >
            <Hash className="h-4 w-4 mr-2" />
            Explore More Topics
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}