import React from "react";
import {
  Badge,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Card,
} from "@/components/shared";
import { Eye, FileText, CheckCircle2, XCircle, CalendarDays, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContractListProps {
  contracts: any[];
  onContractClick?: (contractUuid: string) => void;
}

export function ContractList({ contracts = [], onContractClick }: ContractListProps) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium">No contracts found</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You haven't created any contracts yet or none match your search.
        </p>
        <Link
          href="/proposals"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          Create Your First Contract
        </Link>
      </div>
    );
  }

  // Helper function to check if a signature exists (text or image)
  const isSignatureProvided = (contract: any, party: 'contractor' | 'client') => {
    // Check for direct initials property
    if (party === 'contractor' && contract.contractorInitials) return true;
    if (party === 'client' && contract.clientInitials) return true;
    
    // Check for direct image property
    if (party === 'contractor' && contract.contractorImage) return true;
    if (party === 'client' && contract.clientImage) return true;
    
    // Check in signatures object
    if (contract.signatures && contract.signatures[party]) {
      return !!contract.signatures[party].value;
    }
    
    return false;
  };

  const handleClick = (contract: any) => {
    if (onContractClick) {
      onContractClick(contract.uuid);
    }
  };

  return (
    <div className="space-y-2">
      {contracts.map((contract, index) => (
        <Card
          key={contract.uuid}
          className={cn(
            "overflow-hidden transition-all cursor-pointer hover:shadow-md",
            index % 2 === 0 ? "bg-white" : "bg-muted/10"
          )}
          onClick={() => handleClick(contract)}
        >
          <div className="flex flex-col md:flex-row md:items-center p-0">
            {/* Contract main info */}
            <div className="flex-1 p-4 md:pr-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                  {contract.contractName || "Untitled Contract"}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1.5 mb-2">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  <span>{contract.clientName || "No client"}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  <span>
                    {contract.contractDate
                      ? format(new Date(contract.contractDate), "MMM d, yyyy")
                      : "No date"}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                {contract.contractDescription || "No description provided"}
              </p>
            </div>
            
            {/* Signature status - prominent display */}
            <div className="flex gap-3 p-4 border-t md:border-t-0 md:border-l md:pl-4 md:pr-6
                            flex-row md:items-center md:w-auto md:min-w-[240px]">
              <div className="flex flex-1 md:flex-none gap-2 md:gap-3">
                <div className="flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md ${
                        isSignatureProvided(contract, 'contractor')
                          ? "bg-green-50/80 text-green-700"
                          : "bg-muted/30 text-muted-foreground"
                        }`}>
                        {isSignatureProvided(contract, 'contractor') ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/70" />
                        )}
                        <span className="font-medium text-xs whitespace-nowrap">Contractor</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {`Contractor ${isSignatureProvided(contract, 'contractor') ? "Signed" : "Not Signed"}`}
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md ${
                        isSignatureProvided(contract, 'client')
                          ? "bg-green-50/80 text-green-700"
                          : "bg-muted/30 text-muted-foreground"
                        }`}>
                        {isSignatureProvided(contract, 'client') ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/70" />
                        )}
                        <span className="font-medium text-xs whitespace-nowrap">Client</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {`Client ${isSignatureProvided(contract, 'client') ? "Signed" : "Not Signed"}`}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(contract);
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="sr-only">View Contract</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
