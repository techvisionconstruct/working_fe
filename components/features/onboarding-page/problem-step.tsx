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
    <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-between">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-black tracking-tight">
          What challenges do you face?
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Select all that apply to your current workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start overflow-y-auto max-h-80">
        {problemOptions.map((problem) => (
          <button
            key={problem}
            type="button"
            onClick={() => toggleProblem(problem)}
            className={`w-full p-4 text-left rounded-lg border transition-all duration-300 group ${
              isSelected(problem)
                ? 'border-black bg-black text-white shadow-md'
                : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-wide">{problem}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected(problem) 
                  ? 'bg-white border-white' 
                  : 'border-gray-300 group-hover:border-gray-500'
              }`}>
                {isSelected(problem) && (
                  <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 text-muted-foreground rounded-full font-medium hover:text-foreground transition-colors text-sm tracking-wide"
        >
          Back
        </button>
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