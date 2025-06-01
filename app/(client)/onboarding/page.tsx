'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCreateOnboardingMutation } from '@/mutation-options/onboard-create'
import IndustryStep from '@/components/features/onboarding-page/industry-step'
import ProblemsStep from '@/components/features/onboarding-page/problem-step'
import GoalsStep from '@/components/features/onboarding-page/goals-step'
import EmailStep from '@/components/features/onboarding-page/email-step'

interface OnboardingData {
  user_industry: { name: string }[]
  user_problems: { name: string }[]
  user_goals: { name: string }[]
  email: string
}

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    user_industry: [], 
    user_problems: [],
    user_goals: [],
    email: ''
  })

  const createOnboardingMutation = useCreateOnboardingMutation()

  // Read email from URL parameters and update data state
  useEffect(() => {
    const emailFromUrl = searchParams.get('email')
    if (emailFromUrl) {
      setData(prev => ({ ...prev, email: emailFromUrl }))
    }
  }, [searchParams])

  const totalSteps = 4

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleFinish = async () => {
    try {
      const result = await createOnboardingMutation.mutateAsync(data)
      
      if (result.success) {
        console.log('Onboarding completed successfully:', result.data)
        // Redirect to dashboard or next page
        // router.push('/dashboard')
      } else {
        console.error('Onboarding failed:', result.message)
        // Handle error (show toast, etc.)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IndustryStep
            value={data.user_industry}
            onChange={(value) => updateData('user_industry', value)}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <ProblemsStep
            value={data.user_problems}
            onChange={(value) => updateData('user_problems', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <GoalsStep
            value={data.user_goals}
            onChange={(value) => updateData('user_goals', value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <EmailStep
            value={data.email}
            onChange={(value) => updateData('email', value)}
            onFinish={handleFinish}
            onPrev={prevStep}
            isLoading={createOnboardingMutation.isPending}
          />        )
      default:
        return null
    }
  }
  return (    <div className="h-screen flex flex-col">
      <div className="max-w-4xl mx-auto px-6 flex flex-col h-full">
        {/* Progress Indicator */}
        <div className="pt-8 pb-6 flex-shrink-0">
          <div className="flex justify-center items-center mb-3">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i + 1 <= currentStep ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center px-4 pb-16">
          {renderStep()}
        </div>        {/* Error Display */}
        {createOnboardingMutation.isError && (
          <div className="pb-12 flex-shrink-0 text-center">
            <p className="text-sm font-medium text-red-500">
              {createOnboardingMutation.error?.message || 'Something went wrong'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
