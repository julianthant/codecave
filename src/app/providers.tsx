'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuthStore } from '@/stores/auth.store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, initialize } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)

      // Fetch user profile if logged in
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .then(({ data, error }) => {
            if (error) {
              console.log('Profile fetch error:', error)
              // User profile doesn't exist yet - this is normal for new users
              setProfile(null)
            } else {
              setProfile(data && data.length > 0 ? data[0] : null)
            }
          })
      }

      initialize()
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch updated profile
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)

        if (error) {
          console.log('Profile fetch error on auth change:', error)
          setProfile(null)
        } else {
          setProfile(data && data.length > 0 ? data[0] : null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, initialize, supabase])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}