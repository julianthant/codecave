'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  MoreHorizontal,
  Building2,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ExperienceEditModal } from './modals/experience-edit-modal'
import { toast } from 'sonner'
import type { Experience } from '@/db/schema'

// Helper function to format date range
function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
  
  if (isCurrent) {
    return `${start} - Present`
  }
  
  if (!endDate) {
    return start
  }
  
  const end = new Date(endDate).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
  
  return `${start} - ${end}`
}

// Helper function to calculate duration
function calculateDuration(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate)
  const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date())
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
  
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`
  } else {
    const years = Math.floor(diffMonths / 12)
    const remainingMonths = diffMonths % 12
    let duration = `${years} ${years === 1 ? 'year' : 'years'}`
    if (remainingMonths > 0) {
      duration += ` ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
    }
    return duration
  }
}

interface ExperienceListProps {
  isOwnProfile?: boolean
  experiences?: Experience[]
}

export function ExperienceList({ isOwnProfile = false, experiences = [] }: ExperienceListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>()

  const handleDeleteExperience = async (experience: Experience) => {
    if (window.confirm(`Are you sure you want to delete your experience at "${experience.company}"? This action cannot be undone.`)) {
      try {
        // TODO: Implement delete API call
        toast.success('Experience deleted successfully!')
      } catch (error) {
        console.error('Failed to delete experience:', error)
        toast.error('Failed to delete experience. Please try again.')
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const ExperienceCard = ({ experience, isLast }: { experience: Experience; isLast: boolean }) => {
    return (
      <motion.div
        variants={itemVariants}
        className="relative flex"
      >
        {/* Timeline */}
        <div className="flex flex-col items-center mr-6">
          {/* Timeline dot */}
          <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md z-10 ${
            experience.isCurrent 
              ? 'bg-green-500' 
              : experience.isFeatured 
                ? 'bg-orange-500' 
                : 'bg-blue-500'
          }`} />
          
          {/* Timeline line */}
          {!isLast && (
            <div className="w-0.5 h-full bg-gray-200 mt-2" style={{ minHeight: '60px' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                      {experience.position}
                    </h3>
                    {experience.isCurrent && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        Current
                      </Badge>
                    )}
                    {experience.isFeatured && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-700 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{experience.company}</span>
                    {experience.companyUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 w-6 p-0 ml-1 text-gray-400 hover:text-orange-600"
                      >
                        <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateRange(experience.startDate, experience.endDate || undefined, experience.isCurrent)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{calculateDuration(experience.startDate, experience.endDate || undefined, experience.isCurrent)}</span>
                    </div>

                    {experience.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{experience.location}</span>
                      </div>
                    )}

                    <Badge variant="outline" className="text-xs">
                      {experience.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>

                {/* Action buttons */}
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
                      <DropdownMenuItem onClick={() => setEditingExperience(experience)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Experience
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteExperience(experience)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Experience
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Description */}
              {experience.description && (
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {experience.description}
                </p>
              )}

              {/* Technologies */}
              {experience.technologies && experience.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {experience.technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {experience.achievements && experience.achievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-1.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
            </div>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Experience
              </Button>
            )}
          </div>
        </div>
        <div className="p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Experience</h3>
          <p className="text-gray-500 mb-4">
            {isOwnProfile 
              ? "Share your professional journey with the community" 
              : "This user hasn't shared their work experience yet"
            }
          </p>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Experience
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
            <Briefcase className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
            <Badge variant="secondary" className="text-xs">
              {experiences.length} {experiences.length === 1 ? 'position' : 'positions'}
            </Badge>
          </div>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Experience
            </Button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={experience.id} 
              experience={experience}
              isLast={index === experiences.length - 1}
            />
          ))}
        </motion.div>
      </div>

      {/* Experience Modals */}
      <ExperienceEditModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <ExperienceEditModal
        isOpen={!!editingExperience}
        onClose={() => setEditingExperience(undefined)}
        experience={editingExperience}
      />
    </div>
  )
}