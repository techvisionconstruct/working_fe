import React, { useState } from "react";
import { 
  Card, 
  Badge, 
  Button,
  Input 
} from "@/components/shared";
import { Check, Loader2, Search } from "lucide-react";
import { Template } from "./types";

interface TemplateSelectionTabProps {
  templates: {
    isLoading: boolean;
    data?: Template[];
  };
  selectedTemplate: Template | null;
  handleTemplateSelect: (template: Template) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TemplateSelectionTab({ 
  templates, 
  selectedTemplate, 
  handleTemplateSelect, 
  onBack, 
  onNext 
}: TemplateSelectionTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = templates.data?.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (template.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Choose a template</h2>
      <div className="flex justify-between items-start gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          Select a template to jumpstart your proposal with pre-defined modules and parameters.
        </p>
        <div className="relative w-64 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {templates.isLoading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTemplates?.length ? (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`flex flex-col p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? "ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
                            <div className="flex gap-4">
                <div className="w-16 h-16 relative overflow-hidden rounded-md flex-shrink-0">
                  <img
                    src={template.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    {selectedTemplate?.id === template.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {template.modules && template.modules.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {template.modules.slice(0, 3).map((module) => (
                      <Badge key={module.id} variant="secondary" className="text-xs">
                        {module.name}
                      </Badge>
                    ))}
                    {template.modules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.modules.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {template.parameters && template.parameters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
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
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            {searchQuery ? "No matching templates found." : "No templates available."}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Details
        </Button>
        <Button onClick={onNext}>
          Continue to Modules
        </Button>
      </div>
    </div>
  );
}
