import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to CodeCave!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Let&apos;s set up your profile
          </p>
        </div>
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}