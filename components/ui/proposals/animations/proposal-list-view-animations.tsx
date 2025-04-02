import React, { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ProposalsGridProps } from "@/types/proposals";
import { proposals } from "@/data/proposals";
import { AnimatedListItem } from "./proposal-grid-view-animations";

export default function ProposalListView({
  sortOption,
  searchQuery = "",
}: ProposalsGridProps) {
  const filteredAndSortedProposals = useMemo(() => {
    const filtered = searchQuery
      ? proposals.filter((proposal) =>
          proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : proposals;

    return [...filtered].sort((a, b) => {
      if (sortOption.value === "name-ascending") {
        return a.title.localeCompare(b.title);
      } else if (sortOption.value === "name-descending") {
        return b.title.localeCompare(a.title);
      } else if (sortOption.value === "date-ascending") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortOption.value === "date-descending") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });
  }, [sortOption, searchQuery]);
  
  return (
    <div className="space-y-1">
      {filteredAndSortedProposals.length > 0 ? (
        filteredAndSortedProposals.map((proposal, index) => (
          <AnimatedListItem key={proposal.id} index={index}>
            <div className={`border rounded-md p-4 ${
              index % 2 === 0 ? "bg-[#e8e8e8]" : "bg-white"
            }`}>
              <div className="font-bold text-xl">{proposal.title}</div>
              <div className="flex items-center justify-between mt-1 gap-x-8">
                <div className="text-sm text-black/50 line-clamp-3">
                  {proposal.description}
                </div>
                <ExternalLink className="h-8 w-8 mr-8" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {proposal.categories.slice(0, 4).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className={`font-bold uppercase text-xs ${
                          index % 2 === 0
                            ? "border border-black/30 text-black"
                            : "bg-none text-black"
                        }`}
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {proposal.categories.length > 4 && (
                      <Badge
                        variant="outline"
                        className={`font-bold uppercase text-xs ${
                          index % 2 === 0
                            ? "border border-black/30 text-black"
                            : "bg-none text-black"
                        }`}
                      >
                        +{proposal.categories.length - 4} more
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        index % 2 === 0
                          ? "border border-black/30 text-black"
                          : "bg-none text-black"
                      }`}
                    >
                      <span className="uppercase font-bold">Variables</span>
                      <span
                        className={`ml-1 h-4 w-4 rounded-sm text-xs flex items-center justify-center bg-black/50 text-primary-foreground`}
                      >
                        {proposal.variables?.length || 0}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        index % 2 === 0
                          ? "border border-black/30 text-black"
                          : "bg-none text-black"
                      }`}
                    >
                      <span className="uppercase font-bold">Categories</span>
                      <span
                       className={`ml-1 h-4 w-4 rounded-sm text-xs flex items-center justify-center bg-black/50 text-primary-foreground`}
                      >
                        {proposal.categories?.length || 0}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedListItem>
        ))
      ) : (
        <div className="col-span-3 py-8 text-center">
          <p className="text-lg font-medium">
            No proposals found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}