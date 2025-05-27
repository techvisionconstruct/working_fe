import React from "react";
import { Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ProposalResponse } from "@/types/proposals/dto";
import { ProposalDropdownMenu } from "./proposal-dropdown-menu";

interface ProposalListProps {
  proposals: ProposalResponse[];
  onDeleteProposal?: (proposalId: string) => void;
}

export function ProposalList({ proposals, onDeleteProposal }: ProposalListProps) {
  const handleDelete = (proposalId: string) => {
    if (onDeleteProposal) {
      onDeleteProposal(proposalId);
    }
  };

  return (
    <div className="space-y-5">      <div className="rounded-md border">
        {proposals.map((proposal, index) => (
          <div
            key={proposal.id}
            className={[
              "flex gap-4 p-4 transition-colors cursor-pointer hover:bg-accent/60 hover:shadow-xs relative",
              index !== proposals.length - 1 ? "border-b" : "",
              index % 2 === 0 ? "bg-muted/50" : "",
            ].join(" ")}
          >            <div className="absolute top-2 right-2 z-10">
              <ProposalDropdownMenu proposalId={proposal.id} onDelete={handleDelete} />
            </div>
            <Link href={`/proposals/${proposal.id}`} className="flex gap-4 flex-1">
              <Image
              src={
                proposal.image ||
                "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              }
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
                {proposal.template?.trades?.map((trade) => (
                  <Badge key={trade.id} variant="secondary" className="text-xs">
                    {trade.name}
                  </Badge>
                ))}
              </div>
              {proposal.template?.variables &&
                proposal.template.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {proposal.template?.variables
                      ?.slice(0, 3)
                      .map((variable) => (
                        <Badge
                          key={variable.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {variable.name}
                        </Badge>
                      ))}
                    {proposal.template?.variables &&
                      proposal.template.variables.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{proposal.template?.variables?.length - 3} more
                        </Badge>
                      )}
                  </div>
                )}            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(proposal.updated_at), "MMM d, yyyy")}
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
