'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import toast from 'react-hot-toast'

type Provider = 'discord' | 'google' | 'github'

interface AuthButtonProps {
  provider: Provider
  redirectTo?: string
  className?: string
}

export function AuthButton({
  provider,
  redirectTo = '/',
  className,
}: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          scopes: provider === 'github' ? 'read:user user:email' : undefined,
        },
      })

      if (error) {
        toast.error(`Failed to sign in with ${provider}`)
        console.error('Auth error:', error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const icons = {
    discord: <FaDiscord className="mr-2 w-5 h-5" />,
    google: <FcGoogle className="mr-2 w-5 h-5" />,
    github: <FaGithub className="mr-2 w-5 h-5" />,
  }

  const labels = {
    discord: 'Discord',
    google: 'Google',
    github: 'GitHub',
  }

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className={`w-full ${className}`}
      disabled={isLoading}
    >
      {icons[provider]}
      Continue with {labels[provider]}
    </Button>
  )
}
