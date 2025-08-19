'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar, 
  Globe,
  Lock,
  TrendingUp,
  Code,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface FeaturedGridProps {
  projects: ProjectData[]
}

export function FeaturedGrid({ projects }: FeaturedGridProps) {
  // Sort projects by importance/popularity for grid placement
  const sortedProjects = [...projects]
    .filter(p => !p.isPrivate) // Only show public projects in featured grid
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6) // Limit to 6 projects for the grid

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  // Featured project (largest card)
  const featuredProject = sortedProjects[0]
  // Secondary projects
  const secondaryProjects = sortedProjects.slice(1, 3)
  // Small projects
  const smallProjects = sortedProjects.slice(3, 6)

  const ProjectCard = ({ 
    project, 
    size = 'small',
    className = '' 
  }: { 
    project: ProjectData
    size?: 'large' | 'medium' | 'small'
    className?: string 
  }) => {
    const isLarge = size === 'large'
    const isMedium = size === 'medium'

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        className={`
          group bg-white rounded-lg border border-gray-200 overflow-hidden
          hover:border-orange-200 hover:shadow-lg transition-all duration-300
          ${className}
        `}
      >
        {/* Project Header */}
        <div className={`p-4 ${isLarge ? 'pb-2' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`
                  font-semibold text-gray-900 group-hover:text-orange-600 transition-colors
                  ${isLarge ? 'text-xl' : isMedium ? 'text-lg' : 'text-base'}
                `}>
                  {project.name}
                </h3>
                {project.isPrivate && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                {project.stars > 100 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              
              <p className={`
                text-gray-600 leading-relaxed mb-3
                ${isLarge ? 'text-sm' : 'text-xs line-clamp-2'}
                ${isLarge ? 'line-clamp-3' : ''}
              `}>
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.technologies.slice(0, isLarge ? 6 : isMedium ? 4 : 3).map((tech, index) => (
                  <SkillBadge 
                    key={index} 
                    skill={tech} 
                    variant="secondary" 
                    size="sm" 
                  />
                ))}
                {project.technologies.length > (isLarge ? 6 : isMedium ? 4 : 3) && (
                  <span className="text-xs text-gray-500 self-center">
                    +{project.technologies.length - (isLarge ? 6 : isMedium ? 4 : 3)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Large project additional content */}
          {isLarge && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 font-medium">Project Highlights</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-gray-600">{project.stars} stars</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="h-3 w-3 text-blue-500" />
                  <span className="text-gray-600">{project.forks} forks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Code className="h-3 w-3 text-purple-500" />
                  <span className="text-gray-600">{project.language}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-orange-500" />
                  <span className="text-gray-600">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Footer */}
        <div className={`px-4 pb-4 ${isLarge ? 'pt-0' : 'pt-2'}`}>
          <div className="flex items-center justify-between">
            {/* Stats for non-large cards */}
            {!isLarge && (
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>{project.language}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{project.lastUpdated}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center space-x-1 ml-auto">
              {project.githubUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 w-7 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3" />
                  </a>
                </Button>
              )}
              
              {project.liveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 w-7 p-0 text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3 w-3" />
                  </a>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-orange-600 hover:bg-orange-50"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Last updated for large cards */}
          {isLarge && (
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
              <span>Last updated {project.lastUpdated}</span>
              <span>⭐ Trending in {project.language}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Public Projects</h3>
          <p className="text-gray-500">This developer hasn&apos;t shared any public projects yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Featured Projects</h2>
          <p className="text-sm text-gray-500">
            Showcasing the most popular and impactful work
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr"
        >
          {/* Featured project - 2x2 */}
          {featuredProject && (
            <ProjectCard
              project={featuredProject}
              size="large"
              className="md:col-span-2 md:row-span-2"
            />
          )}

          {/* Secondary projects - 1x2 each */}
          {secondaryProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              size="medium"
              className="md:col-span-2 md:row-span-1"
            />
          ))}

          {/* Small projects - 1x1 each */}
          {smallProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              size="small"
              className="md:col-span-1 md:row-span-1"
            />
          ))}
        </motion.div>

        {/* View all projects link */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            <Github className="h-4 w-4 mr-2" />
            View All Projects on GitHub
          </Button>
        </div>
      </motion.div>
    </div>
  )
}