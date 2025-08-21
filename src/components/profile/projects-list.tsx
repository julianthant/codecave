'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar, 
  Globe,
  Lock,
  Code,
  FolderOpen,
  Plus,
  Edit3,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ProjectEditModal } from './modals/project-edit-modal'
import { useProjects, useDeleteProject } from '@/hooks/use-projects'
import { toast } from 'sonner'
import type { Project } from '@/db/schema'

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'just now' : `${diffMinutes} minutes ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

interface ProjectsListProps {
  isOwnProfile?: boolean
}

export function ProjectsList({ isOwnProfile = false }: ProjectsListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  
  // Use the projects hook to fetch real data
  const { data: projects = [], isLoading, error } = useProjects(!isOwnProfile) // Include private only for own profile
  const deleteProject = useDeleteProject()

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await deleteProject.mutateAsync(project.id)
        toast.success('Project deleted successfully!')
      } catch (error) {
        console.error('Failed to delete project:', error)
        toast.error('Failed to delete project. Please try again.')
      }
    }
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-300"
      >
        <div className="p-6">
          {/* Header with title and private icon */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer truncate">
                {project.name}
              </h3>
              {project.isPrivate && (
                <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
            
            {/* Action buttons - responsive */}
            <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
              {/* Edit/Delete Menu for own profile */}
              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingProject(project)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteProject(project)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-gray-600 hover:text-gray-900 hover:border-gray-300 hidden sm:inline-flex"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Code</span>
                  </a>
                </Button>
              )}
              
              {/* Mobile: Github icon only */}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-gray-600 hover:text-gray-900 hover:border-gray-300 sm:hidden"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              
              {project.liveUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50 hidden sm:inline-flex"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Live</span>
                  </a>
                </Button>
              )}
              
              {/* Mobile: Live icon only */}
              {project.liveUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50 sm:hidden"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-orange-600 hover:bg-orange-50"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies?.map((tech, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Footer with language and stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                <span className="font-medium">{project.language}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>{project.stars}</span>
              </div>
              
              {project.forks > 0 && (
                <div className="flex items-center space-x-1">
                  <GitFork className="h-3 w-3" />
                  <span>{project.forks}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Updated {getRelativeTime(new Date(project.updatedAt))}</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <Code className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Projects</h3>
          <p className="text-gray-500">There was an error loading projects. Please try again.</p>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            </div>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </Button>
            )}
          </div>
        </div>
        <div className="p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects</h3>
          <p className="text-gray-500 mb-4">
            {isOwnProfile 
              ? "Share your amazing projects with the community" 
              : "This user hasn't shared any projects yet"
            }
          </p>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Project
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <Badge variant="secondary" className="text-xs">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </Badge>
          </div>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Project
            </Button>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>

      {/* Project Modals */}
      <ProjectEditModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <ProjectEditModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(undefined)}
        project={editingProject}
      />
    </div>
  )
}