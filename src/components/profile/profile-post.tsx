'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Clock,
  User
} from 'lucide-react'
import { SkillBadge } from './skill-badge'
import { ContentCardFooter } from './content-card-footer'
import { InlineComments } from './inline-comments'
import { toast } from 'sonner'
import type { Post, Profile } from '@/db/schema'

interface ProfilePostProps {
  post: Post
  author: Profile
}

export function ProfilePost({ post, author }: ProfilePostProps) {
  const [isLiked, setIsLiked] = React.useState(false)
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [isCommentsExpanded, setIsCommentsExpanded] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Check for mobile on mount
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites')
  }
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Bookmark removed' : 'Post bookmarked')
  }
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleComments = () => {
    setIsCommentsExpanded(!isCommentsExpanded)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden border-gray-100 transition-all duration-200 hover:border-orange-200 hover:shadow-lg">
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={author.avatarUrl || undefined} alt={author.displayName || author.username} />
                <AvatarFallback className="bg-orange-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{author.displayName || author.username}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.readingTime && (
                    <>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {post.isPublished && (
              <Badge 
                variant="secondary" 
                className={`${
                  post.visibility === 'public' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {post.visibility}
              </Badge>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4 space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag, index) => (
                  <SkillBadge key={index} skill={tag} variant="secondary" size="sm" />
                ))}
                {post.tags.length > 4 && (
                  <span className="text-xs text-gray-500">+{post.tags.length - 4} more</span>
                )}
              </div>
            )}
          </div>

          {/* Unified Content Card Footer */}
          <ContentCardFooter
            stats={{
              views: parseInt(post.viewCount || '0'),
              likes: parseInt(post.likeCount || '0'),
              comments: parseInt(post.commentCount || '0')
            }}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onLike={handleLike}
            onComment={handleComments}
            onBookmark={handleBookmark}
            onShare={handleShare}
            showExternalLink={true}
          />
          {/* Inline Comments */}
          <InlineComments
            postId={post.id}
            isExpanded={isCommentsExpanded}
            onToggle={() => setIsCommentsExpanded(!isCommentsExpanded)}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}