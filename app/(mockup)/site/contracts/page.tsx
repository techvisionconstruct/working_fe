"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getContracts } from "@/queryOptions/contracts";
import { ContractResponse } from "@/types/contracts/dto";
import { Header } from "@/components/mockup/contract-page/header";
import { Filters } from "@/components/mockup/contract-page/filters";
import { ContractCard } from "@/components/mockup/contract-page/contract-card";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContractsPage() {
  const { data, isError, isPending } = useQuery(getContracts());
  const contracts = data?.data;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contracts based on search query
  const filteredContracts = contracts?.filter((contract: ContractResponse) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      contract.name.toLowerCase().includes(query) ||
      contract.description?.toLowerCase().includes(query) ||
      false
    );
  });

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Page Header */}

      <Header
        title="Contracts"
        description="Create and manage legally binding contracts for your projects."
      />

      {/* Contract Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <Filters />

        {/* All Contracts Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading contracts...
              </div>
            ) : filteredContracts && filteredContracts.length > 0 ? (
              filteredContracts.map((contract: ContractResponse) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {isError
                  ? "Error loading contracts"
                  : searchQuery
                  ? "No contracts match your search"
                  : "No contracts found"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Draft Contracts Tab */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading contracts...
              </div>
            ) : filteredContracts && filteredContracts.length > 0 ? (
              filteredContracts
                .filter(
                  (contract: ContractResponse) => contract.status === "draft"
                )
                .map((contract: ContractResponse) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                {searchQuery
                  ? "No draft contracts match your search"
                  : "No draft contracts found"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Sent Contracts Tab */}
        <TabsContent value="sent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading contracts...
              </div>
            ) : filteredContracts && filteredContracts.length > 0 ? (
              filteredContracts
                .filter(
                  (contract: ContractResponse) => contract.status === "sent"
                )
                .map((contract: ContractResponse) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                {searchQuery
                  ? "No sent contracts match your search"
                  : "No sent contracts found"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Signed Contracts Tab */}
        <TabsContent value="signed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isPending ? (
              <div className="col-span-full text-center py-10">
                Loading contracts...
              </div>
            ) : filteredContracts && filteredContracts.length > 0 ? (
              filteredContracts
                .filter(
                  (contract: ContractResponse) => contract.status === "signed"
                )
                .map((contract: ContractResponse) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                {searchQuery
                  ? "No signed contracts match your search"
                  : "No signed contracts found"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
