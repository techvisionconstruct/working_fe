import React from 'react'

interface GoalsStepProps {
  value: { name: string }[]
  onChange: (value: { name: string }[]) => void
  onNext: () => void
  onPrev: () => void
}

const goalOptions = [
  'Increase team productivity',
  'Improve project delivery times',
  'Better resource management',
  'Enhanced team collaboration',
  'Streamline workflows',
  'Reduce operational costs',
  'Improve client satisfaction',
  'Better time management',
  'Increase transparency',
  'Scale business operations'
]

export default function GoalsStep({ value, onChange, onNext, onPrev }: GoalsStepProps) {
  const toggleGoal = (goal: string) => {
    const isSelected = value.some(item => item.name === goal)
    
    if (isSelected) {
      // Remove goal if already selected
      onChange(value.filter(item => item.name !== goal))
    } else {
      // Add goal
      onChange([...value, { name: goal }])
    }
  }

  const isSelected = (goal: string) => {
    return value.some(item => item.name === goal)
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
          What are your main goals?
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Select all that apply to define success for your team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start overflow-y-auto max-h-80">
        {goalOptions.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => toggleGoal(goal)}
            className={`w-full p-4 text-left rounded-lg border transition-all duration-300 group ${
              isSelected(goal)
                ? 'border-black bg-black text-white shadow-md'
                : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-wide">{goal}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected(goal) 
                  ? 'bg-white border-white' 
                  : 'border-gray-300 group-hover:border-gray-500'
              }`}>
                {isSelected(goal) && (
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