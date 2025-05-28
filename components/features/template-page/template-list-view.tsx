"use client";

import React from "react";
import { Badge } from "@/components/shared";
import { TemplateViewProps } from "@/types/templates/dto";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { TemplateDropdownMenu } from "./template-dropdown-menu";

// Consistent default image across the application
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

interface TemplateListProps extends TemplateViewProps {
  onDeleteTemplate: (templateId: string) => void;
  isDeleting?: boolean;
}

export function TemplateList({ templates, onDeleteTemplate, isDeleting }: TemplateListProps) {
  const handleDelete = (templateId: string) => {
    onDeleteTemplate(templateId);
  };

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium">No templates found</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You haven't created any templates yet or none match your search.
        </p>
        <Link
          href="/templates/create"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          Create Your First Template
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5"><div className="rounded-md border">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={cn(
              "flex gap-4 p-4 transition-colors cursor-pointer hover:bg-accent/60 hover:shadow-xs relative",
              index !== templates.length - 1 && "border-b",
              index % 2 === 0 && "bg-muted/50"
            )}
          >            <div className="absolute top-2 right-2 z-10">
              <TemplateDropdownMenu 
                templateId={template.id} 
                onDelete={handleDelete} 
                isDeleting={isDeleting}
              />
            </div>
            <Link href={`/templates/${template.id}`} className="flex gap-4 flex-1">
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
              </div>            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(template.updated_at), "MMM d, yyyy")}
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
