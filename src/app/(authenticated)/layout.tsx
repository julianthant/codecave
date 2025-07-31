import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <>
      <main className="min-h-screen bg-background">{children}</main>
    </>
  )
}