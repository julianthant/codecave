'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Heart, 
  Reply, 
  MoreHorizontal,
  User,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatarUrl?: string
  }
  timestamp: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface InlineCommentsProps {
  postId: string
  isExpanded: boolean
  onToggle: () => void
  comments?: Comment[]
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is really insightful! I\'ve been struggling with this exact problem in my current project.',
    author: {
      id: 'user1',
      name: 'Alex Chen',
      username: 'alexc',
      avatarUrl: undefined
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        content: 'Thanks! What specific part are you working on? Happy to help if I can.',
        author: {
          id: 'author',
          name: 'Julian Thant',
          username: 'julianthant',
          avatarUrl: undefined
        },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        likes: 2,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    content: 'Great explanation of the TypeScript utility types. The ApiResponse example is particularly useful.',
    author: {
      id: 'user2',
      name: 'Sarah Kim',
      username: 'sarahk',
      avatarUrl: undefined
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 8,
    isLiked: false
  },
  {
    id: '3',
    content: 'I\'ve bookmarked this for reference. Clean and practical code examples!',
    author: {
      id: 'user3',
      name: 'Mike Rodriguez',
      username: 'miker',
      avatarUrl: undefined
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 3,
    isLiked: false
  }
]

export function InlineComments({ postId, isExpanded, onToggle, comments = mockComments }: InlineCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Comment posted!')
    setNewComment('')
    setIsSubmitting(false)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Reply posted!')
    setReplyContent('')
    setReplyToId(null)
    setIsSubmitting(false)
  }

  const handleLikeComment = (commentId: string) => {
    toast.success('Comment liked!')
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}
    >
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
          <AvatarFallback className="bg-orange-500 text-white text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-500">@{comment.author.username}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-orange-600 transition-colors"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
            
            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
          
          {/* Reply Form */}
          {replyToId === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex space-x-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="bg-orange-500 text-white text-xs">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder={`Reply to ${comment.author.name}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyToId(null)
                        setReplyContent('')
                      }}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || isSubmitting}
                      className="bg-orange-600 hover:bg-orange-700 text-xs"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      ) : (
                        <Send className="h-3 w-3 mr-1" />
                      )}
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 mt-4 pt-4 space-y-4"
        >
          {/* Comments Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 text-sm">
              Comments ({comments.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* New Comment Form */}
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-orange-500 text-white text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex items-center justify-end space-x-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewComment('')}
                  className="text-xs"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-xs"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                  ) : (
                    <Send className="h-3 w-3 mr-1" />
                  )}
                  Comment
                </Button>
              </div>
            </div>
          </div>
          
          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
