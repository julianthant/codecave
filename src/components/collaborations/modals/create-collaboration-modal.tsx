'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  X,
  Plus,
  Briefcase,
  Code,
  Sparkles,
  TrendingUp,
  GitBranch,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react'
import {
  CollaborationType,
  ExperienceLevel,
  TimeCommitment,
} from '@/types/collaborations'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CreateCollaborationModalProps {
  isOpen: boolean
  onClose: () => void
}

const collaborationTypes: {
  value: CollaborationType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}[] = [
  {
    value: 'project',
    label: 'Project Collaboration',
    icon: Briefcase,
    description: 'Long-term project partnership',
  },
  {
    value: 'code-review',
    label: 'Code Review',
    icon: Code,
    description: 'Get feedback on your code',
  },
  {
    value: 'mentorship',
    label: 'Mentorship',
    icon: Sparkles,
    description: 'Teach or learn from others',
  },
  {
    value: 'hackathon',
    label: 'Hackathon Team',
    icon: TrendingUp,
    description: 'Form a team for competitions',
  },
  {
    value: 'open-source',
    label: 'Open Source',
    icon: GitBranch,
    description: 'Contribute to open projects',
  },
  {
    value: 'study-group',
    label: 'Study Group',
    icon: Users,
    description: 'Learn together with peers',
  },
]

export function CreateCollaborationModal({
  isOpen,
  onClose,
}: CreateCollaborationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Form state
  const [selectedType, setSelectedType] = useState<CollaborationType | null>(
    null
  )
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>('intermediate')
  const [timeCommitment, setTimeCommitment] =
    useState<TimeCommitment>('few-weeks')
  const [isRemote, setIsRemote] = useState(true)
  const [location, setLocation] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [compensationType, setCompensationType] = useState<
    'paid' | 'equity' | 'volunteer' | 'open'
  >('volunteer')
  const [compensationDetails, setCompensationDetails] = useState('')
  const [githubRepo, setGithubRepo] = useState('')
  const [projectUrl, setProjectUrl] = useState('')

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleSubmit = () => {
    // Here you would submit to your API
    toast.success('Collaboration posted successfully!')
    onClose()
    // Reset form
    setCurrentStep(1)
    setSelectedType(null)
    setTitle('')
    setDescription('')
    setTechnologies([])
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedType !== null
      case 2:
        return title.trim() !== '' && description.trim() !== ''
      case 3:
        return technologies.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="relative">
          <DialogTitle className="font-semibold text-xl">
            Create Collaboration Opportunity
          </DialogTitle>

          {/* Progress Bar */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-xs">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-orange-600 rounded-full h-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 px-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-4"
              >
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    What type of collaboration are you looking for?
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Choose the option that best describes your opportunity
                  </p>
                </div>

                <div className="gap-3 grid">
                  {collaborationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={cn(
                          'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                          selectedType === type.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 p-2 rounded-lg',
                            selectedType === type.value
                              ? 'bg-orange-100'
                              : 'bg-gray-100'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-5 h-5',
                              selectedType === type.value
                                ? 'text-orange-600'
                                : 'text-gray-600'
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {type.label}
                          </p>
                          <p className="mt-0.5 text-gray-600 text-sm">
                            {type.description}
                          </p>
                        </div>
                        {selectedType === type.value && (
                          <Check className="mt-1 w-5 h-5 text-orange-600" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-4"
              >
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Tell us about your collaboration
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Provide the key details to attract the right collaborators
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Looking for React developer for e-commerce project"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project, goals, and what you're looking for in collaborators..."
                      className="mt-1 min-h-[150px]"
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        value={experienceLevel}
                        onValueChange={(value) =>
                          setExperienceLevel(value as ExperienceLevel)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="time">Time Commitment</Label>
                      <Select
                        value={timeCommitment}
                        onValueChange={(value) =>
                          setTimeCommitment(value as TimeCommitment)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="few-hours">Few Hours</SelectItem>
                          <SelectItem value="few-days">Few Days</SelectItem>
                          <SelectItem value="few-weeks">Few Weeks</SelectItem>
                          <SelectItem value="few-months">Few Months</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Technical Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-4"
              >
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Technical requirements
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Specify the technologies and skills needed
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="technologies">
                      Technologies & Skills *
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="technologies"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), handleAddTechnology())
                        }
                        placeholder="e.g., React, Node.js, Python"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTechnology}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-orange-100 px-2 py-1 text-orange-700"
                        >
                          {tech}
                          <button
                            onClick={() => handleRemoveTechnology(tech)}
                            className="ml-1.5 hover:text-orange-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="teamSize">Team Size (optional)</Label>
                    <Input
                      id="teamSize"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="e.g., Looking for 2-3 developers"
                      className="mt-1"
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <Label htmlFor="github">
                        GitHub Repository (optional)
                      </Label>
                      <Input
                        id="github"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        placeholder="https://github.com/..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="project">Project URL (optional)</Label>
                      <Input
                        id="project"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-4"
              >
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Final details
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Almost done! Add any final information
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label htmlFor="remote" className="cursor-pointer">
                        Remote Collaboration
                      </Label>
                      <p className="mt-0.5 text-gray-600 text-sm">
                        Can collaborators work remotely?
                      </p>
                    </div>
                    <Switch
                      id="remote"
                      checked={isRemote}
                      onCheckedChange={setIsRemote}
                    />
                  </div>

                  {!isRemote && (
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="compensation">Compensation Type</Label>
                    <Select
                      value={compensationType}
                      onValueChange={(value) =>
                        setCompensationType(value as typeof compensationType)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="open">Open to Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(compensationType === 'paid' ||
                    compensationType === 'equity') && (
                    <div>
                      <Label htmlFor="compensationDetails">
                        Compensation Details (optional)
                      </Label>
                      <Input
                        id="compensationDetails"
                        value={compensationDetails}
                        onChange={(e) => setCompensationDetails(e.target.value)}
                        placeholder={
                          compensationType === 'paid'
                            ? 'e.g., $50/hour'
                            : 'e.g., 2-5% equity'
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
            disabled={false}
          >
            {currentStep === 1 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="mr-1 w-4 h-4" />
                Back
              </>
            )}
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Next
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Post Collaboration
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
