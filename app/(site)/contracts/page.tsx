"use client";

import { getAllContracts } from "@/api-calls/contracts/get-all-contracts";
import { getAllProposals } from "@/api-calls/proposals/get-all-proposals";
import { ContractList } from "@/components/features/contract-page/contract-list-view";
import { ContractGridView } from "@/components/features/contract-page/contract-grid-view";
import { ContractLoader } from "@/components/features/contract-page/loader";
import { ContractTour } from "@/components/features/tour-guide/contract-tour";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { getContracts } from "@/query-options/contracts";
import { getProposals } from "@/query-options/proposals";

export default function ContractsPage() {
  const router = useRouter();
  const { data: contractData, isError: contractIsError, isLoading: contractIsLoading } = useQuery(getContracts());

  const { data: proposalData, isError: proposalIsError, isLoading: proposalIsLoading } = useQuery(getProposals());
  console.log("Proposal Data", proposalData);
  console.log("Contract Data", contractData);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("grid");
  const [showTour, setShowTour] = useState(false);

  // Check if user has seen tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenContractsTour");
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleContractClick = useCallback(
    (contractUuid: string) => {
      if (proposalData.data && proposalData.data.length > 0) {
        const matchingProposal = proposalData.data.find(
          (proposal: any) => proposal.contract?.uuid === contractUuid
        );
        if (matchingProposal) {
          router.push(`/proposals/${matchingProposal.id}/contract`);
          return;
        }
      }
    },
    [proposalData?.data, router]
  );

  const filteredContracts = (
    Array.isArray(contractData?.data) ? contractData?.data : []
  ).filter((contract: any) => {
    const searchMatch =
      contract.name?.toLowerCase().includes(search.toLowerCase()) ||
      contract.description?.toLowerCase().includes(search.toLowerCase())
    return searchMatch;
  });

  const filteredProposals = (
    Array.isArray(proposalData?.data) ? proposalData?.data : []
  ).filter((proposal: any) => {
    const searchMatch =
      proposal.name?.toLowerCase().includes(search.toLowerCase()) ||
      proposal.description?.toLowerCase().includes(search.toLowerCase()) ||
      proposal.contract?.name?.toLowerCase().includes(search.toLowerCase()) ||
      proposal.contract?.description?.toLowerCase().includes(search.toLowerCase())
      proposal.client_name?.toLowerCase().includes(search.toLowerCase())
    return searchMatch;
  })

  const startTour = () => {
    setShowTour(true);
  };

  if (contractIsLoading || proposalIsLoading) {
    return <ContractLoader />;
  }

  if (contractIsError || proposalIsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error loading contracts</div>
      </div>
    );
  }

  return (
    <div>
      {/* Contract Tour */}
      <ContractTour isRunning={showTour} setIsRunning={setShowTour} />

      <div id="content">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Contracts</div>
          <div className="flex gap-2">
            <Link
              href="/proposals"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Create Contract
              <Plus className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Manage all your client contracts in one place. Track status, access
          details, and keep your agreements organized.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-4">
          <div className="relative flex-1 max-w-md w-full">
            <Input
              type="text"
              placeholder="Search contracts..."
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
            <ContractGridView
              contracts={filteredContracts}
              proposals={filteredProposals}
              onContractClick={handleContractClick}
            />
          </TabsContent>
          <TabsContent value="list">
            <ContractList
              contracts={filteredContracts}
              onContractClick={handleContractClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tour guide button - bottom right floating */}
      {!showTour && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={startTour}
            variant="secondary"
            className="rounded-full w-12 h-12 shadow-lg bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-gray-200"
            title="Start tour guide"
          >
            <HelpCircle size={24} />
          </Button>
        </div>
      )}
    </div>
  );
}
