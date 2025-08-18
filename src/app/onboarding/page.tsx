import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { OnboardingForm } from '../../components/onboarding/onboarding-form'

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
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <div className="flex justify-center items-center bg-background min-h-screen">
      <div className="space-y-8 p-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="font-bold text-3xl">Welcome to CodeCave!</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Let&apos;s set up your profile
          </p>
        </div>
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}
