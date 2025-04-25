import React from "react";
import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import { Proposal } from "@/types/proposals";

interface ProposalListProps {
  proposals: Proposal[];
}

export function ProposalList({ proposals }: ProposalListProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-md border">
        {proposals.map((proposal, index) => (
          <div
            key={proposal.id}
            className={[
              "flex gap-4 p-4 transition-colors cursor-pointer hover:bg-accent/60 hover:shadow-xs",
              index !== proposals.length - 1 ? "border-b" : "",
              index % 2 === 0 ? "bg-muted/50" : ""
            ].join(" ")}
          >
            <Image
              src={proposal.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
              alt={proposal.name}
              width={40}
              height={60}
              className="w-20 h-30 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{proposal.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {proposal.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {proposal.project_modules?.map((pm) => (
                  <Badge key={pm.id} variant="secondary" className="text-xs">
                    {pm.module.name}
                  </Badge>
                ))}
              </div>
              {proposal.project_parameters?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {proposal.project_parameters.slice(0, 3).map((pp) => (
                    <Badge key={pp.id} variant="outline" className="text-xs">
                      {pp.parameter.name}
                    </Badge>
                  ))}
                  {proposal.project_parameters.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{proposal.project_parameters.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(proposal.updated_at), "MMM d, yyyy")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
