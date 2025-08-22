import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define route types
  const protectedRoutes = ['/onboarding']
  const authenticatedRoutes = [
    '/dashboard',
    '/connections',
    '/collaborations',
    '/settings',
    '/profile',
  ]

  const pathname = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthenticatedRoute = authenticatedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Special handling for /feed route - conditional access based on authentication
  if (pathname.startsWith('/feed')) {
    // Allow guest users (not authenticated) to access feed
    if (!user) {
      return supabaseResponse
    }
    
    // For authenticated users, check onboarding completion
    try {
      // Use edge function for database access
      const { data: profileData } =
        await supabase.functions.invoke('database-access', {
          body: {
            action: 'findProfile',
            userId: user.id,
          },
        })

      const profile = profileData?.profile

      // If authenticated user hasn't completed onboarding, redirect to onboarding
      if (!profile || !profile.onboarding_completed) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Middleware: Error checking profile for feed access:', error)
      // Allow access on database errors to prevent blocking users
    }
    
    // Allow access if user is authenticated and has completed onboarding
    return supabaseResponse
  }

  // Redirect unauthenticated users from protected/authenticated routes
  if (!user && (isProtectedRoute || isAuthenticatedRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Check profile for authenticated users on specific routes
  if (user && (isAuthenticatedRoute || pathname.startsWith('/onboarding'))) {
    try {
      // Use edge function for database access
      const { data: profileData } =
        await supabase.functions.invoke('database-access', {
          body: {
            action: 'findProfile',
            userId: user.id,
          },
        })

      const profile = profileData?.profile

      // Handle onboarding page - redirect completed users to feed
      if (pathname.startsWith('/onboarding')) {
        if (profile && profile.onboarding_completed) {
          const url = request.nextUrl.clone()
          url.pathname = '/feed'
          return NextResponse.redirect(url)
        }
      }

      // Handle authenticated routes - redirect users without profiles to onboarding
      if (isAuthenticatedRoute && !pathname.startsWith('/onboarding')) {
        if (!profile) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error('Middleware: Error checking profile:', error)
      // Allow access on database errors to prevent redirect loops
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
