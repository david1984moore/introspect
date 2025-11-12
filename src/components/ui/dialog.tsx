'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './button'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface DialogFooterProps {
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/50"
          />
          {/* Content */}
          {children}
        </>
      )}
    </AnimatePresence>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-lg bg-white rounded-lg shadow-lg border border-gray-200 p-6 pointer-events-auto ${className}`}
        >
          {children}
        </motion.div>
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ children, className = '' }: DialogHeaderProps) => {
  return <div className={`mb-6 pt-2 ${className}`}>{children}</div>
}

const DialogTitle = ({ children, className = '' }: DialogTitleProps) => {
  return <h2 className={`text-xl font-semibold text-gray-900 leading-tight ${className}`}>{children}</h2>
}

const DialogDescription = ({ children, className = '' }: DialogDescriptionProps) => {
  return <p className={`text-sm text-gray-600 mt-2 leading-relaxed ${className}`}>{children}</p>
}

const DialogFooter = ({ children }: DialogFooterProps) => {
  return <div className="flex flex-col items-center justify-center gap-3 mt-6">{children}</div>
}

const DialogClose = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Close dialog"
    >
      <X className="h-4 w-4 text-gray-500" />
      <span className="sr-only">Close</span>
    </button>
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}

