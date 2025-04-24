"use client";

import React from "react";
import { Skeleton } from "@/components/shared/skeleton/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent, Input } from "@/components/shared";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import Link from "next/link";

export function ProposalLoader() {
  const tab = "grid";
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Proposal Library</div>
        <Link
          href="/templates/create"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Create Proposal
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <div className="text-sm text-muted-foreground">
      Your personal library of proposals. Manage and review your project
        proposals easily.
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-4">
        <div className="relative flex-1 max-w-md w-full">
          <Skeleton className="h-10 w-full rounded-md" />
          <span className="absolute left-2 top-2.5 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4 ml-1" />
          </span>
        </div>
        <Tabs value={tab} className="w-auto">
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={tab} className="w-full">
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="h-full">
                <div className="flex flex-col p-4 hover:shadow-lg transition-shadow h-full rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mt-1" />
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto pt-4">
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-5">
            <div className="rounded-md border">
              {Array(6).fill(0).map((_, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 transition-colors cursor-pointer ${
                    index !== 5 && "border-b"
                  } ${index % 2 === 0 && "bg-muted/50"}`}
                >
                  <Skeleton className="w-20 h-30 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
