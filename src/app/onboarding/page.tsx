import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { MultiStepForm } from '../../components/onboarding/multi-step-form'
import { TextEffect } from '@/components/landing/text-effect'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-orange-50/20 dark:from-orange-900/5 dark:via-transparent dark:to-orange-900/5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.05)_0%,transparent_50%)]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <TextEffect 
            preset="blur"
            per="word"
            as="h1"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4"
          >
            Welcome to CodeCave!
          </TextEffect>
          
          <TextEffect
            preset="slide"
            per="word"
            delay={0.5}
            as="p"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Let&apos;s create your developer profile and get you connected with the community
          </TextEffect>
          
          {/* Decorative Elements */}
          <div className="flex justify-center mt-8 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </div>

        {/* Multi-Step Form */}
        <MultiStepForm user={user} />
      </div>
    </div>
  )
}
