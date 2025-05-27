"use client";

import React from "react";
import { Skeleton } from "@/components/shared/skeleton/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared";
import { Button } from "@/components/shared";

export function ProposalDetailedLoader() {
  return (
    <Tabs defaultValue="proposal" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="proposal" className="flex-1">
          Proposal Details
        </TabsTrigger>
        <TabsTrigger value="contract" className="flex-1">
          Contract Details
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="proposal">
        {/* Hero image skeleton */}
        <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
              <div className="flex-1 min-w-0">
                {/* Title and description skeletons */}
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-full max-w-3xl mb-2" />
                <Skeleton className="h-6 w-5/6 max-w-3xl mb-2" />
                
                {/* Parameters section skeleton */}
                <div className="mt-4 w-full">
                  <Skeleton className="h-6 w-36 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array(5).fill(0).map((_, index) => (
                      <Skeleton key={`param-${index}`} className="h-7 w-32 rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-[380px] flex-shrink-0">
                {/* Action Buttons skeleton */}
                <div className="flex gap-2 mb-4 justify-end">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-36" />
                </div>
                
                {/* Client Details skeleton */}
                <div className="my-0 p-4 rounded-lg border bg-muted/30">
                  <Skeleton className="h-6 w-40 mb-3" />
                  <div className="grid grid-cols-1 gap-y-2 text-sm">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modules section skeleton */}
            <div className="mt-8 w-full">
              <Skeleton className="h-6 w-36 mb-3" />
              <div className="flex flex-col gap-4 w-full">
                {Array(3).fill(0).map((_, moduleIndex) => (
                  <div 
                    key={`module-${moduleIndex}`} 
                    className="rounded-lg border border-border bg-muted/40 px-4 py-3 w-full"
                  >
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-full mb-2" />
                    
                    {/* Elements section skeleton */}
                    <div className="ml-2 mt-2 w-full">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <div className="flex flex-col gap-2 w-full">
                        {Array(2).fill(0).map((_, elementIndex) => (
                          <div 
                            key={`element-${moduleIndex}-${elementIndex}`} 
                            className="flex items-center gap-3 p-4 rounded border bg-background w-full"
                          >
                            <div className="flex-1 min-w-0">
                              <Skeleton className="h-5 w-40 mb-1" />
                              <Skeleton className="h-4 w-full mb-1" />
                              <Skeleton className="h-4 w-3/4 mt-1" />
                              <Skeleton className="h-4 w-3/4 mt-1" />
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
        </div>
      </TabsContent>
      
      <TabsContent value="contract">
        <div className="max-w-3xl mx-auto mt-8">
          <div className="my-0 p-6 rounded-lg border bg-muted/30">
            <Skeleton className="h-8 w-72 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
