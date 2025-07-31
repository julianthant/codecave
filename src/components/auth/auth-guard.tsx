'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: string
}

export function AuthGuard({ children, fallback = '/' }: AuthGuardProps) {
  const router = useRouter()
  const { user, isLoading, isInitialized } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isInitialized && !user) {
      router.push(fallback)
    }
  }, [user, isLoading, isInitialized, router, fallback])

  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}