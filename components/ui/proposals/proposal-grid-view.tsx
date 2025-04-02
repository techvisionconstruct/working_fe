import React, { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import Link from "next/link";
import { ProposalsGridProps } from "@/types/proposals";
import { proposals } from "@/data/proposals";
import { AnimatedCard } from "./animations/proposal-grid-view-animations";

export default function ProposalGridView({ sortOption, searchQuery = "" }: ProposalsGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredAndSortedProposals.length > 0 ? (
        filteredAndSortedProposals.map((proposal, index) => (
          <AnimatedCard key={proposal.id} index={index}>
            <Card
              className="h-full rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-full h-44 relative -mt-20">
                <Image
                  src={proposal.imageUrl || "/placeholder.svg"}
                  alt={proposal.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent>
                <h1 className="text-xl font-bold">{proposal.title}</h1>
                <p className="mt-1 text-sm text-black/50 line-clamp-3">
                  {proposal.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {proposal.categories.slice(0, 4).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="font-bold uppercase text-xs"
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {proposal.categories.length > 4 && (
                      <Badge
                        variant="outline"
                        className="font-bold uppercase text-xs"
                      >
                        +{proposal.categories.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className="uppercase font-bold">Variables</span>
                    <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                      {proposal.variables?.length || 0}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className="uppercase font-bold">Categories</span>
                    <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                      {proposal.categories?.length || 0}
                    </span>
                  </Badge>
                </div>

                <div className="flex justify-between items-center mt-4 ml-1">
                  <p className="text-sm font-bold">{proposal.created_at}</p>
                  <Link href={`proposals/${proposal.id}`} className="text-sm font-bold hover:underline">
                    Read More
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))
      ) : (
        <div className="col-span-3 py-8 text-center">
          <p className="text-lg font-medium">No proposals found matching your search.</p>
        </div>
      )}
    </div>
  );
}