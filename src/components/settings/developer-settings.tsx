'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { TagInput } from '@/components/ui/TagInput'
import { Code, Users, GraduationCap, Briefcase } from 'lucide-react'
import { toast } from 'sonner'

const developerSchema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required').max(10, 'Maximum 10 skills allowed'),
  languages: z.array(z.string()).min(1, 'At least one programming language is required').max(8, 'Maximum 8 languages allowed'),
  experienceLevel: z.enum(['student', 'junior', 'mid', 'senior', 'lead']),
  availableForCollab: z.boolean(),
})

type DeveloperFormData = z.infer<typeof developerSchema>

// Mock data
const mockDeveloperData = {
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  languages: ['JavaScript', 'Python', 'Go', 'SQL'],
  experienceLevel: 'senior' as const,
  availableForCollab: true,
}

const experienceLevels = [
  { value: 'student', label: 'Student', icon: GraduationCap, description: 'Learning and building projects' },
  { value: 'junior', label: 'Junior', icon: Code, description: '0-2 years of experience' },
  { value: 'mid', label: 'Mid-Level', icon: Briefcase, description: '3-5 years of experience' },
  { value: 'senior', label: 'Senior', icon: Users, description: '5+ years of experience' },
  { value: 'lead', label: 'Tech Lead', icon: Users, description: 'Leading teams and projects' },
]

const popularSkills = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 
  'Rust', 'Node.js', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Next.js', 'Express', 'GraphQL'
]

const popularLanguages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'SQL', 'HTML/CSS'
]

export function DeveloperSettings() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: mockDeveloperData,
  })

  const watchedExperienceLevel = watch('experienceLevel')
  const selectedExperience = experienceLevels.find(exp => exp.value === watchedExperienceLevel)

  const onSubmit = async (data: DeveloperFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Developer profile update:', data)
    toast.success('Developer profile updated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Code className="mr-2 inline h-5 w-5" />
            Technical Skills
          </CardTitle>
          <CardDescription>
            Add your technical skills and expertise. These help others find you for collaboration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Skills</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type a skill and press Enter"
                      suggestions={popularSkills}
                      maxTags={10}
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-600">{errors.skills.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Add up to 10 technical skills. Popular suggestions will appear as you type.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Programming Languages</Label>
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type a language and press Enter"
                      suggestions={popularLanguages}
                      maxTags={8}
                    />
                  )}
                />
                {errors.languages && (
                  <p className="text-sm text-red-600">{errors.languages.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Add programming languages you&apos;re proficient in (max 8).
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Briefcase className="mr-2 inline h-5 w-5" />
            Experience Level
          </CardTitle>
          <CardDescription>
            Your current experience level helps match you with appropriate projects and collaborators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Experience Level</Label>
                <Controller
                  name="experienceLevel"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => {
                          const Icon = level.icon
                          return (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{level.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                
                {selectedExperience && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <selectedExperience.icon className="h-4 w-4" />
                    <span>{selectedExperience.description}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Collaboration */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Users className="mr-2 inline h-5 w-5" />
            Collaboration Preferences
          </CardTitle>
          <CardDescription>
            Let others know if you&apos;re open to collaboration on projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="availableForCollab">Available for Collaboration</Label>
                  <Badge 
                    variant={watchedExperienceLevel === 'student' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {watchedExperienceLevel === 'student' ? 'Learning' : 'Open to projects'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {watchedExperienceLevel === 'student' 
                    ? 'Show that you&apos;re looking for learning opportunities and beginner-friendly projects'
                    : 'Allow other developers to find and collaborate with you on projects'
                  }
                </p>
              </div>
              <Controller
                name="availableForCollab"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="availableForCollab"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: isDirty ? 1 : 0.5, scale: isDirty ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                disabled={!isDirty}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Save Developer Profile
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}