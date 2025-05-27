"use client";

import React from "react";
import { Badge } from "@/components/shared";
import { TemplateViewProps } from "@/types/templates/dto";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Consistent default image across the application
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export function TemplateList({ templates }: TemplateViewProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-md border">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={cn(
              "flex gap-4 p-4 transition-colors cursor-pointer hover:bg-accent/60 hover:shadow-xs",
              index !== templates.length - 1 && "border-b",
              index % 2 === 0 && "bg-muted/50"
            )}
          >
            <Image
              src={template.image || DEFAULT_IMAGE}
              alt={`${template.name} thumbnail`}
              width={40}
              height={60}
              className="w-20 h-30 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.trades?.slice(0, 3).map((trade) => (
                  <Badge
                    key={trade.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {trade.name}
                  </Badge>
                ))}
                {template.trades && template.trades.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.trades.length - 3} more
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {template.variables?.slice(0, 3).map((variable) => (
                  <Badge key={variable.id} variant="outline" className="text-xs">
                    {variable.name}
                  </Badge>
                ))}
                {template.variables && template.variables.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.variables.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(template.updated_at), "MMM d, yyyy")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
