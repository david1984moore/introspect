'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useConversationStore } from '@/stores/conversationStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface StartOverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartOverModal({ open, onOpenChange }: StartOverModalProps) {
  const reset = useConversationStore((state) => state.reset)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the cancel button when modal opens (safer default - user must actively choose destructive action)
  useEffect(() => {
    if (open && cancelButtonRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleConfirm = async () => {
    try {
      // Close modal first
      onOpenChange(false)
      
      // Set a flag to indicate we're resetting (prevents conversation page effects from running)
      try {
        sessionStorage.setItem('introspect-resetting', 'true')
      } catch (error) {
        console.error('Failed to set sessionStorage flag:', error)
      }
      
      // Clear persisted storage FIRST to prevent rehydration
      try {
        localStorage.removeItem('introspect-v3-conversation')
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
      }
      
      // Redirect immediately BEFORE resetting state to prevent conversation page effects from running
      // Using window.location.replace ensures we don't add to history and prevents back button issues
      // The redirect happens synchronously, preventing any effects from reacting to state changes
      window.location.replace('/')
      
      // Reset state after redirect (will complete in background but won't affect navigation)
      reset()
    } catch (error) {
      console.error('Error during reset:', error)
      // Still try to redirect even if there's an error
      window.location.replace('/')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <DialogDescription className="text-center text-base">
            This will permanently delete all your progress and start a fresh session.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="w-full"
          >
            Start Over
          </Button>
          <Button
            ref={cancelButtonRef}
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

