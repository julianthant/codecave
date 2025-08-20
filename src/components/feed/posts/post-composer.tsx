'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  User,
  ImageIcon,
  Code,
  Link2,
  Smile,
  Send
} from 'lucide-react'
import { toast } from 'sonner'

// Mock user data - In a real app, this would come from auth store
const mockCurrentUser = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
}

export function PostComposer() {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleCancel = () => {
    setContent('')
    setIsExpanded(false)
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something before posting!')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Post created successfully!')
    setContent('')
    setIsExpanded(false)
    setIsSubmitting(false)
  }

  const handleQuickAction = (action: string) => {
    toast.success(`Opening ${action} editor...`)
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          {/* Avatar */}
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage 
              src={mockCurrentUser.avatarUrl} 
              alt={mockCurrentUser.displayName} 
            />
            <AvatarFallback className="bg-orange-500 text-white">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="What's on your mind? Share your thoughts, code, or projects..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              className="min-h-[60px] border-gray-200 focus:border-orange-300 focus:ring-orange-200 resize-none"
              disabled={isSubmitting}
            />

            {/* Expanded Actions */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isExpanded ? 'auto' : 0, 
                opacity: isExpanded ? 1 : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('image')}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      disabled={isSubmitting}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('code')}
                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                      disabled={isSubmitting}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('link')}
                      className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                      disabled={isSubmitting}
                    >
                      <Link2 className="h-4 w-4 mr-1" />
                      Link
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('emoji')}
                      className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                      disabled={isSubmitting}
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      Emoji
                    </Button>
                  </div>

                  {/* Character Count & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {content.length}/280 characters
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Post
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}