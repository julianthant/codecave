'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Clock,
  Users,
  Globe,
  MapPin,
  DollarSign,
  GitBranch,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Send,
  CheckCircle,
} from 'lucide-react'
import { Collaboration, CollaborationType } from '@/types/collaborations'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CollaborationCardProps {
  collaboration: Collaboration
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onApply?: (id: string) => void
  onSave?: (id: string) => void
  className?: string
}

const typeLabels: Record<CollaborationType, string> = {
  project: 'Project',
  'code-review': 'Code Review',
  mentorship: 'Mentorship',
  hackathon: 'Hackathon',
  'open-source': 'Open Source',
  'study-group': 'Study Group',
  startup: 'Startup',
}

export function CollaborationCard({
  collaboration,
  showActions = true,
  onApply,
  onSave,
  className,
}: CollaborationCardProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const handleCardClick = () => {
    router.push(`/collaborations/${collaboration.id}`)
  }

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsApplying(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsApplying(false)
    setHasApplied(true)
    toast.success('Application sent successfully!')

    if (onApply) {
      onApply(collaboration.id)
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved' : 'Saved for later')

    if (onSave) {
      onSave(collaboration.id)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`

    return `${Math.floor(diffInDays / 30)}mo ago`
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        className="group flex flex-col gap-0 hover:shadow-sm border-gray-200 hover:border-gray-300 overflow-hidden transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="flex-shrink-0 pb-4">
          {/* Header with Type and Save Button - properly aligned */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">
              {typeLabels[collaboration.type]}
            </span>
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="hover:bg-gray-100 p-1 w-7 h-7"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-orange-600" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                )}
              </Button>
            )}
          </div>

          {/* Posted By - moved before title */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-200 font-medium text-gray-600 text-xs">
                {getInitials(collaboration.createdBy.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {collaboration.createdBy.displayName}
                {collaboration.createdBy.isVerified && (
                  <CheckCircle className="inline ml-1 w-4 h-4 text-blue-500" />
                )}
              </p>
              <p className="text-gray-500 text-xs">
                @{collaboration.createdBy.username} ·{' '}
                {formatTimeAgo(collaboration.createdAt)}
              </p>
            </div>
          </div>

          {/* Title - moved after user info */}
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 text-base line-clamp-1 leading-tight transition-colors">
            {collaboration.title}
          </h3>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">
          {/* Description - fixed 4 lines height */}
          <p
            className="mb-4 text-gray-600 text-sm line-clamp-4 leading-relaxed"
            style={{ height: 'calc(1.5rem * 4)' }}
          >
            {collaboration.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {collaboration.technologies.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="bg-gray-50 px-2 py-1 border-gray-200 text-gray-600 text-xs"
              >
                {tech}
              </Badge>
            ))}
            {collaboration.technologies.length > 4 && (
              <Badge
                variant="outline"
                className="bg-gray-50 px-2 py-1 border-gray-200 text-gray-500 text-xs"
              >
                +{collaboration.technologies.length - 4} more
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4 text-gray-500 text-xs">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {collaboration.timeCommitment.replace('-', ' ')}
            </span>
            {collaboration.teamSize && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {collaboration.teamSize.current}/{collaboration.teamSize.needed}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              {collaboration.remote ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  Remote
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  On-site
                </>
              )}
            </span>
            {collaboration.compensation && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                {collaboration.compensation.type}
              </span>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-auto">
            {/* Stats */}
            <div className="flex justify-between items-center mb-4 pt-4 border-gray-100 border-t text-gray-500 text-xs">
              <div className="flex items-center gap-4">
                <span>{collaboration.applicants || 0} applicants</span>
                <span>{collaboration.views || 0} views</span>
                {collaboration.saves && collaboration.saves > 0 && (
                  <span>{collaboration.saves} saves</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {collaboration.githubRepo && (
                  <a
                    href={collaboration.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                  </a>
                )}
                {collaboration.projectUrl && (
                  <a
                    href={collaboration.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Apply Button */}
            {showActions && collaboration.status === 'open' && (
              <Button
                onClick={handleApply}
                disabled={isApplying || hasApplied}
                className={cn(
                  'w-full text-sm h-10',
                  hasApplied
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                )}
              >
                {isApplying ? (
                  <>
                    <div className="mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : hasApplied ? (
                  <>
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Applied
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-4 h-4" />
                    Apply Now
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
