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
  Rocket,
  ExternalLink,
  Github,
  Clock,
  Eye,
  User,
  CheckCircle,
  Crown,
  Star,
  Check
} from 'lucide-react'
import { FeedItem } from './feed-container'

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

function isProjectContent(content: FeedItem['content']): content is ProjectContent {
  return 'title' in content && 'version' in content
}

interface ProjectUpdatePostProps {
  item: FeedItem
  onLike: () => void
  onComment: () => void
  onRepost: () => void
  onBookmark: () => void
  onShare: () => void
}

export function ProjectUpdatePost({ 
  item, 
  onLike, 
  onComment, 
  onRepost, 
  onBookmark, 
  onShare 
}: ProjectUpdatePostProps) {
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

  if (item.type !== 'project' || !isProjectContent(item.content)) return null
  
  const content = item.content

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-gray-200 bg-white hover:border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${item.author.username}`}>
                <Avatar className="w-10 h-10 hover:ring-2 hover:ring-green-200 transition-all cursor-pointer">
                  <AvatarImage 
                    src={item.author.avatarUrl || undefined} 
                    alt={item.author.displayName} 
                  />
                  <AvatarFallback className="bg-green-500 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/profile/${item.author.username}`}
                    className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {item.author.displayName}
                  </Link>
                  
                  {item.author.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                  
                  {item.author.isPro && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    <Rocket className="h-3 w-3 mr-1" />
                    Project
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
            {/* Title with Version */}
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors cursor-pointer flex-1">
                {content.title}
              </h2>
              {content.version && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-mono text-sm">
                  {content.version}
                </Badge>
              )}
            </div>

            {/* Description */}
            {content.description && (
              <p className="text-gray-600 leading-relaxed">
                {content.description}
              </p>
            )}

            {/* Screenshots */}
            {content.screenshots && content.screenshots.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {content.screenshots.map((screenshot: string, index: number) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={screenshot}
                      alt={`${content.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Key Features */}
            {content.features && content.features.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  What&apos;s New:
                </h4>
                <ul className="space-y-1">
                  {content.features.slice(0, 3).map((feature: string, index: number) => (
                    <li key={index} className="text-green-800 text-sm flex items-start">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {content.features.length > 3 && (
                    <li className="text-green-700 text-sm font-medium">
                      +{content.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {content.technologies && content.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.technologies.map((tech: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 cursor-pointer text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Project Links */}
            <div className="flex items-center space-x-3 pt-2">
              {content.repository && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  asChild
                >
                  <Link href={content.repository} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Source Code
                  </Link>
                </Button>
              )}
              
              {content.liveDemo && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  asChild
                >
                  <Link href={content.liveDemo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}
            </div>
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
                className={`text-gray-500 hover:text-green-500 ${
                  isBookmarked ? 'text-green-500 bg-green-50' : ''
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