'use client'

import React, { useMemo } from 'react'
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
} from 'lucide-react'

import type { UserSettings } from '@/db/schema'

interface SkillsMatrixProps {
  userSettings?: UserSettings
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
  yearsExperience: number
  isLearning?: boolean
}

export function SkillsMatrix({}: SkillsMatrixProps) {
  // Mock skill data - in real app, this would come from userSettings or database
  const skillCategories: SkillCategory[] = useMemo(
    () => [
      {
        id: 'frontend',
        name: 'Frontend',
        icon: Palette,
        color: 'bg-blue-500',
        skills: [
          { name: 'React', yearsExperience: 4 },
          { name: 'TypeScript', yearsExperience: 3 },
          { name: 'Next.js', yearsExperience: 2 },
          { name: 'TailwindCSS', yearsExperience: 2 },
          { name: 'Vue.js', yearsExperience: 1 },
          { name: 'Svelte', yearsExperience: 0.5, isLearning: true },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        icon: Server,
        color: 'bg-green-500',
        skills: [
          { name: 'Node.js', yearsExperience: 3 },
          { name: 'Python', yearsExperience: 2 },
          { name: 'Go', yearsExperience: 1 },
          { name: 'Express', yearsExperience: 3 },
          { name: 'FastAPI', yearsExperience: 1 },
          { name: 'Rust', yearsExperience: 0.5, isLearning: true },
        ],
      },
      {
        id: 'database',
        name: 'Database',
        icon: Database,
        color: 'bg-purple-500',
        skills: [
          { name: 'PostgreSQL', yearsExperience: 3 },
          { name: 'MongoDB', yearsExperience: 2 },
          { name: 'Redis', yearsExperience: 2 },
          { name: 'Supabase', yearsExperience: 1 },
          { name: 'Prisma', yearsExperience: 2 },
          { name: 'GraphQL', yearsExperience: 1 },
        ],
      },
      {
        id: 'cloud',
        name: 'Cloud & DevOps',
        icon: Cloud,
        color: 'bg-orange-500',
        skills: [
          { name: 'Docker', yearsExperience: 3 },
          { name: 'AWS', yearsExperience: 2 },
          { name: 'Vercel', yearsExperience: 2 },
          { name: 'GitHub Actions', yearsExperience: 2 },
          { name: 'Kubernetes', yearsExperience: 1, isLearning: true },
          { name: 'Terraform', yearsExperience: 0.5, isLearning: true },
        ],
      },
      {
        id: 'mobile',
        name: 'Mobile',
        icon: Smartphone,
        color: 'bg-indigo-500',
        skills: [
          { name: 'React Native', yearsExperience: 1 },
          { name: 'Expo', yearsExperience: 1 },
          { name: 'Swift', yearsExperience: 0.5, isLearning: true },
          { name: 'Flutter', yearsExperience: 0.5, isLearning: true },
        ],
      },
      {
        id: 'ai',
        name: 'AI & ML',
        icon: Brain,
        color: 'bg-pink-500',
        skills: [
          { name: 'OpenAI API', yearsExperience: 1 },
          { name: 'LangChain', yearsExperience: 1 },
          { name: 'Vector Databases', yearsExperience: 0.5, isLearning: true },
          { name: 'TensorFlow', yearsExperience: 0.5, isLearning: true },
        ],
      },
    ],
    []
  )

  const allSkills = skillCategories.flatMap((category) =>
    category.skills.map((skill) => ({
      ...skill,
      category: category.id,
      categoryName: category.name,
    }))
  )

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-gray-200 border-b">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900 text-lg">
            Skills & Technologies
          </h2>
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
                        ({skill.yearsExperience}y)
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
    </div>
  )
}
