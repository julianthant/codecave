'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from 'lucide-react'

import { ConnectionFilters } from '@/types/connections'
import { cn } from '@/lib/utils'

interface NetworkFiltersProps {
  onFiltersChange: (filters: ConnectionFilters) => void
}

const availableSkills = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Java', 'Go',
  'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'GraphQL',
  'Vue.js', 'Angular', 'Spring', 'Django', 'Flask', 'Express'
]

const experienceLevels = [
  { value: 'student', label: 'Student' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
]

export function NetworkFilters({ onFiltersChange }: NetworkFiltersProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null)

  const handleSkillToggle = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill]
    
    setSelectedSkills(updated)
    updateFilters({ skills: updated })
  }

  const handleExperienceToggle = (level: string) => {
    const updated = selectedExperience.includes(level)
      ? selectedExperience.filter(l => l !== level)
      : [...selectedExperience, level]
    
    setSelectedExperience(updated)
    updateFilters({ experienceLevels: updated })
  }

  const handleAvailabilityChange = (available: boolean | null) => {
    setAvailabilityFilter(available)
    updateFilters({ availability: available })
  }

  const updateFilters = (partialFilters: Partial<ConnectionFilters>) => {
    onFiltersChange({
      skills: selectedSkills,
      experienceLevels: selectedExperience,
      availability: availabilityFilter,
      location: [],
      ...partialFilters,
    })
  }

  const clearAllFilters = () => {
    setSelectedSkills([])
    setSelectedExperience([])
    setAvailabilityFilter(null)
    onFiltersChange({
      skills: [],
      experienceLevels: [],
      availability: null,
      location: [],
    })
  }

  const hasActiveFilters = selectedSkills.length > 0 || 
                          selectedExperience.length > 0 || 
                          availabilityFilter !== null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Filter Connections</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Skills Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Skills & Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedSkills.includes(skill)
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience Level Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h4>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={level.value}
                    checked={selectedExperience.includes(level.value)}
                    onCheckedChange={() => handleExperienceToggle(level.value)}
                  />
                  <label
                    htmlFor={level.value}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {level.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Availability</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={availabilityFilter === true}
                  onCheckedChange={() => handleAvailabilityChange(
                    availabilityFilter === true ? null : true
                  )}
                />
                <label htmlFor="available" className="text-sm text-gray-700 cursor-pointer">
                  Available for collaboration
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="not-available"
                  checked={availabilityFilter === false}
                  onCheckedChange={() => handleAvailabilityChange(
                    availabilityFilter === false ? null : false
                  )}
                />
                <label htmlFor="not-available" className="text-sm text-gray-700 cursor-pointer">
                  Not available for collaboration
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}