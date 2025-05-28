import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { FileText } from "lucide-react";
import { ProposalResponse } from "@/types/proposals/dto";
import { ProposalDropdownMenu } from "./proposal-dropdown-menu";

interface ProposalGridViewProps {
  proposals: ProposalResponse[];
  onDeleteProposal?: (proposalId: string) => void;
  isDeleting?: boolean;
}

export function ProposalGridView({ proposals, onDeleteProposal, isDeleting }: ProposalGridViewProps) {
  const handleDelete = (proposalId: string) => {
    if (onDeleteProposal) {
      onDeleteProposal(proposalId);
    }
  };

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium">No proposals found</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You haven't created any proposals yet or none match your search.
        </p>
        <Link
          href="/proposals/create"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          Create Your First Proposal
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="h-full relative group">
          <Card className="flex flex-col p-4 hover:shadow-lg transition-shadow h-full relative">
            <div className="absolute top-2 right-2" style={{ zIndex: 1000 }}>
              <ProposalDropdownMenu 
                proposalId={proposal.id} 
                onDelete={handleDelete} 
                isDeleting={isDeleting}
              />
            </div>
            
            <Link 
              href={`/proposals/${proposal.id}`} 
              className="flex flex-col h-full"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('[role="menuitem"]') || target.closest('button')) {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex gap-4">
                <Image
                  src={proposal.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                  width={64}
                  height={64}
                  alt={proposal.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 pr-8"> {/* Add padding to avoid overlap with dropdown */}
                  <h3 className="text-lg font-semibold">{proposal.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {proposal.description}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mt-auto pt-4">
                <div className="flex flex-wrap gap-2">
                  {proposal.template?.trades?.slice(0, 3).map((trade) => (
                    <Badge key={trade.id} variant="secondary" className="text-xs">
                      {trade.name}
                    </Badge>
                  ))}
                  {proposal.template?.trades && proposal.template.trades.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{proposal.template.trades.length - 3} more
                    </Badge>
                  )}
                </div>
                {proposal.template?.variables && proposal.template.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {proposal.template.variables.slice(0, 3).map((variable) => (
                      <Badge key={variable.id} variant="outline" className="text-xs">
                        {variable.name}
                      </Badge>
                    ))}
                    {proposal.template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{proposal.template.variables.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Updated: {format(new Date(proposal.updated_at), "MMM d, yyyy")}
                </div>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </div>
  );
}
