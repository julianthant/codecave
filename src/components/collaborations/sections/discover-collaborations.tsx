'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CollaborationCard } from '../shared/collaboration-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import {
  Collaboration,
  CollaborationType,
  ExperienceLevel,
  TimeCommitment,
} from '@/types/collaborations'
import { cn } from '@/lib/utils'

// Mock data for collaborations
const mockCollaborations: Collaboration[] = [
  {
    id: '1',
    type: 'project',
    title: 'Build a Social Learning Platform for Developers',
    description:
      "Looking for full-stack developers to help build an innovative social learning platform that combines coding challenges with peer learning. We're creating a space where developers can learn, share, and grow together.",
    requirements: [
      '2+ years of React experience',
      'Familiarity with Node.js and Express',
      'Experience with real-time features (WebSockets)',
      'Strong communication skills',
    ],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Supabase',
      'TailwindCSS',
      'WebSockets',
    ],
    skillsNeeded: [
      'Frontend Development',
      'Backend Development',
      'UI/UX Design',
      'Database Design',
    ],
    experienceLevel: 'intermediate',
    timeCommitment: 'few-months',
    teamSize: {
      current: 2,
      needed: 5,
    },
    remote: true,
    compensation: {
      type: 'equity',
      details: '2-5% equity based on contribution',
    },
    status: 'open',
    createdBy: {
      id: 'user1',
      username: 'techfounder',
      displayName: 'Emily Chen',
      avatarUrl: null,
      bio: 'Serial entrepreneur, passionate about EdTech',
      skills: ['Product Management', 'React', 'Node.js'],
      isVerified: true,
      isPro: true,
    },
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
    applicants: 12,
    views: 234,
    saves: 18,
    githubRepo: 'https://github.com/example/social-learning',
    tags: ['startup', 'edtech', 'social'],
  },
  {
    id: '2',
    type: 'open-source',
    title: 'Contribute to Open Source CLI Tool for API Testing',
    description:
      'Join us in building a powerful CLI tool for API testing. We need help with adding new features, improving documentation, and fixing bugs. Great opportunity for beginners to get into open source!',
    technologies: ['Go', 'Python', 'Docker', 'GitHub Actions'],
    skillsNeeded: ['Backend Development', 'DevOps', 'Documentation'],
    experienceLevel: 'beginner',
    timeCommitment: 'few-hours',
    remote: true,
    compensation: {
      type: 'volunteer',
    },
    status: 'open',
    createdBy: {
      id: 'user2',
      username: 'opensourcehero',
      displayName: 'Alex Kumar',
      avatarUrl: null,
      skills: ['Go', 'Python', 'DevOps'],
      isVerified: false,
      isPro: false,
    },
    createdAt: new Date('2025-01-14T15:30:00'),
    updatedAt: new Date('2025-01-14T15:30:00'),
    applicants: 8,
    views: 156,
    saves: 12,
    githubRepo: 'https://github.com/example/api-testing-cli',
    projectUrl: 'https://api-tester.dev',
  },
  {
    id: '3',
    type: 'hackathon',
    title: 'Team Up for Global AI Hackathon 2025',
    description:
      "Looking for ML engineers and frontend developers to form a team for the upcoming Global AI Hackathon. We're planning to build an AI-powered accessibility tool. Prize pool of $50,000!",
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'AWS'],
    skillsNeeded: [
      'Machine Learning',
      'Frontend Development',
      'Cloud Architecture',
    ],
    experienceLevel: 'advanced',
    timeCommitment: 'few-days',
    teamSize: {
      current: 1,
      needed: 4,
    },
    remote: true,
    deadline: new Date('2025-02-01'),
    compensation: {
      type: 'paid',
      details: 'Equal prize split if we win',
    },
    status: 'open',
    createdBy: {
      id: 'user3',
      username: 'mlwizard',
      displayName: 'Sarah Johnson',
      avatarUrl: null,
      skills: ['Machine Learning', 'Python', 'TensorFlow'],
      isVerified: true,
      isPro: false,
    },
    createdAt: new Date('2025-01-13T09:00:00'),
    updatedAt: new Date('2025-01-13T09:00:00'),
    applicants: 15,
    views: 412,
    saves: 34,
  },
  {
    id: '4',
    type: 'mentorship',
    title: 'Frontend Mentor - Help Junior Developers Level Up',
    description:
      'Experienced React developer offering mentorship to 2-3 junior developers. Weekly code reviews, pair programming sessions, and career guidance included.',
    technologies: ['React', 'JavaScript', 'CSS', 'Git'],
    skillsNeeded: ['Frontend Development', 'Problem Solving'],
    experienceLevel: 'beginner',
    timeCommitment: 'few-weeks',
    remote: true,
    compensation: {
      type: 'volunteer',
    },
    status: 'open',
    createdBy: {
      id: 'user4',
      username: 'reactpro',
      displayName: 'Mike Wilson',
      avatarUrl: null,
      skills: ['React', 'TypeScript', 'Mentoring'],
      isVerified: true,
      isPro: true,
    },
    createdAt: new Date('2025-01-12T14:00:00'),
    updatedAt: new Date('2025-01-12T14:00:00'),
    applicants: 7,
    views: 189,
    saves: 23,
  },
  {
    id: '5',
    type: 'code-review',
    title: 'Need Code Review for E-commerce Platform',
    description:
      'Built a full-stack e-commerce platform and need experienced developers to review the codebase for security, performance, and best practices. Paid per hour.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
    skillsNeeded: ['Code Review', 'Security', 'Performance Optimization'],
    experienceLevel: 'expert',
    timeCommitment: 'few-hours',
    remote: true,
    compensation: {
      type: 'paid',
      details: '$100/hour',
    },
    status: 'open',
    createdBy: {
      id: 'user5',
      username: 'shopbuilder',
      displayName: 'Lisa Park',
      avatarUrl: null,
      skills: ['E-commerce', 'Next.js', 'PostgreSQL'],
      isVerified: false,
      isPro: false,
    },
    createdAt: new Date('2025-01-11T11:00:00'),
    updatedAt: new Date('2025-01-11T11:00:00'),
    applicants: 4,
    views: 98,
    saves: 8,
  },
]

// Filter options
const typeFilters: { value: CollaborationType; label: string }[] = [
  { value: 'project', label: 'Projects' },
  { value: 'open-source', label: 'Open Source' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'code-review', label: 'Code Review' },
  { value: 'study-group', label: 'Study Groups' },
  { value: 'startup', label: 'Startups' },
]

const experienceFilters: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
]

const timeFilters: { value: TimeCommitment; label: string }[] = [
  { value: 'few-hours', label: 'Few Hours' },
  { value: 'few-days', label: 'Few Days' },
  { value: 'few-weeks', label: 'Few Weeks' },
  { value: 'few-months', label: 'Few Months' },
  { value: 'ongoing', label: 'Ongoing' },
]

export function DiscoverCollaborations() {
  const [collaborations] = useState<Collaboration[]>(mockCollaborations)
  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<CollaborationType[]>([])
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceLevel[]
  >([])
  const [selectedTime, setSelectedTime] = useState<TimeCommitment[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilter = <T,>(
    value: T,
    selected: T[],
    setSelected: (values: T[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedExperience([])
    setSelectedTime([])
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedExperience.length > 0 ||
    selectedTime.length > 0

  // Filter collaborations based on selected filters
  const filteredCollaborations = collaborations.filter((collab) => {
    const matchesSearch =
      searchQuery === '' ||
      collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(collab.type)
    const matchesExperience =
      selectedExperience.length === 0 ||
      selectedExperience.includes(collab.experienceLevel)
    const matchesTime =
      selectedTime.length === 0 || selectedTime.includes(collab.timeCommitment)

    return matchesSearch && matchesType && matchesExperience && matchesTime
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="space-y-4 bg-white p-4 border border-gray-200 rounded-lg">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4 pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2',
              hasActiveFilters && 'border-orange-500 text-orange-600'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="bg-orange-100 px-1.5 py-0 h-5 text-orange-700"
              >
                {selectedTypes.length +
                  selectedExperience.length +
                  selectedTime.length}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                showFilters && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 border-gray-200 border-t">
                {/* Type Filters */}
                <div>
                  <p className="mb-2 font-medium text-gray-700 text-sm">
                    Project Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => (
                      <Badge
                        key={filter.value}
                        variant={
                          selectedTypes.includes(filter.value)
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'cursor-pointer transition-colors',
                          selectedTypes.includes(filter.value)
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'hover:bg-gray-50'
                        )}
                        onClick={() =>
                          toggleFilter(
                            filter.value,
                            selectedTypes,
                            setSelectedTypes
                          )
                        }
                      >
                        {filter.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filters */}
                <div>
                  <p className="mb-2 font-medium text-gray-700 text-sm">
                    Experience Level
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experienceFilters.map((filter) => (
                      <Badge
                        key={filter.value}
                        variant={
                          selectedExperience.includes(filter.value)
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'cursor-pointer transition-colors',
                          selectedExperience.includes(filter.value)
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'hover:bg-gray-50'
                        )}
                        onClick={() =>
                          toggleFilter(
                            filter.value,
                            selectedExperience,
                            setSelectedExperience
                          )
                        }
                      >
                        {filter.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time Commitment Filters */}
                <div>
                  <p className="mb-2 font-medium text-gray-700 text-sm">
                    Time Commitment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map((filter) => (
                      <Badge
                        key={filter.value}
                        variant={
                          selectedTime.includes(filter.value)
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'cursor-pointer transition-colors',
                          selectedTime.includes(filter.value)
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'hover:bg-gray-50'
                        )}
                        onClick={() =>
                          toggleFilter(
                            filter.value,
                            selectedTime,
                            setSelectedTime
                          )
                        }
                      >
                        {filter.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          Found{' '}
          <span className="font-semibold text-gray-900">
            {filteredCollaborations.length}
          </span>{' '}
          collaboration opportunities
        </p>
      </div>

      {/* Collaborations Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredCollaborations.length > 0 ? (
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredCollaborations.map((collaboration, index) => (
              <motion.div
                key={collaboration.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CollaborationCard collaboration={collaboration} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            No collaborations found matching your filters.
          </p>
          <Button
            variant="link"
            onClick={clearFilters}
            className="mt-2 text-orange-600 hover:text-orange-700"
          >
            Clear filters to see all collaborations
          </Button>
        </div>
      )}

      {/* Load More */}
      {filteredCollaborations.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            className="hover:bg-orange-50 border-orange-200 text-orange-600"
          >
            Load More Collaborations
          </Button>
        </div>
      )}
    </div>
  )
}
