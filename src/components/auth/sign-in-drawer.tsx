'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { AuthButton } from './auth-button'
import { User } from 'lucide-react'
import Link from 'next/link'

interface SignInDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export function SignInDrawer({
  open,
  onOpenChange,
  redirectTo = '/',
}: SignInDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <DialogTitle className="font-semibold text-xl">
              Sign in required
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              You need to be signed in to access this feature. Join our
              community of developers building amazing things together.
            </DialogDescription>
          </DialogHeader>
          <SignInForm className="mt-6" redirectTo={redirectTo} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="flex justify-center items-center bg-[hsl(25_95%_65%)]/10 rounded-full w-16 h-16">
              <User className="w-8 h-8 text-[hsl(25_95%_65%)]" />
            </div>
          </div>
          <DrawerTitle className="font-semibold text-xl">
            Sign in required
          </DrawerTitle>
          <DrawerDescription className="mt-2 text-gray-600">
            You need to be signed in to access this feature. Join our community
            of developers.
          </DrawerDescription>
        </DrawerHeader>
        <SignInForm className="px-4" redirectTo={redirectTo} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Maybe later</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function SignInForm({
  className,
  redirectTo,
}: {
  className?: string
  redirectTo?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <AuthButton
          provider="github"
          redirectTo={redirectTo}
          className="w-full h-11 font-medium text-base"
        />
        <AuthButton
          provider="google"
          redirectTo={redirectTo}
          className="w-full h-11 font-medium text-base"
        />
        <AuthButton
          provider="discord"
          redirectTo={redirectTo}
          className="w-full h-11 font-medium text-base"
        />
      </div>
      <p className="text-muted-foreground text-xs text-center">
        By continuing, you agree to our{' '}
        <Link href="#" className="hover:text-primary underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="hover:text-primary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
