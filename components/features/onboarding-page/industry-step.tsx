import React from 'react'

interface IndustryStepProps {
  value: { name: string }[]
  onChange: (value: { name: string }[]) => void
  onNext: () => void
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Marketing',
  'Consulting',
  'Other'
]

export default function IndustryStep({ value, onChange, onNext }: IndustryStepProps) {
  const maxSelections = 3

  const toggleIndustry = (industry: string) => {
    const isSelected = value.some(item => item.name === industry)
    
    if (isSelected) {
      // Remove industry if already selected
      onChange(value.filter(item => item.name !== industry))
    } else if (value.length < maxSelections) {
      // Add industry if under limit
      onChange([...value, { name: industry }])
    }
  }

  const isSelected = (industry: string) => {
    return value.some(item => item.name === industry)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length > 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What industries do you work in?
        </h2>
        <p className="text-gray-600">
          Select up to {maxSelections} industries that best describe your work
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {value.length} of {maxSelections} selected
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => toggleIndustry(industry)}
            disabled={!isSelected(industry) && value.length >= maxSelections}
            className={`p-4 text-left rounded-lg border-2 transition-all relative ${
              isSelected(industry)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : value.length >= maxSelections
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{industry}</span>
              {isSelected(industry) && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={value.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  )
}