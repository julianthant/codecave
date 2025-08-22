'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2, FolderOpen, Github, Globe, Lock, Image, Star, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { TagInput } from '@/components/ui/TagInput'
import { useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/use-projects'
import { useProjectsStore } from '@/stores/projects.store'
import { toast } from 'sonner'
interface ProjectEditModalProps {
  // Props can be added here if needed in the future
  className?: string
}

interface ProjectFormData {
  name: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  imageUrl: string
  isPrivate: boolean
  isFeatured: boolean
  language: string
  role: string
  startDate: string
  endDate: string
}

export function ProjectEditModal({}: ProjectEditModalProps) {
  // Get state from store
  const { 
    isProjectModalOpen, 
    editingProject,
    closeProjectModal,
    addProject,
    updateProject: updateProjectInStore,
    removeProject,
    setLoading,
    setError
  } = useProjectsStore()
  
  const isEditMode = !!editingProject
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    isPrivate: false,
    isFeatured: false,
    language: '',
    role: '',
    startDate: '',
    endDate: '',
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when editingProject changes
  useEffect(() => {
    if (editingProject) {
      const newFormData = {
        name: editingProject.name,
        description: editingProject.description || '',
        technologies: editingProject.technologies || [],
        githubUrl: editingProject.githubUrl || '',
        liveUrl: editingProject.liveUrl || '',
        imageUrl: editingProject.imageUrl || '',
        isPrivate: editingProject.isPrivate,
        isFeatured: false, // Add when available in schema
        language: editingProject.language || '',
        role: '', // Add when available in schema
        startDate: '', // Add when available in schema
        endDate: '', // Add when available in schema
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
        imageUrl: '',
        isPrivate: false,
        isFeatured: false,
        language: '',
        role: '',
        startDate: '',
        endDate: '',
      })
      setHasChanges(false)
    }
  }, [editingProject])

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

    setLoading(true)
    setError(null)

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        technologies: formData.technologies,
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        isPrivate: formData.isPrivate,
        language: formData.language.trim() || undefined,
      }

      if (isEditMode && editingProject) {
        const updatedProject = await updateProject.mutateAsync({
          id: editingProject.id,
          updates: projectData
        })
        updateProjectInStore(editingProject.id, updatedProject)
        toast.success('Project updated successfully!')
      } else {
        const newProject = await createProject.mutateAsync(projectData)
        addProject(newProject)
        toast.success('Project created successfully!')
      }
      
      closeProjectModal()
    } catch (error) {
      console.error('Failed to save project:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} project. ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form if creating, restore original if editing
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        description: editingProject.description || '',
        technologies: editingProject.technologies || [],
        githubUrl: editingProject.githubUrl || '',
        liveUrl: editingProject.liveUrl || '',
        imageUrl: editingProject.imageUrl || '',
        isPrivate: editingProject.isPrivate,
        isFeatured: false,
        language: editingProject.language || '',
        role: '',
        startDate: '',
        endDate: '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
        isPrivate: false,
        isFeatured: false,
        language: '',
        role: '',
        startDate: '',
        endDate: '',
      })
    }
    setHasChanges(false)
    closeProjectModal()
  }

  const handleDelete = async () => {
    if (!editingProject) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${editingProject.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)
    setError(null)

    try {
      await deleteProject.mutateAsync(editingProject.id)
      removeProject(editingProject.id)
      toast.success('Project deleted successfully!')
      closeProjectModal()
    } catch (error) {
      console.error('Failed to delete project:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(`Failed to delete project. ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const isLoading = createProject.isPending || updateProject.isPending || deleteProject.isPending

  return (
    <Dialog open={isProjectModalOpen} onOpenChange={handleCancel}>
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

          {/* Project Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Project Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Your Role
                </label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Full Stack Developer, Designer, etc."
                  disabled={isLoading}
                />
              </div>

              {/* Project Image */}
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-4 h-4" />
                  <span>Project Image</span>
                </label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date</span>
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
                  disabled={isLoading}
                  placeholder="Leave empty if ongoing"
                />
              </div>
            </div>
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

          {/* Project Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Project Settings</h3>
            
            {/* Featured Project */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Featured Project</h4>
                  <p className="text-xs text-gray-500">
                    Featured projects appear at the top of your profile
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            {/* Delete button for edit mode */}
            {isEditMode && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {deleteProject.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </>
                )}
              </Button>
            )}
            
            {/* Cancel and Save buttons */}
            <div className="flex space-x-3">
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
                {(createProject.isPending || updateProject.isPending) ? (
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
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}