"use client";

import React, { useState } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import TemplateDetailsStep from "@/components/features/create-template-page/template-details-step";
import TradesAndElementsStep from "@/components/features/create-template-page/template-and-elements-step";
import PreviewStep from "@/components/features/create-template-page/preview-step";
import StepIndicator from "@/components/features/create-template-page/step-indicator";
import {
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { createTemplate } from "@/api/templates/create-template";
import { updateTemplate } from "@/api/templates/update-template";
import { useRouter } from "next/navigation";

export default function CreateTemplate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("details");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TemplateCreateRequest>({
    name: "",
    description: "",
    image: undefined,
  });

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
    []
  );

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

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast.success("Template created successfully!", {
        description: "Your template has been saved",
      });
      handleNext();
    },
    onError: (error: any) => {
      toast.error("Failed to create template", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (data: {
      templateId: string;
      template: TemplateUpdateRequest;
    }) => updateTemplate(data.templateId, data.template),
    onSuccess: () => {
      toast.success("Template updated successfully!", {
        description: "Your template has been saved",
      });
      handleNext();
    },
    onError: (error: any) => {
      toast.error("Failed to update template", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  const publishTemplateMutation = useMutation({
    mutationFn: (data: {
      templateId: string;
      template: TemplateUpdateRequest;
    }) => updateTemplate(data.templateId, data.template),
    onSuccess: (data) => {
      toast.success("Template published successfully!", {
        description: "Your template is now available",
      });

      // After successful publish, redirect to template list or view page
      setTimeout(() => {
        router.push("/templates");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error("Failed to publish template", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  const handleCreateTemplate = async () => {
    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    // Include all template details including image
    const templateDetails = {
      name: formData.name,
      description: formData.description,
      image: formData.image, // Pass the image
      status: "draft",
    };

    console.log(
      "Creating template with image:",
      templateDetails.image ? "Yes (base64)" : "No"
    );

    return new Promise((resolve, reject) => {
      createTemplateMutation.mutate(templateDetails, {
        onSuccess: (data) => {
          resolve(data);
          setTemplateId(data.data.id);
        },
        onError: (error) => {
          reject(error);
          toast.error("Failed to create template", {
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

    const tradesAndVariables = {
      trades: tradeObjects.map((trade) => trade.id),
      variables: variableObjects.map((variable) => variable.id),
    };

    updateTemplateMutation.mutate({ templateId, template: tradesAndVariables });
  };

  const handlePublishTemplate = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }

    publishTemplateMutation.mutate({
      templateId,
      template: {
        status: "published",
      },
    });
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
                image: formData.image, // Pass the image
              }}
              updateData={(data) => updateFormData("details", data)}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleCreateTemplate}>
                Next: Trades & Elements
              </Button>
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
              <Button onClick={handleUpdateTemplate}>Next: Preview</Button>
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
              <Button onClick={handlePublishTemplate}>Create Template</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
