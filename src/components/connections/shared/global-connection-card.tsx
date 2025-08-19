'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [isSecondaryLoading, setIsSecondaryLoading] = useState(false)
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

  function handleConnect(userId: string) {
    setIsPrimaryLoading(true)
    setTimeout(() => {
      setIsPrimaryLoading(false)
      setActionState('success')
    }, 1000)
  }

  function handleFollowBack(userId: string) {
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

  const avatarSize = compact ? 32 : 40

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
              <Image
                src={user.avatarUrl || '/default-avatar.png'}
                alt={user.displayName}
                width={avatarSize}
                height={avatarSize}
                className="rounded-full object-cover"
              />
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
              
              {/* Location and mutual connections */}
              <div className={cn(
                "flex items-center space-x-3 mt-1 text-gray-500",
                compact ? "text-[10px]" : "text-[10px]"
              )}>
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{user.location.split(',')[0]}</span>
                  </div>
                )}
                {user.mutualConnections && user.mutualConnections > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>{user.mutualConnections} mutual</span>
                  </div>
                )}
                {invitation && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatTimeAgo(invitation.sentAt)}</span>
                  </div>
                )}
              </div>
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

          {/* Invitation Message */}
          {invitation?.message && (
            <div className="bg-gray-50 rounded-md p-2 border-l-2 border-orange-200">
              <p className="text-xs text-gray-700 italic line-clamp-2">
                &quot;{invitation.message}&quot;
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 2).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className={cn(
                  "bg-gray-50 text-gray-700 border-gray-200",
                  compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
                )}
              >
                {skill}
              </Badge>
            ))}
            {user.skills.length > 2 && (
              <Badge
                variant="outline"
                className={cn(
                  "bg-gray-50 text-gray-600 border-gray-200",
                  compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
                )}
              >
                +{user.skills.length - 2}
              </Badge>
            )}
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