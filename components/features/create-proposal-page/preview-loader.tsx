"use client";

import React from "react";
import { Skeleton } from "@/components/shared";

export function ProposalPreviewLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="border rounded-md p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-6 w-2/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/4 mx-auto" />
          </div>

          {/* Description Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="border rounded-md p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Project Scope Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-1/3 mb-4" />

            {/* First Trade */}
            <div className="mb-6">
              <Skeleton className="h-5 w-1/4 mb-3" />
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <div className="p-2 border border-dashed rounded-md">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <div className="p-2 border border-dashed rounded-md">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Trade */}
            <div className="mb-6">
              <Skeleton className="h-5 w-1/4 mb-3" />
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <div className="p-2 border border-dashed rounded-md">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section Skeleton */}
          <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-5 w-1/2 mb-12" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </div>
              <div>
                <Skeleton className="h-5 w-1/2 mb-12" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
