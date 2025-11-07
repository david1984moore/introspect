'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useConversationStore } from '@/stores/conversationStore'
import type { FoundationData } from '@/types/conversation'

// Validation schemas
const foundationSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Please enter a valid email'),
  userPhone: z.string().optional(),
  websiteType: z.enum(['business', 'personal', 'project', 'nonprofit', 'other']),
  otherDescription: z.string().optional(),
})

type FoundationFormData = z.infer<typeof foundationSchema>

const websiteTypes = [
  { value: 'business', label: 'Business Website', icon: '🏢' },
  { value: 'personal', label: 'Personal/Portfolio', icon: '👤' },
  { value: 'project', label: 'Project/Campaign', icon: '🚀' },
  { value: 'nonprofit', label: 'Non-Profit Organization', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '✨' },
]

export default function FoundationForm() {
  const router = useRouter()
  const { setFoundation } = useConversationStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FoundationFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNext = () => {
    // Validate current step
    let isValid = true
    const newErrors: Record<string, string> = {}

    if (currentStep === 1 && !formData.userName?.trim()) {
      newErrors.userName = 'Please enter your name'
      isValid = false
    }
    if (currentStep === 2 && !formData.userEmail?.trim()) {
      newErrors.userEmail = 'Please enter your email'
      isValid = false
    } else if (currentStep === 2 && formData.userEmail && !z.string().email().safeParse(formData.userEmail).success) {
      newErrors.userEmail = 'Please enter a valid email'
      isValid = false
    }

    setErrors(newErrors)
    
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = () => {
    try {
      const validated = foundationSchema.parse(formData)
      
      // Set foundation data
      const foundationData: FoundationData = {
        userName: validated.userName,
        userEmail: validated.userEmail,
        userPhone: validated.userPhone || '',
        websiteType: validated.websiteType === 'other' 
          ? validated.otherDescription || 'other'
          : validated.websiteType,
      }
      
      setFoundation(foundationData)
      
      // Navigate to conversation
      router.push('/intake/conversation')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-gray-600">
              Foundation Questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What's your name?
                  </h2>
                  <p className="text-gray-600">
                    Let's start with a proper introduction.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userName"
                    type="text"
                    placeholder="John Smith"
                    value={formData.userName || ''}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    onKeyDown={handleKeyPress}
                    className={errors.userName ? 'border-red-500' : ''}
                    autoFocus
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-500">{errors.userName}</p>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Hi {formData.userName}! What's your email?
                  </h2>
                  <p className="text-gray-600">
                    We'll send your project scope here.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.userEmail || ''}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    onKeyDown={handleKeyPress}
                    className={errors.userEmail ? 'border-red-500' : ''}
                    autoFocus
                  />
                  {errors.userEmail && (
                    <p className="text-sm text-red-500">{errors.userEmail}</p>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 3: Phone (Optional) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Phone number?
                  </h2>
                  <p className="text-gray-600">
                    Optional - for urgent updates only.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.userPhone || ''}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <Button onClick={handleNext} className="w-full">
                    Continue
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    variant="ghost" 
                    className="w-full"
                  >
                    Skip
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Website Type */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What kind of website are we building?
                  </h2>
                  <p className="text-gray-600">
                    This helps me ask the right questions.
                  </p>
                </div>
                
                <RadioGroup
                  value={formData.websiteType}
                  onValueChange={(value) => setFormData({ ...formData, websiteType: value as any })}
                >
                  {websiteTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3 mb-3">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label 
                        htmlFor={type.value}
                        className="flex items-center gap-2 cursor-pointer flex-1 p-3 
                                 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-base">{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {formData.websiteType === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Input
                      id="otherDescription"
                      type="text"
                      placeholder="Describe your project..."
                      value={formData.otherDescription || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        otherDescription: e.target.value 
                      })}
                      autoFocus
                    />
                  </motion.div>
                )}

                <Button 
                  onClick={handleNext} 
                  className="w-full"
                  disabled={!formData.websiteType}
                >
                  Start Conversation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
