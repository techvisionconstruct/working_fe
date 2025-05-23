"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Badge } from "@/components/shared";
import { Search, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTemplates } from "@/api/templates/get-all-templates";
import { TemplateResponse } from "@/types/templates/dto";
import Image from "next/image";
import { format } from "date-fns";
import { getTemplates } from "@/queryOptions/templates";

interface TemplateSelectionTabProps {
  data: TemplateResponse | null;
  updateData: (template: TemplateResponse | null) => void;
}

const TemplateSelectionTab: React.FC<TemplateSelectionTabProps> = ({
  data,
  updateData,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track if we've done the initial load
  const [initialLoaded, setInitialLoaded] = useState(false);

  const { data: templatesData, isPending } = useQuery(
    getTemplates(1, 5, searchQuery)
  );

  const templates = templatesData?.data || [];

  // Make sure we preserve variables when selecting a template
  const handleSelectTemplate = (template: TemplateResponse) => {
    // If selecting the same template, don't change anything
    if (data?.id === template.id) return;

    // Ensure we preserve any variables that were added to the current template
    if (data && data.variables && data.variables.length > 0) {
      // When switching templates, ask if user wants to keep their variables
      const confirmed = window.confirm(
        "Do you want to preserve your current variables when switching templates?"
      );
      
      if (confirmed && template.variables) {
        // Create a set of existing variable IDs for quick lookup
        const existingVarIds = new Set(template.variables.map(v => v.id));
        
        // Add variables from current template that don't exist in the new one
        const newTemplate = {
          ...template,
          variables: [
            ...template.variables,
            ...data.variables.filter(v => !existingVarIds.has(v.id))
          ]
        };
        
        updateData(newTemplate);
        return;
      }
    }
    
    // Default case: just update with the new template
    updateData(template);
  };

  const filteredTemplates = templates.filter(
    (template: TemplateResponse) =>
      template.origin === "original" &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Ensure template selections don't lose variables
  useEffect(() => {
    if (templatesData && !initialLoaded && data) {
      setInitialLoaded(true);
      // This ensures we keep any initial template data provided
    }
  }, [templatesData, data, initialLoaded]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Select a Template</h2>
        <p className="text-muted-foreground mb-6">
          Choose a template to use as a starting point for your proposal or
          start from scratch.
        </p>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {" "}
        <Card
          className={`cursor-pointer border-2 hover:shadow-md transition-shadow ${
            data === null ? "border-primary" : ""
          }`}
          onClick={() => updateData(null)}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Start from scratch</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Create a proposal without using a template
            </p>
          </CardContent>
        </Card>
        {filteredTemplates.map((template: TemplateResponse) => (
          <div key={template.id} className="h-full relative">
            <Card
              className={`flex flex-col p-4 hover:shadow-lg transition-shadow h-full ${
                data?.id === template.id ? "border-2 border-primary" : ""
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="flex gap-4">
                <Image
                  src={
                    template.image ||
                    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  }
                  width={64}
                  height={64}
                  alt={template.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-auto pt-4">
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
                <div className="flex flex-wrap gap-2">
                  {template.variables?.slice(0, 3).map((variable) => (
                    <Badge
                      key={variable.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {variable.name}
                    </Badge>
                  ))}
                  {template.variables && template.variables.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Updated:{" "}
                  {template.updated_at
                    ? format(new Date(template.updated_at), "MMM d, yyyy")
                    : "N/A"}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && !isPending && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No templates found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectionTab;
