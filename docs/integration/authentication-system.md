# Authentication System

[← Back to Index](./index.md) | [Previous: Project Setup](./04-project-setup.md) | [Next: Feed System →](./06-feed-system.md)

## Overview

CodeCave uses OAuth-only authentication with Discord, Google, and GitHub providers. No passwords are stored, and the system is built on Supabase Auth.

## Step 1: Configure Supabase Auth

### Enable OAuth Providers in Supabase Dashboard

1. Go to Authentication → Providers
2. Enable and configure:
   - **Discord**: Add Client ID and Secret
   - **Google**: Add Client ID and Secret
   - **GitHub**: Add Client ID and Secret

### Redirect URLs

```
http://localhost:3000/auth/callback (development)
https://codecave.tech/auth/callback (production)
```

## Step 2: Create Supabase Clients

### Create `src/utils/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Create `src/utils/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### Create `src/utils/supabase/middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

## Step 3: Create Middleware

### Create `src/middleware.ts`

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Step 4: Create Auth Store

### Create `src/stores/auth.store.ts`

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: any | null
  isLoading: boolean
  isInitialized: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: any | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        profile: null,
        isLoading: true,
        isInitialized: false,

        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isLoading = false
          }),

        setProfile: (profile) =>
          set((state) => {
            state.profile = profile
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        initialize: () =>
          set((state) => {
            state.isInitialized = true
            state.isLoading = false
          }),

        reset: () =>
          set((state) => {
            state.user = null
            state.profile = null
            state.isLoading = false
          }),
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
```

## Step 5: Create Auth Components

### Create `src/components/auth/auth-button.tsx`

```typescript
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

export function AuthButton({ provider, redirectTo = '/', className }: AuthButtonProps) {
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
    discord: <FaDiscord className="mr-2 h-5 w-5" />,
    google: <FcGoogle className="mr-2 h-5 w-5" />,
    github: <FaGithub className="mr-2 h-5 w-5" />,
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
```

### Create `src/components/auth/auth-modal.tsx`

```typescript
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
            <AuthButton provider="github" redirectTo={redirectTo} />
            <AuthButton provider="google" redirectTo={redirectTo} />
            <AuthButton provider="discord" redirectTo={redirectTo} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Create `src/components/auth/user-menu.tsx`

```typescript
'use client'

import { useAuthStore } from '@/stores/auth.store'
import { createClient } from '@/utils/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Settings,
  FileText,
  Users,
  LogOut,
  Crown,
} from 'lucide-react'

export function UserMenu() {
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ''}
              alt={profile?.display_name || user.email || ''}
            />
            <AvatarFallback>
              {profile?.display_name?.[0]?.toUpperCase() ||
               user.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.display_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{profile?.username || 'username'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${profile?.username}`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>My Groups</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {profile?.is_pro && (
          <DropdownMenuItem asChild>
            <Link href="/pro" className="cursor-pointer text-blue-600">
              <Crown className="mr-2 h-4 w-4" />
              <span>Pro Settings</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Step 6: Create Auth Callback Route

### Create `src/app/auth/callback/route.ts`

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user profile exists
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        // If no profile exists, redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to home page if there's an error
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
```

### Create `src/app/auth/signout/route.ts`

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
```

## Step 7: Create Onboarding Flow

### Create `src/app/onboarding/page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to CodeCave!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Let's set up your profile
          </p>
        </div>
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}
```

### Create `src/app/onboarding/onboarding-form.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: user.user_metadata?.user_name || '',
    display_name: user.user_metadata?.full_name || '',
    bio: '',
    github_username: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if username is available
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)
        .single()

      if (existing) {
        toast.error('Username already taken')
        setIsLoading(false)
        return
      }

      // Create user profile
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio,
        github_username: formData.github_username,
        avatar_url: user.user_metadata?.avatar_url,
      })

      if (error) throw error

      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
            required
            pattern="^[a-zA-Z0-9_-]+$"
            title="Username can only contain letters, numbers, underscores, and hyphens"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be your unique identifier on CodeCave
          </p>
        </div>

        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        {user.app_metadata?.provider !== 'github' && (
          <div>
            <Label htmlFor="github_username">GitHub Username (optional)</Label>
            <Input
              id="github_username"
              type="text"
              value={formData.github_username}
              onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
              placeholder="johndoe"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Profile...' : 'Complete Setup'}
      </Button>
    </form>
  )
}
```

## Step 8: Create Auth Guard Component

### Create `src/components/auth/auth-guard.tsx`

```typescript
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
```

## Step 9: Create Providers Component

### Create `src/app/providers.tsx`

```typescript
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
          .single()
          .then(({ data }) => {
            setProfile(data)
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
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(data)
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
```

## Step 10: Update Root Layout

### Update `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeCave - Developer Social Platform',
  description: 'Share code, find collaborators, and build amazing things together',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Step 11: Create Protected Route Layouts

### Create `src/app/(authenticated)/layout.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Navbar } from '@/components/layout/navbar'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  )
}
```

## Step 12: Create Auth Hooks

### Create `src/hooks/use-auth.ts`

```typescript
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
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      return true
    } catch (error) {
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
```

### Create `src/hooks/use-require-auth.ts`

```typescript
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
```

## Step 13: Create UI Components for Auth

### Create `src/components/ui/dialog.tsx`

```typescript
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

## Testing the Authentication

### Test OAuth Providers

1. Click "Continue with GitHub/Google/Discord"
2. Authorize the application
3. Complete onboarding
4. Verify profile creation

### Test Protected Routes

1. Try accessing `/dashboard` without auth
2. Should redirect to home page
3. Sign in and try again
4. Should show dashboard

### Test Sign Out

1. Click user menu → Sign out
2. Should redirect to home page
3. Auth state should be cleared

## Security Considerations

1. **No Password Storage**: OAuth-only prevents password vulnerabilities
2. **PKCE Flow**: Supabase uses PKCE for secure OAuth
3. **HTTP-Only Cookies**: Session stored in secure cookies
4. **CSRF Protection**: Built into Supabase Auth
5. **Rate Limiting**: Supabase provides auth rate limiting

## Next Steps

Continue to [Feed System](./06-feed-system.md) → from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
return createBrowserClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
}

````

### Create `src/utils/supabase/server.ts`
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
````

### Create `src/utils/supabase/middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

## Step 3: Create Middleware

### Create `src/middleware.ts`

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Step 4: Create Auth Store

### Create `src/stores/auth.store.ts`

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: any | null
  isLoading: boolean
  isInitialized: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: any | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        profile: null,
        isLoading: true,
        isInitialized: false,

        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isLoading = false
          }),

        setProfile: (profile) =>
          set((state) => {
            state.profile = profile
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        initialize: () =>
          set((state) => {
            state.isInitialized = true
            state.isLoading = false
          }),

        reset: () =>
          set((state) => {
            state.user = null
            state.profile = null
            state.isLoading = false
          }),
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
```

## Step 5: Create Auth Components

### Create `src/components/auth/auth-button.tsx`

```typescript
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

export function AuthButton({ provider, redirectTo = '/', className }: AuthButtonProps) {
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
    discord: <FaDiscord className="mr-2 h-5 w-5" />,
    google: <FcGoogle className="mr-2 h-5 w-5" />,
    github: <FaGithub className="mr-2 h-5 w-5" />,
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
```

### Create `src/components/auth/auth-modal.tsx`

```typescript
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
            <AuthButton provider="github" redirectTo={redirectTo} />
            <AuthButton provider="google" redirectTo={redirectTo} />
            <AuthButton provider="discord" redirectTo={redirectTo} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Create `src/components/auth/user-menu.tsx`

```typescript
'use client'

import { useAuthStore } from '@/stores/auth.store'
import { createClient } from '@/utils/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Settings,
  FileText,
  Users,
  LogOut,
  Crown,
} from 'lucide-react'

export function UserMenu() {
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ''}
              alt={profile?.display_name || user.email || ''}
            />
            <AvatarFallback>
              {profile?.display_name?.[0]?.toUpperCase() ||
               user.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.display_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{profile?.username || 'username'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${profile?.username}`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>My Groups</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {profile?.is_pro && (
          <DropdownMenuItem asChild>
            <Link href="/pro" className="cursor-pointer text-blue-600">
              <Crown className="mr-2 h-4 w-4" />
              <span>Pro Settings</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Step 6: Create Auth Callback Route

### Create `src/app/auth/callback/route.ts`

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user profile exists
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        // If no profile exists, redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to home page if there's an error
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
```

### Create `src/app/auth/signout/route.ts`

```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
```

## Step 7: Create Onboarding Flow

### Create `src/app/onboarding/page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to CodeCave!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Let's set up your profile
          </p>
        </div>
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}
```

### Create `src/app/onboarding/onboarding-form.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: user.user_metadata?.user_name || '',
    display_name: user.user_metadata?.full_name || '',
    bio: '',
    github_username: user.app_metadata?.provider === 'github' ? user.user_metadata?.user_name : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if username is available
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)
        .single()

      if (existing) {
        toast.error('Username already taken')
        setIsLoading(false)
        return
      }

      // Create user profile
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio,
        github_username: formData.github_username,
        avatar_url: user.user_metadata?.avatar_url,
      })

      if (error) throw error

      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
            required
            pattern="^[a-zA-Z0-9_-]+$"
            title="Username can only contain letters, numbers, underscores, and hyphens"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be your unique identifier on CodeCave
          </p>
        </div>

        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        {user.app_metadata?.provider !== 'github' && (
          <div>
            <Label htmlFor="github_username">GitHub Username (optional)</Label>
            <Input
              id="github_username"
              type="text"
              value={formData.github_username}
              onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
              placeholder="johndoe"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Profile...' : 'Complete Setup'}
      </Button>
    </form>
  )
}
```
