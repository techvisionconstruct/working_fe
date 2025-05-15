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
  Clock,
  Download,
  UserCircle,
  CheckCircle2,
} from "lucide-react";

import { format } from "date-fns";
import { ContractResponse } from "@/types/contracts/dto";

interface ContractCardProps {
  contract: ContractResponse;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  // Function to determine badge color based on status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed":
        return "default"; // Green
      case "sent":
        return "secondary"; // Purple
      case "draft":
        return "outline"; // Gray outline
      default:
        return "secondary"; 
    }
  };

  // Check if contract is fully signed
  const isFullySigned = contract.client_signature && contract.contractor_signature;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{contract.name}</CardTitle>
            <CardDescription>{contract.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusVariant(contract.status)}
              className="px-2 py-0.5 text-xs uppercase"
            >
              {contract.status}
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
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
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
        <div className="space-y-3">
          {/* Signature Status */}
          <div className="flex flex-col space-y-2 text-xs">
            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Client:</span>
                {contract.client_signature ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1.5">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Signed {contract.client_signed_at && `on ${format(new Date(contract.client_signed_at), "MMM d, yyyy")}`}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-1.5">Unsigned</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Contractor:</span>
                {contract.contractor_signature ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1.5">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Signed {contract.contractor_signed_at && `on ${format(new Date(contract.contractor_signed_at), "MMM d, yyyy")}`}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-1.5">Unsigned</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                Updated: {format(new Date(contract.updated_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-1/2 rounded-full">
          View
        </Button>
        {contract.status === "draft" ? (
          <Button variant="default" className="w-1/2 rounded-full">
            Send for Signature
          </Button>
        ) : !isFullySigned ? (
          <Button variant="default" className="w-1/2 rounded-full">
            Sign Now
          </Button>
        ) : (
          <Button variant="outline" className="w-1/2 rounded-full">
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
