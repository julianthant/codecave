'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
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
  onSave,
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
            Upload a new cover photo for your profile. Recommended size:
            1200x400px
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Image */}
          <div className="relative bg-gray-100 rounded-lg h-48 overflow-hidden">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Cover preview"
                fill
                className="object-cover"
              />
            ) : currentCoverUrl ? (
              <Image
                src={currentCoverUrl}
                alt="Current cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 w-full h-full" />
            )}

            {/* Upload overlay */}
            <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={triggerFileInput}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Camera className="mr-2 w-4 h-4" />
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
            className="hover:bg-orange-50 p-8 border-2 border-gray-300 hover:border-orange-400 border-dashed rounded-lg text-center transition-colors cursor-pointer"
          >
            <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <h3 className="mb-2 font-medium text-gray-900 text-lg">
              Choose a new cover photo
            </h3>
            <p className="text-gray-500 text-sm">
              PNG, JPG, GIF up to 5MB. Recommended: 1200x400px
            </p>
          </motion.div>

          {/* Selected file info */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-green-50 p-4 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 text-sm">
                    {selectedFile.name}
                  </p>
                  <p className="text-green-600 text-xs">
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
                className="hover:bg-green-100 text-green-600 hover:text-green-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end items-center space-x-3 pt-4 border-t">
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
                  <div className="mr-2 border-white border-b-2 rounded-full w-4 h-4 animate-spin" />
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
