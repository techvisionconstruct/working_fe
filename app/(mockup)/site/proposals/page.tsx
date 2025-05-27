"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getProposals } from "@/query-options/proposals";
import { ProposalResponse } from "@/types/proposals/dto";
import { Header } from "@/components/mockup/proposal-page/header";
import { Filters } from "@/components/mockup/proposal-page/filters";
import { PlusCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProposalCard } from "@/components/mockup/proposal-page/proposal-card";

export default function ProposalsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isError, isPending } = useQuery(getProposals(currentPage, pageSize, searchQuery));
  const proposals = data?.data;
  const paginationMeta = data?.meta;
  const paginationLinks = data?.links;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!paginationMeta || newPage <= paginationMeta.total_pages)) {
      setCurrentPage(newPage);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Page Header */}

      <Header
        title="Proposals"
        description="Create and manage professional proposals for your clients."
      />

      {/* Proposal Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <Filters onSearch={handleSearch} />

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
          
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to{' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} proposals
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
          
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to{' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} proposals
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
          
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to{' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} proposals
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
          
          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(paginationMeta.current_page - 1) * paginationMeta.page_size + 1} to{' '}
                {Math.min(paginationMeta.current_page * paginationMeta.page_size, paginationMeta.total_count)} of{' '}
                {paginationMeta.total_count} proposals
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(paginationMeta.total_pages)}
                  disabled={currentPage === paginationMeta.total_pages || isPending}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
