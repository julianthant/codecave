import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './use-auth'

export function useRequireAuth(redirectTo = '/') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}