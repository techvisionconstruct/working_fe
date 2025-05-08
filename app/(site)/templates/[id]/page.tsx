"use client";

import React from "react";
import { getTemplateById } from "@/api/templates/get-template-by-id";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TemplateDetailedLoader } from "@/components/features/template-page/loader-detailed";
import { VariableResponse } from "@/types/variables/dto";
import Error from "@/components/features/template-page/error";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export default function TemplatedById() {
  const { id } = useParams();

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplateById(String(id)),
    select: (data) => data.data,
  });

  console.log(template);

  if (isLoading) {
    return <TemplateDetailedLoader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="p-0 mx-auto">
      <div className="w-full max-w-8xl relative left-1/2 right-1/2 -translate-x-1/2 h-48 md:h-64 mb-4">
        <Image
          src={template?.image || DEFAULT_IMAGE}
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
          <div className="flex flex-wrap gap-2 mb-4">
            {template.variables.map((variable: VariableResponse) => (
              <span
                key={variable.id}
                className="inline-block rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border"
              >
                {variable.name}: {variable.value}
                <span className="text-[10px] text-gray-400 ml-1">
                  ({variable.variable_type?.name})
                </span>
              </span>
            ))}
          </div>
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
                      <div className="flex items-center gap-3 p-4 rounded border bg-background">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{element.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{element.description}</div>
                        </div>
                        <div className="flex gap-2">
                          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                            Material: {element.material_cost}
                          </span>
                          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                            Labor: {element.labor_cost}
                          </span>
                          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                            Markup: {element.markup}%
                          </span>
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
