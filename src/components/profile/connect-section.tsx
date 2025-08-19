'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Coffee, 
  Calendar, 
  Clock, 
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Users,
  Code,
  BookOpen,
  Zap,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingModal } from './modals/booking-modal'
import { toast } from 'sonner'
import type { Profile, UserSettings } from '@/db/schema'

interface ConnectSectionProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
}

interface AvailabilitySlot {
  day: string
  time: string
  timezone: string
  isAvailable: boolean
}

interface CollaborationType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  estimatedTime: string
}

export function ConnectSection({ profile, userSettings }: ConnectSectionProps) {
  const [selectedCollabType, setSelectedCollabType] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Mock availability data - in real app, this would come from calendar integration
  const availability: AvailabilitySlot[] = [
    { day: 'Monday', time: '2:00 PM - 4:00 PM', timezone: 'PST', isAvailable: true },
    { day: 'Tuesday', time: '10:00 AM - 12:00 PM', timezone: 'PST', isAvailable: true },
    { day: 'Wednesday', time: '3:00 PM - 5:00 PM', timezone: 'PST', isAvailable: false },
    { day: 'Thursday', time: '1:00 PM - 3:00 PM', timezone: 'PST', isAvailable: true },
    { day: 'Friday', time: '11:00 AM - 1:00 PM', timezone: 'PST', isAvailable: true },
  ]

  const collaborationTypes: CollaborationType[] = [
    {
      id: 'coffee',
      title: 'Virtual Coffee Chat',
      description: 'Casual conversation about tech, career, and industry trends',
      icon: Coffee,
      color: 'bg-orange-500',
      estimatedTime: '30 minutes',
    },
    {
      id: 'pair',
      title: 'Pair Programming',
      description: 'Collaborative coding session on interesting problems',
      icon: Code,
      color: 'bg-blue-500',
      estimatedTime: '1-2 hours',
    },
    {
      id: 'review',
      title: 'Code Review',
      description: 'Get feedback on your code, architecture, or design decisions',
      icon: CheckCircle,
      color: 'bg-green-500',
      estimatedTime: '45 minutes',
    },
    {
      id: 'mentoring',
      title: 'Mentoring Session',
      description: 'Career guidance, technical advice, and skill development',
      icon: BookOpen,
      color: 'bg-purple-500',
      estimatedTime: '1 hour',
    },
    {
      id: 'brainstorm',
      title: 'Project Brainstorming',
      description: 'Discuss ideas, solve problems, and plan technical approaches',
      icon: Zap,
      color: 'bg-yellow-500',
      estimatedTime: '1 hour',
    },
    {
      id: 'networking',
      title: 'Professional Networking',
      description: 'Connect, share experiences, and expand professional network',
      icon: Users,
      color: 'bg-indigo-500',
      estimatedTime: '30 minutes',
    },
  ]

  const contactMethods = [
    {
      platform: 'GitHub',
      icon: Github,
      username: profile.githubUsername,
      url: profile.githubUsername ? `https://github.com/${profile.githubUsername}` : null,
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      username: profile.twitterUsername,
      url: profile.twitterUsername ? `https://twitter.com/${profile.twitterUsername}` : null,
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      username: 'LinkedIn Profile',
      url: profile.linkedinUrl,
    },
    {
      platform: 'Email',
      icon: Mail,
      username: 'Send Message',
      url: null, // Would open a modal or contact form
    },
  ].filter(method => method.username && method.username !== 'Send Message' || method.platform === 'Email')

  const handleBookSession = (type: CollaborationType) => {
    setSelectedCollabType(type.id)
    setIsBookingModalOpen(true)
  }

  const handleScheduleMeeting = () => {
    setSelectedCollabType(null)
    setIsBookingModalOpen(true)
  }

  const handleContactMethod = (method: typeof contactMethods[0]) => {
    if (method.url) {
      window.open(method.url, '_blank')
      toast.success(`Opening ${method.platform} profile`)
    } else {
      // Mock email contact
      toast.success('Contact form would open here')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Let&apos;s Connect</h2>
              <p className="text-sm text-gray-500 mt-1">
                {userSettings?.availableForCollab 
                  ? 'Open for collaboration, mentoring, and professional networking'
                  : 'Connect through social platforms and professional networks'
                }
              </p>
            </div>
            
            {userSettings?.availableForCollab && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Available for collaboration</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Collaboration Types */}
          {userSettings?.availableForCollab && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Ways to Collaborate</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Usually responds within 24h
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collaborationTypes.map((type, index) => {
                  const Icon = type.icon
                  return (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleBookSession(type)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                            {type.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {type.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {type.estimatedTime}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              Book Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Office Hours */}
          {userSettings?.availableForCollab && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Weekly Availability</span>
                  <Badge variant="secondary" className="bg-white text-orange-800 border-orange-200">
                    Pacific Time (PST)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                  {availability.map((slot) => (
                    <motion.div
                      key={slot.day}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-3 rounded-lg text-center text-sm ${
                        slot.isAvailable 
                          ? 'bg-white border border-green-200 text-green-800' 
                          : 'bg-gray-100 border border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="font-medium">{slot.day}</div>
                      <div className="text-xs mt-1">{slot.time}</div>
                      <div className={`text-xs mt-1 flex items-center justify-center space-x-1 ${
                        slot.isAvailable ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          slot.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span>{slot.isAvailable ? 'Available' : 'Busy'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={handleScheduleMeeting}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a Meeting
                  </Button>
                </div>
              </div>
            </div>
          )}


          {/* Collaboration Guidelines */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Collaboration Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What I&apos;m interested in:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React/Next.js architecture discussions</li>
                  <li>• TypeScript best practices</li>
                  <li>• System design and scalability</li>
                  <li>• Open source contributions</li>
                  <li>• Career growth and mentoring</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">My communication style:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Direct and honest feedback</li>
                  <li>• Structured problem-solving approach</li>
                  <li>• Focus on learning and growth</li>
                  <li>• Respect for different perspectives</li>
                  <li>• Punctual and well-prepared</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return method.url ? (
                  <a
                    key={method.platform}
                    href={method.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-orange-600 transition-colors"
                    title={`Connect on ${method.platform}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ) : (
                  <button
                    key={method.platform}
                    onClick={() => handleContactMethod(method)}
                    className="text-gray-500 hover:text-orange-600 transition-colors"
                    title={`Contact via ${method.platform}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
            
            {/* Remote Friendly */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>Remote friendly • Global collaboration</span>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedCollabType(null)
          }}
          selectedType={selectedCollabType || undefined}
          startingStep={selectedCollabType ? 2 : 1}
        />
      </motion.div>
  )
}