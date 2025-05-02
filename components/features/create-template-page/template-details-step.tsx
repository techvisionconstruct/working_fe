"use client";

import React from "react";
import { 
  Input, 
  Label, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/shared";

interface TemplateDetailsProps {
  data: {
    name: string;
    description: string;
  };
  updateData: (data: any) => void;
}

const TemplateDetailsStep: React.FC<TemplateDetailsProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Template Details</h2>
        <p className="text-muted-foreground mb-6">
          Provide basic information about your template to help others find and use it.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            placeholder="Enter template name"
            value={data.name}
            onChange={(e) => updateData({ ...data, name: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what this template is for and how to use it"
            className="min-h-[120px]"
            value={data.description}
            onChange={(e) => updateData({ ...data, description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsStep;
