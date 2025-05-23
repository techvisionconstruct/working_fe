"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TemplateDetailedLoader } from "@/components/features/template-page/loader-detailed";
import { VariableResponse } from "@/types/variables/dto";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { getTemplate } from "@/queryOptions/templates";
import { AlertError } from "@/components/features/alert-error/alert-error";
import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";
import Link from "next/link";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export default function TemplatedById() {
  const { id } = useParams();
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery(getTemplate(String(id)));

  if (isLoading) {
    return <TemplateDetailedLoader />;
  }

  if (isError) {
    return <AlertError resource="template" />;
  }

  return (
    <div className="p-0 mx-auto">
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
        <Link
          href="/site/templates"
          className="absolute left-4 top-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm hover:bg-background transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:translate-x-[-2px] transition-transform">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="text-sm font-medium">Back to templates</span>
        </Link>
        <Image
          src={template.image || DEFAULT_IMAGE}
          alt={template?.name || "Template Image"}
          fill
          className="w-full h-full object-cover object-center rounded-2xl shadow"
          priority
        />
      </div>
      <h2 className="text-4xl font-bold mb-2 tracking-tight leading-tight">
        {template?.name}
      </h2>
      <p className="text-lg text-muted-foreground mb-2">
        {template?.description}
      </p>
      {template?.variables.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Variables
          </h3>
          {(() => {
            // Group variables by variable_type name
            const groupedVariables: Record<string, VariableResponse[]> = {};
            template.variables.forEach((variable: VariableResponse) => {
              const typeName = variable.variable_type?.name || 'Other';
              if (!groupedVariables[typeName]) {
                groupedVariables[typeName] = [];
              }
              groupedVariables[typeName].push(variable);
            });

            // Return the grouped variables UI in horizontal layout with limited display
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(groupedVariables).map(([typeName, variables]) => {
                  const isExpanded = expandedTypes[typeName] || false;
                  const visibleVariables = isExpanded ? variables : variables.slice(0, 3);

                  return (
                    <div key={typeName}>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">
                        {typeName}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {visibleVariables.map((variable: VariableResponse) => (
                          <span
                            key={variable.id}
                            className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border transition-colors hover:bg-muted"
                          >
                            {variable.name}
                          </span>
                        ))}
                        {variables.length > 3 && !isExpanded && (
                          <button
                            onClick={() => setExpandedTypes(prev => ({ ...prev, [typeName]: true }))}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 transition-colors hover:bg-primary/20 cursor-pointer"
                          >
                            +{variables.length - 3} more
                          </button>
                        )}
                        {isExpanded && variables.length > 3 && (
                          <button
                            onClick={() => setExpandedTypes(prev => ({ ...prev, [typeName]: false }))}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 transition-colors hover:bg-primary/20 cursor-pointer"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
      {template.trades.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Trades
          </h3>
          <div className="flex flex-col gap-4">
            {template.trades.map((trade: TradeResponse) => (
              <div
                key={trade.id}
                className="rounded-lg border border-border bg-muted/40 px-4 py-3 hover:bg-accent/40 transition-colors"
              >
                <h4 className="font-medium text-base mb-1">{trade.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {trade.description}
                </p>

                <div className="mt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                    Elements
                  </div>
                  {trade.elements?.map((element: ElementResponse) => (
                    <div className="flex flex-col mt-1" key={element.id}>
                      <div className="flex flex-col p-4 rounded-lg border bg-background hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">
                            {element.name}
                          </h5>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {element.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div className="p-2 rounded-md bg-muted/40 border-l-2 border-primary/40">
                            <div className="text-xs font-medium text-muted-foreground">Material Formula</div>
                            <div className="text-sm mt-1 font-mono tracking-tighter leading-none">{element.material_cost_formula ? replaceVariableIdsWithNames(
                              element.material_cost_formula,
                              template.variables,
                              element.material_formula_variables || []
                            ) : ''}</div>
                          </div>
                          <div className="p-2 rounded-md bg-muted/40 border-l-2 border-primary/70">
                            <div className="text-xs font-medium text-muted-foreground">Labor Formula</div>
                            <div className="text-sm mt-1 font-mono tracking-tighter leading-none">{element.labor_cost_formula ? replaceVariableIdsWithNames(
                              element.labor_cost_formula,
                              template.variables,
                              element.labor_formula_variables || []
                            ) : ''}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
