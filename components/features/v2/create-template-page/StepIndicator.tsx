"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {index < currentStep ? <Check size={18} /> : index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${
                index <= currentStep ? "text-primary font-medium" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector line (except after last step) */}
          {index < steps.length - 1 && (
            <div
              className={`flex-grow h-1 mx-4 ${
                index < currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
