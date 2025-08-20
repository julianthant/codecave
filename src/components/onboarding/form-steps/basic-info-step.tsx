'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, AtSign, FileText, Upload, Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatedGroup } from '@/components/landing/animated-group'
import { cn } from '@/lib/utils'

interface BasicInfoStepProps {
  formData: {
    username: string
    displayName: string
    bio: string
    avatarUrl: string | null
  }
  onFormDataChange: (data: Partial<BasicInfoStepProps['formData']>) => void
}

export function BasicInfoStep({ formData, onFormDataChange }: BasicInfoStepProps) {
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(formData.avatarUrl)

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    
    // Simulate API call
    setTimeout(() => {
      const taken = ['admin', 'test', 'user'].includes(username.toLowerCase())
      setUsernameStatus(taken ? 'taken' : 'available')
    }, 800)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_\-]/g, '')
    onFormDataChange({ username: value })
    if (value !== formData.username) {
      checkUsernameAvailability(value)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        onFormDataChange({ avatarUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-muted-foreground/30 border-t-orange-500 rounded-full"
          />
        )
      case 'available':
        return <Check className="w-4 h-4 text-green-500" />
      case 'taken':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getUsernameStatusMessage = () => {
    switch (usernameStatus) {
      case 'checking':
        return 'Checking availability...'
      case 'available':
        return 'Username is available!'
      case 'taken':
        return 'Username is already taken'
      default:
        return 'Your unique identifier on CodeCave'
    }
  }

  const getUsernameStatusColor = () => {
    switch (usernameStatus) {
      case 'available':
        return 'text-green-600'
      case 'taken':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardContent className="p-8">
          <AnimatedGroup preset="slide" className="space-y-6">
            {/* Avatar Upload */}
            <motion.div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg dark:border-gray-800">
                  <AvatarImage src={avatarPreview || ''} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xl font-bold">
                    {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-1 -right-1"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 rounded-full p-0 bg-white shadow-md border-2 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="w-3 h-3" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </motion.div>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Upload a profile picture (optional)
              </p>
            </motion.div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                <AtSign className="w-4 h-4 text-orange-500" />
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  placeholder="johndoe"
                  required
                  className={cn(
                    'pr-10 transition-all duration-200',
                    usernameStatus === 'available' && 'border-green-500 focus-visible:ring-green-500',
                    usernameStatus === 'taken' && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getUsernameStatusIcon()}
                </div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn('text-xs', getUsernameStatusColor())}
              >
                {getUsernameStatusMessage()}
              </motion.p>
            </div>

            {/* Display Name Field */}
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="display_name"
                type="text"
                value={formData.displayName}
                onChange={(e) => onFormDataChange({ displayName: e.target.value })}
                placeholder="John Doe"
                required
                className="transition-all duration-200 focus-visible:ring-orange-500"
              />
              <p className="text-xs text-muted-foreground">
                How your name appears to others
              </p>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => onFormDataChange({ bio: e.target.value })}
                placeholder="Tell us about yourself, your interests, and what you're working on..."
                rows={3}
                maxLength={160}
                className="resize-none transition-all duration-200 focus-visible:ring-orange-500"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Share a bit about yourself
                </p>
                <span className={cn(
                  'text-xs',
                  formData.bio.length > 140 ? 'text-orange-600' : 'text-muted-foreground'
                )}>
                  {formData.bio.length}/160
                </span>
              </div>
            </div>
          </AnimatedGroup>
        </CardContent>
      </Card>
    </motion.div>
  )
}