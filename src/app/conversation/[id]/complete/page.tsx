'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Mail, Calendar, ArrowRight } from 'lucide-react'
import { useConversationStore } from '@/stores/conversationStore'
import type { CompletionData } from '@/types/email'

export default function CompletionPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  
  const {
    generatedScope,
    clientSummary,
    intelligence,
    emailDeliveryStatus,
    downloadClientPDF
  } = useConversationStore()
  
  const [showConfetti, setShowConfetti] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true)
    
    // Track completion event
    trackCompletionEvent({
      conversationId,
      projectName: intelligence.businessName || intelligence.companyName || 'Unnamed',
      totalInvestment: generatedScope?.section13_investmentSummary.totalProjectInvestment || 0
    })
  }, [conversationId, intelligence, generatedScope])
  
  const completionData: CompletionData = {
    conversationId,
    projectName: generatedScope?.section1_executiveSummary.projectName || intelligence.businessName || intelligence.companyName || 'Your Project',
    clientName: intelligence.fullName || generatedScope?.section3_clientInformation.fullName || 'there',
    clientEmail: intelligence.email || generatedScope?.section3_clientInformation.email || '',
    totalInvestment: generatedScope?.section13_investmentSummary.totalProjectInvestment || 0,
    estimatedTimeline: generatedScope?.section12_timeline.estimatedDuration || '6-8 weeks',
    keyFeatures: clientSummary?.keyFeatures || [],
    nextSteps: clientSummary?.nextSteps || [
      'Review your project summary',
      'Schedule a consultation call with David',
      'Sign the project contract',
      'Submit initial deposit to begin development'
    ],
    davidContactInfo: {
      email: process.env.NEXT_PUBLIC_DAVID_EMAIL || 'david@applicreations.com',
      phone: process.env.NEXT_PUBLIC_DAVID_PHONE || '(555) 123-4567',
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/applicreations'
    }
  }
  
  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await downloadClientPDF()
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Confetti effect */}
      {showConfetti && <ConfettiAnimation />}
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You're All Set! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your project summary for <strong>{completionData.projectName}</strong> has been created and sent to your email.
          </p>
        </motion.div>
        
        {/* Email status cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Email to client */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Email Sent to You
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Check <strong>{completionData.clientEmail}</strong> for your project summary PDF
                </p>
                <EmailStatusBadge status={emailDeliveryStatus.client} />
              </div>
            </div>
          </div>
          
          {/* Email to David */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  David Has Been Notified
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Complete specifications sent to Applicreations
                </p>
                <EmailStatusBadge status={emailDeliveryStatus.david} />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Project summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Project Summary
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Investment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${completionData.totalInvestment.toLocaleString()}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Timeline</p>
              <p className="text-2xl font-bold text-gray-900">
                {completionData.estimatedTimeline}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Features</p>
              <p className="text-2xl font-bold text-gray-900">
                {completionData.keyFeatures.length}+ included
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download PDF Summary'}
          </button>
        </motion.div>
        
        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Happens Next?
          </h2>
          
          <div className="space-y-4">
            {completionData.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Schedule a consultation call with David to discuss your project timeline, answer any questions, and outline the next steps.
          </p>
          
          <a
            href={completionData.davidContactInfo.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            <Calendar className="w-6 h-6" />
            Schedule Your Consultation Call
            <ArrowRight className="w-5 h-5" />
          </a>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Have questions before scheduling?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${completionData.davidContactInfo.email}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {completionData.davidContactInfo.email}
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href={`tel:${completionData.davidContactInfo.phone.replace(/\D/g, '')}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {completionData.davidContactInfo.phone}
              </a>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-12 text-sm text-gray-500"
        >
          <p>
            This conversation was powered by Introspect, Applicreations' AI-driven client intake system.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// Email status badge component
function EmailStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    sent: {
      label: 'Sent successfully',
      color: 'text-green-700 bg-green-100 border-green-200'
    },
    pending: {
      label: 'Sending...',
      color: 'text-yellow-700 bg-yellow-100 border-yellow-200'
    },
    failed: {
      label: 'Retry in progress',
      color: 'text-red-700 bg-red-100 border-red-200'
    }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {status === 'sent' && <CheckCircle className="w-3 h-3" />}
      {config.label}
    </span>
  )
}

// Confetti animation component
function ConfettiAnimation() {
  if (typeof window === 'undefined') return null
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: Math.random() * 360
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 0.5,
            ease: 'linear'
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][i % 5]
          }}
        />
      ))}
    </div>
  )
}

// Analytics tracking
function trackCompletionEvent(data: Partial<CompletionData>) {
  // Track completion in analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversation_complete', {
      conversation_id: data.conversationId,
      project_name: data.projectName,
      total_investment: data.totalInvestment
    })
  }
}

