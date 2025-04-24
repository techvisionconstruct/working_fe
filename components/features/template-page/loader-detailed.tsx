"use client";

import React from "react";
import { Skeleton } from "@/components/shared/skeleton/skeleton";

export function TemplateDetailedLoader() {
  return (
    <div className="p-0 mx-auto">
      {/* Hero image skeleton */}
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
      
      {/* Title and description skeletons */}
      <Skeleton className="h-10 w-3/4 mb-2" />
      <Skeleton className="h-6 w-full max-w-3xl mb-2" />
      <Skeleton className="h-6 w-5/6 max-w-3xl mb-2" />
      
      {/* Parameters section skeleton */}
      <div className="mt-8 w-full">
        <Skeleton className="h-6 w-36 mb-3" />
        <div className="flex flex-wrap gap-2 mb-4">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={`param-${index}`} className="h-7 w-32 rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Modules section skeleton */}
      <div className="mt-8 w-full">
        <Skeleton className="h-6 w-36 mb-3" />
        <div className="flex flex-col gap-4">
          {Array(3).fill(0).map((_, moduleIndex) => (
            <div 
              key={`module-${moduleIndex}`} 
              className="rounded-lg border border-border bg-muted/40 px-4 py-3"
            >
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-full mb-2" />
              
              {/* Template Elements skeleton */}
              <div className="ml-2 mt-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <div className="flex flex-col gap-2">
                  {Array(2).fill(0).map((_, elementIndex) => (
                    <div 
                      key={`element-${moduleIndex}-${elementIndex}`} 
                      className="flex items-center gap-3 p-4 rounded border bg-background"
                    >
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
