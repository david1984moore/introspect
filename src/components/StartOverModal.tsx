'use client'

import { useEffect, useRef } from 'react'
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
import { AlertTriangle } from 'lucide-react'

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
      
      // Clear persisted storage FIRST to prevent rehydration
      try {
        localStorage.removeItem('introspect-v3-conversation')
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
      }
      
      // Reset all state (this will also save empty state to localStorage via persist middleware)
      reset()
      
      // Small delay to ensure state operations complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force a full page reload to landing page to ensure clean state
      window.location.href = '/'
    } catch (error) {
      console.error('Error during reset:', error)
      // Still try to redirect even if there's an error
      window.location.href = '/'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
              <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle>Start Over?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your progress and start a fresh session.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            ref={cancelButtonRef}
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Start Over
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

