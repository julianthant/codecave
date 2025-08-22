import { createClient } from '@/utils/supabase/server'
import { MultiStepForm } from '../../components/onboarding/multi-step-form'
import { TextEffect } from '@/components/landing/text-effect'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware handles auth redirects

  return (
    <div className="bg-gradient-to-br from-orange-50 dark:from-gray-900 via-white dark:via-gray-900 to-orange-50/30 dark:to-gray-800 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 dark:from-orange-900/5 via-transparent dark:via-transparent to-orange-50/20 dark:to-orange-900/5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="z-10 relative mx-auto px-4 py-16 container">
        {/* Welcome Header */}
        <div className="mb-12 text-center">
          <TextEffect
            preset="blur"
            per="word"
            as="h1"
            className="bg-clip-text bg-gradient-to-r from-gray-900 dark:from-white via-gray-800 dark:via-gray-100 to-gray-900 dark:to-white mb-4 font-bold text-transparent text-4xl md:text-5xl"
          >
            Welcome to CodeCave!
          </TextEffect>

          <TextEffect
            preset="slide"
            per="word"
            delay={0.5}
            as="p"
            className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl"
          >
            Let&apos;s create your developer profile and get you connected with
            the community
          </TextEffect>

          {/* Decorative Elements */}
          <div className="flex justify-center mt-8 mb-2">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 rounded-full w-2 h-2 animate-pulse" />
              <div className="bg-orange-400 rounded-full w-2 h-2 animate-pulse delay-100" />
              <div className="bg-orange-300 rounded-full w-2 h-2 animate-pulse delay-200" />
            </div>
          </div>
        </div>

        {/* Multi-Step Form */}
        {user && <MultiStepForm user={user} />}
      </div>
    </div>
  )
}
