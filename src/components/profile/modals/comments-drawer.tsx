'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Reply,
  MoreHorizontal,
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Post, Profile } from '@/db/schema'

interface Comment {
  id: string
  author: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
  }
  content: string
  createdAt: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  post: Post
  postAuthor: Profile
  isMobile?: boolean
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'alexdev',
      displayName: 'Alex Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Great article! The TypeScript utility types section really helped clarify some concepts I was struggling with. Thanks for sharing!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          id: '2',
          username: 'johndoe',
          displayName: 'John Doe',
        },
        content: 'Glad it helped! Utility types can be tricky at first but they\'re so powerful once you get the hang of them.',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likes: 3,
        isLiked: true,
      }
    ]
  },
  {
    id: '2',
    author: {
      id: '3',
      username: 'sarahk',
      displayName: 'Sarah Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Could you do a follow-up post on conditional types? I feel like that\'s the next logical step from this content.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    likes: 8,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      id: '4',
      username: 'mikecoder',
      displayName: 'Mike Rodriguez',
    },
    content: 'Bookmarked for future reference. Your examples are always so practical and easy to follow.',
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    likes: 5,
    isLiked: false,
  }
]

export function CommentsDrawer({ 
  isOpen, 
  onClose, 
  post, 
  postAuthor,
  isMobile = false 
}: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        username: 'you',
        displayName: 'You',
      },
      content: newComment,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setIsSubmitting(false)
    toast.success('Comment posted!')
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ))
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: {
        id: 'current-user',
        username: 'you',
        displayName: 'You',
      },
      content: replyContent,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    }

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { 
            ...comment, 
            replies: [...(comment.replies || []), reply]
          }
        : comment
    ))
    
    setReplyContent('')
    setReplyingTo(null)
    setIsSubmitting(false)
    toast.success('Reply posted!')
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-3 ${isReply ? 'ml-12 pt-3 border-t border-gray-100' : ''}`}
    >
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatarUrl} alt={comment.author.displayName || comment.author.username} />
          <AvatarFallback className="bg-orange-500 text-white text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900">
              {comment.author.displayName || comment.author.username}
            </h4>
            <span className="text-xs text-gray-500">
              @{comment.author.username}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                comment.isLiked 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
            
            <button className="text-xs text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Reply Form */}
      {replyingTo === comment.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="ml-11 space-y-2"
        >
          <Textarea
            placeholder={`Reply to ${comment.author.displayName || comment.author.username}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Posting...' : 'Reply'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setReplyingTo(null)
                setReplyContent('')
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </motion.div>
  )

  const content = (
    <div className="flex flex-col h-full">
      {/* Post Summary */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={postAuthor.avatarUrl || undefined} alt={postAuthor.displayName || postAuthor.username} />
            <AvatarFallback className="bg-orange-500 text-white text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {postAuthor.displayName || postAuthor.username}
            </p>
            <p className="text-xs text-gray-500">@{postAuthor.username}</p>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">{post.title}</h3>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>{post.viewCount} views</span>
          <span>{comments.length} comments</span>
          <span>{post.likeCount} likes</span>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {newComment.length}/500 characters
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 mr-2" />
                  Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Comments</span>
              <Badge variant="secondary" className="text-xs">
                {comments.length}
              </Badge>
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments</span>
            <Badge variant="secondary" className="text-xs">
              {comments.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}