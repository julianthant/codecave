'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  Database, 
  Palette, 
  Server, 
  Cloud, 
  Smartphone,
  Brain,
  TrendingUp,
  Award,
  Target,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

export function SkillsMatrix({ }: SkillsMatrixProps) {

  // Mock skill data - in real app, this would come from userSettings or database
  const skillCategories: SkillCategory[] = useMemo(() => [
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ], [])

  const allSkills = skillCategories.flatMap(category => 
    category.skills.map(skill => ({ ...skill, category: category.id, categoryName: category.name }))
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills & Technologies</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
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
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-6 h-6 ${category.color} rounded-md flex items-center justify-center`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.skills.length} skills</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="text-xs font-medium text-gray-900">{skill.name}</span>
                      {skill.isLearning && <BookOpen className="h-3 w-3 text-green-600" />}
                      <span className="text-xs text-gray-500">({skill.yearsExperience}y)</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{allSkills.length} total skills</span>
            <span>{allSkills.filter(s => s.isLearning).length} learning</span>
          </div>
          <span className="text-xs">Continuously expanding skillset</span>
        </div>
      </div>
    </div>
  )
}