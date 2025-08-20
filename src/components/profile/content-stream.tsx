'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  Search,
  Calendar,
  TrendingUp,
  FileText,
  Code,
  Rocket,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfilePost } from './profile-post'
import { SkillBadge } from './skill-badge'
import { ContentCardFooter } from './content-card-footer'
import { InlineComments } from './inline-comments'
import { toast } from 'sonner'
import type { Post, Profile } from '@/db/schema'

interface ContentStreamProps {
  posts: Post[]
  profile: Profile
}

type ContentType = 'all' | 'posts' | 'snippets' | 'projects' | 'thoughts'

interface StreamItem {
  id: string
  type: ContentType
  title: string
  content?: string
  excerpt?: string
  timestamp: Date
  tags?: string[]
  engagement: {
    likes: number
    comments: number
    views: number
  }
  metadata?: {
    readingTime?: string
    language?: string
    isPublished?: boolean
  }
}

export function ContentStream({ posts, profile }: ContentStreamProps) {
  const [activeFilter, setActiveFilter] = useState<ContentType>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreContent, setHasMoreContent] = useState(true)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  )

  // Generate additional mock content for pagination
  const generateAdditionalContent = (page: number): StreamItem[] => {
    const baseItems = [
      {
        id: `additional-snippet-${page}`,
        type: 'snippets' as ContentType,
        title: `React Hook for ${page === 2 ? 'Local Storage' : page === 3 ? 'Debounced Values' : 'API Calls'}`,
        content:
          page === 2
            ? `// Custom hook for localStorage\nconst useLocalStorage = (key, initialValue) => {\n  const [value, setValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key)\n      return item ? JSON.parse(item) : initialValue\n    } catch (error) {\n      return initialValue\n    }\n  })\n\n  const setStoredValue = (value) => {\n    setValue(value)\n    window.localStorage.setItem(key, JSON.stringify(value))\n  }\n\n  return [value, setStoredValue]\n}`
            : `// Custom debounce hook\nconst useDebounce = (value, delay) => {\n  const [debouncedValue, setDebouncedValue] = useState(value)\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value)\n    }, delay)\n\n    return () => {\n      clearTimeout(handler)\n    }\n  }, [value, delay])\n\n  return debouncedValue\n}`,
        timestamp: new Date(Date.now() - page * 24 * 60 * 60 * 1000),
        tags:
          page === 2
            ? ['React', 'Hooks', 'localStorage']
            : ['React', 'Hooks', 'Performance'],
        engagement: {
          likes: Math.floor(Math.random() * 50) + 20,
          comments: Math.floor(Math.random() * 15) + 5,
          views: Math.floor(Math.random() * 200) + 100,
        },
        metadata: { language: 'typescript' },
      },
      {
        id: `additional-thought-${page}`,
        type: 'thoughts' as ContentType,
        title:
          page === 2
            ? 'The Future of Frontend Development'
            : page === 3
              ? 'Building Scalable Component Libraries'
              : 'Remote Work Best Practices',
        content:
          page === 2
            ? "Excited about the direction frontend development is heading. With React Server Components, we're seeing a shift back to server-side rendering while maintaining the interactive capabilities we love. The balance between performance and developer experience is finally clicking."
            : "After building several component libraries, I've learned that documentation and examples are just as important as the code itself. A well-documented component is infinitely more valuable than a perfect one that nobody knows how to use.",
        timestamp: new Date(
          Date.now() - page * 24 * 60 * 60 * 1000 - 12 * 60 * 60 * 1000
        ),
        tags:
          page === 2
            ? ['Frontend', 'React', 'SSR']
            : page === 3
              ? ['Design Systems', 'Documentation']
              : ['Remote Work', 'Productivity'],
        engagement: {
          likes: Math.floor(Math.random() * 80) + 30,
          comments: Math.floor(Math.random() * 25) + 10,
          views: Math.floor(Math.random() * 300) + 150,
        },
      },
    ]

    return baseItems
  }

  // Convert posts to stream items and add mock activity items
  const baseStreamItems: StreamItem[] = [
    // Real posts
    ...posts.map((post) => ({
      id: post.id,
      type: 'posts' as ContentType,
      title: post.title,
      excerpt: post.excerpt || undefined,
      timestamp: new Date(post.createdAt),
      tags: post.tags,
      engagement: {
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        views: post.viewCount || 0,
      },
      metadata: {
        readingTime: post.readingTime || undefined,
        isPublished: post.isPublished,
      },
    })),
    // Mock code snippets
    {
      id: 'snippet-1',
      type: 'snippets' as ContentType,
      title: 'Useful TypeScript Utility Types',
      content: `// Creating a conditional type for API responses
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
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      tags: ['TypeScript', 'Utility Types', 'API'],
      engagement: { likes: 45, comments: 12, views: 234 },
      metadata: { language: 'typescript' },
    },
    // Mock project activity
    {
      id: 'project-1',
      type: 'projects' as ContentType,
      title: 'CodeCave Platform v2.0 Released',
      excerpt:
        'Major update with improved real-time collaboration, enhanced project showcasing, and new developer networking features.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      tags: ['Release', 'Next.js', 'React', 'Supabase'],
      engagement: { likes: 89, comments: 23, views: 456 },
    },
    // Mock thoughts
    {
      id: 'thought-1',
      type: 'thoughts' as ContentType,
      title: 'The Evolution of React State Management',
      content:
        'Been thinking about how state management in React has evolved from Redux being the go-to solution to now having so many great options like Zustand, Jotai, and Valtio. Each has its place depending on the use case. What&apos;s your favorite state management solution in 2024?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      tags: ['React', 'State Management', 'Discussion'],
      engagement: { likes: 67, comments: 34, views: 189 },
    },
  ]

  // Add additional content for current page
  const allStreamItems = [...baseStreamItems]
  for (let page = 2; page <= currentPage; page++) {
    allStreamItems.push(...generateAdditionalContent(page))
  }

  const streamItems = allStreamItems.sort((a, b) => {
    if (sortBy === 'recent') {
      return b.timestamp.getTime() - a.timestamp.getTime()
    } else {
      return b.engagement.likes - a.engagement.likes
    }
  })

  const filteredItems =
    activeFilter === 'all'
      ? streamItems
      : streamItems.filter((item) => item.type === activeFilter)

  // Load more functionality
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreContent) return

    setIsLoadingMore(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    // Simulate reaching end of content after 3 pages
    if (nextPage >= 4) {
      setHasMoreContent(false)
      toast.success("You've reached the end! No more content to load.")
    } else {
      toast.success(`Loaded page ${nextPage} content`)
    }

    setIsLoadingMore(false)
  }

  const filterOptions = [
    { key: 'all', label: 'All Content', icon: Filter },
    { key: 'posts', label: 'Articles', icon: FileText },
    { key: 'snippets', label: 'Code', icon: Code },
    { key: 'projects', label: 'Projects', icon: Rocket },
    { key: 'thoughts', label: 'Thoughts', icon: MessageSquare },
  ] as const

  const renderStreamItem = (item: StreamItem) => {
    // For regular posts, use the existing ProfilePost component
    if (item.type === 'posts') {
      const post = posts.find((p) => p.id === item.id)
      if (post) {
        return <ProfilePost key={item.id} post={post} author={profile} />
      }
    }

    // For other content types, render custom cards
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        <div className="p-4">
          {/* Content Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              {item.type === 'snippets' && (
                <Code className="w-5 h-5 text-purple-600" />
              )}
              {item.type === 'projects' && (
                <Rocket className="w-5 h-5 text-green-600" />
              )}
              {item.type === 'thoughts' && (
                <MessageSquare className="w-5 h-5 text-blue-600" />
              )}

              <Badge
                variant="secondary"
                className={`text-xs ${
                  item.type === 'snippets'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : item.type === 'projects'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1, -1)}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{item.timestamp.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="mb-2 font-semibold text-gray-900 text-lg cursor-pointer">
              {item.title}
            </h3>

            {item.content && item.type === 'snippets' && (
              <div className="bg-gray-900 mb-3 p-4 rounded-lg overflow-x-auto">
                <pre className="font-mono text-gray-100 text-sm">
                  <code>{item.content}</code>
                </pre>
              </div>
            )}

            {item.content && item.type !== 'snippets' && (
              <p className="mb-3 text-gray-600 text-sm leading-relaxed">
                {item.content}
              </p>
            )}

            {item.excerpt && (
              <p className="mb-3 text-gray-600 text-sm leading-relaxed">
                {item.excerpt}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag, index) => (
                  <SkillBadge
                    key={index}
                    skill={tag}
                    variant="secondary"
                    size="sm"
                  />
                ))}
                {item.tags.length > 4 && (
                  <span className="text-gray-500 text-xs">
                    +{item.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Unified Content Card Footer */}
          <ContentCardFooter
            stats={{
              views: item.engagement.views,
              likes: item.engagement.likes,
              comments: item.engagement.comments,
            }}
            onComment={() => {
              const newExpanded = new Set(expandedComments)
              if (expandedComments.has(item.id)) {
                newExpanded.delete(item.id)
              } else {
                newExpanded.add(item.id)
              }
              setExpandedComments(newExpanded)
            }}
            showExternalLink={true}
          />

          {/* Inline Comments */}
          <InlineComments
            isExpanded={expandedComments.has(item.id)}
            onToggle={() => {
              const newExpanded = new Set(expandedComments)
              if (expandedComments.has(item.id)) {
                newExpanded.delete(item.id)
              } else {
                newExpanded.add(item.id)
              }
              setExpandedComments(newExpanded)
            }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border border-gray-200 rounded-lg"
    >
      {/* Header */}
      <div className="px-6 py-4 border-gray-200 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">
              Content Stream
            </h2>
            <p className="text-gray-500 text-sm">
              Latest articles, code snippets, projects, and thoughts
            </p>
          </div>

          {/* Sort Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className={sortBy === 'recent' ? 'bg-orange-600' : ''}
            >
              <Calendar className="mr-1 w-4 h-4" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className={sortBy === 'popular' ? 'bg-orange-600' : ''}
            >
              <TrendingUp className="mr-1 w-4 h-4" />
              Popular
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          {filterOptions.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeFilter === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(key as ContentType)}
              className={`flex items-center space-x-1 ${
                activeFilter === key
                  ? 'bg-white shadow-sm text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content Stream */}
      <div className="space-y-4 p-6">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            filteredItems.map(renderStreamItem)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 p-8 border border-gray-200 rounded-lg text-center"
            >
              <Search className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-gray-900 text-lg">
                No {activeFilter === 'all' ? 'content' : activeFilter} found
              </h3>
              <p className="text-gray-500">
                {activeFilter === 'all'
                  ? 'This developer hasn&apos;t shared any content yet.'
                  : `No ${activeFilter} have been shared yet.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {filteredItems.length > 0 && hasMoreContent && (
        <div className="px-6 py-4 border-gray-200 border-t text-center">
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className="mr-2 border-orange-600 border-b-2 rounded-full w-4 h-4 animate-spin" />
                Loading more content...
              </>
            ) : (
              'Load More Content'
            )}
          </Button>
        </div>
      )}

      {/* End of content message */}
      {!hasMoreContent && filteredItems.length > 0 && (
        <div className="px-6 py-4 border-gray-200 border-t text-center">
          <p className="text-gray-500 text-sm">
            You&apos;ve reached the end! Check back later for new updates.
          </p>
        </div>
      )}
    </motion.div>
  )
}
