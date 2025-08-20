'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  User,
  Copy,
  ExternalLink,
  Code,
  MessageSquare,
  MoreHorizontal,
  Bookmark,
  Share,
  Flag,
  EyeOff,
} from 'lucide-react'
import { ContentCardFooter } from '@/components/profile/content-card-footer'
import { InlineComments } from '@/components/profile/inline-comments'
import { FeedItem } from './feed-container'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UnifiedFeedPostProps {
  item: FeedItem
}

export function UnifiedFeedPost({ item }: UnifiedFeedPostProps) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false)

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'bookmark':
        toast.success('Post bookmarked!')
        break
      case 'share':
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
        break
      case 'hide':
        toast.success('Post hidden from feed')
        break
      case 'report':
        toast.success('Post reported. Thank you for your feedback.')
        break
      default:
        break
    }
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  }

  const renderContent = () => {
    const content = item.content

    switch (item.type) {
      case 'article':
        if ('title' in content && 'excerpt' in content) {
          return (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-xl line-clamp-2 cursor-pointer">
                {content.title}
              </h3>

              {'excerpt' in content && content.excerpt && (
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {content.excerpt}
                </p>
              )}

              {'coverImage' in content && content.coverImage && (
                <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                  <Image
                    src={content.coverImage}
                    alt={content.title}
                    fill
                    className="object-cover cursor-pointer"
                  />
                </div>
              )}

              {'readingTime' in content && content.readingTime && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{content.readingTime}</span>
                </div>
              )}
            </div>
          )
        }
        break

      case 'snippet':
        if ('title' in content && 'code' in content) {
          return (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg cursor-pointer">
                {content.title}
              </h3>

              {'description' in content && content.description && (
                <p className="text-gray-600 text-sm">{content.description}</p>
              )}

              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-500 rounded-full w-3 h-3"></div>
                    <div className="bg-yellow-500 rounded-full w-3 h-3"></div>
                    <div className="bg-green-500 rounded-full w-3 h-3"></div>
                    {'language' in content && content.language && (
                      <span className="ml-4 text-gray-400 text-xs">
                        {content.language}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyCode('code' in content ? content.code : '')
                    }
                    className="text-gray-400"
                  >
                    <Copy className="mr-1 w-4 h-4" />
                    Copy
                  </Button>
                </div>
                <pre className="font-mono text-gray-100 text-sm">
                  <code>{'code' in content ? content.code : ''}</code>
                </pre>
              </div>
            </div>
          )
        }
        break

      case 'project':
        if ('title' in content && 'description' in content) {
          return (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 text-xl cursor-pointer">
                  {content.title}
                </h3>
                {'version' in content && content.version && (
                  <Badge variant="outline" className="text-xs">
                    {content.version}
                  </Badge>
                )}
              </div>

              {'description' in content && content.description && (
                <p className="text-gray-600 leading-relaxed">
                  {content.description}
                </p>
              )}

              {'screenshots' in content &&
                content.screenshots &&
                content.screenshots.length > 0 && (
                  <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                    <Image
                      src={content.screenshots[0]}
                      alt={`${content.title} screenshot`}
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </div>
                )}

              {'features' in content &&
                content.features &&
                content.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center font-medium text-gray-900 text-sm">
                      <div className="bg-green-600 mr-2 rounded-full w-2 h-2"></div>
                      What&apos;s New:
                    </h4>
                    <ul className="space-y-1">
                      {content.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600 text-sm"
                        >
                          <div className="flex-shrink-0 bg-green-500 mt-1.5 mr-2 rounded-full w-1.5 h-1.5"></div>
                          {feature}
                        </li>
                      ))}
                      {content.features.length > 3 && (
                        <li className="text-gray-500 text-sm">
                          +{content.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}

              {(('repository' in content && content.repository) ||
                ('liveDemo' in content && content.liveDemo)) && (
                <div className="flex items-center space-x-3">
                  {'repository' in content && content.repository && (
                    <Link
                      href={content.repository}
                      target="_blank"
                      className="inline-flex items-center text-gray-600 text-sm"
                    >
                      <Code className="mr-1 w-4 h-4" />
                      Source Code
                    </Link>
                  )}
                  {'liveDemo' in content && content.liveDemo && (
                    <Link
                      href={content.liveDemo}
                      target="_blank"
                      className="inline-flex items-center text-gray-600 text-sm"
                    >
                      <ExternalLink className="mr-1 w-4 h-4" />
                      Live Demo
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        }
        break

      case 'thought':
        if ('text' in content) {
          return (
            <div className="space-y-4">
              <p className="text-gray-900 leading-relaxed">{content.text}</p>

              <div className="bg-orange-50 p-4 border border-orange-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-900 text-sm">
                    Join the discussion!
                  </span>
                </div>
                <p className="text-orange-700 text-sm">
                  Share your thoughts and experiences in the comments below.
                </p>
              </div>
            </div>
          )
        }
        break

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white p-0 border-gray-200 overflow-hidden">
        <CardContent className="p-4">
          {/* Post Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${item.author.username}`}>
                <Avatar className="w-10 h-10 cursor-pointer">
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
                    className="font-medium text-gray-900"
                  >
                    {item.author.displayName}
                  </Link>
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

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-8 h-8 text-gray-400"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleMenuAction('bookmark')}>
                  <Bookmark className="mr-2 w-4 h-4" />
                  <span>Bookmark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('share')}>
                  <Share className="mr-2 w-4 h-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuAction('hide')}>
                  <EyeOff className="mr-2 w-4 h-4" />
                  <span>Hide from feed</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleMenuAction('report')}
                  className="text-red-600 focus:text-red-600"
                >
                  <Flag className="mr-2 w-4 h-4" />
                  <span>Report post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            {renderContent()}

            {/* Tags */}
            {'tags' in item.content &&
              item.content.tags &&
              item.content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {'tags' in item.content && item.content.tags
                    ? item.content.tags
                        .slice(0, 4)
                        .map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-50 border-gray-200 text-gray-700 text-xs cursor-pointer"
                          >
                            #{tag}
                          </Badge>
                        ))
                    : []}
                  {'tags' in item.content &&
                    item.content.tags &&
                    item.content.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.content.tags.length - 4} more
                      </Badge>
                    )}
                </div>
              )}
          </div>

          {/* Footer */}
          <ContentCardFooter
            stats={{
              views: item.engagement.views,
              likes: item.engagement.likes,
              comments: item.engagement.comments,
            }}
            onComment={() => setIsCommentsExpanded(!isCommentsExpanded)}
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
