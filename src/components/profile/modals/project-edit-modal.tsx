'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2, FolderOpen, Github, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { TagInput } from '@/components/ui/TagInput'
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import { toast } from 'sonner'
import type { Project } from '@/db/schema'

interface ProjectEditModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project // undefined for create, Project for edit
}

interface ProjectFormData {
  name: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  isPrivate: boolean
  language: string
}

export function ProjectEditModal({ isOpen, onClose, project }: ProjectEditModalProps) {
  const isEditMode = !!project
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    isPrivate: false,
    language: '',
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      const newFormData = {
        name: project.name,
        description: project.description || '',
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        isPrivate: project.isPrivate,
        language: project.language || '',
      }
      setFormData(newFormData)
      setHasChanges(false)
    } else {
      // Reset for create mode
      setFormData({
        name: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        isPrivate: false,
        language: '',
      })
      setHasChanges(false)
    }
  }, [project])

  const handleInputChange = (field: keyof ProjectFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        technologies: formData.technologies,
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        isPrivate: formData.isPrivate,
        language: formData.language.trim() || undefined,
      }

      if (isEditMode) {
        await updateProject.mutateAsync({
          id: project.id,
          updates: projectData
        })
        toast.success('Project updated successfully!')
      } else {
        await createProject.mutateAsync(projectData)
        toast.success('Project created successfully!')
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save project:', error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`)
    }
  }

  const handleCancel = () => {
    // Reset form if creating, restore original if editing
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        isPrivate: project.isPrivate,
        language: project.language || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        isPrivate: false,
        language: '',
      })
    }
    setHasChanges(false)
    onClose()
  }

  const isLoading = createProject.isPending || updateProject.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <span>{isEditMode ? 'Edit Project' : 'Create New Project'}</span>
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
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="My Awesome Project"
              disabled={isLoading}
            />
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
              placeholder="Describe your project, its goals, and key features..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Technologies
            </label>
            <TagInput
              value={formData.technologies}
              onChange={(tags: string[]) => handleInputChange('technologies', tags)}
              placeholder="Add technologies (React, TypeScript, etc.)"
              disabled={isLoading}
            />
          </div>

          {/* Primary Language */}
          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-medium text-gray-700">
              Primary Language
            </label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              placeholder="JavaScript, Python, TypeScript, etc."
              disabled={isLoading}
            />
          </div>

          {/* URLs Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Links</h3>
            
            {/* GitHub URL */}
            <div className="space-y-2">
              <label htmlFor="githubUrl" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/username/repo"
                disabled={isLoading}
              />
            </div>

            {/* Live URL */}
            <div className="space-y-2">
              <label htmlFor="liveUrl" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Live Demo</span>
              </label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                placeholder="https://your-project.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Private Project</h4>
                <p className="text-xs text-gray-500">
                  Private projects are only visible to you
                </p>
              </div>
            </div>
            <Switch
              checked={formData.isPrivate}
              onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
              disabled={isLoading}
            />
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
              disabled={(!hasChanges && isEditMode) || isLoading || !formData.name.trim()}
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
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}