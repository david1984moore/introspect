'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useConversationStore } from '@/stores/conversationStore'

export default function ConversationPage() {
  const router = useRouter()
  const { userName, userEmail } = useConversationStore()
  
  useEffect(() => {
    // Redirect if no foundation data
    if (!userName || !userEmail) {
      router.push('/intake')
    }
  }, [userName, userEmail, router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Conversation Interface
        </h1>
        <p className="text-gray-600">
          Welcome, {userName}! Claude orchestration will be implemented here.
        </p>
        <p className="text-sm text-gray-500">
          Phase 3: Claude Integration
        </p>
      </div>
    </div>
  )
}

