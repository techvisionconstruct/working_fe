"use client";

import React from "react";
import { Input, Button, Card, Badge } from "@/components/shared";
import { Template } from "@/types/templates";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
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
              src={
                template.image ||
                "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              }
              alt={template.name}
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
                {template.modules.map((module) => (
                  <Badge
                    key={module.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {module.name}
                  </Badge>
                ))}
              </div>
              {template.parameters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {template.parameters.slice(0, 3).map((param) => (
                    <Badge key={param.id} variant="outline" className="text-xs">
                      {param.name}
                    </Badge>
                  ))}
                  {template.parameters.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.parameters.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
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
