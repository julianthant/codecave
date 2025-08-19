import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/feed/navbar/navbar'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">{children}</main>
    </>
  )
}
