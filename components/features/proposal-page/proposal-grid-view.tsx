import { Card, Badge } from "@/components/shared";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Proposal } from "@/types/proposals";

interface ProposalGridViewProps {
  proposals: Proposal[];
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
                {proposal.project_modules?.slice(0, 3).map((pm) => (
                  <Badge key={pm.id} variant="secondary" className="text-xs">
                    {pm.module.name}
                  </Badge>
                ))}
                {proposal.project_modules && proposal.project_modules.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{proposal.project_modules.length - 3} more
                  </Badge>
                )}
              </div>
              {proposal.project_parameters?.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
