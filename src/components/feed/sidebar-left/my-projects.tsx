'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket,
  Star,
  GitFork,
  Plus,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

// Mock user projects data
const mockProjects = [
  {
    id: '1',
    name: 'CodeCave Platform',
    description: 'Developer community platform',
    language: 'TypeScript',
    stars: 245,
    forks: 67,
    status: 'active',
    lastUpdated: '2 days ago',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'React Components',
    description: 'UI component library',
    language: 'React',
    stars: 432,
    forks: 89,
    status: 'active',
    lastUpdated: '1 week ago',
    color: 'bg-cyan-500'
  },
  {
    id: '3',
    name: 'API Gateway',
    description: 'Microservices gateway',
    language: 'Go',
    stars: 156,
    forks: 34,
    status: 'maintenance',
    lastUpdated: '3 weeks ago',
    color: 'bg-teal-500'
  }
]

export function MyProjects() {
  const handleProjectClick = (projectName: string) => {
    toast.success(`Opening ${projectName}...`)
  }

  const handleNewProject = () => {
    toast.success('Creating new project...')
  }

  const handleViewAll = () => {
    toast.success('Opening projects page...')
  }

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <Rocket className="w-4 h-4 text-orange-500" />
            <span>My Projects</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="text-xs text-orange-600 hover:text-orange-700 p-1 h-auto"
          >
            View all
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <button
              onClick={() => handleProjectClick(project.name)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200 group-hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-3">
                {/* Language Color Indicator */}
                <div className={`w-3 h-3 rounded-full ${project.color} mt-1 flex-shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  {/* Project Name and Status */}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {project.name}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ml-2 ${
                        project.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {project.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{project.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{project.forks}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{project.lastUpdated}</span>
                  </div>
                </div>
                
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </button>
          </motion.div>
        ))}

        {/* New Project Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-2 border-t border-gray-100"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewProject}
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}