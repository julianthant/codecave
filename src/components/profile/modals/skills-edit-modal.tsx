'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Save, 
  Loader2, 
  Plus, 
  Minus,
  Code, 
  Database, 
  Palette, 
  Server, 
  Cloud, 
  Smartphone, 
  Brain,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateUserSettings } from '@/hooks/use-profile'
import { toast } from 'sonner'
import type { UserSettings, Profile } from '@/db/schema'

interface SkillsEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile
  userSettings?: UserSettings
}

interface SkillCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface SkillData {
  name: string
  years: number
  isLearning: boolean
}

type SkillsDataStructure = Record<string, Record<string, SkillData>>

export function SkillsEditModal({ isOpen, onClose, profile, userSettings }: SkillsEditModalProps) {
  // Define skill categories
  const skillCategories: SkillCategory[] = useMemo(() => [
    { id: 'frontend', name: 'Frontend', icon: Palette, color: 'bg-blue-500' },
    { id: 'backend', name: 'Backend', icon: Server, color: 'bg-green-500' },
    { id: 'database', name: 'Database', icon: Database, color: 'bg-purple-500' },
    { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud, color: 'bg-orange-500' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'bg-indigo-500' },
    { id: 'ai', name: 'AI & ML', icon: Brain, color: 'bg-pink-500' },
  ], [])

  // Initialize skills data from userSettings
  const [skillsData, setSkillsData] = useState<SkillsDataStructure>(() => {
    const initialData: SkillsDataStructure = {}
    
    // Initialize empty categories
    skillCategories.forEach(category => {
      initialData[category.id] = {}
    })
    
    // Load existing skills data if available
    if (userSettings?.skillsData && typeof userSettings.skillsData === 'object') {
      const existingData = userSettings.skillsData as SkillsDataStructure
      Object.keys(existingData).forEach(categoryId => {
        if (initialData[categoryId]) {
          initialData[categoryId] = { ...existingData[categoryId] }
        }
      })
    }
    
    return initialData
  })

  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({})
  const updateUserSettings = useUpdateUserSettings()

  const handleAddSkill = (categoryId: string) => {
    const skillName = newSkillInputs[categoryId]?.trim()
    if (!skillName) return

    setSkillsData(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [skillName]: {
          name: skillName,
          years: 1,
          isLearning: false
        }
      }
    }))

    setNewSkillInputs(prev => ({
      ...prev,
      [categoryId]: ''
    }))
  }

  const handleRemoveSkill = (categoryId: string, skillName: string) => {
    setSkillsData(prev => {
      const newData = { ...prev }
      delete newData[categoryId][skillName]
      return newData
    })
  }

  const handleUpdateSkillYears = (categoryId: string, skillName: string, years: number) => {
    setSkillsData(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [skillName]: {
          ...prev[categoryId][skillName],
          years
        }
      }
    }))
  }

  const handleToggleLearning = (categoryId: string, skillName: string) => {
    setSkillsData(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [skillName]: {
          ...prev[categoryId][skillName],
          isLearning: !prev[categoryId][skillName].isLearning
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      await updateUserSettings.mutateAsync({
        username: profile.username,
        settings: {
          skillsData: skillsData
        }
      })
      
      toast.success('Skills updated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to update skills:', error)
      toast.error('Failed to update skills. Please try again.')
    }
  }

  const handleCancel = () => {
    // Reset to original data
    const initialData: SkillsDataStructure = {}
    skillCategories.forEach(category => {
      initialData[category.id] = {}
    })
    
    if (userSettings?.skillsData && typeof userSettings.skillsData === 'object') {
      const existingData = userSettings.skillsData as SkillsDataStructure
      Object.keys(existingData).forEach(categoryId => {
        if (initialData[categoryId]) {
          initialData[categoryId] = { ...existingData[categoryId] }
        }
      })
    }
    
    setSkillsData(initialData)
    setNewSkillInputs({})
    onClose()
  }

  const totalSkills = Object.values(skillsData).reduce((sum, category) => sum + Object.keys(category).length, 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-gray-600" />
              <span>Edit Skills & Technologies</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Skills Categories */}
          <div className="space-y-4">
            {skillCategories.map((category) => {
              const Icon = category.icon
              const categorySkills = skillsData[category.id] || {}
              const skillCount = Object.keys(categorySkills).length

              return (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  {/* Category Header */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-6 h-6 ${category.color} rounded-md flex items-center justify-center`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                      <p className="text-gray-500 text-xs">{skillCount} skills</p>
                    </div>
                  </div>

                  {/* Existing Skills */}
                  <div className="space-y-2 mb-3">
                    {Object.entries(categorySkills).map(([skillName, skillData]) => (
                      <div key={skillName} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-sm flex-1">{skillData.name}</span>
                        
                        {/* Years Experience Selector */}
                        <Select
                          value={skillData.years.toString()}
                          onValueChange={(value) => handleUpdateSkillYears(category.id, skillName, parseInt(value))}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(10)].map((_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}y
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Learning Toggle */}
                        <Button
                          variant={skillData.isLearning ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleLearning(category.id, skillName)}
                          className="h-8 px-2"
                        >
                          <BookOpen className="w-3 h-3" />
                        </Button>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(category.id, skillName)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Skill */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Add ${category.name.toLowerCase()} skill...`}
                      value={newSkillInputs[category.id] || ''}
                      onChange={(e) => setNewSkillInputs(prev => ({
                        ...prev,
                        [category.id]: e.target.value
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill(category.id)
                        }
                      }}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSkill(category.id)}
                      disabled={!newSkillInputs[category.id]?.trim()}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total skills: {totalSkills}</span>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Learning indicator</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateUserSettings.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateUserSettings.isPending}
              className="min-w-[120px]"
            >
              {updateUserSettings.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Skills
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}