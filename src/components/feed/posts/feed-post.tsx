'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Share,
  MoreHorizontal,
  Clock,
  Eye,
  User,
  CheckCircle,
  Crown,
} from 'lucide-react'
import { FeedItem } from './feed-container'

interface ArticleContent {
  title: string
  excerpt?: string
  readingTime?: string
  tags?: string[]
  coverImage?: string
}

function isArticleContent(
  content: FeedItem['content']
): content is ArticleContent {
  return 'title' in content && 'excerpt' in content
}

interface FeedPostProps {
  item: FeedItem
  onLike: () => void
  onComment: () => void
  onRepost: () => void
  onBookmark: () => void
  onShare: () => void
}

export function FeedPost({
  item,
  onLike,
  onComment,
  onRepost,
  onBookmark,
  onShare,
}: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked || false)
  const [isReposted, setIsReposted] = useState(item.isReposted || false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike()
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark()
  }

  const handleRepost = () => {
    setIsReposted(!isReposted)
    onRepost()
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (item.type !== 'article' || !isArticleContent(item.content)) return null

  const content = item.content

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white hover:shadow-lg p-0 border-gray-200 hover:border-orange-200 transition-all duration-300">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${item.author.username}`}>
                <Avatar className="hover:ring-2 hover:ring-orange-200 w-10 h-10 transition-all cursor-pointer">
                  <AvatarImage
                    src={item.author.avatarUrl || undefined}
                    alt={item.author.displayName}
                  />
                  <AvatarFallback className="bg-orange-500 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/profile/${item.author.username}`}
                    className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {item.author.displayName}
                  </Link>

                  {/* Verification Badge */}
                  {item.author.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}

                  {/* Pro Badge */}
                  {item.author.isPro && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>

                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <span>@{item.author.username}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="font-bold text-gray-900 hover:text-orange-600 text-xl line-clamp-2 transition-colors cursor-pointer">
              {content.title}
            </h2>

            {/* Excerpt */}
            {content.excerpt && (
              <p className="text-gray-600 line-clamp-3 leading-relaxed">
                {content.excerpt}
              </p>
            )}

            {/* Cover Image */}
            {content.coverImage && (
              <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                <Image
                  src={content.coverImage}
                  alt={content.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
            )}

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.tags.slice(0, 4).map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 text-xs cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
                {content.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{content.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Reading Time */}
            {content.readingTime && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                <span>{content.readingTime}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-gray-100 border-t">
            <div className="flex items-center space-x-6">
              {/* Like */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`text-gray-500 hover:text-red-500 ${
                  isLiked ? 'text-red-500 bg-red-50' : ''
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`}
                />
                {formatNumber(item.engagement.likes + (isLiked ? 1 : 0))}
              </Button>

              {/* Comment */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onComment}
                className="text-gray-500 hover:text-blue-500"
              >
                <MessageCircle className="mr-1 w-4 h-4" />
                {formatNumber(item.engagement.comments)}
              </Button>

              {/* Repost */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepost}
                className={`text-gray-500 hover:text-green-500 ${
                  isReposted ? 'text-green-500 bg-green-50' : ''
                }`}
              >
                <Repeat className="mr-1 w-4 h-4" />
                {formatNumber(item.engagement.reposts + (isReposted ? 1 : 0))}
              </Button>

              {/* Views */}
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(item.engagement.views)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Bookmark */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`text-gray-500 hover:text-orange-500 ${
                  isBookmarked ? 'text-orange-500 bg-orange-50' : ''
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
                />
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-gray-500 hover:text-gray-700"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
