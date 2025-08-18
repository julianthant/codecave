'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Bell, 
  Crown, 
  Monitor, 
  Sun, 
  Moon,
  Mail,
  Settings as SettingsIcon 
} from 'lucide-react'
import { toast } from 'sonner'

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
})

type PreferencesFormData = z.infer<typeof preferencesSchema>

// Mock data
const mockPreferencesData = {
  theme: 'system' as const,
  emailNotifications: true,
  isPro: false, // Read-only from user settings
}

const themeOptions = [
  { 
    value: 'light', 
    label: 'Light', 
    icon: Sun, 
    description: 'Classic light theme for daytime use' 
  },
  { 
    value: 'dark', 
    label: 'Dark', 
    icon: Moon, 
    description: 'Easy on the eyes in low light' 
  },
  { 
    value: 'system', 
    label: 'System', 
    icon: Monitor, 
    description: 'Automatically match your system preference' 
  },
]

export function PreferencesSettings() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: mockPreferencesData,
  })

  const watchedTheme = watch('theme')
  const selectedTheme = themeOptions.find(theme => theme.value === watchedTheme)

  const onSubmit = async (data: PreferencesFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Preferences update:', data)
    toast.success('Preferences updated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Palette className="mr-2 inline h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how CodeCave looks and feels for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Theme Preference</Label>
                <Controller
                  name="theme"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((theme) => {
                          const Icon = theme.icon
                          return (
                            <SelectItem key={theme.value} value={theme.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{theme.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                
                {selectedTheme && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <selectedTheme.icon className="h-4 w-4" />
                    <span>{selectedTheme.description}</span>
                  </motion.div>
                )}
              </div>

              {/* Theme Preview */}
              <div className="rounded-lg border p-4 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="font-medium text-gray-700">Theme Preview</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Your selected theme will be applied across the entire application.
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Bell className="mr-2 inline h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how and when you receive notifications from CodeCave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Badge variant="secondary" className="text-xs">
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for project updates, collaboration requests, and important announcements.
                  </p>
                </div>
                <Controller
                  name="emailNotifications"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="emailNotifications"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Additional notification settings would go here */}
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                <SettingsIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  More notification preferences coming soon
                </p>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: isDirty ? 1 : 0.5, scale: isDirty ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                disabled={!isDirty}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Save Preferences
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Pro Status */}
      <Card className={mockPreferencesData.isPro ? 'border-orange-200 bg-orange-50/50' : ''}>
        <CardHeader>
          <CardTitle>
            <Crown className={`mr-2 inline h-5 w-5 ${mockPreferencesData.isPro ? 'text-orange-600' : 'text-gray-400'}`} />
            Pro Membership
            {mockPreferencesData.isPro && (
              <Badge className="ml-2 bg-orange-600">Active</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {mockPreferencesData.isPro 
              ? 'You have access to all Pro features and benefits.'
              : 'Upgrade to Pro for enhanced features and priority support.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPreferencesData.isPro ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-orange-200 bg-white p-4">
                <h4 className="font-medium text-orange-700">Pro Benefits Active</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Unlimited private projects</li>
                  <li>• Priority collaboration matching</li>
                  <li>• Advanced analytics</li>
                  <li>• Premium support</li>
                </ul>
              </div>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-700">Upgrade to Pro</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Unlimited private projects</li>
                  <li>• Priority collaboration matching</li>
                  <li>• Advanced analytics</li>
                  <li>• Premium support</li>
                </ul>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}