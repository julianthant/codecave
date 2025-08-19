'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CoverPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  currentCoverUrl?: string
  onSave: (file: File) => Promise<void>
}

export function CoverPhotoModal({ 
  isOpen, 
  onClose, 
  currentCoverUrl,
  onSave 
}: CoverPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleSave = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    
    try {
      await onSave(selectedFile)
      toast.success('Cover photo updated successfully!')
      handleClose()
    } catch (error) {
      toast.error('Failed to update cover photo')
      console.error('Cover photo upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Cover Photo</DialogTitle>
          <DialogDescription>
            Upload a new cover photo for your profile. Recommended size: 1200x400px
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Image */}
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : currentCoverUrl ? (
              <img
                src={currentCoverUrl}
                alt="Current cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600" />
            )}
            
            {/* Upload overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={triggerFileInput}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Area */}
          <motion.div
            onClick={triggerFileInput}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Choose a new cover photo
            </h3>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 5MB. Recommended: 1200x400px
            </p>
          </motion.div>

          {/* Selected file info */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                  }
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFile || isUploading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                'Save Cover Photo'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}