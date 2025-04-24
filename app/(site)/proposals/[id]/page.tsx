"use client";

import React from "react";
import { getProposalById } from "@/api/client/proposals";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared";
import { ProposalDetails } from "@/components/features/proposal-page/proposal-details";
import { ContractDetails } from "@/components/features/proposal-page/contract-details";

export default function ProposalById() {
  const { id } = useParams();

  const proposal = useQuery({
    queryKey: ["proposal", id],
    queryFn: () => getProposalById(Number(id)),
  });

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
