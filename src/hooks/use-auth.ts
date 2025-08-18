import { useAuthStore } from '@/stores/auth.store'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export function useAuth() {
  const { user, profile, isLoading, reset } = useAuthStore()
  const supabase = createClient()

  const signOut = async () => {
    try {
      // Clear local state first
      reset()
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Show success message
      toast.success('Signed out successfully')
      
      // Hard refresh to clear all state
      window.location.href = '/'
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const updateProfile = async (updates: Record<string, unknown>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
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