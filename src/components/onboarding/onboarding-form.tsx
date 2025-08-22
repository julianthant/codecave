'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    tagline: '',
    bio: '',
    githubUsername: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : '',
    availableForCollab: true,
    emailNotifications: true,
    theme: 'system',
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
          username: formData.username.toLowerCase(),
          displayName: formData.displayName,
          tagline: formData.tagline || null,
          bio: formData.bio || null,
          githubUsername: formData.githubUsername || null,
          availableForCollab: formData.availableForCollab,
          emailNotifications: formData.emailNotifications,
          theme: formData.theme,
          avatarUrl: user.user_metadata?.avatar_url || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      toast.success('Profile created successfully!')
      router.push('/feed')
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
      {/* Basic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Set up your developer profile on CodeCave
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                placeholder="johndoe"
                required
                pattern="^[a-z0-9_\-]+$"
                title="Username can only contain lowercase letters, numbers, underscores, and hyphens"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your unique identifier on CodeCave
              </p>
            </div>

            <div>
              <Label htmlFor="display_name">Display Name <span className="text-red-500">*</span></Label>
              <Input
                id="display_name"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="John Doe"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                How your name appears to others
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Software Engineer @ Meta"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground mt-1">
              A short professional tagline that appears under your name
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself, your interests, and what you're working on..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Share a bit about yourself ({formData.bio.length}/160)
            </p>
          </div>

          {user.app_metadata?.provider !== 'github' && (
            <div>
              <Label htmlFor="github_username">GitHub Username</Label>
              <Input
                id="github_username"
                type="text"
                value={formData.githubUsername}
                onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                placeholder="johndoe"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Connect your GitHub profile
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your CodeCave experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="available-collab">Available for Collaboration</Label>
              <p className="text-sm text-muted-foreground">
                Show that you&apos;re open to working on projects with other developers
              </p>
            </div>
            <Switch
              id="available-collab"
              checked={formData.availableForCollab}
              onCheckedChange={(checked) => setFormData({ ...formData, availableForCollab: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about likes, comments, and collaboration requests
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme Preference</Label>
            <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how CodeCave looks to you
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          className="bg-orange-600 hover:bg-orange-700 min-w-[200px]" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating Profile...' : 'Complete Setup'}
        </Button>
      </div>
    </form>
  )
}