'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Building, User, Rocket, Handshake, Sparkles } from 'lucide-react'
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
  { value: 'business', label: 'Business Website', icon: Building },
  { value: 'personal', label: 'Personal/Portfolio', icon: User },
  { value: 'project', label: 'Project/Campaign', icon: Rocket },
  { value: 'nonprofit', label: 'Non-Profit Organization', icon: Handshake },
  { value: 'other', label: 'Other', icon: Sparkles },
]

export default function FoundationForm() {
  const router = useRouter()
  const { setFoundation, userName, userEmail, userPhone, websiteType } = useConversationStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FoundationFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // Initialize form data from store on mount (only once)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      
      // Check if websiteType is a custom "other" description
      const validTypes = ['business', 'personal', 'project', 'nonprofit', 'other']
      const isCustomOther = websiteType && !validTypes.includes(websiteType)
      
      // Only initialize if store has data
      if (userName || userEmail || userPhone || websiteType) {
        setFormData({
          userName: userName || '',
          userEmail: userEmail || '',
          userPhone: userPhone || '',
          websiteType: isCustomOther ? 'other' : (websiteType || undefined),
          otherDescription: isCustomOther ? websiteType : undefined,
        })
        
        // Determine current step based on what data exists
        if (websiteType) {
          setCurrentStep(4)
        } else if (userPhone) {
          setCurrentStep(3)
        } else if (userEmail) {
          setCurrentStep(2)
        } else if (userName) {
          setCurrentStep(2)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - store values are stable

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
      // Save current step data to store before moving forward
      if (currentStep === 1 && formData.userName) {
        setFoundation({
          userName: formData.userName,
          userEmail: '',
          userPhone: '',
          websiteType: '',
        })
      } else if (currentStep === 2 && formData.userEmail) {
        setFoundation({
          userName: formData.userName || '',
          userEmail: formData.userEmail,
          userPhone: '',
          websiteType: '',
        })
      } else if (currentStep === 3) {
        setFoundation({
          userName: formData.userName || '',
          userEmail: formData.userEmail || '',
          userPhone: formData.userPhone || '',
          websiteType: '',
        })
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Clear errors when going back
      setErrors({})
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

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10)
    
    // Format based on length
    if (limitedDigits.length === 0) {
      return ''
    } else if (limitedDigits.length <= 3) {
      return `(${limitedDigits}`
    } else if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`
    } else {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Format the new value
    const formatted = formatPhoneNumber(newValue)
    
    // Count digits in formatted string to place cursor after last digit
    const digitCount = formatted.replace(/\D/g, '').length
    let newCursorPos = formatted.length
    
    // Find position right after the last digit
    if (digitCount > 0) {
      let digitIndex = 0
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digitIndex++
          if (digitIndex === digitCount) {
            newCursorPos = i + 1
            break
          }
        }
      }
    }
    
    setFormData({ ...formData, userPhone: formatted })
    
    // Restore cursor position after state update using double requestAnimationFrame for reliability
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const input = phoneInputRef.current || e.target
        if (input) {
          input.setSelectionRange(newCursorPos, newCursorPos)
        }
      })
    })
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key
    if (e.key === 'Enter') {
      handleNext()
      return
    }

    // Handle backspace - remove last digit
    if (e.key === 'Backspace' && formData.userPhone) {
      const digits = formData.userPhone.replace(/\D/g, '')
      if (digits.length > 0) {
        e.preventDefault()
        const newDigits = digits.slice(0, -1)
        const formatted = formatPhoneNumber(newDigits)
        setFormData({ ...formData, userPhone: formatted })
        // Set cursor position after formatting
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const input = phoneInputRef.current || e.currentTarget
            if (input) {
              const digitCount = formatted.replace(/\D/g, '').length
              let newPos = formatted.length
              if (digitCount > 0) {
                let digitIndex = 0
                for (let i = 0; i < formatted.length; i++) {
                  if (/\d/.test(formatted[i])) {
                    digitIndex++
                    if (digitIndex === digitCount) {
                      newPos = i + 1
                      break
                    }
                  }
                }
              }
              input.setSelectionRange(newPos, newPos)
            }
          })
        })
      } else if (formData.userPhone === '(') {
        // If only "(" remains, clear it
        e.preventDefault()
        setFormData({ ...formData, userPhone: '' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of 4
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
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

                <Button onClick={handleNext} type="button" className="w-full" size="lg">
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

                <div className="space-y-4">
                  <Button onClick={handleNext} type="button" className="w-full" size="lg">
                    Continue
                  </Button>
                  <button
                    onClick={handleBack}
                    type="button"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </button>
                </div>
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
                    ref={phoneInputRef}
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.userPhone || ''}
                    onChange={handlePhoneChange}
                    onKeyDown={handlePhoneKeyDown}
                    autoFocus
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Button onClick={handleNext} type="button" className="w-full" size="lg">
                      Continue
                    </Button>
                    <Button 
                      onClick={handleNext}
                      type="button"
                      variant="ghost" 
                      className="w-full"
                    >
                      Skip
                    </Button>
                  </div>
                  <button
                    onClick={handleBack}
                    type="button"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </button>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.websiteType) {
                    e.preventDefault()
                    handleNext()
                  }
                }}
                tabIndex={0}
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
                  {websiteTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <div key={type.value} className="flex items-center space-x-3 mb-3">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label 
                          htmlFor={type.value}
                          className="flex items-center gap-2 cursor-pointer flex-1 p-3 
                                   rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          <span className="text-base">{type.label}</span>
                        </Label>
                      </div>
                    )
                  })}
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
                      onKeyDown={handleKeyPress}
                      autoFocus
                    />
                  </motion.div>
                )}

                <div className="space-y-4">
                  <Button 
                    onClick={handleNext}
                    type="button"
                    className="w-full"
                    size="lg"
                    disabled={!formData.websiteType}
                  >
                    Start Conversation
                  </Button>
                  <button
                    onClick={handleBack}
                    type="button"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
