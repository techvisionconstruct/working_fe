"use client";

import React, { useState } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

// Import our step components
import TemplateSelectionStep from "@/components/features/create-proposal-page/template-selection-tab";
import ProposalDetailsStep from "@/components/features/create-proposal-page/proposal-details-tab";
import TradesAndElementsStep from "@/components/features/create-proposal-page/trades-and-elements-tab";
// import PreviewStep from "@/components/features/create-proposal-page/preview-tab";
import StepIndicator from "@/components/features/create-proposal-page/step-indicator";

import { createProposal } from "@/api/proposals/create-proposal";
import { updateTemplate } from "@/api/templates/update-template";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ProposalCreateRequest } from "@/types/proposals/dto";

export default function CreateProposalPage() {
  const [currentStep, setCurrentStep] = useState<string>("template");
  const [formData, setFormData] = useState({
    template: null,
    proposalDetails: {
      name: "",
      description: "",
      image: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      client_address: "",
      valid_until: "",
      location: "",
    },
    status: "draft",
  });

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
    []
  );

  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      toast.success("Proposal created successfully!", {
        description: "Your proposal has been saved",
      });
    },
    onError: (error: any) => {
      console.error("API error:", error);
      toast.error("Failed to create proposal", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  // Add updateTemplate mutation
  const updateTemplateMutation = useMutation({
    mutationFn: (params: { id: string; data: any }) => updateTemplate(params.id, params.data),
    onSuccess: () => {
      toast.success("Template updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update template", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  const updateFormData = (field: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: data,
    }));
  };

  const handleNext = () => {
    if (currentStep === "template") {
      setCurrentStep("details");
    } else if (currentStep === "details") {
      setCurrentStep("trades");
    } else if (currentStep === "trades") {
      setCurrentStep("preview");
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("template");
    } else if (currentStep === "trades") {
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      setCurrentStep("trades");
    }
  };

  const handleSubmit = async () => {
    try {
      const templateId = (typeof formData.template === 'object' && formData.template !== null)
        ? (formData.template as any).id
        : formData.template;

      const payload: ProposalCreateRequest = {
        name: formData.proposalDetails.name,
        description: formData.proposalDetails.description,
        status: formData.status,
        template: templateId,
        client_name: formData.proposalDetails.client_name,
        client_email: formData.proposalDetails.client_email,
        client_phone: formData.proposalDetails.client_phone,
        client_address: formData.proposalDetails.client_address,
      };

      // Create proposal
      const result = await createProposalMutation.mutateAsync(payload);
      console.log(result)
      const createdTemplateId = result?.data?.template?.id
      // Only update template if trades or variables exist
      if (createdTemplateId && (tradeObjects.length > 0 || variableObjects.length > 0)) {
        await updateTemplateMutation.mutateAsync({
          id: createdTemplateId,
          data: {
            trades: tradeObjects.map((t) => t.id),
            variables: variableObjects.map((v) => v.id),
          },
        });
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create New Proposal</h1>
        <p className="text-muted-foreground text-sm">
          Create a new proposal by following the steps below.
        </p>
      </div>

      <Card className="w-full">
        <div className="w-full mx-auto pl-6 pr-8 py-6 border-b">
          <StepIndicator
            steps={[
              "Template Selection",
              "Proposal Details",
              "Trades & Elements",
              "Preview",
            ]}
            currentStep={
              currentStep === "template"
                ? 0
                : currentStep === "details"
                ? 1
                : currentStep === "trades"
                ? 2
                : 3
            }
          />
        </div>

        <Tabs value={currentStep} className="w-full">
          <TabsContent value="template" className="p-6">
            <TemplateSelectionStep
              data={formData.template}
              updateData={(data) => updateFormData("template", data)}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>Next: Proposal Details</Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-6">
            <ProposalDetailsStep
              data={formData.proposalDetails}
              updateData={(data) => updateFormData("proposalDetails", data)}
            />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next: Trades & Elements</Button>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="p-6">
            <TradesAndElementsStep
              data={{
                trades: tradeObjects,
                variables: variableObjects,
              }}
              template={formData.template}
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
            {/* <PreviewStep formData={formData} /> */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createProposalMutation.isPending}
              >
                {createProposalMutation.isPending
                  ? "Submitting..."
                  : "Create Proposal"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
