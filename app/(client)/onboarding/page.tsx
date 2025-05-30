'use client'

import React, { useState } from 'react'
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
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    user_industry: [], 
    user_problems: [],
    user_goals: [],
    email: ''
  })

  const createOnboardingMutation = useCreateOnboardingMutation()

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
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStep()}
        </div>

        {/* Error Display */}
        {createOnboardingMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              Error: {createOnboardingMutation.error?.message || 'Something went wrong'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
