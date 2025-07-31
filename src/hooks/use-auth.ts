import { useAuthStore } from '@/stores/auth.store'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, profile, isLoading } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      return true
    } catch {
      toast.error('Failed to update profile')
      return false
    }
  }

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    updateProfile,
  }
}