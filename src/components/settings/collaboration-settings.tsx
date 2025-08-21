'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useForm, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, Users } from 'lucide-react'
import { toast } from 'sonner'

const collaborationSchema = z.object({
  availableForCollab: z.boolean(),
  collaborationTypes: z.array(z.string()).min(0),
  responseTime: z.string().optional(),
  timezone: z.string().optional(),
  collaborationGuidelines: z.string().max(500, 'Guidelines must be less than 500 characters').optional(),
  calendarUrl: z.string().url('Please enter a valid calendar URL').optional().or(z.literal('')),
  officeHours: z.object({
    enabled: z.boolean(),
    monday: z.object({ enabled: z.boolean(), start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ enabled: z.boolean(), start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ enabled: z.boolean(), start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ enabled: z.boolean(), start: z.string(), end: z.string() }).optional(),
    friday: z.object({ enabled: z.boolean(), start: z.string(), end: z.string() }).optional(),
  }).optional(),
})

type CollaborationFormData = z.infer<typeof collaborationSchema>

const collaborationTypes = [
  { id: 'coffee', label: 'Virtual Coffee Chat', description: 'Casual conversation about tech and career' },
  { id: 'pair', label: 'Pair Programming', description: 'Collaborative coding sessions' },
  { id: 'review', label: 'Code Review', description: 'Get feedback on code and architecture' },
  { id: 'mentoring', label: 'Mentoring Session', description: 'Career guidance and skill development' },
  { id: 'brainstorm', label: 'Project Brainstorming', description: 'Discuss ideas and technical approaches' },
  { id: 'networking', label: 'Professional Networking', description: 'Connect and share experiences' },
]

const responseTimeOptions = [
  { value: 'within-hour', label: 'Usually responds within 1 hour' },
  { value: 'within-day', label: 'Usually responds within 24 hours' },
  { value: 'few-days', label: 'Usually responds within 2-3 days' },
  { value: 'weekly', label: 'Usually responds within a week' },
]

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
]

// Mock data
const mockCollaborationSettings = {
  availableForCollab: true,
  collaborationTypes: ['coffee', 'pair', 'mentoring'],
  responseTime: 'within-day',
  timezone: 'America/Los_Angeles',
  collaborationGuidelines: 'I enjoy helping junior developers and discussing React architecture. Please include specific topics you&apos;d like to cover in your booking message.',
  calendarUrl: '',
  officeHours: {
    enabled: true,
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
  },
}

export function CollaborationSettings() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: mockCollaborationSettings,
  })

  const availableForCollab = watch('availableForCollab')
  const selectedTypes = watch('collaborationTypes') || []
  const officeHoursEnabled = watch('officeHours.enabled')

  const onSubmit = async (data: CollaborationFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Collaboration settings update:', data)
    toast.success('Collaboration settings updated successfully!')
  }

  const handleTypeChange = (typeId: string, checked: boolean) => {
    const currentTypes = selectedTypes || []
    if (checked) {
      setValue('collaborationTypes', [...currentTypes, typeId], { shouldDirty: true })
    } else {
      setValue('collaborationTypes', currentTypes.filter(id => id !== typeId), { shouldDirty: true })
    }
  }

  const weekdays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
  ]

  return (
    <div className="space-y-6">
      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-600" />
            <span>Collaboration Availability</span>
          </CardTitle>
          <CardDescription>
            Control whether you&apos;re open to collaboration requests and meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="availableForCollab" className="text-base font-medium">
                Available for collaboration
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Allow others to book sessions and send collaboration requests
              </p>
            </div>
            <Switch
              id="availableForCollab"
              checked={availableForCollab}
              onCheckedChange={(checked) => setValue('availableForCollab', checked, { shouldDirty: true })}
            />
          </div>
        </CardContent>
      </Card>

      {availableForCollab && (
        <>
          {/* Collaboration Types */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Collaboration</CardTitle>
              <CardDescription>
                Select the types of sessions you&apos;re willing to offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {collaborationTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Checkbox
                      id={type.id}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={(checked) => handleTypeChange(type.id, checked === true)}
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={type.id} className="font-medium text-sm cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Time & Timezone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Response & Timezone</span>
              </CardTitle>
              <CardDescription>
                Set expectations for response time and your working timezone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="responseTime">Response Time</Label>
                  <Select 
                    value={watch('responseTime') || ''} 
                    onValueChange={(value) => setValue('responseTime', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select response time" />
                    </SelectTrigger>
                    <SelectContent>
                      {responseTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={watch('timezone') || ''} 
                    onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezoneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>Office Hours</span>
              </CardTitle>
              <CardDescription>
                Set your general availability for meetings and collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="officeHoursEnabled" className="text-base font-medium">
                    Enable office hours
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Show your general availability to others
                  </p>
                </div>
                <Switch
                  id="officeHoursEnabled"
                  checked={officeHoursEnabled}
                  onCheckedChange={(checked) => setValue('officeHours.enabled', checked, { shouldDirty: true })}
                />
              </div>

              {officeHoursEnabled && (
                <div className="space-y-3 pt-2">
                  {weekdays.map((day) => (
                    <div key={day.key} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="w-20">
                        <Checkbox
                          id={`${day.key}-enabled`}
                          checked={!!(watch(`officeHours.${day.key}.enabled` as Path<CollaborationFormData>) as boolean)}
                          onCheckedChange={(checked) => 
                            setValue(`officeHours.${day.key}.enabled` as Path<CollaborationFormData>, checked, { shouldDirty: true })
                          }
                        />
                        <Label htmlFor={`${day.key}-enabled`} className="ml-2 text-sm font-medium cursor-pointer">
                          {day.label}
                        </Label>
                      </div>
                      
                      {watch(`officeHours.${day.key}.enabled` as Path<CollaborationFormData>) && (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            type="time"
                            className="w-auto"
                            {...register(`officeHours.${day.key}.start` as Path<CollaborationFormData>)}
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <Input
                            type="time"
                            className="w-auto"
                            {...register(`officeHours.${day.key}.end` as Path<CollaborationFormData>)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Guidelines</CardTitle>
              <CardDescription>
                Share what you&apos;re interested in discussing and your communication style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collaborationGuidelines">Guidelines (Optional)</Label>
                  <Textarea
                    id="collaborationGuidelines"
                    rows={4}
                    placeholder="e.g., I enjoy helping with React architecture, discussing career growth, and reviewing code. Please include specific topics you&apos;d like to cover when booking a session."
                    {...register('collaborationGuidelines')}
                  />
                  {errors.collaborationGuidelines && (
                    <p className="text-sm text-red-600">{errors.collaborationGuidelines.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Help others understand what you&apos;re interested in collaborating on
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calendarUrl">Calendar Integration (Optional)</Label>
                  <Input
                    id="calendarUrl"
                    placeholder="https://calendly.com/your-link or https://cal.com/your-link"
                    {...register('calendarUrl')}
                    aria-invalid={!!errors.calendarUrl}
                  />
                  {errors.calendarUrl && (
                    <p className="text-sm text-red-600">{errors.calendarUrl.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Link to your external calendar for direct booking
                  </p>
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
                    Save Collaboration Settings
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}