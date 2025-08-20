'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Check, Sparkles, Users, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SuccessAnimationProps {
  isVisible: boolean
  onComplete?: () => void
  userName?: string
}

export function SuccessAnimation({ isVisible, onComplete, userName }: SuccessAnimationProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    // Initial confetti burst
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa']
      })
      setStep(1)
    }, 300)

    // Success message
    const timer2 = setTimeout(() => {
      setStep(2)
    }, 1000)

    // Features preview
    const timer3 = setTimeout(() => {
      setStep(3)
    }, 2000)

    // Final confetti
    const timer4 = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      })
    }, 2500)

    // Auto-complete after animation
    const timer5 = setTimeout(() => {
      onComplete?.()
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [isVisible, onComplete])

  const features = [
    { icon: Users, text: 'Connect with developers' },
    { icon: Rocket, text: 'Showcase your projects' },
    { icon: Sparkles, text: 'Discover opportunities' },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <Card className="max-w-md w-full border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              
              {/* Step 1: Check Icon */}
              <AnimatePresence mode="wait">
                {step >= 1 && (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 260, 
                      damping: 20,
                      duration: 0.6
                    }}
                    className="mb-6"
                  >
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 2: Success Message */}
              <AnimatePresence mode="wait">
                {step >= 2 && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Profile Created! 🎉
                    </h2>
                    <p className="text-muted-foreground">
                      {userName ? `Welcome to CodeCave, ${userName}!` : 'Welcome to CodeCave!'}
                      <br />
                      Your developer profile is ready.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Feature Preview */}
              <AnimatePresence mode="wait">
                {step >= 3 && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="space-y-4"
                  >
                    <p className="text-sm font-medium text-foreground mb-4">
                      You can now:
                    </p>
                    
                    <div className="space-y-3">
                      {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                          >
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {feature.text}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4"
                    >
                      <Button
                        onClick={onComplete}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
                      >
                        Explore CodeCave
                      </Button>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Redirecting you to the feed...
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}