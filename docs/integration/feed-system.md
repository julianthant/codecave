# Feed System

[← Back to Index](./index.md) | [Previous: Authentication](./05-authentication.md) | [Next: Block Editor →](./07-block-editor.md)

## Overview

The feed system is the heart of CodeCave, featuring:
- Guest-friendly browsing (no login required)
- Multiple feed algorithms (For You, Following, Trending, Latest)
- Infinite scrolling
- Real-time updates
- Smart caching

## Step 1: Create Feed Store

### Create `src/stores/feed.store.ts`
```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type FeedAlgorithm = 
  | 'algorithm' 
  | 'following' 
  | 'trending' 
  | 'latest' 
  | 'showcase' 
  | 'collaborations'

export interface FeedFilters {
  languages: string[]
  tags: string[]
  postTypes: ('article' | 'snippet' | 'showcase' | 'discussion' | 'collaboration')[]
  timeRange?: '24h' | '7d' | '30d' | 'all'
}

interface FeedState {
  algorithm: FeedAlgorithm
  filters: FeedFilters
  searchQuery: string
  
  // Actions
  setAlgorithm: (algorithm: FeedAlgorithm) => void
  setFilters: (filters: Partial<FeedFilters>) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

const defaultFilters: FeedFilters = {
  languages: [],
  tags: [],
  postTypes: [],
  timeRange: 'all',
}

export const useFeedStore = create<FeedState>()(
  devtools(
    (set) => ({
      algorithm: 'algorithm',
      filters: defaultFilters,
      searchQuery: '',

      setAlgorithm: (algorithm) => set({ algorithm }),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
        
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'feed-store',
    }
  )
)
```

## Step 2: Create Feed API Routes

### Create `src/app/api/posts/route.ts`
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().min(1).max(50).default(20),
  algorithm: z.enum(['algorithm', 'following', 'trending', 'latest', 'showcase', 'collaborations']).default('algorithm'),
  languages: z.string().optional(),
  tags: z.string().optional(),
  postTypes: z.string().optional(),
  timeRange: z.enum(['24h', '7d', '30d', 'all']).optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const query = querySchema.parse(searchParams)
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Base query
    let postsQuery = supabase
      .from('posts')
      .select(`
        *,
        user:users!user_id (
          id,
          username,
          display_name,
          avatar_url,
          is_pro
        ),
        likes:likes(count),
        user_liked:likes!left(user_id)
      `)
      .eq('is_published', true)
      .limit(query.limit)
      .range(query.page * query.limit, (query.page + 1) * query.limit - 1)

    // Apply filters
    if (query.languages) {
      const languages = query.languages.split(',')
      postsQuery = postsQuery.contains('tags', languages)
    }

    if (query.tags) {
      const tags = query.tags.split(',')
      postsQuery = postsQuery.contains('tags', tags)
    }

    if (query.postTypes) {
      const types = query.postTypes.split(',')
      postsQuery = postsQuery.in('type', types)
    }

    // Apply time range filter
    if (query.timeRange && query.timeRange !== 'all') {
      const hoursMap = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30,
      }
      const hours = hoursMap[query.timeRange]
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
      postsQuery = postsQuery.gte('published_at', since)
    }

    // Apply search
    if (query.search) {
      postsQuery = postsQuery.textSearch('search_vector', query.search)
    }

    // Apply algorithm-specific ordering
    switch (query.algorithm) {
      case 'following':
        if (!user) {
          return NextResponse.json({ posts: [], hasMore: false })
        }
        // Get following list
        const { data: following } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)
        
        const followingIds = following?.map(f => f.following_id) || []
        if (followingIds.length === 0) {
          return NextResponse.json({ posts: [], hasMore: false })
        }
        
        postsQuery = postsQuery
          .in('user_id', followingIds)
          .order('published_at', { ascending: false })
        break

      case 'trending':
        // Calculate trending score
        postsQuery = postsQuery
          .order('like_count', { ascending: false })
          .order('comment_count', { ascending: false })
          .order('published_at', { ascending: false })
        break

      case 'latest':
        postsQuery = postsQuery.order('published_at', { ascending: false })
        break

      case 'showcase':
        postsQuery = postsQuery
          .eq('type', 'showcase')
          .order('published_at', { ascending: false })
        break

      case 'collaborations':
        postsQuery = postsQuery
          .eq('type', 'collaboration')
          .order('published_at', { ascending: false })
        break

      default: // 'algorithm'
        // For now, use a simple algorithm
        // In production, this would be more sophisticated
        postsQuery = postsQuery.order('published_at', { ascending: false })
    }

    const { data: posts, error } = await postsQuery

    if (error) {
      console.error('Feed error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Process posts to add user_liked flag
    const processedPosts = posts?.map(post => ({
      ...post,
      user_liked: user ? post.user_liked?.some((like: any) => like.user_id === user.id) : false,
      likes: post.likes?.[0]?.count || 0,
    })) || []

    // Determine if there are more posts
    const hasMore = processedPosts.length === query.limit

    return NextResponse.json({
      posts: processedPosts,
      hasMore,
      page: query.page,
    })
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    )
  }
}
```

### Create `src/app/api/posts/[id]/route.ts`
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!user_id (
        id,
        username,
        display_name,
        avatar_url,
        banner_url,
        bio,
        is_pro,
        github_username,
        twitter_username
      ),
      likes:likes(count),
      user_liked:likes!left(user_id),
      comments:comments(count)
    `)
    .eq('id', params.id)
    .single()

  if (error || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Check if post is published or user owns it
  if (!post.is_published && post.user_id !== user?.id) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Process post
  const processedPost = {
    ...post,
    user_liked: user ? post.user_liked?.some((like: any) => like.user_id === user.id) : false,
    likes: post.likes?.[0]?.count || 0,
    comments: post.comments?.[0]?.count || 0,
  }

  // Increment view count
  if (user && user.id !== post.user_id) {
    await supabase.rpc('increment_post_views', {
      post_id: params.id,
      viewer_id: user.id,
    })
  }

  return NextResponse.json(processedPost)
}
```

## Step 3: Create Feed Components

### Create `src/components/feed/feed-container.tsx`
```typescript
'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { PostCard } from './post-card'
import { FeedFilters } from './feed-filters'
import { FeedTabs } from './feed-tabs'
import { useFeedStore } from '@/stores/feed.store'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { EmptyState } from './empty-state'

interface FeedContainerProps {
  isGuest?: boolean
}

async function fetchFeed({
  pageParam = 0,
  algorithm,
  filters,
  searchQuery,
}: {
  pageParam?: number
  algorithm: string
  filters: any
  searchQuery: string
}) {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    algorithm,
    search: searchQuery,
    ...(filters.languages.length && { languages: filters.languages.join(',') }),
    ...(filters.tags.length && { tags: filters.tags.join(',') }),
    ...(filters.postTypes.length && { postTypes: filters.postTypes.join(',') }),
    ...(filters.timeRange && { timeRange: filters.timeRange }),
  })

  const response = await fetch(`/api/posts?${params}`)
  if (!response.ok) throw new Error('Failed to fetch posts')
  
  return response.json()
}

export function FeedContainer({ isGuest }: FeedContainerProps) {
  const { algorithm, filters, searchQuery } = useFeedStore()
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['feed', algorithm, filters, searchQuery],
    queryFn: ({ pageParam }) => fetchFeed({ pageParam, algorithm, filters, searchQuery }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const posts = data?.pages.flatMap(page => page.posts) ?? []

  return (
    <div className="space-y-6">
      <FeedTabs />
      <FeedFilters disabled={isGuest} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <EmptyState
          title="Something went wrong"
          description="We couldn't load the posts. Please try again."
          action={{
            label: 'Refresh',
            onClick: () => window.location.reload(),
          }}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try adjusting your filters or check back later for new content."
          action={
            filters.languages.length || filters.tags.length || filters.postTypes.length
              ? {
                  label: 'Clear filters',
                  onClick: () => useFeedStore.getState().resetFilters(),
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} isGuest={isGuest} />
            ))}
          </div>
          
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

### Create `src/components/feed/post-card.tsx`
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AuthModal } from '@/components/auth/auth-modal'
import { useAuthStore } from '@/stores/auth.store'
import { PostActions } from './post-actions'
import { CodeBlockPreview } from './code-block-preview'
import { CollaboratorBlockPreview } from './collaborator-block-preview'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Crown,
} from 'lucide-react'

interface PostCardProps {
  post: any
  isGuest?: boolean
}

export function PostCard({ post, isGuest }: PostCardProps) {
  const { user } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Extract preview content
  const textBlock = post.blocks?.find((b: any) => b.type === 'text')
  const codeBlock = post.blocks?.find((b: any) => b.type === 'code')
  const collaboratorBlock = post.blocks?.find((b: any) => b.type === 'collaborator')

  const handleInteraction = (action: string) => {
    if (isGuest || !user) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href={`/u/${post.user.username}`}>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={post.user.avatar_url} />
                  <AvatarFallback>
                    {post.user.display_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/u/${post.user.username}`}
                    className="font-semibold hover:underline"
                  >
                    {post.user.display_name}
                  </Link>
                  {post.user.is_pro && (
                    <Crown className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  @{post.user.username} · {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Title */}
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-bold mb-3 hover:text-primary cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          {textBlock && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {textBlock.content.text}
            </p>
          )}

          {/* Special Blocks Preview */}
          {codeBlock && (
            <div className="mb-4">
              <CodeBlockPreview
                language={codeBlock.content.language}
                code={codeBlock.content.code}
                filename={codeBlock.content.filename}
              />
            </div>
          )}

          {collaboratorBlock && (
            <div className="mb-4">
              <CollaboratorBlockPreview content={collaboratorBlock.content} />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <Link key={tag} href={`/tag/${tag}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Post Type Badge */}
          {post.type !== 'article' && (
            <Badge variant="outline" className="mb-4">
              {post.type}
            </Badge>
          )}

          {/* Actions */}
          <PostActions
            post={post}
            onInteraction={handleInteraction}
            isGuest={isGuest}
          />
        </div>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
```

### Create `src/components/feed/post-actions.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PostActionsProps {
  post: any
  onInteraction: (action: string) => boolean
  isGuest?: boolean
}

export function PostActions({ post, onInteraction, isGuest }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(post.user_liked)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = async () => {
    if (!onInteraction('like')) return

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (!response.ok) throw new Error()
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked)
      setLikeCount(likeCount)
      toast.error('Failed to update like')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${post.id}`
      )
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleBookmark = async () => {
    if (!onInteraction('bookmark')) return

    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'hover:text-red-500',
            isLiked && 'text-red-500'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 mr-1',
              isLiked && 'fill-current'
            )}
          />
          {likeCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInteraction('comment')}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.comment_count || 0}
        </Button>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={cn(
            isBookmarked && 'text-primary'
          )}
        >
          <Bookmark
            className={cn(
              'h-4 w-4',
              isBookmarked && 'fill-current'
            )}
          />
        </Button>
      </div>
    </div>
  )
}
```

### Create `src/components/feed/feed-tabs.tsx`
```typescript
'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFeedStore, type FeedAlgorithm } from '@/stores/feed.store'
import { useAuthStore } from '@/stores/auth.store'
import {
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Palette,
  UserPlus,
} from 'lucide-react'

const feedTabs = [
  {
    value: 'algorithm' as FeedAlgorithm,
    label: 'For You',
    icon: Sparkles,
    requiresAuth: false,
  },
  {
    value: 'following' as FeedAlgorithm,
    label: 'Following',
    icon: Users,
    requiresAuth: true,
  },
  {
    value: 'trending' as FeedAlgorithm,
    label: 'Trending',
    icon: TrendingUp,
    requiresAuth: false,
  },
  {
    value: 'latest' as FeedAlgorithm,
    label: 'Latest',
    icon: Clock,
    requiresAuth: false,
  },
  {
    value: 'showcase' as FeedAlgorithm,
    label: 'Showcase',
    icon: Palette,
    requiresAuth: false,
  },
  {
    value: 'collaborations' as FeedAlgorithm,
    label: 'Find Team',
    icon: UserPlus,
    requiresAuth: false,
  },
]

export function FeedTabs() {
  const { algorithm, setAlgorithm } = useFeedStore()
  const { user } = useAuthStore()

  const availableTabs = feedTabs.filter(
    tab => !tab.requiresAuth || user
  )

  return (
    <Tabs value={algorithm} onValueChange={(v) => setAlgorithm(v as FeedAlgorithm)}>
      <TabsList className="grid grid-cols-3 lg:grid-cols-6">
        {availableTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
```

### Create `src/components/feed/feed-filters.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useFeedStore } from '@/stores/feed.store'
import { Filter, X } from 'lucide-react'

const popularLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'React',
  'Node.js',
  'Go',
  'Rust',
  'Java',
  'C++',
  'Ruby',
]

const postTypes = [
  { value: 'article', label: 'Articles' },
  { value: 'snippet', label: 'Code Snippets' },
  { value: 'showcase', label: 'Project Showcases' },
  { value: 'discussion', label: 'Discussions' },
  { value: 'collaboration', label: 'Collaborations' },
]

interface FeedFiltersProps {
  disabled?: boolean
}

export function FeedFilters({ disabled }: FeedFiltersProps) {
  const { filters, setFilters } = useFeedStore()
  const [isOpen, setIsOpen] = useState(false)

  const activeFilterCount = 
    filters.languages.length + 
    filters.tags.length + 
    filters.postTypes.length +
    (filters.timeRange && filters.timeRange !== 'all' ? 1 : 0)

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language]
    
    setFilters({ languages: newLanguages })
  }

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.postTypes.includes(type as any)
      ? filters.postTypes.filter(t => t !== type)
      : [...filters.postTypes, type as any]
    
    setFilters({ postTypes: newTypes })
  }

  const clearFilters = () => {
    useFeedStore.getState().resetFilters()
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 px-1"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Time Range</h4>
              <Select
                value={filters.timeRange}
                onValueChange={(value: any) => setFilters({ timeRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium mb-3">Languages & Technologies</h4>
              <div className="space-y-2">
                {popularLanguages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={language}
                      checked={filters.languages.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                    />
                    <Label
                      htmlFor={language}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Post Types</h4>
              <div className="space-y-2">
                {postTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={filters.postTypes.includes(type.value as any)}
                      onCheckedChange={() => handleTypeToggle(type.value)}
                    />
                    <Label
                      htmlFor={type.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.timeRange && filters.timeRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.timeRange}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ timeRange: 'all' })}
              />
            </Badge>
          )}
          {filters.languages.map((language) => (
            <Badge key={language} variant="secondary" className="gap-1">
              {language}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleLanguageToggle(language)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Create `src/components/feed/empty-state.tsx`
```typescript
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ElementType
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileText,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

## Step 4: Create Preview Components

### Create `src/components/feed/code-block-preview.tsx`
```typescript
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCode } from 'lucide-react'

interface CodeBlockPreviewProps {
  language: string
  code: string
  filename?: string
}

export function CodeBlockPreview({ language, code, filename }: CodeBlockPreviewProps) {
  const lines = code.split('\n').slice(0, 5)
  const hasMore = code.split('\n').length > 5

  return (
    <Card className="overflow-hidden bg-slate-900 border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-slate-400" />
          {filename && (
            <span className="text-sm text-slate-400">{filename}</span>
          )}
        </div>
        <Badge variant="secondary" className="text-xs">
          {language}
        </Badge>
      </div>
      <pre className="p-4 text-sm text-slate-300 overflow-hidden">
        <code>
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {hasMore && (
            <div className="text-slate-500 mt-2">...</div>
          )}
        </code>
      </pre>
    </Card>
  )
}
```

### Create `src/components/feed/collaborator-block-preview.tsx`
```typescript
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Clock } from 'lucide-react'

interface CollaboratorBlockPreviewProps {
  content: {
    projectName: string
    description: string
    techStack: string[]
    commitment: string
    remote: boolean
  }
}

export function CollaboratorBlockPreview({ content }: CollaboratorBlockPreviewProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold">Looking for Collaborators</h3>
        </div>
      </div>
      
      <h4 className="font-medium mb-1">{content.projectName}</h4>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {content.description}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {content.commitment}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {content.remote ? 'Remote' : 'Local'}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-3">
        {content.techStack.slice(0, 3).map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
        {content.techStack.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{content.techStack.length - 3}
          </Badge>
        )}
      </div>
    </Card>
  )
}
```

## Step 5: Create Public Pages

### Create `src/app/(public)/layout.tsx`
```typescript
import { Navbar } from '@/components/layout/navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar showAuthPrompt />
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </>
  )
}
```

### Create `src/app/(public)/page.tsx`
```typescript
import { FeedContainer } from '@/components/feed/feed-container'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Discover Amazing Projects
          </h1>
          <p className="text-muted-foreground">
            Join the community of developers building cool things together
          </p>
        </div>
        
        <FeedContainer isGuest />
      </div>
    </div>
  )
}
```

## Step 6: Add Like/Unlike API Routes

### Create `src/app/api/posts/[id]/like/route.ts`
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      post_id: params.id,
    })

  if (error) {
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('post_id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

## Key Features Implemented

### 1. Guest-Friendly Browsing
- No authentication required to view posts
- Auth modal appears only when trying to interact
- Full read access to all public content

### 2. Multiple Feed Algorithms
- **For You**: Personalized recommendations (currently chronological)
- **Following**: Posts from users you follow (auth required)
- **Trending**: Most liked and commented posts
- **Latest**: Newest posts first
- **Showcase**: Project showcases only
- **Find Team**: Collaboration posts only

### 3. Advanced Filtering
- Filter by programming languages/technologies
- Filter by post types
- Time range filters (24h, 7d, 30d, all time)
- Active filter badges with quick removal

### 4. Infinite Scrolling
- Automatic loading when scrolling to bottom
- Smooth pagination with loading states
- Efficient query batching

### 5. Real-time Interactions
- Like/unlike posts with optimistic updates
- Share posts via clipboard
- Bookmark posts for later
- Comment count display

### 6. Post Previews
- Text content preview (3 lines)
- Code block preview with syntax highlighting
- Collaboration block preview with key details
- Tags and post type badges

## Performance Optimizations

1. **Server-Side Rendering**: Initial page load is fast
2. **Optimistic Updates**: UI updates immediately on interactions
3. **Efficient Queries**: Proper indexing and query optimization
4. **Lazy Loading**: Components load only when needed
5. **Caching**: React Query handles caching automatically

## Next Steps

The feed system is now complete with:
- Guest-friendly browsing
- Multiple feed algorithms
- Infinite scrolling
- Like/unlike functionality
- Filter system
- Empty states

Continue to [Block Editor](./07-block-editor.md) →