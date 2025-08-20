'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostComposer } from './post-composer'
import { UnifiedFeedPost } from './unified-feed-post'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
export type PostType = 'article' | 'snippet' | 'project' | 'thought'

interface ArticleContent {
  title: string
  excerpt?: string
  readingTime?: string
  tags?: string[]
  coverImage?: string
}

interface SnippetContent {
  title: string
  description?: string
  language: string
  code: string
  tags?: string[]
}

interface ProjectContent {
  title: string
  description?: string
  version?: string
  repository?: string
  liveDemo?: string
  technologies?: string[]
  features?: string[]
  screenshots?: string[]
}

interface ThoughtContent {
  text: string
  tags?: string[]
}

export type FeedContent = ArticleContent | SnippetContent | ProjectContent | ThoughtContent

export interface FeedItem {
  id: string
  type: PostType
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified?: boolean
    isPro?: boolean
  }
  createdAt: string
  content: FeedContent
  engagement: {
    likes: number
    comments: number
    reposts: number
    views: number
  }
  isLiked?: boolean
  isBookmarked?: boolean
  isReposted?: boolean
}

// Mock feed data
const mockFeedData: FeedItem[] = [
  {
    id: '1',
    type: 'article',
    author: {
      id: '1',
      username: 'sarahchen',
      displayName: 'Sarah Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b163d4b2?w=400&h=400&fit=crop&crop=face',
      isVerified: true,
      isPro: true
    },
    createdAt: '2024-08-19T10:30:00Z',
    content: {
      title: 'Building Scalable React Applications with Server Components',
      excerpt: 'React Server Components are revolutionizing how we think about server-side rendering and client-side interactivity. Here\'s everything you need to know.',
      readingTime: '8 min read',
      tags: ['React', 'Server Components', 'Next.js', 'Performance'],
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop'
    },
    engagement: {
      likes: 156,
      comments: 23,
      reposts: 12,
      views: 1240
    }
  },
  {
    id: '2',
    type: 'snippet',
    author: {
      id: '2',
      username: 'alexkumar',
      displayName: 'Alex Kumar',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      isPro: false
    },
    createdAt: '2024-08-19T09:15:00Z',
    content: {
      title: 'Useful TypeScript Utility Types',
      description: 'A collection of TypeScript utility types that will make your code more type-safe and maintainable.',
      language: 'typescript',
      code: `// Creating a conditional type for API responses
type ApiResponse<T> = {
  data: T
  success: true
  message: string
} | {
  data: null
  success: false
  error: string
}

// Usage example
const handleResponse = <T>(response: ApiResponse<T>) => {
  if (response.success) {
    return response.data // Type is T
  } else {
    throw new Error(response.error)
  }
}`,
      tags: ['TypeScript', 'Utility Types', 'API']
    },
    engagement: {
      likes: 89,
      comments: 15,
      reposts: 7,
      views: 456
    }
  },
  {
    id: '3',
    type: 'project',
    author: {
      id: '3',
      username: 'emilyjohnson',
      displayName: 'Emily Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      isVerified: false,
      isPro: true
    },
    createdAt: '2024-08-19T08:45:00Z',
    content: {
      title: 'CodeCave Platform v2.0 Released',
      description: 'Major update with improved real-time collaboration, enhanced project showcasing, and new developer networking features.',
      version: 'v2.0.0',
      repository: 'https://github.com/emilyjohnson/codecave-platform',
      liveDemo: 'https://codecave.dev',
      technologies: ['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'Framer Motion'],
      features: [
        'Real-time collaboration tools',
        'Enhanced project showcasing',
        'Developer networking features',
        'Improved performance by 40%',
        'Mobile-responsive design'
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop'
      ]
    },
    engagement: {
      likes: 234,
      comments: 45,
      reposts: 28,
      views: 1890
    }
  },
  {
    id: '4',
    type: 'thought',
    author: {
      id: '4',
      username: 'mikewilson',
      displayName: 'Mike Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      isVerified: true,
      isPro: false
    },
    createdAt: '2024-08-19T07:20:00Z',
    content: {
      text: 'Been thinking about the evolution of React state management. From Redux being the go-to solution to now having amazing options like Zustand, Jotai, and Valtio. Each has its place depending on the use case. What\'s your favorite state management solution in 2024?',
      tags: ['React', 'State Management', 'Discussion']
    },
    engagement: {
      likes: 67,
      comments: 34,
      reposts: 8,
      views: 789
    }
  }
]

export function FeedContainer() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(mockFeedData)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = async () => {
    setIsLoading(true)
    // Simulate loading more content
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add more mock data
    const moreMockData = mockFeedData.map(item => ({
      ...item,
      id: item.id + '_' + Date.now(),
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }))
    
    setFeedItems(prev => [...prev, ...moreMockData])
    setIsLoading(false)
    toast.success('Loaded more posts!')
  }

  const renderPost = (item: FeedItem) => {
    return <UnifiedFeedPost key={item.id} item={item} />
  }

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      <PostComposer />

      {/* Feed Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {feedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {renderPost(item)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Load More */}
        <div className="flex justify-center py-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Loading more posts...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}