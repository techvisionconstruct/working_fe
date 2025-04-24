"use client";

import React from "react";
import { getProposalById } from "@/api/client/proposals";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared";
import { ProposalDetails } from "@/components/features/proposal-page/proposal-details";
import { ContractDetails } from "@/components/features/proposal-page/contract-details";
import { ProposalDetailedLoader } from "@/components/features/proposal-page/loader-detailed";

export default function ProposalById() {
  const { id } = useParams();

  const proposal = useQuery({
    queryKey: ["proposal", id],
    queryFn: () => getProposalById(Number(id)),
  });

  if (proposal.isLoading) {
    return <ProposalDetailedLoader />;
  }

  if (proposal.isError) {
    return (
      <div className="p-0 mx-auto">
        <div className="flex items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50">
          <div className="text-red-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Error loading proposal details. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  console.log(proposal.data);
  
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
        {proposal.data && <ProposalDetails proposal={proposal.data} />}
      </TabsContent>
      <TabsContent value="contract">
        {proposal.data && <ContractDetails proposal={proposal.data} />}
      </TabsContent>
    </Tabs>
  );
}
