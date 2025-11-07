import { create } from 'zustand'
import type { FoundationData } from '@/types/conversation'

interface ConversationState {
  // Foundation (Q1-4)
  userName: string
  userEmail: string
  userPhone: string
  websiteType: string
  
  // Actions
  setFoundation: (data: FoundationData) => void
  reset: () => void
}

export const useConversationStore = create<ConversationState>((set) => ({
  // Initial state
  userName: '',
  userEmail: '',
  userPhone: '',
  websiteType: '',
  
  // Actions
  setFoundation: (data) => {
    set({
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone || '',
      websiteType: typeof data.websiteType === 'string' ? data.websiteType : String(data.websiteType),
    })
  },
  
  reset: () => {
    set({
      userName: '',
      userEmail: '',
      userPhone: '',
      websiteType: '',
    })
  },
}))

