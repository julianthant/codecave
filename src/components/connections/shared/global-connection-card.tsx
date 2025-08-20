'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  UserPlus, 
  UserCheck, 
  UserMinus, 
  MessageCircle, 
  MapPin, 
  Users, 
  Clock, 
  Check, 
  X 
} from 'lucide-react'
import { ConnectionUser, ConnectionInvitation } from '@/types/connections'
import { cn } from '@/lib/utils'

// Helper functions for avatar initials and colors
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarColor = (username: string): string => {
  const colors = [
    'bg-orange-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-red-500'
  ]
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

type CardVariant = 
  | 'discover' 
  | 'connection' 
  | 'invitation-received' 
  | 'invitation-sent' 
  | 'following' 
  | 'follower'

interface PrimaryAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (userId: string) => void
  variant?: 'default' | 'outline' | 'destructive'
  loadingText?: string
}

interface SecondaryAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (userId: string) => void
  variant?: 'default' | 'outline' | 'destructive'
  loadingText?: string
}

interface GlobalConnectionCardProps {
  user: ConnectionUser
  variant: CardVariant
  invitation?: ConnectionInvitation
  primaryAction?: PrimaryAction
  secondaryAction?: SecondaryAction
  className?: string
  compact?: boolean // For mobile optimization
}

export function GlobalConnectionCard({ 
  user, 
  variant, 
  invitation,
  primaryAction,
  secondaryAction,
  className,
  compact = false
}: GlobalConnectionCardProps) {
  const router = useRouter()
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false)
  const [isSecondaryLoading] = useState(false)
  const [actionState, setActionState] = useState<'default' | 'success' | 'following'>('default')

  // Default actions based on variant
  const getDefaultActions = (): { primary?: PrimaryAction, secondary?: SecondaryAction } => {
    switch (variant) {
      case 'discover':
        return {
          primary: {
            label: 'Connect',
            icon: UserPlus,
            onClick: handleConnect,
            loadingText: 'Connecting...'
          }
        }
      case 'connection':
        return {
          primary: {
            label: 'Message',
            icon: MessageCircle,
            onClick: (userId) => console.log('Message user:', userId),
            variant: 'outline'
          }
        }
      case 'invitation-received':
        return {
          primary: {
            label: 'Accept',
            icon: Check,
            onClick: (userId) => console.log('Accept invitation:', userId),
            loadingText: 'Accepting...'
          },
          secondary: {
            label: 'Decline',
            icon: X,
            onClick: (userId) => console.log('Decline invitation:', userId),
            variant: 'outline',
            loadingText: 'Declining...'
          }
        }
      case 'invitation-sent':
        return {
          primary: {
            label: 'Withdraw',
            icon: X,
            onClick: (userId) => console.log('Withdraw invitation:', userId),
            variant: 'outline',
            loadingText: 'Withdrawing...'
          }
        }
      case 'following':
        return {
          primary: {
            label: 'Unfollow',
            icon: UserMinus,
            onClick: (userId) => console.log('Unfollow user:', userId),
            variant: 'outline',
            loadingText: 'Unfollowing...'
          }
        }
      case 'follower':
        return {
          primary: {
            label: actionState === 'following' ? 'Following' : 'Follow Back',
            icon: actionState === 'following' ? UserCheck : UserPlus,
            onClick: handleFollowBack,
            loadingText: 'Following...'
          }
        }
      default:
        return {}
    }
  }

  const defaultActions = getDefaultActions()
  const finalPrimaryAction = primaryAction || defaultActions.primary
  const finalSecondaryAction = secondaryAction || defaultActions.secondary

  function handleConnect() {
    setIsPrimaryLoading(true)
    setTimeout(() => {
      setIsPrimaryLoading(false)
      setActionState('success')
    }, 1000)
  }

  function handleFollowBack() {
    setIsPrimaryLoading(true)
    setTimeout(() => {
      setIsPrimaryLoading(false)
      setActionState('following')
    }, 1000)
  }

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (finalPrimaryAction) {
      finalPrimaryAction.onClick(user.id)
    }
  }

  const handleSecondaryAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (finalSecondaryAction) {
      finalSecondaryAction.onClick(user.id)
    }
  }

  const handleCardClick = () => {
    router.push(`/profile/${user.username}`)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return `${Math.floor(diffInDays / 7)}w ago`
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-orange-200 cursor-pointer group"
        onClick={handleCardClick}
      >
        <CardContent className={cn("space-y-3", compact ? "p-3" : "p-4")}>
          {/* User Header */}
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0">
              <Avatar className={cn(
                "rounded-full",
                compact ? "w-8 h-8" : "w-10 h-10"
              )}>
                <AvatarFallback className={cn(
                  "text-white font-semibold",
                  getAvatarColor(user.username),
                  compact ? "text-xs" : "text-sm"
                )}>
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              {user.availableForCollab && (
                <div className={cn(
                  "absolute bg-green-500 border-2 border-white rounded-full",
                  compact 
                    ? "-bottom-0.5 -right-0.5 w-2.5 h-2.5" 
                    : "-bottom-0.5 -right-0.5 w-3 h-3"
                )} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors",
                compact ? "text-sm" : "text-base"
              )}>
                {user.displayName}
              </h3>
              <p className={cn(
                "text-gray-600",
                compact ? "text-xs" : "text-xs"
              )}>
                @{user.username}
              </p>
              
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className={cn(
              "text-gray-700 leading-relaxed",
              compact ? "text-xs line-clamp-1" : "text-xs line-clamp-2"
            )}>
              {user.bio}
            </p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2 py-0.5"
              >
                {skill}
              </Badge>
            ))}
            {user.skills.length > 3 && (
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-600 border-gray-200 text-xs px-2 py-0.5"
              >
                +{user.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-3">
                {/* For Discover/Connection/Network cards */}
                {(variant === 'discover' || variant === 'connection' || variant === 'follower' || variant === 'following') && (
                  <>
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="max-w-[100px] truncate">
                          {user.location.split(',')[0]}
                        </span>
                      </div>
                    )}
                    {user.mutualConnections && user.mutualConnections > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span>{user.mutualConnections}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* For Invitation cards - time display */}
              {(variant === 'invitation-received' || variant === 'invitation-sent') && invitation && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs">{formatTimeAgo(invitation.sentAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={cn(
            "pt-2",
            finalSecondaryAction ? "flex space-x-2" : ""
          )}>
            {finalSecondaryAction && (
              <Button
                variant={finalSecondaryAction.variant || 'outline'}
                size="sm"
                onClick={handleSecondaryAction}
                disabled={isSecondaryLoading}
                className={cn(
                  "flex-1 text-xs",
                  compact ? "h-7" : "h-8"
                )}
              >
                {isSecondaryLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1.5" />
                    {finalSecondaryAction.loadingText || 'Loading...'}
                  </>
                ) : (
                  <>
                    {finalSecondaryAction.icon && (
                      <finalSecondaryAction.icon className="w-3 h-3 mr-1.5" />
                    )}
                    {finalSecondaryAction.label}
                  </>
                )}
              </Button>
            )}
            
            {finalPrimaryAction && (
              <Button
                variant={finalPrimaryAction.variant || 'default'}
                size="sm"
                onClick={handlePrimaryAction}
                disabled={isPrimaryLoading}
                className={cn(
                  "text-xs",
                  finalSecondaryAction ? "flex-1" : "w-full",
                  compact ? "h-7" : "h-8",
                  actionState === 'success' && "bg-green-600 hover:bg-green-700",
                  actionState === 'following' && "bg-green-600 hover:bg-green-700"
                )}
              >
                {isPrimaryLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                    {finalPrimaryAction.loadingText || 'Loading...'}
                  </>
                ) : (
                  <>
                    {finalPrimaryAction.icon && (
                      <finalPrimaryAction.icon className="w-3 h-3 mr-1.5" />
                    )}
                    {actionState === 'success' ? 'Connected' : finalPrimaryAction.label}
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