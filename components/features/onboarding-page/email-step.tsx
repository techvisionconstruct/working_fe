import React, { useState } from 'react'

interface EmailStepProps {
  value: string
  onChange: (value: string) => void
  onFinish: () => void
  onPrev: () => void
  isLoading?: boolean
}

export default function EmailStep({ value, onChange, onFinish, onPrev, isLoading = false }: EmailStepProps) {
  const [isValid, setIsValid] = useState(true)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value && validateEmail(value) && !isLoading) {
      setIsValid(true)
      onFinish()
    } else if (!validateEmail(value)) {
      setIsValid(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    onChange(email)
    if (email && !isValid) {
      setIsValid(validateEmail(email))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What's your email address?
        </h2>
        <p className="text-gray-600">
          We'll use this to send you important updates and notifications
        </p>
      </div>

      <div className="mb-8">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={value}
          onChange={handleEmailChange}
          disabled={isLoading}
          placeholder="Enter your email address"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            !isValid ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-red-600">
            Please enter a valid email address
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!value || isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Completing...
            </>
          ) : (
            'Complete Onboarding'
          )}
        </button>
      </div>
    </form>
  )
}