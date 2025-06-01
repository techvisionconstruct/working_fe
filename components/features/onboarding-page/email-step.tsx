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
    <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-between">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-black tracking-tight">
          What's your email address?
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          We'll use this for important updates and notifications
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4 flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          <input
            type="email"
            id="email"
            value={value}
            onChange={handleEmailChange}
            disabled={isLoading}
            placeholder="Enter your email address"
            className={`w-full px-0 py-4 text-lg font-light text-center border-0 border-b-2 bg-transparent focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-gray-300 ${
              !isValid 
                ? 'border-red-400 text-red-600' 
                : 'border-gray-200 focus:border-black text-black'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          />
          {!isValid && (
            <p className="text-center text-sm font-medium text-red-500">
              Please enter a valid email address
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isLoading}
          className="px-6 py-3 text-muted-foreground rounded-full font-medium hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!value || isLoading}
          className="px-10 py-3 bg-black text-white rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-all duration-200 flex items-center text-sm tracking-wide"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Completing...
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      </div>
    </form>
  )
}