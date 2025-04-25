import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@/components/shared";
import { Calendar, User, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ContractGridViewProps {
  contracts: any[];
  onContractClick?: (contractUuid: string) => void;
}

export function ContractGridView({ contracts = [], onContractClick }: ContractGridViewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {contracts.map((contract) => (
        <div
          key={contract.uuid}
          className="group cursor-pointer"
          onClick={() => handleClick(contract)}
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-all border border-border hover:border-primary/20">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {contract.contractName || "Untitled Contract"}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">
                    {contract.clientName || "No client specified"}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="whitespace-nowrap">
                    {contract.status || "Draft"}
                  </Badge>
                  <div className="flex gap-1.5 mt-1.5">
                    <span 
                      className={`h-6 w-6 rounded-sm flex items-center justify-center text-xs font-bold ${
                        contract.contractorInitials || (contract.signatures?.contractor?.value)
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                      title={`Contractor ${contract.contractorInitials || (contract.signatures?.contractor?.value) ? "signed" : "not signed"}`}
                    >
                      C
                    </span>
                    <span 
                      className={`h-6 w-6 rounded-sm flex items-center justify-center text-xs font-bold ${
                        contract.clientInitials || (contract.signatures?.client?.value)
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                      title={`Client ${contract.clientInitials || (contract.signatures?.client?.value) ? "signed" : "not signed"}`}
                    >
                      P
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">
                {contract.contractDescription || "No description provided"}
              </p>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {contract.contractDate
                    ? formatDistanceToNow(new Date(contract.contractDate), {
                        addSuffix: true,
                      })
                    : "No date"}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between items-center border-t bg-muted/20">
              <div className="flex items-center text-xs">
                <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {contract.clientName || "No client"}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}
