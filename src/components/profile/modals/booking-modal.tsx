'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MessageSquare,
  Check,
  Coffee,
  Code,
  BookOpen,
  Zap,
  Users,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedType?: string
  startingStep?: number
}

interface SessionType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  duration: string
  color: string
}

const sessionTypes: SessionType[] = [
  {
    id: 'coffee',
    title: 'Virtual Coffee Chat',
    description: 'Casual conversation about tech, career, and industry trends',
    icon: Coffee,
    duration: '30 minutes',
    color: 'bg-orange-500',
  },
  {
    id: 'pair',
    title: 'Pair Programming',
    description: 'Collaborative coding session on interesting problems',
    icon: Code,
    duration: '1-2 hours',
    color: 'bg-blue-500',
  },
  {
    id: 'review',
    title: 'Code Review',
    description: 'Get feedback on your code, architecture, or design decisions',
    icon: CheckCircle,
    duration: '45 minutes',
    color: 'bg-green-500',
  },
  {
    id: 'mentoring',
    title: 'Mentoring Session',
    description: 'Career guidance, technical advice, and skill development',
    icon: BookOpen,
    duration: '1 hour',
    color: 'bg-purple-500',
  },
  {
    id: 'brainstorm',
    title: 'Project Brainstorming',
    description: 'Discuss ideas, solve problems, and plan technical approaches',
    icon: Zap,
    duration: '1 hour',
    color: 'bg-yellow-500',
  },
  {
    id: 'networking',
    title: 'Professional Networking',
    description: 'Connect, share experiences, and expand professional network',
    icon: Users,
    duration: '30 minutes',
    color: 'bg-indigo-500',
  },
]

const timeSlots = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
]

export function BookingModal({
  isOpen,
  onClose,
  selectedType,
  startingStep = 1,
}: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(startingStep)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [sessionType, setSessionType] = useState(selectedType || '')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedSessionType = sessionTypes.find(
    (type) => type.id === sessionType
  )

  useEffect(() => {
    if (selectedType) {
      setSessionType(selectedType)
    }
    setCurrentStep(startingStep)
  }, [selectedType, startingStep])

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !sessionType) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const sessionTitle =
      sessionTypes.find((t) => t.id === sessionType)?.title || 'Session'
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    toast.success(
      `${sessionTitle} scheduled for ${formattedDate} at ${selectedTime}! You'll receive a calendar invitation via email.`
    )

    handleClose()
  }

  const handleClose = () => {
    setCurrentStep(startingStep)
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setSessionType(selectedType || '')
    setMessage('')
    setIsSubmitting(false)
    onClose()
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    const dayOfWeek = date.getDay()

    // Disable past dates and weekends
    return date < today || dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            <span>Schedule a Session</span>
          </DialogTitle>
          <DialogDescription>
            Book a session to connect, collaborate, or get guidance
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 py-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Session Type */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="mb-2 font-medium text-lg">Choose Session Type</h3>
              <p className="mb-4 text-gray-600 text-sm">
                Select the type of session you'd like to book
              </p>
            </div>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {sessionTypes.map((type) => {
                const Icon = type.icon
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ y: -2 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      sessionType === type.id
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setSessionType(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-medium text-gray-900">
                          {type.title}
                        </h4>
                        <p className="mb-2 text-gray-600 text-sm">
                          {type.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {type.duration}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="mb-2 font-medium text-lg">Select Date & Time</h3>
              <p className="mb-4 text-gray-600 text-sm">
                Choose a convenient date and time for your session
              </p>
            </div>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
              {/* Calendar */}
              <div>
                <Label className="block mb-2 font-medium text-sm">Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="border rounded-md"
                />
              </div>

              {/* Time Slots */}
              <div>
                <Label className="block mb-2 font-medium text-sm">
                  Time (PST)
                </Label>
                <div className="gap-2 grid grid-cols-2 max-h-80 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={`text-xs ${
                        selectedTime === time
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'hover:border-orange-300'
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Session Summary */}
            {selectedSessionType && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="mb-2 font-medium text-gray-900">
                  Session Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span>{selectedSessionType.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{selectedSessionType.duration}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span>
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{selectedTime} PST</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="mb-2 font-medium text-lg">Additional Details</h3>
              <p className="mb-4 text-gray-600 text-sm">
                Share any specific topics or questions you'd like to discuss
              </p>
            </div>

            <div>
              <Label
                htmlFor="message"
                className="block mb-2 font-medium text-sm"
              >
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Tell me more about what you'd like to discuss, any specific challenges you're facing, or topics you'd like to cover..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="mt-2 text-gray-500 text-xs">
                This helps me prepare for our session and make it more valuable
                for you.
              </p>
            </div>

            {/* Final Summary */}
            {selectedSessionType && selectedDate && selectedTime && (
              <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg">
                <h4 className="mb-3 font-medium text-orange-900">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-orange-800 text-sm">
                  <div className="flex justify-between">
                    <span>Session Type:</span>
                    <span className="font-medium">
                      {selectedSessionType.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {selectedSessionType.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{selectedTime} PST</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !sessionType) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime))
                }
                className="bg-orange-600 hover:bg-orange-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedDate || !selectedTime || !sessionType || isSubmitting
                }
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 border-white border-b-2 rounded-full w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Session'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
