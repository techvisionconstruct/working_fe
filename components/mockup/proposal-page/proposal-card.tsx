import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared";

import {
  FileText,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash,
  UserCircle,
  Clock,
  Building,
} from "lucide-react";

import { format } from "date-fns";
import { ProposalResponse } from "@/types/proposals/dto";

interface ProposalCardProps {
  proposal: ProposalResponse;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  // Function to determine badge color based on status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default"; // Green
      case "sent":
        return "secondary"; // Purple
      case "draft":
        return "outline"; // Gray outline
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{proposal.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-ellipsis overflow-hidden">
              {proposal.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusVariant(proposal.status)}
              className="px-2 py-0.5 text-xs uppercase"
            >
              {proposal.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Client information */}
          {proposal.client_name && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <UserCircle className="mr-1 h-3 w-3" />
                <span>Client: {proposal.client_name}</span>
              </div>
            </div>
          )}

          {/* Company information if available */}
          {proposal.client_address && proposal.client_address && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Building className="mr-1 h-3 w-3" />
                <span>Company: {proposal.client_address}</span>
              </div>
            </div>
          )}

          {/* Amount information if available */}
          {proposal.total_cost && (
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-sm font-bold">
                  ${Number(proposal.total_cost).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                Updated: {format(new Date(proposal.updated_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-1/2 rounded-full">
          View
        </Button>
        <Button
          variant={proposal.status === "draft" ? "default" : "outline"}
          className="w-1/2 rounded-full"
        >
          {proposal.status === "pubished" ? "Send" : "Edit"}
        </Button>
      </CardFooter>
    </Card>
  );
};
