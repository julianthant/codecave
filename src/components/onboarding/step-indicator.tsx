'use client'

import { motion } from 'framer-motion'
import { User, Settings, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

interface Step {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Basic Info',
    description: 'Tell us about yourself',
    icon: User,
  },
  {
    id: 2,
    title: 'Developer Profile',
    description: 'Set up your profile',
    icon: Settings,
  },
]

export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted rounded-full" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        
        {/* Step Circles */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep >= step.id
            const isCurrent = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.icon
            
            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Circle */}
                <motion.div
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'bg-background border-muted-foreground/30 text-muted-foreground'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: isCompleted ? 360 : 0,
                      scale: isCompleted ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ 
                      duration: isCompleted ? 0.6 : 0.3,
                      ease: 'easeInOut'
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  
                  {/* Pulse Effect for Current Step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-orange-500/30"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Step Info */}
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: isCurrent ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <p className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent 
                      ? 'text-orange-600 dark:text-orange-400' 
                      : isActive 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Current Step Info */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-muted-foreground">
          {steps[currentStep - 1]?.description}
        </p>
      </motion.div>
    </div>
  )
}