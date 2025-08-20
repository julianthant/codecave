'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Clock, User } from 'lucide-react'
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
  // Check for mobile on mount
  React.useEffect(() => {
    const checkMobile = () => window.innerWidth < 768
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
    >
      <Card className="border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={author.avatarUrl || undefined}
                  alt={author.displayName || author.username}
                />
                <AvatarFallback className="bg-orange-500 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {author.displayName || author.username}
                </p>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Clock className="w-3 h-3" />
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
          <div className="space-y-3 mb-4">
            <h3 className="font-semibold text-gray-900 text-xl cursor-pointer">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag, index) => (
                  <SkillBadge
                    key={index}
                    skill={tag}
                    variant="secondary"
                    size="sm"
                  />
                ))}
                {post.tags.length > 4 && (
                  <span className="text-gray-500 text-xs">
                    +{post.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Unified Content Card Footer */}
          <ContentCardFooter
            stats={{
              views: post.viewCount || 0,
              likes: post.likeCount || 0,
              comments: post.commentCount || 0,
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
            isExpanded={isCommentsExpanded}
            onToggle={() => setIsCommentsExpanded(!isCommentsExpanded)}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
