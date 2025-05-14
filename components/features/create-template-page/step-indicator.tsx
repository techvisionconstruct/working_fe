"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onClick?: (stepIndex: number) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep,
  onClick,
  className 
}) => {
  // Calculate progress percentage based on steps
  const progressPercentage = steps.length <= 1 
    ? 0 
    : (Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100;
  
  // Circle radius in pixels (half of w-10 which is 2.5rem or 40px)
  const circleRadius = 20;
  
  return (
    <div 
      className={`max-w-4xl mx-auto relative ${className || ''}`}
      style={{ 
        '--circle-radius': `${circleRadius}px`,
      } as React.CSSProperties}
    >
      {/* Background line with adjusted offset */}
      <div 
        className="absolute h-1 bg-gray-300"
        style={{
          top: '20px',
          left: 'calc(var(--circle-radius) + 5%)',
          right: 'calc(var(--circle-radius) - 1%)', // Extend further right by reducing right offset
          transform: 'translateY(-50%)'
        }}
      />
      
      {/* Progress line with matching horizontal positioning */}
      {currentStep > 0 && (
        <div 
          className="absolute h-1 bg-primary transition-all duration-300 ease-in-out"
          style={{
            top: '20px',
            left: 'calc(var(--circle-radius) + 5%)',
            width: `calc((100% - var(--circle-radius) * 2 - 4%) * ${progressPercentage / 100})`, // Adjusted width calculation
            transform: 'translateY(-50%)'
          }}
        />
      )}
      
      {/* Step circles */}
      <div className="flex justify-between w-full relative z-10">
        {steps.map((step, index) => (
          <div 
            key={step}
            className="flex flex-col items-center"
            onClick={() => onClick && onClick(index)}
            style={{cursor: onClick ? 'pointer' : 'default'}}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                index <= currentStep
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-300 text-gray-400"
              } ${index === currentStep ? "ring-4 ring-primary/20" : ""}`}
            >
              {index < currentStep ? <Check size={18} /> : index + 1}
            </div>
            <span
              className={`mt-2 text-sm text-center ${
                index <= currentStep ? "text-primary font-medium" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
