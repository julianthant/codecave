'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Database,
  Palette,
  Server,
  Cloud,
  Smartphone,
  Brain,
  BookOpen,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillsEditModal } from './modals/skills-edit-modal'

import type { UserSettings, Profile } from '@/db/schema'

interface SkillsMatrixProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
}

interface SkillCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  skills: SkillData[]
}

interface SkillData {
  name: string
  years: number
  isLearning?: boolean
}

type SkillsDataStructure = Record<string, Record<string, SkillData>>

export function SkillsMatrix({ profile, userSettings, isOwnProfile = false }: SkillsMatrixProps) {
  const [isSkillsEditOpen, setIsSkillsEditOpen] = useState(false)

  // Transform userSettings.skillsData into component format
  const skillCategories: SkillCategory[] = useMemo(() => {
    const baseCategories = [
      { id: 'frontend', name: 'Frontend', icon: Palette, color: 'bg-blue-500' },
      { id: 'backend', name: 'Backend', icon: Server, color: 'bg-green-500' },
      { id: 'database', name: 'Database', icon: Database, color: 'bg-purple-500' },
      { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud, color: 'bg-orange-500' },
      { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'bg-indigo-500' },
      { id: 'ai', name: 'AI & ML', icon: Brain, color: 'bg-pink-500' },
    ]

    // Get skills data from userSettings
    const skillsData = userSettings?.skillsData as SkillsDataStructure | undefined

    return baseCategories.map(category => ({
      ...category,
      skills: skillsData?.[category.id] 
        ? Object.entries(skillsData[category.id]).map(([skillName, skill]) => ({
            name: skill.name || skillName, // Use skill.name if available, otherwise fallback to key
            years: skill.years,
            isLearning: skill.isLearning
          }))
        : []
    })).filter(category => category.skills.length > 0) // Only show categories with skills
  }, [userSettings?.skillsData])

  const allSkills = skillCategories.flatMap((category) =>
    category.skills.map((skill) => ({
      ...skill,
      category: category.id,
      categoryName: category.name,
    }))
  )

  // Show empty state if no skills
  if (skillCategories.length === 0) {
    return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-gray-200 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900 text-lg">
                Skills & Technologies
              </h2>
            </div>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSkillsEditOpen(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Add Skills
              </Button>
            )}
          </div>
        </div>

        {/* Empty state */}
        <div className="p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Added</h3>
          <p className="text-gray-500 mb-4">
            {isOwnProfile 
              ? "Add your technical skills and expertise to showcase your abilities" 
              : "This user hasn't added their skills yet"
            }
          </p>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSkillsEditOpen(true)}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Add Skills
            </Button>
          )}
        </div>

        {/* Skills Edit Modal */}
        {isOwnProfile && (
          <SkillsEditModal
            isOpen={isSkillsEditOpen}
            onClose={() => setIsSkillsEditOpen(false)}
            profile={profile}
            userSettings={userSettings}
          />
        )}
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-gray-200 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900 text-lg">
              Skills & Technologies
            </h2>
          </div>
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSkillsEditOpen(true)}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        <p className="mt-1 text-gray-500 text-sm">
          Technologies and skills with years of experience
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-4">
          {skillCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className={`w-6 h-6 ${category.color} rounded-md flex items-center justify-center`}
                  >
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {category.skills.length} skills
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 px-2 py-1 border border-gray-200 rounded-md transition-colors"
                    >
                      <span className="font-medium text-gray-900 text-xs">
                        {skill.name}
                      </span>
                      {skill.isLearning && (
                        <BookOpen className="w-3 h-3 text-green-600" />
                      )}
                      <span className="text-gray-500 text-xs">
                        ({skill.years}y)
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-gray-200 border-t rounded-b-lg">
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <div className="flex items-center space-x-4">
            <span>{allSkills.length} total skills</span>
            <span>{allSkills.filter((s) => s.isLearning).length} learning</span>
          </div>
          <span className="text-xs">Continuously expanding skillset</span>
        </div>
      </div>

      {/* Skills Edit Modal */}
      {isOwnProfile && (
        <SkillsEditModal
          isOpen={isSkillsEditOpen}
          onClose={() => setIsSkillsEditOpen(false)}
          profile={profile}
          userSettings={userSettings}
        />
      )}
    </div>
  )
}
