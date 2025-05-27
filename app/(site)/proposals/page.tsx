"use client";

import { ProposalList } from "@/components/features/proposal-page/proposal-list-view";
import { ProposalGridView } from "@/components/features/proposal-page/proposal-grid-view";
import { ProposalLoader } from "@/components/features/proposal-page/loader";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Button,
} from "@/components/shared";
import { LayoutGrid, List, Search, Plus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { ProposalTour } from "@/components/features/tour-guide/proposal-tour";
import { getProposals } from "@/query-options/proposals";
import { AlertError } from "@/components/features/alert-error/alert-error";

export default function ProposalsPage() {
  const [tab, setTab] = useState("grid");
  const [search, setSearch] = useState("");
  const [isTourRunning, setIsTourRunning] = useState(false);

  const {
    data: proposals,
    isError,
    isPending,
  } = useQuery(getProposals());

  const startTour = () => {
    setIsTourRunning(true);
  };

  if (isPending) {
    return <ProposalLoader />;
  }

  if (isError) {
    return <AlertError resource="proposals" />;
  }

  const proposalData = proposals?.data || [];

  return (
    <div id="content">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Proposal Library</div>
        <Link
          href="/proposals/create"
          id="new-proposal"
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
          <Input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <span className="absolute left-2 top-2.5 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4 ml-1" />
          </span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="w-auto">
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
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsContent value="grid">
          <ProposalGridView proposals={proposalData} />
        </TabsContent>
        <TabsContent value="list">
          <ProposalList proposals={proposalData} />
        </TabsContent>
      </Tabs>

      {/* Tour guide component */}
      <ProposalTour isRunning={isTourRunning} setIsRunning={setIsTourRunning} />

      {/* Floating help button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={startTour}
          variant="secondary"
          className="rounded-full w-12 h-12 shadow-lg bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-gray-200"
          aria-label="Start tour guide"
        >
          <HelpCircle size={24} />
        </Button>
      </div>
    </div>
  );
}
