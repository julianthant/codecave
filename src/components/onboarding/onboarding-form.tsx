'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: user.user_metadata?.user_name || '',
    display_name: user.user_metadata?.full_name || '',
    bio: '',
    github_username: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Starting profile creation for user:', user.id)
      console.log('Form data:', formData)
      
      // Check if username is available
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)

      if (checkError) {
        console.error('Error checking username:', checkError)
        toast.error('Error checking username availability')
        setIsLoading(false)
        return
      }

      if (existing && existing.length > 0) {
        toast.error('Username already taken')
        setIsLoading(false)
        return
      }

      // Create user profile
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio || null,
        github_username: formData.github_username || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })

      if (error) {
        console.error('Profile creation error:', error)
        throw error
      }
      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      
      // More specific error messages
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Failed to create profile: ${error.message}`)
      } else {
        toast.error('Failed to create profile')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
            required
            pattern="^[a-zA-Z0-9_\-]+$"
            title="Username can only contain letters, numbers, underscores, and hyphens"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be your unique identifier on CodeCave
          </p>
        </div>

        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        {user.app_metadata?.provider !== 'github' && (
          <div>
            <Label htmlFor="github_username">GitHub Username (optional)</Label>
            <Input
              id="github_username"
              type="text"
              value={formData.github_username}
              onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
              placeholder="johndoe"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Profile...' : 'Complete Setup'}
      </Button>
    </form>
  )
}