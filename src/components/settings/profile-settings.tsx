'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, User, Github, Twitter, MessageSquare, Linkedin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  githubUsername: z.string().max(39, 'GitHub username is too long').optional(),
  twitterUsername: z.string().max(15, 'Twitter username is too long').optional(),
  discordUsername: z.string().max(37, 'Discord username is too long').optional(),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

// API functions
async function updateProfile(data: ProfileFormData) {
  const response = await fetch('/api/profiles/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update profile')
  }

  return response.json()
}

export function ProfileSettings() {
  const { profile, setProfile } = useAuthStore()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      username: '',
      bio: '',
      githubUsername: '',
      twitterUsername: '',
      discordUsername: '',
      linkedinUrl: '',
    },
  })

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        githubUsername: profile.githubUsername || '',
        twitterUsername: profile.twitterUsername || '',
        discordUsername: profile.discordUsername || '',
        linkedinUrl: profile.linkedinUrl || '',
      })
      setIsLoading(false)
    }
  }, [profile, reset])

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')
      // Invalidate profile-related queries
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    toast.info('Avatar upload feature coming soon!')
  }

  // Show loading state while profile is loading
  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture. Recommended size: 400x400px
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatarUrl || undefined} alt="Profile picture" />
              <AvatarFallback className="bg-orange-500 text-white">
                {profile?.displayName ? 
                  profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase() :
                  <User className="h-8 w-8" />
                }
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button 
                onClick={handleAvatarUpload}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload new picture
              </Button>
              <p className="text-sm text-gray-500">
                JPG, PNG or GIF. Max file size 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your profile information that will be displayed to other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  {...register('displayName')}
                  aria-invalid={!!errors.displayName}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  aria-invalid={!!errors.username}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="Tell us about yourself..."
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: isDirty ? 1 : 0.5, scale: isDirty ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                disabled={!isDirty || updateProfileMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Connect your social accounts to show them on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="githubUsername">
                  <Github className="mr-2 inline h-4 w-4" />
                  GitHub Username
                </Label>
                <Input
                  id="githubUsername"
                  placeholder="username"
                  {...register('githubUsername')}
                  aria-invalid={!!errors.githubUsername}
                />
                {errors.githubUsername && (
                  <p className="text-sm text-red-600">{errors.githubUsername.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitterUsername">
                  <Twitter className="mr-2 inline h-4 w-4" />
                  Twitter Username
                </Label>
                <Input
                  id="twitterUsername"
                  placeholder="username"
                  {...register('twitterUsername')}
                  aria-invalid={!!errors.twitterUsername}
                />
                {errors.twitterUsername && (
                  <p className="text-sm text-red-600">{errors.twitterUsername.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discordUsername">
                  <MessageSquare className="mr-2 inline h-4 w-4" />
                  Discord Username
                </Label>
                <Input
                  id="discordUsername"
                  placeholder="username#1234"
                  {...register('discordUsername')}
                  aria-invalid={!!errors.discordUsername}
                />
                {errors.discordUsername && (
                  <p className="text-sm text-red-600">{errors.discordUsername.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">
                  <Linkedin className="mr-2 inline h-4 w-4" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  {...register('linkedinUrl')}
                  aria-invalid={!!errors.linkedinUrl}
                />
                {errors.linkedinUrl && (
                  <p className="text-sm text-red-600">{errors.linkedinUrl.message}</p>
                )}
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: isDirty ? 1 : 0.5, scale: isDirty ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                disabled={!isDirty || updateProfileMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Social Links'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}