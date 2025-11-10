// Phase 10: API Endpoint for Conversation Completion
import { NextRequest, NextResponse } from 'next/server'
import { emailOrchestrator } from '@/lib/email/emailOrchestrator'
import type { ScopeDocument, ClientSummary } from '@/types/scope'
import type { EmailDelivery } from '@/types/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, scope, clientSummary } = body as {
      conversationId: string
      scope: ScopeDocument
      clientSummary: ClientSummary
    }
    
    if (!scope || !clientSummary) {
      return NextResponse.json(
        { error: 'Scope and client summary are required' },
        { status: 400 }
      )
    }
    
    // Send completion emails
    const { davidEmail, clientEmail } = await emailOrchestrator.sendCompletionEmails(
      scope,
      clientSummary,
      conversationId
    )
    
    const emailDeliveries: EmailDelivery[] = [davidEmail, clientEmail]
    
    // Save completion to database
    // TODO: Integrate with your database
    // await supabase.from('conversations').update({
    //   status: 'completed',
    //   completed_at: new Date().toISOString(),
    //   email_deliveries: emailDeliveries
    // }).eq('id', conversationId)
    
    // Track completion in analytics
    // TODO: Send to analytics platform
    
    return NextResponse.json({
      success: true,
      message: 'Conversation completed and emails sent',
      emailDeliveries
    })
    
  } catch (error) {
    console.error('Error completing conversation:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

