'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateProfile } from '@/hooks/use-profile'
import { toast } from 'sonner'
import type { Profile } from '@/db/schema'

interface BioEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile
}

export function BioEditModal({ isOpen, onClose, profile }: BioEditModalProps) {
  const [bio, setBio] = useState(profile.bio || '')
  const [hasChanges, setHasChanges] = useState(false)
  const updateProfile = useUpdateProfile()

  const maxLength = 500
  const remainingChars = maxLength - bio.length

  const handleBioChange = (value: string) => {
    if (value.length <= maxLength) {
      setBio(value)
      setHasChanges(value !== (profile.bio || ''))
    }
  }

  const handleSave = async () => {
    if (!hasChanges) {
      onClose()
      return
    }

    try {
      await updateProfile.mutateAsync({
        username: profile.username,
        updates: { bio: bio.trim() || null }
      })
      
      toast.success('Bio updated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to update bio:', error)
      toast.error('Failed to update bio. Please try again.')
    }
  }

  const handleCancel = () => {
    setBio(profile.bio || '')
    setHasChanges(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Bio</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Bio Input */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => handleBioChange(e.target.value)}
              placeholder="Tell the community about yourself, your interests, and what you're working on..."
              className="min-h-[120px] resize-none"
              disabled={updateProfile.isPending}
            />
            
            {/* Character Counter */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">
                Share your story with the community
              </span>
              <span className={`${
                remainingChars < 50 
                  ? remainingChars < 0 
                    ? 'text-red-500' 
                    : 'text-orange-500'
                  : 'text-gray-500'
              }`}>
                {remainingChars} characters remaining
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateProfile.isPending || remainingChars < 0}
              className="min-w-[100px]"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Bio
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}