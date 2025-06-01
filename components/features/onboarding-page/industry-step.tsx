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
    <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-between">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-light text-black tracking-tight">What industries do you work in?</h3>
        <p className="text-sm text-muted-foreground">
          Select up to {maxSelections} industries
        </p>
        <div className="flex justify-center items-center space-x-1 pt-1">
          {Array.from({ length: maxSelections }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < value.length ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => toggleIndustry(industry)}
            disabled={!isSelected(industry) && value.length >= maxSelections}
            className={`group relative p-4 text-center rounded-md border transition-all duration-300 ${
              isSelected(industry)
                ? 'border-black bg-black text-white shadow-md'
                : value.length >= maxSelections
                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:shadow-sm'
            }`}
          >
            <span className="text-sm font-medium">{industry}</span>
            {isSelected(industry) && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={value.length === 0}
          className="px-10 py-3 bg-black text-white rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-all duration-200 text-sm tracking-wide"
        >
          Continue
        </button>
      </div>
    </form>
  )
}