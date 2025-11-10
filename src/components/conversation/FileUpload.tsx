'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  id: string
  file: File
  preview?: string // For images
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  className?: string
}

export function FileUpload({
  files,
  onFilesChange,
  accept = 'image/*,.pdf,.ai,.eps,.svg,.psd,.sketch',
  maxSize = 50, // 50MB default
  maxFiles = 10,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setError(null)
    const newFiles: UploadedFile[] = []
    const fileArray = Array.from(selectedFiles)

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    fileArray.forEach((file) => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSize) {
        setError(`${file.name} exceeds ${maxSize}MB limit`)
        return
      }

      // Create preview for images
      const isImage = file.type.startsWith('image/')
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
      }

      if (isImage) {
        const reader = new FileReader()
        reader.onloadend = () => {
          uploadedFile.preview = reader.result as string
          newFiles.push(uploadedFile)
          onFilesChange([...files, ...newFiles])
        }
        reader.readAsDataURL(file)
      } else {
        newFiles.push(uploadedFile)
      }
    })

    if (newFiles.length > 0 && !fileArray.some((f) => f.type.startsWith('image/'))) {
      onFilesChange([...files, ...newFiles])
    }
  }

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    onFilesChange(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return Image
    }
    if (file.type === 'application/pdf') {
      return FileText
    }
    return File
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Drag and drop files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:underline font-medium"
            disabled={files.length >= maxFiles}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Accepted: Images, PDFs, AI, EPS, SVG, PSD, Sketch (max {maxSize}MB per file)
        </p>
        {files.length >= maxFiles && (
          <p className="text-xs text-red-500 mt-2">Maximum {maxFiles} files reached</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3"
        >
          {error}
        </motion.div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Uploaded files ({files.length}/{maxFiles})
            </p>
            <div className="grid grid-cols-1 gap-2">
              {files.map((uploadedFile) => {
                const Icon = getFileIcon(uploadedFile.file)
                return (
                  <motion.div
                    key={uploadedFile.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    {/* Preview or Icon */}
                    {uploadedFile.preview ? (
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(uploadedFile.id)}
                      className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

