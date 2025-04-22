import React from "react";

interface ContractDetailsProps {
  proposal: any;
}

export function ContractDetails({ proposal }: ContractDetailsProps) {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="my-0 p-6 rounded-lg border bg-muted/30">
        <h2 className="text-2xl font-bold mb-4 text-muted-foreground uppercase tracking-wider">
          Contract Details
        </h2>
        <div className="text-base text-muted-foreground">
          {/* TODO: Replace with real contract details if available */}
          No contract details available.
        </div>
      </div>
    </div>
  );
}
