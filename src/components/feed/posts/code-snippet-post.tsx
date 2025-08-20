'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
  Copy,
  Code2,
  Clock,
  Eye,
  User,
  CheckCircle,
  Crown,
  Check
} from 'lucide-react'
import { FeedItem } from './feed-container'

interface SnippetContent {
  title: string
  description?: string
  language: string
  code: string
  tags?: string[]
}

function isSnippetContent(content: FeedItem['content']): content is SnippetContent {
  return 'code' in content && 'language' in content
}

import { toast } from 'sonner'

interface CodeSnippetPostProps {
  item: FeedItem
  onLike: () => void
  onComment: () => void
  onRepost: () => void
  onBookmark: () => void
  onShare: () => void
}

export function CodeSnippetPost({ 
  item, 
  onLike, 
  onComment, 
  onRepost, 
  onBookmark, 
  onShare 
}: CodeSnippetPostProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked || false)
  const [isReposted, setIsReposted] = useState(item.isReposted || false)
  const [isCopied, setIsCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.code)
      setIsCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
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

  if (item.type !== 'snippet' || !isSnippetContent(item.content)) return null
  
  const content = item.content

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-gray-200 bg-white hover:border-purple-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${item.author.username}`}>
                <Avatar className="w-10 h-10 hover:ring-2 hover:ring-purple-200 transition-all cursor-pointer">
                  <AvatarImage 
                    src={item.author.avatarUrl || undefined} 
                    alt={item.author.displayName} 
                  />
                  <AvatarFallback className="bg-purple-500 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/profile/${item.author.username}`}
                    className="font-medium text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    {item.author.displayName}
                  </Link>
                  
                  {item.author.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                  
                  {item.author.isPro && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                    <Code2 className="h-3 w-3 mr-1" />
                    Snippet
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>@{item.author.username}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
              {content.title}
            </h3>

            {/* Description */}
            {content.description && (
              <p className="text-gray-600 leading-relaxed">
                {content.description}
              </p>
            )}

            {/* Code Block */}
            <div className="relative">
              <div className="flex items-center justify-between bg-gray-900 text-gray-100 px-4 py-2 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{content.language}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-b-lg overflow-x-auto">
                <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                  <code>{content.code}</code>
                </pre>
              </div>
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
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
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {formatNumber(item.engagement.likes + (isLiked ? 1 : 0))}
              </Button>

              {/* Comment */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onComment}
                className="text-gray-500 hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
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
                <Repeat className="h-4 w-4 mr-1" />
                {formatNumber(item.engagement.reposts + (isReposted ? 1 : 0))}
              </Button>

              {/* Views */}
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(item.engagement.views)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Bookmark */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`text-gray-500 hover:text-purple-500 ${
                  isBookmarked ? 'text-purple-500 bg-purple-50' : ''
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-gray-500 hover:text-gray-700"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}