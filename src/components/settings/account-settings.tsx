'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Shield, 
  Key, 
  Calendar,
  Mail,
  AlertTriangle,
  Github,
  Chrome,
  Trash2,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Mock data
const mockAccountData = {
  email: 'johndoe@example.com',
  accountCreated: '2024-01-15',
  lastSignIn: '2024-08-18',
  connectedAccounts: [
    {
      provider: 'github',
      name: 'GitHub',
      email: 'johndoe@example.com',
      connected: true,
      avatar: 'https://github.com/johndoe.png',
      icon: Github
    },
    {
      provider: 'google',
      name: 'Google',
      email: 'johndoe@gmail.com',
      connected: true,
      avatar: null,
      icon: Chrome
    }
  ]
}

export function AccountSettings() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleConnectAccount = (provider: string) => {
    toast.success(`${provider} account connected successfully!`)
  }

  const handleDisconnectAccount = (provider: string) => {
    toast.success(`${provider} account disconnected successfully!`)
  }

  const handleDeleteAccount = () => {
    // This would normally show a more complex flow
    toast.error('Account deletion is currently unavailable. Please contact support.')
    setShowDeleteDialog(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and security information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Email Address</span>
                </div>
                <p className="text-sm text-gray-600">{mockAccountData.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Member Since</span>
                </div>
                <p className="text-sm text-gray-600">{formatDate(mockAccountData.accountCreated)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Key className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Last Sign In</span>
                </div>
                <p className="text-sm text-gray-600">{formatDate(mockAccountData.lastSignIn)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-gray-700">Account Status</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Key className="mr-2 inline h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage your connected social accounts and authentication methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAccountData.connectedAccounts.map((account) => {
              const Icon = account.icon
              return (
                <div
                  key={account.provider}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {account.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={account.avatar} alt={account.name} />
                          <AvatarFallback>
                            <Icon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      {account.connected && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{account.name}</p>
                        {account.connected && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{account.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {account.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectAccount(account.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnectAccount(account.name)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Connect
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="mt-1 text-sm text-gray-500">
                Add an extra layer of security to your account.
              </p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => toast.info('Two-factor authentication setup coming soon!')}
              >
                <Key className="mr-2 h-4 w-4" />
                Setup 2FA
              </Button>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-gray-900">Data Privacy</h4>
              <p className="mt-1 text-sm text-gray-500">
                Control how your data is used and shared.
              </p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => toast.info('Privacy settings coming soon!')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">
            <AlertTriangle className="mr-2 inline h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">Delete Account</h4>
                <p className="mt-1 text-sm text-red-600">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Delete Account</span>
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      Are you absolutely sure you want to delete your account? This will permanently delete:
                      <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                        <li>Your profile and all personal information</li>
                        <li>All your projects and posts</li>
                        <li>Your collaboration history</li>
                        <li>All associated data and settings</li>
                      </ul>
                      <p className="mt-3 font-medium text-red-600">
                        This action cannot be undone.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}