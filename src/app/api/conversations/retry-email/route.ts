// Phase 10: API Endpoint for Email Retry
import { NextRequest, NextResponse } from 'next/server'
import { emailOrchestrator } from '@/lib/email/emailOrchestrator'
import type { ScopeDocument, ClientSummary } from '@/types/scope'
import type { EmailDelivery } from '@/types/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, recipientType, scope, clientSummary } = body as {
      conversationId: string
      recipientType: 'client' | 'david'
      scope: ScopeDocument
      clientSummary: ClientSummary
    }
    
    if (!scope || !clientSummary) {
      return NextResponse.json(
        { error: 'Scope and client summary are required' },
        { status: 400 }
      )
    }
    
    let delivery: EmailDelivery
    
    if (recipientType === 'david') {
      const attachment = emailOrchestrator.generateScopeMdAttachment(scope)
      delivery = await emailOrchestrator.sendScopeMdToDavid(
        scope,
        conversationId,
        attachment
      )
    } else {
      const attachment = await emailOrchestrator.generateClientPdfAttachment(clientSummary)
      delivery = await emailOrchestrator.sendClientSummary(
        scope,
        clientSummary,
        attachment
      )
    }
    
    return NextResponse.json({
      success: true,
      delivery
    })
    
  } catch (error) {
    console.error('Error retrying email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

