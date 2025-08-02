'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AuthButton } from './auth-button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function AuthModal({ isOpen, onClose, redirectTo = '/' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CodeCave</DialogTitle>
          <DialogDescription>
            Join the community of developers building amazing things together.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <AuthButton provider="github" redirectTo={redirectTo} variant="outline" className="w-full">
              Continue with GitHub
            </AuthButton>
            <AuthButton provider="google" redirectTo={redirectTo} variant="outline" className="w-full">
              Continue with Google
            </AuthButton>
            <AuthButton provider="discord" redirectTo={redirectTo} variant="outline" className="w-full">
              Continue with Discord
            </AuthButton>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}