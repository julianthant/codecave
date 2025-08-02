'use client'

import React, { memo, useState } from 'react'
import { 
  Menu, 
  Home, 
  Users, 
  MessageCircle, 
  Bookmark, 
  Settings, 
  User, 
  LogOut,
  HelpCircle,
  Moon,
  Bell,
  LogIn
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { SignInDrawer } from '@/components/auth/sign-in-drawer'
import Link from 'next/link'

export const MobileMenu = memo(function MobileMenu() {
  const { isAuthenticated, signOut } = useAuth()
  const [showSignInDrawer, setShowSignInDrawer] = useState(false)

  const handleAuthenticatedAction = (action: () => void) => {
    if (!isAuthenticated) {
      setShowSignInDrawer(true)
      return
    }
    action()
  }

  return (
    <>
      <div className="lg:hidden flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex justify-center items-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[hsl(25_95%_65%)] focus:ring-offset-2 transition-all duration-200 ease-in-out"
              aria-label="Open main menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <DropdownMenuLabel className="font-semibold text-gray-900">
              Menu
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Main Navigation */}
            <DropdownMenuItem className="flex items-center space-x-3 py-3">
              <Link href="/feed" className="flex items-center space-x-3 w-full">
                <Home className="w-5 h-5 text-gray-500" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center space-x-3 py-3 cursor-pointer"
              onClick={() => handleAuthenticatedAction(() => {})}
            >
              <Users className="w-5 h-5 text-gray-500" />
              <span>Friends</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center space-x-3 py-3 cursor-pointer"
              onClick={() => handleAuthenticatedAction(() => {})}
            >
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span>Messages</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center space-x-3 py-3 cursor-pointer"
              onClick={() => handleAuthenticatedAction(() => {})}
            >
              <Bookmark className="w-5 h-5 text-gray-500" />
              <span>Saved</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Account & Settings */}
            {isAuthenticated ? (
              <>
                <DropdownMenuItem className="flex items-center space-x-3 py-3">
                  <Link href="/profile" className="flex items-center space-x-3 w-full">
                    <User className="w-5 h-5 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 py-3 cursor-pointer"
                  onClick={() => handleAuthenticatedAction(() => {})}
                >
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center space-x-3 py-3">
                  <Link href="/settings" className="flex items-center space-x-3 w-full">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem 
                className="flex items-center space-x-3 py-3 cursor-pointer text-[hsl(25_95%_65%)] hover:text-[hsl(25_95%_55%)]"
                onClick={() => setShowSignInDrawer(true)}
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem className="flex items-center space-x-3 py-3">
              <Moon className="w-5 h-5 text-gray-500" />
              <span>Dark Mode</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Help & Support */}
            <DropdownMenuItem className="flex items-center space-x-3 py-3">
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            
            {isAuthenticated && (
              <DropdownMenuItem 
                className="flex items-center space-x-3 py-3 text-red-600 cursor-pointer"
                onClick={signOut}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <SignInDrawer 
        open={showSignInDrawer} 
        onOpenChange={setShowSignInDrawer}
        redirectTo="/feed"
      />
    </>
  )
})