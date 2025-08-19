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
  Zap,
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
    .filter((p) => !p.isPrivate) // Only show public projects in featured grid
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
    className = '',
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
          <div className="flex justify-between items-start mb-3">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <h3
                  className={`
                  font-semibold text-gray-900 group-hover:text-orange-600 transition-colors
                  ${isLarge ? 'text-xl' : isMedium ? 'text-lg' : 'text-base'}
                `}
                >
                  {project.name}
                </h3>
                {project.isPrivate && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
                {project.stars > 100 && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 border-yellow-200 text-yellow-800"
                  >
                    <Star className="mr-1 w-3 h-3" />
                    Popular
                  </Badge>
                )}
              </div>

              <p
                className={`
                text-gray-600 leading-relaxed mb-3
                ${isLarge ? 'text-sm' : 'text-xs line-clamp-2'}
                ${isLarge ? 'line-clamp-3' : ''}
              `}
              >
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.technologies
                  .slice(0, isLarge ? 6 : isMedium ? 4 : 3)
                  .map((tech, index) => (
                    <SkillBadge
                      key={index}
                      skill={tech}
                      variant="secondary"
                      size="sm"
                    />
                  ))}
                {project.technologies.length >
                  (isLarge ? 6 : isMedium ? 4 : 3) && (
                  <span className="self-center text-gray-500 text-xs">
                    +
                    {project.technologies.length -
                      (isLarge ? 6 : isMedium ? 4 : 3)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Large project additional content */}
          {isLarge && (
            <div className="bg-gray-50 mb-4 p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600 text-xs">
                  Project Highlights
                </span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="gap-3 grid grid-cols-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-600">{project.stars} stars</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600">{project.forks} forks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Code className="w-3 h-3 text-purple-500" />
                  <span className="text-gray-600">{project.language}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-orange-500" />
                  <span className="text-gray-600">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Footer */}
        <div className={`px-4 pb-4 ${isLarge ? 'pt-0' : 'pt-2'}`}>
          <div className="flex justify-between items-center">
            {/* Stats for non-large cards */}
            {!isLarge && (
              <div className="flex items-center space-x-3 text-gray-500 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="bg-blue-500 rounded-full w-2 h-2"></div>
                  <span>{project.language}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
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
                  className="hover:bg-gray-100 p-0 w-7 h-7 text-gray-400 hover:text-gray-900"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-3 h-3" />
                  </a>
                </Button>
              )}

              {project.liveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-orange-50 p-0 w-7 h-7 text-gray-400 hover:text-orange-600"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-3 h-3" />
                  </a>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-orange-50 p-0 w-7 h-7 text-gray-400 hover:text-orange-600"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Last updated for large cards */}
          {isLarge && (
            <div className="flex justify-between items-center mt-3 pt-3 border-gray-100 border-t text-gray-500 text-xs">
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-lg text-center">
          <Code className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            No Public Projects
          </h3>
          <p className="text-gray-500">
            This developer hasn&apos;t shared any public projects yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-900 text-lg">
            Featured Projects
          </h2>
          <p className="text-gray-500 text-sm">
            Showcasing the most popular and impactful work
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="gap-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-fr"
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
          <Button
            variant="outline"
            className="hover:bg-orange-50 border-orange-200 text-orange-600"
          >
            <Github className="mr-2 w-4 h-4" />
            View All Projects on GitHub
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
