"use client";

import React, { useState } from "react";
import {
  Card,
  Tabs,
  TabsContent,
  Button,
} from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import TemplateDetailsStep from "@/components/features/create-template-page/template-details-step";
import TradesAndElementsStep from "@/components/features/create-template-page/template-and-elements-step";
import PreviewStep from "@/components/features/create-template-page/preview-step";
import StepIndicator from "@/components/features/create-template-page/step-indicator";
import { TemplateCreateRequest } from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { createTemplateSchema, validateTradeElements } from "@/zod-schemas/templates/create-template-schema";
import { createTemplate } from "@/api/server/templates";

export default function CreateTemplate() {
  const [currentStep, setCurrentStep] = useState<string>("details");
    const [formData, setFormData] = useState<TemplateCreateRequest>({
      name: "",
      description: "",
      status: "draft",
      origin: "original",
      source_id: "",
      owner: "",
      trades: [], 
      variables: [], 
      is_public: false,
    });
  
    const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
    const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
      []
    );
    
    // Define the mutation for template creation
    const createTemplateMutation = useMutation({
      mutationFn: createTemplate,
      onSuccess: () => {
        toast.success("Template created successfully!", {
          description: "Your template has been saved"
        });
      },
      onError: (error: any) => {
        console.error("API error:", error);
        toast.error("Failed to create template", {
          description: error instanceof Error ? error.message : "Please try again later"
        });
      }
    });
  
    const updateFormData = (field: string, data: any) => {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    };
  
    const handleNext = () => {
      if (currentStep === "details") {
        setCurrentStep("trades");
      } else if (currentStep === "trades") {
        setCurrentStep("preview");
      }
    };
  
    const handleBack = () => {
      if (currentStep === "trades") {
        setCurrentStep("details");
      } else if (currentStep === "preview") {
        setCurrentStep("trades");
      }
    };
  
    const handleSubmit = async () => {
      try {
        const updatedFormData = {
          ...formData,
          trades: tradeObjects.map(trade => trade.id),
          variables: variableObjects.map(variable => variable.id)
        };

        const validationResult = createTemplateSchema.safeParse(updatedFormData);
        
        if (!validationResult.success) {
          const errorMessages = validationResult.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
          toast.error("Validation Error", {
            description: errorMessages,
          });
          return;
        }
        
        const hasTradesWithElements = validateTradeElements(tradeObjects);
        if (!hasTradesWithElements) {
          toast.error("Validation Error", {
            description: "At least one trade must have elements",
          });
          return;
        }
        
        const requestPayload = {
          name: updatedFormData.name,
          description: updatedFormData.description,
          status: updatedFormData.status,
          origin: updatedFormData.origin,
          trades: updatedFormData.trades,
          variables: updatedFormData.variables
        };
  
        console.log("Submitting template:", requestPayload);
        
        createTemplateMutation.mutate(requestPayload);
      } catch (error) {
        console.error("Error creating template:", error);
        toast.error("Failed to create template. Please try again.");
      }
    };
  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create New Template</h1>
        <p className="text-muted-foreground text-sm">
          Create a new template to standardize your proposals and contracts
        </p>
      </div>

      <Card className="w-full">
        <div className="w-full mx-auto pl-6 pr-8 py-6 border-b">
          <StepIndicator
            steps={["Template Details", "Trades & Elements", "Preview"]}
            currentStep={
              currentStep === "details" ? 0 : currentStep === "trades" ? 1 : 2
            }
          />
        </div>

        <Tabs value={currentStep} className="w-full">
          <TabsContent value="details" className="p-6">
            <TemplateDetailsStep
              data={{
                name: formData.name,
                description: formData.description || "",
              }}
              updateData={(data) => updateFormData("details", data)}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>Next: Trades & Elements</Button>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="p-6">
            <TradesAndElementsStep
              data={{
                trades: tradeObjects,
                variables: variableObjects,
              }}
              updateTrades={(trades) => {
                setTradeObjects(trades);
                updateFormData(
                  "trades",
                  trades.map((trade) => trade.id)
                );
              }}
              updateVariables={(variables) => {
                setVariableObjects(variables);
                updateFormData(
                  "variables",
                  variables.map((variable) => variable.id)
                );
              }}
            />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next: Preview</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="p-6">
            <PreviewStep
              data={formData}
              tradeObjects={tradeObjects}
              variableObjects={variableObjects}
            />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Create Template</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
