"use client";

import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge
} from "@/components/shared";
import { TemplateFormData } from "../CreateTemplateForm";
import { Check, FileText, ListChecks } from "lucide-react";

interface PreviewStepProps {
  data: TemplateFormData;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Preview & Submit</h2>
        <p className="text-muted-foreground mb-6">
          Review your template details before creating it.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Template Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-muted">
            <div className="grid grid-cols-3 py-3">
              <dt className="font-medium">Name</dt>
              <dd className="col-span-2">{data.details.name || "—"}</dd>
            </div>
            <div className="grid grid-cols-3 py-3">
              <dt className="font-medium">Category</dt>
              <dd className="col-span-2">
                {data.details.category ? (
                  <Badge variant="outline" className="capitalize">
                    {data.details.category}
                  </Badge>
                ) : "—"}
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3">
              <dt className="font-medium">Description</dt>
              <dd className="col-span-2 whitespace-pre-wrap">
                {data.details.description || "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5" />
            Trades & Elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Applicable Trades ({data.trades.length})</h4>
              <div className="flex flex-wrap gap-2">
                {data.trades.length > 0 ? (
                  data.trades.map((trade) => (
                    <Badge key={trade} variant="secondary">
                      {trade}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No trades selected</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Template Elements ({data.elements.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.elements.length > 0 ? (
                  data.elements.map((element) => (
                    <div 
                      key={element.id} 
                      className="flex items-center border rounded-md p-2 bg-muted/30"
                    >
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>{element.type}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground md:col-span-2">No elements selected</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-primary" />
            <p>Your template is ready to be created. Click "Create Template" to proceed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewStep;
