'use client'

import { motion } from 'framer-motion'
import { Github, Briefcase, Users, Mail, Palette } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimatedGroup } from '@/components/landing/animated-group'
import { cn } from '@/lib/utils'

interface DeveloperProfileStepProps {
  formData: {
    tagline: string
    githubUsername: string
    availableForCollab: boolean
    emailNotifications: boolean
    theme: string
  }
  onFormDataChange: (data: Partial<DeveloperProfileStepProps['formData']>) => void
  githubFromAuth?: string
}


export function DeveloperProfileStep({ 
  formData, 
  onFormDataChange, 
  githubFromAuth
}: DeveloperProfileStepProps) {

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
            
            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Professional Tagline
              </Label>
              <Input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => onFormDataChange({ tagline: e.target.value })}
                placeholder="Full Stack Developer @ Meta"
                maxLength={60}
                className="transition-all duration-200 focus-visible:ring-orange-500"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  A short professional tagline
                </p>
                <span className={cn(
                  'text-xs',
                  formData.tagline.length > 50 ? 'text-orange-600' : 'text-muted-foreground'
                )}>
                  {formData.tagline.length}/60
                </span>
              </div>
            </div>

            {/* GitHub Username */}
            {!githubFromAuth && (
              <div className="space-y-2">
                <Label htmlFor="github_username" className="text-sm font-medium flex items-center gap-2">
                  <Github className="w-4 h-4 text-orange-500" />
                  GitHub Username
                </Label>
                <Input
                  id="github_username"
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => onFormDataChange({ githubUsername: e.target.value })}
                  placeholder="johndoe"
                  className="transition-all duration-200 focus-visible:ring-orange-500"
                />
                <p className="text-xs text-muted-foreground">
                  Connect your GitHub profile (optional)
                </p>
              </div>
            )}


            {/* Preferences */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-medium text-foreground">Preferences</h4>
              
              {/* Collaboration Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="available-collab" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    Available for Collaboration
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show that you&apos;re open to working on projects
                  </p>
                </div>
                <Switch
                  id="available-collab"
                  checked={formData.availableForCollab}
                  onCheckedChange={(checked) => onFormDataChange({ availableForCollab: checked })}
                />
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="email-notifications" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get updates about activity and collaboration requests
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => onFormDataChange({ emailNotifications: checked })}
                />
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-500" />
                  Theme Preference
                </Label>
                <Select 
                  value={formData.theme} 
                  onValueChange={(value) => onFormDataChange({ theme: value })}
                >
                  <SelectTrigger className="focus:ring-orange-500">
                    <SelectValue placeholder="Choose your theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-600" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-white to-gray-900 border border-gray-400" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how CodeCave looks to you
                </p>
              </div>
            </div>

          </AnimatedGroup>
        </CardContent>
      </Card>
    </motion.div>
  )
}