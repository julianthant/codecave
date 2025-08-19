'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Eye,
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share, 
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface ContentCardFooterProps {
  stats: {
    views: number
    likes: number
    comments: number
  }
  isLiked?: boolean
  isBookmarked?: boolean
  onLike?: () => void
  onComment?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onExternalLink?: () => void
  showExternalLink?: boolean
}

export function ContentCardFooter({
  stats,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onExternalLink,
  showExternalLink = true
}: ContentCardFooterProps) {
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleLike = () => {
    if (onLike) {
      onLike()
    } else {
      setLiked(!liked)
      toast.success(liked ? 'Removed from favorites' : 'Added to favorites')
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment()
    } else {
      toast.info('Comments feature would open here')
    }
  }

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark()
    } else {
      setBookmarked(!bookmarked)
      toast.success(bookmarked ? 'Bookmark removed' : 'Content bookmarked')
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleExternalLink = () => {
    if (onExternalLink) {
      onExternalLink()
    } else {
      toast.info('Would open content in new tab')
    }
  }

  const currentLikes = liked !== isLiked ? (liked ? stats.likes + 1 : stats.likes - 1) : stats.likes

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
      {/* Left side - Stats (clickable) */}
      <div className="flex items-center space-x-6 text-sm text-gray-500">
        <button 
          className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
          title="View count"
        >
          <Eye className="h-4 w-4" />
          <span>{stats.views.toLocaleString()}</span>
        </button>
        
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 transition-colors ${
            liked 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-gray-500 hover:text-red-600'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span>{currentLikes.toLocaleString()}</span>
        </button>
        
        <button 
          onClick={handleComment}
          className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
          title="View comments"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{stats.comments.toLocaleString()}</span>
        </button>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`${
            bookmarked 
              ? 'text-orange-600 hover:text-orange-700' 
              : 'text-gray-500 hover:text-orange-600'
          } hover:bg-orange-50`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
          title="Share"
        >
          <Share className="h-4 w-4" />
        </Button>
        
        {showExternalLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExternalLink}
            className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
