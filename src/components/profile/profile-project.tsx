'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Calendar,
  Globe,
  Lock
} from 'lucide-react'
import { SkillBadge } from './skill-badge'

interface ProjectData {
  id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  stars: number
  forks: number
  isPrivate: boolean
  lastUpdated: string
  language: string
}

interface ProfileProjectProps {
  project: ProjectData
}

export function ProfileProject({ project }: ProfileProjectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden border-gray-100 transition-all duration-200 hover:border-orange-200 hover:shadow-lg">
        <CardContent className="p-6">
          {/* Project Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
                  {project.name}
                </h3>
                {project.isPrivate && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.slice(0, 4).map((tech, index) => (
                  <SkillBadge key={index} skill={tech} variant="secondary" size="sm" />
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-xs text-gray-500">+{project.technologies.length - 4} more</span>
                )}
              </div>
            </div>
          </div>

          {/* Project Stats */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>{project.language}</span>
              </div>
              
              {!project.isPrivate && (
                <>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{project.stars.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <GitFork className="h-4 w-4" />
                    <span>{project.forks.toLocaleString()}</span>
                  </div>
                </>
              )}
              
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {project.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {project.githubUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              
              {project.liveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}