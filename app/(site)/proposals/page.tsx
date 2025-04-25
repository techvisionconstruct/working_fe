"use client";

import { getProposals } from "@/api/client/proposals";
import { ProposalList } from "@/components/features/proposal-page/proposal-list-view";
import { ProposalGridView } from "@/components/features/proposal-page/proposal-grid-view";
import { Proposal } from "@/types/proposals";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
} from "@/components/shared";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import Link from "next/link";
import { ProposalLoader } from "@/components/features/proposal-page/loader";

declare global {
  interface Window {
    proposalTourEndCallback?: () => void;
    proposalTourCreateCallback?: () => void;
  }
}

export default function ProposalsPage() {
  const proposals = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
  });

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("grid");

  const filteredProposals = (proposals.data || []).filter(
    (proposal: Proposal) => {
      const searchMatch =
        proposal.name.toLowerCase().includes(search.toLowerCase()) ||
        proposal.description.toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    }
  );

  if (proposals.isLoading) {
    return <ProposalLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Proposal Library</div>
        <Link
          href="/proposals/create"
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
          <ProposalGridView proposals={filteredProposals} />
        </TabsContent>
        <TabsContent value="list">
          <ProposalList proposals={filteredProposals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
