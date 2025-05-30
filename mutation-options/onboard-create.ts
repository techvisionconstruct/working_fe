import { useMutation } from '@tanstack/react-query'
import { createOnboardingRequest } from '@/api-calls/onboarding/create-onboarding-request'

interface OnboardingData {
  user_industry: { name: string }[]
  user_problems: { name: string }[]
  user_goals: { name: string }[]
  email: string
}

interface OnboardingResponse {
  success: boolean
  message: string
  data?: any
}

export const useCreateOnboardingMutation = () => {
  return useMutation<OnboardingResponse, Error, OnboardingData>({
    mutationFn: createOnboardingRequest,
    onSuccess: (data) => {
      console.log('Onboarding created successfully:', data)
    },
    onError: (error) => {
      console.error('Failed to create onboarding:', error)
    },
  })
}

// Alternative with more customization options
export const useCreateOnboardingMutationWithOptions = (
  onSuccessCallback?: (data: OnboardingResponse) => void,
  onErrorCallback?: (error: Error) => void
) => {
  return useMutation<OnboardingResponse, Error, OnboardingData>({
    mutationFn: createOnboardingRequest,
    onSuccess: (data) => {
      console.log('Onboarding created successfully:', data)
      onSuccessCallback?.(data)
    },
    onError: (error) => {
      console.error('Failed to create onboarding:', error)
      onErrorCallback?.(error)
    },
  })
}