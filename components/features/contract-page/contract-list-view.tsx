import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
} from "@/components/shared";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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

  const handleClick = (contract: any) => {
    if (onContractClick) {
      onContractClick(contract.uuid);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signatures</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow 
              key={contract.uuid}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleClick(contract)}
            >
              <TableCell className="font-medium">
                <span className="hover:text-primary transition-colors">
                  {contract.contractName || "Untitled Contract"}
                </span>
              </TableCell>
              <TableCell>{contract.clientName || "No client"}</TableCell>
              <TableCell>
                {contract.contractDate
                  ? format(new Date(contract.contractDate), "MMM d, yyyy")
                  : "No date"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {contract.status || "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <span 
                    className={`h-7 w-7 rounded-sm flex items-center justify-center text-xs font-bold ${
                      contract.contractorInitials || (contract.signatures?.contractor?.value)
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                    title={`Contractor ${contract.contractorInitials || (contract.signatures?.contractor?.value) ? "signed" : "not signed"}`}
                  >
                    C
                  </span>
                  <span 
                    className={`h-7 w-7 rounded-sm flex items-center justify-center text-xs font-bold ${
                      contract.clientInitials || (contract.signatures?.client?.value)
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                    title={`Client ${contract.clientInitials || (contract.signatures?.client?.value) ? "signed" : "not signed"}`}
                  >
                    P
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(contract);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View Contract</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
