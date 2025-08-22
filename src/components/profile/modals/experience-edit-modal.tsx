'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2, Briefcase, Building2, MapPin, Link, Star, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TagInput } from '@/components/ui/TagInput'
import { toast } from 'sonner'
import type { Experience } from '@/db/schema'

interface ExperienceEditModalProps {
  isOpen: boolean
  onClose: () => void
  experience?: Experience // undefined for create, Experience for edit
}

interface ExperienceFormData {
  company: string
  position: string
  description: string
  location: string
  companyUrl: string
  companyLogo: string
  employmentType: string
  startDate: string
  endDate: string
  isCurrent: boolean
  technologies: string[]
  achievements: string[]
  isPrivate: boolean
  isFeatured: boolean
}

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

export function ExperienceEditModal({ isOpen, onClose, experience }: ExperienceEditModalProps) {
  const isEditMode = !!experience
  // TODO: Add hooks for API calls
  // const createExperience = useCreateExperience()
  // const updateExperience = useUpdateExperience()

  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    position: '',
    description: '',
    location: '',
    companyUrl: '',
    companyLogo: '',
    employmentType: 'full-time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    technologies: [],
    achievements: [],
    isPrivate: false,
    isFeatured: false,
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when experience changes
  useEffect(() => {
    if (experience) {
      const newFormData = {
        company: experience.company,
        position: experience.position,
        description: experience.description || '',
        location: experience.location || '',
        companyUrl: experience.companyUrl || '',
        companyLogo: experience.companyLogo || '',
        employmentType: experience.employmentType,
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        isCurrent: experience.isCurrent,
        technologies: experience.technologies || [],
        achievements: experience.achievements || [],
        isPrivate: experience.isPrivate,
        isFeatured: experience.isFeatured,
      }
      setFormData(newFormData)
      setHasChanges(false)
    } else {
      // Reset for create mode
      setFormData({
        company: '',
        position: '',
        description: '',
        location: '',
        companyUrl: '',
        companyLogo: '',
        employmentType: 'full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        technologies: [],
        achievements: [],
        isPrivate: false,
        isFeatured: false,
      })
      setHasChanges(false)
    }
  }, [experience])

  const handleInputChange = (field: keyof ExperienceFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    
    // Handle current position logic
    if (field === 'isCurrent' && value === true) {
      setFormData(prev => ({ ...prev, endDate: '' }))
    }
  }

  const validateForm = () => {
    if (!formData.company.trim()) {
      toast.error('Company name is required')
      return false
    }
    if (!formData.position.trim()) {
      toast.error('Position is required')
      return false
    }
    if (!formData.startDate) {
      toast.error('Start date is required')
      return false
    }
    if (!formData.isCurrent && !formData.endDate) {
      toast.error('End date is required for past positions')
      return false
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Start date must be before end date')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      // TODO: Implement API calls
      // const experienceData = {
      //   company: formData.company.trim(),
      //   position: formData.position.trim(),
      //   description: formData.description.trim() || undefined,
      //   location: formData.location.trim() || undefined,
      //   companyUrl: formData.companyUrl.trim() || undefined,
      //   companyLogo: formData.companyLogo.trim() || undefined,
      //   employmentType: formData.employmentType,
      //   startDate: formData.startDate,
      //   endDate: formData.isCurrent ? undefined : formData.endDate,
      //   isCurrent: formData.isCurrent,
      //   technologies: formData.technologies,
      //   achievements: formData.achievements.filter(a => a.trim().length > 0),
      //   isPrivate: formData.isPrivate,
      //   isFeatured: formData.isFeatured,
      // }

      if (isEditMode) {
        // await updateExperience.mutateAsync({
        //   id: experience.id,
        //   updates: experienceData
        // })
        toast.success('Experience updated successfully!')
      } else {
        // await createExperience.mutateAsync(experienceData)
        toast.success('Experience created successfully!')
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save experience:', error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} experience. Please try again.`)
    }
  }

  const handleCancel = () => {
    // Reset form if creating, restore original if editing
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        description: experience.description || '',
        location: experience.location || '',
        companyUrl: experience.companyUrl || '',
        companyLogo: experience.companyLogo || '',
        employmentType: experience.employmentType,
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        isCurrent: experience.isCurrent,
        technologies: experience.technologies || [],
        achievements: experience.achievements || [],
        isPrivate: experience.isPrivate,
        isFeatured: experience.isFeatured,
      })
    } else {
      setFormData({
        company: '',
        position: '',
        description: '',
        location: '',
        companyUrl: '',
        companyLogo: '',
        employmentType: 'full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        technologies: [],
        achievements: [],
        isPrivate: false,
        isFeatured: false,
      })
    }
    setHasChanges(false)
    onClose()
  }

  const isLoading = false // TODO: Replace with actual loading state

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-gray-600" />
              <span>{isEditMode ? 'Edit Experience' : 'Add New Experience'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>Company *</span>
                </label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Google, Microsoft, etc."
                  disabled={isLoading}
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium text-gray-700">
                  Position *
                </label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Senior Software Engineer"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="San Francisco, CA / Remote"
                  disabled={isLoading}
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleInputChange('employmentType', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your role, responsibilities, and key projects..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Duration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={isLoading || formData.isCurrent}
                  placeholder="Leave empty if current"
                />
              </div>
            </div>

            {/* Current Position Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isCurrent}
                onCheckedChange={(checked) => handleInputChange('isCurrent', checked)}
                disabled={isLoading}
              />
              <label className="text-sm text-gray-700">
                I currently work here
              </label>
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Technologies Used
            </label>
            <TagInput
              value={formData.technologies}
              onChange={(tags: string[]) => handleInputChange('technologies', tags)}
              placeholder="Add technologies (React, Node.js, etc.)"
              disabled={isLoading}
            />
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Key Achievements
            </label>
            <TagInput
              value={formData.achievements}
              onChange={(tags: string[]) => handleInputChange('achievements', tags)}
              placeholder="Add key achievements (Led team of 5, Increased performance by 40%, etc.)"
              disabled={isLoading}
            />
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Company Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Website */}
              <div className="space-y-2">
                <label htmlFor="companyUrl" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Link className="w-4 h-4" />
                  <span>Company Website</span>
                </label>
                <Input
                  id="companyUrl"
                  value={formData.companyUrl}
                  onChange={(e) => handleInputChange('companyUrl', e.target.value)}
                  placeholder="https://company.com"
                  disabled={isLoading}
                />
              </div>

              {/* Company Logo */}
              <div className="space-y-2">
                <label htmlFor="companyLogo" className="text-sm font-medium text-gray-700">
                  Company Logo URL
                </label>
                <Input
                  id="companyLogo"
                  value={formData.companyLogo}
                  onChange={(e) => handleInputChange('companyLogo', e.target.value)}
                  placeholder="https://company.com/logo.png"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Settings</h3>
            
            {/* Featured Experience */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Featured Experience</h4>
                  <p className="text-xs text-gray-500">
                    Featured experiences appear prominently on your profile
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                disabled={isLoading}
              />
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Private Experience</h4>
                  <p className="text-xs text-gray-500">
                    Private experiences are only visible to you
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={(!hasChanges && isEditMode) || isLoading || !formData.company.trim() || !formData.position.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Experience' : 'Add Experience'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}