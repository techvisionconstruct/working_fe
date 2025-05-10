import React from "react";
import { ProposalResponse } from "@/types/proposals/dto";

interface ProposalDetailsProps {
  proposal: ProposalResponse;
}

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
  console.log("Proposal Details:", proposal);
  return (
    <>
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
        <img
          src={
            proposal?.image ||
            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          }
          alt={proposal?.name || "Proposal Image"}
          className="w-full h-full object-cover object-center rounded-2xl shadow"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-4xl font-bold mb-2 tracking-tight leading-tight">
                {proposal?.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                {proposal?.description}
              </p>
              {proposal.template?.variables &&
                proposal.template.variables.length > 0 && (
                  <div className="mt-4 w-full">
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                      Variables
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proposal.template.variables.map((variable) => (
                        <span
                          key={variable.id}
                          className="inline-block rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border"
                        >
                          {variable.name}: {variable.value}
                          <span className="ml-1 text-[10px] text-gray-400">
                            ({variable.variable_type?.name})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="my-0 p-4 rounded-lg border bg-muted/30">
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                  Client Details
                </h3>
                <div className="grid grid-cols-1 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Client Name:</span>{" "}
                    {proposal?.client_name}
                  </div>
                  <div>
                    <span className="font-medium">Client Email:</span>{" "}
                    {proposal?.client_email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {proposal?.client_phone}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {proposal?.client_address}
                  </div>
                </div>
              </div>

              {/* Total Cost Summary Card */}
              <div className="mt-4 p-4 rounded-lg border bg-primary/10">
                <h3 className="text-lg font-semibold mb-2 text-primary uppercase tracking-wider">
                  Total Estimate
                </h3>
                <div className="text-3xl font-bold text-primary">
                  $ {proposal.total_cost}
                </div>
              </div>
            </div>
          </div>
          {proposal.template?.trades && proposal.template.trades.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
               Trades
              </h3>
              <div className="flex flex-col gap-4 w-full">
                {proposal.template.trades.map((trade) => {
                  return (
                    <div
                      key={trade.id}
                      className="rounded-lg border border-border bg-muted/40 px-4 py-3 hover:bg-accent/40 transition-colors w-full"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-base mb-1">
                          {trade.name}
                        </h4>
                        <div className="text-sm font-medium">
                          Subtotal:
                          
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {trade.description}
                      </p>
                      {trade.elements && trade.elements.length > 0 && (
                        <div className="mt-2 w-full">
                          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                            Elements
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            {trade.elements.map((element) => {
                              return (
                                <div
                                  key={element.id}
                                  className="flex items-center gap-3 p-4 rounded border bg-background w-full"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                      {element.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                      {element.description}
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                      Material:
                                      {element.material_cost}
                                    </span>
                                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                      Labor:
                                      {element.labor_cost}
                                    </span>
                                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                      Markup: {element.markup}%
                                    </span>
                                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium border border-primary/20">
                                      Total:
                                      {/* {formatCurrency(total)} */}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
