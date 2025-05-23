"use client";

import React from "react";
import { Check } from "lucide-react";

interface VerticalStepIndicatorProps {
  steps: string[];
  currentStep: number;
  onClick?: (stepIndex: number) => void;
  className?: string;
}

const VerticalStepIndicator: React.FC<VerticalStepIndicatorProps> = ({ 
  steps, 
  currentStep,
  onClick,
  className 
}) => {
  // Calculate progress percentage based on steps
  const progressPercentage = steps.length <= 1 
    ? 0 
    : (Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100;
  
  // Circle radius in pixels
  const circleRadius = 20;
  
  return (
    <div 
      className={` py-6 px-4 relative bg-gray-200 rounded-2xl ${className || ''}`}
      style={{ 
        '--circle-radius': `${circleRadius}px`,
      } as React.CSSProperties}
    >
      {/* Background line (vertical) */}
      <div 
        className="absolute w-1 bg-gray-300"
        style={{
          left: '20px',
          top: 'calc(var(--circle-radius) + 5%)',
          bottom: 'calc(var(--circle-radius) + 5%)',
          transform: 'translateX(350%)'
        }}
      />
      
      {/* Progress line (vertical) */}
      {currentStep > 0 && (
        <div 
          className="absolute w-1 bg-primary transition-all duration-300 ease-in-out"
          style={{
            left: '20px',
            top: 'calc(var(--circle-radius) + 5%)',
            height: `calc((100% - var(--circle-radius) * 2 - 10%) * ${progressPercentage / 100})`,
            transform: 'translateX(350%)'
          }}
        />
      )}
      
      {/* Step circles (vertical) */}
      <div className="flex flex-col justify-between h-full relative z-10">
        {steps.map((step, index) => (
          <div 
            key={step}
            className="flex items-center gap-3 mb-8 last:mb-0"
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
              className={`text-sm ${
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

export default VerticalStepIndicator;
