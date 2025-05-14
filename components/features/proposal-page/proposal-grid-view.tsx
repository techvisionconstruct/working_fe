import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ProposalResponse } from "@/types/proposals/dto";

interface ProposalGridViewProps {
  proposals: ProposalResponse[];
}

export function ProposalGridView({ proposals }: ProposalGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proposals.map((proposal) => (
        <Link href={`/proposals/${proposal.id}`} key={proposal.id} className="h-full">
          <Card className="flex flex-col p-4 hover:shadow-lg transition-shadow h-full">
            <div className="flex gap-4">
              <Image
                src={proposal.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                width={64}
                height={64}
                alt={proposal.name}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1">
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
          </Card>
        </Link>
      ))}
    </div>
  );
}
