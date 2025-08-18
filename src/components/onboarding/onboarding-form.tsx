'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: user.user_metadata?.user_name || '',
    displayName: user.user_metadata?.full_name || '',
    bio: '',
    githubUsername: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Starting profile creation for user:', user.id)
      console.log('Form data:', formData)
      
      // Call API route that uses Drizzle
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.email!,
          username: formData.username,
          displayName: formData.displayName,
          bio: formData.bio || null,
          githubUsername: formData.githubUsername || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      const message = error instanceof Error ? error.message : 'Failed to create profile'
      toast.error(message)
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
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
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
              value={formData.githubUsername}
              onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
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