'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import { StepIndicator } from './step-indicator'
import { BasicInfoStep } from './form-steps/basic-info-step'
import { DeveloperProfileStep } from './form-steps/developer-profile-step'
import { SuccessAnimation } from './success-animation'

interface MultiStepFormProps {
  user: User
}

interface FormData {
  // Basic Info
  username: string
  displayName: string
  bio: string
  avatarUrl: string | null
  
  // Developer Profile
  tagline: string
  githubUsername: string
  availableForCollab: boolean
  emailNotifications: boolean
  theme: string
}

const initialFormData: FormData = {
  username: '',
  displayName: '',
  bio: '',
  avatarUrl: null,
  tagline: '',
  githubUsername: '',
  availableForCollab: true,
  emailNotifications: true,
  theme: 'system',
}

export function MultiStepForm({ user }: MultiStepFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    username: user.user_metadata?.user_name || '',
    displayName: user.user_metadata?.full_name || '',
    githubUsername: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name || '' : '',
    avatarUrl: user.user_metadata?.avatar_url || null,
  })

  const totalSteps = 2
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.username.trim()) {
        toast.error('Username is required')
        return false
      }
      if (formData.username.length < 3) {
        toast.error('Username must be at least 3 characters')
        return false
      }
      if (!formData.displayName.trim()) {
        toast.error('Display name is required')
        return false
      }
      // Add username format validation
      if (!/^[a-z0-9_\-]+$/.test(formData.username)) {
        toast.error('Username can only contain lowercase letters, numbers, underscores, and hyphens')
        return false
      }
    }
    
    // Step 2 has no required fields currently
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    
    if (isLastStep) {
      handleSubmit()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      console.log('Starting profile creation for user:', user.id)
      console.log('Form data:', formData)
      
      const requestBody = {
        id: user.id,
        email: user.email!,
        username: formData.username.toLowerCase(),
        displayName: formData.displayName,
        tagline: formData.tagline || null,
        bio: formData.bio || null,
        githubUsername: formData.githubUsername || null,
        skills: [],
        languages: [],
        availableForCollab: formData.availableForCollab,
        emailNotifications: formData.emailNotifications,
        theme: formData.theme,
        avatarUrl: formData.avatarUrl || user.user_metadata?.avatar_url || null,
      }
      
      console.log('Request body:', requestBody)
      
      // Call API route that uses Drizzle
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        
        // Try to parse as JSON, fallback to text
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText}`)
        }
        
        throw new Error(errorData.error || errorData.details || 'Failed to create profile')
      }

      const data = await response.json()
      console.log('Success response:', data)

      // Show success animation instead of immediate redirect
      setShowSuccess(true)
      
    } catch (error) {
      console.error('Error creating profile:', error)
      let message = 'Failed to create profile'
      
      if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'string') {
        message = error
      }
      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSuccessComplete = () => {
    router.push('/feed')
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={{
              username: formData.username,
              displayName: formData.displayName,
              bio: formData.bio,
              avatarUrl: formData.avatarUrl,
            }}
            onFormDataChange={updateFormData}
          />
        )
      case 2:
        return (
          <DeveloperProfileStep
            formData={{
              tagline: formData.tagline,
              githubUsername: formData.githubUsername,
              availableForCollab: formData.availableForCollab,
              emailNotifications: formData.emailNotifications,
              theme: formData.theme,
            }}
            onFormDataChange={updateFormData}
            githubFromAuth={user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : undefined}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Step Indicator */}
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        className="mb-8"
      />

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex items-center justify-between max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isLoading}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isFirstStep ? 'invisible' : ''
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 flex items-center gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              {isLastStep ? 'Complete Setup' : 'Next'}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </Button>
      </motion.div>

      {/* Help Text */}
      <motion.div 
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-muted-foreground">
          You can always update these settings later in your profile
        </p>
      </motion.div>

      {/* Success Animation */}
      <SuccessAnimation 
        isVisible={showSuccess}
        onComplete={handleSuccessComplete}
        userName={formData.displayName}
      />
    </div>
  )
}