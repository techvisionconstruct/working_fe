import React from 'react'

interface ProblemsStepProps {
  value: { name: string }[]
  onChange: (value: { name: string }[]) => void
  onNext: () => void
  onPrev: () => void
}

const problemOptions = [
  'Project management inefficiency',
  'Team communication issues',
  'Time tracking difficulties',
  'Resource allocation problems',
  'Deadline management',
  'Client communication',
  'Budget tracking',
  'Task prioritization',
  'Team collaboration',
  'Progress reporting'
]

export default function ProblemsStep({ value, onChange, onNext, onPrev }: ProblemsStepProps) {
  const toggleProblem = (problem: string) => {
    const isSelected = value.some(item => item.name === problem)
    
    if (isSelected) {
      // Remove problem if already selected
      onChange(value.filter(item => item.name !== problem))
    } else {
      // Add problem
      onChange([...value, { name: problem }])
    }
  }

  const isSelected = (problem: string) => {
    return value.some(item => item.name === problem)
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
          What problems does our app help you solve?
        </h2>
        <p className="text-gray-600">
          Select all that apply (choose at least one)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {problemOptions.map((problem) => (
          <button
            key={problem}
            type="button"
            onClick={() => toggleProblem(problem)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              isSelected(problem)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                isSelected(problem) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {isSelected(problem) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {problem}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
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