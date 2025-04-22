import React from "react";
import { ProjectModule, ProjectParameter, ProjectElement } from "@/types/proposals";
import { Button } from "@/components/shared";

interface ProposalDetailsProps {
  proposal: any;
}

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              {proposal?.project_parameters?.length > 0 && (
                <div className="mt-4 w-full">
                  <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    Parameters
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.project_parameters.map((param: ProjectParameter) => (
                      <span
                        key={param.id}
                        className="inline-block rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border"
                      >
                        {param.parameter.name}: {param.value}{" "}
                        <span className="text-[10px] text-gray-400">
                          ({param.parameter.type})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-[380px] flex-shrink-0">
              {/* Action Buttons above Client Details */}
              <div className="flex gap-2 mb-4 justify-end">
                <Button variant="outline" onClick={() => window.print()}>
                  Print
                </Button>
                <Button variant="default" onClick={() => {/* TODO: Implement email to client */}}>
                  Email to Client
                </Button>
                <Button variant="secondary" onClick={() => {/* TODO: Implement make contract */}}>
                  Make a Contract
                </Button>
              </div>
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
                    {proposal?.phone_number}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {proposal?.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {proposal?.project_modules?.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Modules
              </h3>
              <div className="flex flex-col gap-4 w-full">
                {proposal.project_modules.map((pm: ProjectModule) => (
                  <div
                    key={pm.id}
                    className="rounded-lg border border-border bg-muted/40 px-4 py-3 hover:bg-accent/40 transition-colors w-full"
                  >
                    <h4 className="font-medium text-base mb-1">
                      {pm.module.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pm.module.description}
                    </p>
                    {proposal.project_elements?.filter(
                      (el: ProjectElement) => el.project_module.id === pm.id
                    ).length > 0 && (
                      <div className="ml-2 mt-2 w-full">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                          Elements
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          {proposal.project_elements
                            .filter((el: ProjectElement) => el.project_module.id === pm.id)
                            .map((el: ProjectElement) => (
                              <div
                                key={el.id}
                                className="flex items-center gap-3 p-4 rounded border bg-background w-full"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">
                                    {el.element.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {el.element.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <span className="font-medium">Formula:</span>{" "}
                                    {el.element.formula}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <span className="font-medium">Labor Formula:</span>{" "}
                                    {el.element.labor_formula}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                    Material: {el.material_cost}
                                  </span>
                                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                    Labor: {el.labor_cost}
                                  </span>
                                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                                    Markup: {el.markup ?? 0}%
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
