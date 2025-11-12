'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Sparkles, Clock } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  // Clear reset flag when landing page loads (cleanup from Start Over)
  useEffect(() => {
    try {
      sessionStorage.removeItem('introspect-resetting')
    } catch (error) {
      // Ignore errors (sessionStorage might not be available in some environments)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - 70% whitespace principle */}
      <section className="container mx-auto px-4 pt-16 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* AI Signal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm"
          >
            <Brain className="w-4 h-4" />
            AI-Powered Discovery
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[3.157rem] leading-[1.1] font-semibold text-gray-900"
          >
            Transform Client Conversations into
            <span className="text-primary block mt-2">
              Complete Project Specifications
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[1.333rem] text-gray-600 max-w-2xl mx-auto"
          >
            Skip the sales calls. Our intelligent system gathers 100% of project 
            requirements through guided conversation, then generates complete 
            technical specifications and client proposals automatically.
          </motion.p>

          {/* CTA with Progressive Disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/intake">
              <Button size="lg" className="group">
                <span>Begin Your Project Discovery</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>15-20 minutes</span>
              <Sparkles className="w-4 h-4 ml-2" />
              <span>No forms, just conversation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Intelligent Orchestration',
                description: 'Not a chatbot. A systematic discovery process that adapts to your specific business model.',
                icon: Brain,
              },
              {
                title: 'Complete Specifications',
                description: '100% of required information gathered. No follow-up calls or clarification needed.',
                icon: Sparkles,
              },
              {
                title: 'Instant Documentation',
                description: 'Technical specs for developers. Business-friendly proposals for clients. Both generated automatically.',
                icon: Clock,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center space-y-3"
              >
                <feature.icon className="w-8 h-8 mx-auto text-primary" />
                <h3 className="text-[1.333rem] font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

