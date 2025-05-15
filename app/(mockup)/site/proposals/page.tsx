"use client";

import React from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getProposals } from "@/queryOptions/proposals";
import { ProposalResponse } from "@/types/proposals/dto";
import { Header } from "@/components/mockup/proposal-page/header";
import { Filters } from "@/components/mockup/proposal-page/filters";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProposalCard } from "@/components/mockup/proposal-page/proposal-card";

export default function ProposalsPage() {
  const { data, isError, isPending } = useQuery(getProposals());
  const proposals = data?.data;

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Page Header */}

      <Header
        title="Proposals"
        description="Create and manage professional proposals for your clients."
      />

      {/* Proposal Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <Filters />

        {/* All Proposals Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading proposals...
              </div>
            ) : proposals && proposals.length > 0 ? (
              proposals.map((proposal: ProposalResponse) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {isError ? "Error loading proposals" : "No proposals found"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Draft Proposals Tab */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading proposals...
              </div>
            ) : proposals && proposals.length > 0 ? (
              proposals
                .filter(
                  (proposal: ProposalResponse) => proposal.status === "draft"
                )
                .map((proposal: ProposalResponse) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                No draft proposals found
              </div>
            )}
          </div>
        </TabsContent>

        {/* Sent Proposals Tab */}
        <TabsContent value="sent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading proposals...
              </div>
            ) : proposals && proposals.length > 0 ? (
              proposals
                .filter(
                  (proposal: ProposalResponse) => proposal.status === "sent"
                )
                .map((proposal: ProposalResponse) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                No sent proposals found
              </div>
            )}
          </div>
        </TabsContent>

        {/* Approved Proposals Tab */}
        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading proposals...
              </div>
            ) : proposals && proposals.length > 0 ? (
              proposals
                .filter(
                  (proposal: ProposalResponse) => proposal.status === "approved"
                )
                .map((proposal: ProposalResponse) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                No approved proposals found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
