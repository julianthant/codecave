'use client'

import React, { useState } from 'react'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignInDrawer } from '@/components/auth/sign-in-drawer'

interface SignInButtonProps {
  children?: React.ReactNode
  redirectTo?: string
  className?: string
  'aria-label'?: string
}

export function SignInButton({
  children,
  redirectTo = '/feed',
  className = 'relative flex justify-center items-center bg-muted hover:bg-gray-200 rounded-full focus:outline-none text-gray-600 hover:text-gray-900 transition-all duration-200 ease-in-out w-10 h-10',
  'aria-label': ariaLabel = 'Sign in',
}: SignInButtonProps) {
  const [showSignInDrawer, setShowSignInDrawer] = useState(false)

  return (
    <>
      <Button
        variant="default"
        className={className}
        onClick={() => setShowSignInDrawer(true)}
        aria-label={ariaLabel}
      >
        {children || <User className="w-5 h-5 text-gray-600" />}
      </Button>

      <SignInDrawer
        open={showSignInDrawer}
        onOpenChange={setShowSignInDrawer}
        redirectTo={redirectTo}
      />
    </>
  )
}
