"use client";

import React, { useState } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

// Import our step components
import TemplateSelectionStep from "@/components/mockup/create-proposal-page/template-selection-tab";
import ProposalDetailsStep from "@/components/mockup/create-proposal-page/proposal-details-tab";
import TradesAndElementsStep from "@/components/mockup/create-proposal-page/trades-and-elements-tab";
import VerticalStepIndicator from "@/components/mockup/create-template-page/vertical-step-indicator";
import { Header } from "@/components/mockup/create-template-page/header";

import { createProposal } from "@/api/proposals/create-proposal";
import { updateTemplate } from "@/api/templates/update-template";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ProposalCreateRequest } from "@/types/proposals/dto";
import {
  TemplateCreateRequest,
  TemplateResponse,
  TemplateUpdateRequest,
} from "@/types/templates/dto";
import { set } from "date-fns";

export default function CreateProposalPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("template");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_address: string;
    valid_until: string;
    location: string;
    status: string;
    template: TemplateResponse | null;
  }>({
    name: "",
    description: "",
    image: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    valid_until: "",
    location: "",
    status: "draft",
    template: null,
  });

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
    []
  );

  const updateFormData = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
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

  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      toast.success("Proposal created successfully!", {
        description: "Your proposal has been saved",
      });
      handleNext();
    },
    onError: (error: any) => {
      toast.error("Failed to create proposal", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  const { mutate: updateTemplateMutation, isPending: isUpdatingTemplate } =
    useMutation({
      mutationFn: (data: {
        templateId: string;
        template: TemplateUpdateRequest;
      }) => updateTemplate(data.templateId, data.template),
      onSuccess: () => {
        toast.success("Template updated successfully!", {
          description: "Your proposal has been saved",
        });
        // Navigate to proposals list after successful save
        router.push("/proposals");
      },
      onError: (error: any) => {
        toast.error("Failed to update template", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      },
    });

  const handleCreateProposal = async () => {
    const templateId = formData.template ? formData.template.id : null;
    
    setIsLoading(true);

    const proposalDetails = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      image: formData.image,
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      client_address: formData.client_address,
      valid_until: formData.valid_until,
      location: formData.location,
      template: templateId || null,
    };

    return new Promise((resolve, reject) => {
      createProposalMutation.mutate(proposalDetails, {
        onSuccess: (data) => {
          resolve(data);
          toast.success("Proposal created successfully!");
          setTradeObjects(data.data.template.trades);
          setVariableObjects(data.data.template.variables);
          setTemplate(data.data.template);
          setTemplateId(data.data.template.id);
          setIsLoading(false);
        },
        onError: (error) => {
          reject(error);
          setIsLoading(false);
          toast.error("Failed to create proposal", {
            description:
              error instanceof Error ? error.message : "Please try again later",
          });
        },
      });
    });
  };

  const handleUpdateTemplate = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }
    
    setIsLoading(true);

    const tradesAndVariables = {
      trades: tradeObjects.map((trade) => trade.id),
      variables: variableObjects.map((variable) => variable.id),
    };

    updateTemplateMutation({ templateId, template: tradesAndVariables });
  };

  return (
    <div className="flex-1 p-6 pt-0">
      <Header
        title="Create New Proposal"
        description="Design and create a new proposal for your client."
      />

      <div className="flex gap-3 mt-6">
        {/* Vertical step indicator on the left */}
        <div className="w-64 shrink-0">
          <div className="sticky top-20">
            <VerticalStepIndicator
              steps={["Template Selection", "Proposal Details", "Trades & Elements", "Preview"]}
              currentStep={
                currentStep === "template" ? 0 
                : currentStep === "details" ? 1 
                : currentStep === "trades" ? 2 : 3
              }
              className="h-[calc(100vh-600px)]"
            />
            <div className="mt-4">
              <div className="border rounded-2xl p-4 shadow-sm">
                <h1 className="font-bold">Not sure what to do next?</h1>
                <p className="text-sm text-muted-foreground mb-3">
                  Let the tour walk you through the
                  essentials.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-primary font-medium rounded-full"
                >
                  Start the tour
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content area on the right */}
        <div className="flex-1">
          <Tabs value={currentStep} className="w-full">
            <TabsContent value="template" className="px-4">
              <TemplateSelectionStep
                data={formData.template}
                updateData={(template) => updateFormData({ template })}
              />
              <div className="flex justify-end mt-6">
                <Button
                  className="rounded-full"
                  onClick={handleNext}
                >
                  Next: Proposal Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="px-4">
              <ProposalDetailsStep
                data={{
                  name: formData.name,
                  description: formData.description,
                  image: formData.image,
                  client_name: formData.client_name,
                  client_email: formData.client_email,
                  client_phone: formData.client_phone,
                  client_address: formData.client_address,
                  valid_until: formData.valid_until,
                  location: formData.location,
                }}
                updateData={(data) => updateFormData(data)}
              />
              <div className="flex justify-between mt-6">
                <Button
                  className="rounded-full"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  className="rounded-full"
                  onClick={handleCreateProposal}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Next: Trades & Elements"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="px-4">
              <TradesAndElementsStep
                data={{
                  trades: tradeObjects,
                  variables: variableObjects,
                }}
                templateId={templateId}
                template={formData.template}
                updateTrades={(trades) => {
                  setTradeObjects(trades);
                  updateFormData({
                    trades: trades.map((trade) => trade.id),
                  });
                }}
                updateVariables={(variables) => {
                  setVariableObjects(variables);
                  updateFormData({
                    variables: variables.map((variable) => variable.id),
                  });
                }}
              />
              <div className="flex justify-between mt-6">
                <Button
                  className="rounded-full"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => handleUpdateTemplate()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Next: Preview"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="px-4">
              {/* <PreviewStep formData={formData} /> */}
              <div className="flex justify-between mt-6">
                <Button
                  className="rounded-full"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    // Navigate to proposals list after successful save
                    router.push("/proposals");
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Proposal"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
