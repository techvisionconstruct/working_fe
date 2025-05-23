"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import TemplateDetailsStep from "@/components/mockup/create-template-page/template-details-step";
import TradesAndElementsStep from "@/components/mockup/create-template-page/template-and-elements-step";
import PreviewStep from "@/components/mockup/create-template-page/preview-step";
import VerticalStepIndicator from "@/components/mockup/create-template-page/vertical-step-indicator";
import {
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { createTemplate } from "@/api/templates/create-template";
import { updateTemplate } from "@/api/templates/update-template";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Header } from "@/components/mockup/create-template-page/header";

export default function CreateTemplate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("details");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

      setTimeout(() => {
        router.push("/site/templates");
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
    const templateDetails = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      status: "draft",
    };
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

  const handleUpdateTemplate = async (step = currentStep) => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }
    const updateData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      trades: tradeObjects.map((trade) => trade.id),
      variables: variableObjects.map((variable) => variable.id),
      status: "draft",
    };

    updateTemplateMutation.mutate({ templateId, template: updateData });
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
    <div className="flex-1 p-6 pt-0">
      <Header
        title="Create New Template"
        description="Design and save a reusable template to streamline your workflow."
      />

      <div className="flex gap-3 mt-6">
        <div className="w-64 shrink-0">
          <div className="sticky top-20">
            <VerticalStepIndicator
              steps={["Template Details", "Trades & Elements", "Preview"]}
              currentStep={
                currentStep === "details" ? 0 : currentStep === "trades" ? 1 : 2
              }
              className="h-[calc(100vh-600px)]"
            />
            <div className="mt-4">
              <div className="border rounded-2xl p-4 shadow-sm">
                <h1 className="font-bold">Not sure what to do next?</h1>
                <p className="text-sm text-muted-foreground mb-3">
                  Let the tour walk you through the essentials.
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
            <TabsContent value="details" className="px-4">
              <TemplateDetailsStep
                data={{
                  name: formData.name,
                  description: formData.description || "",
                  image: formData.image,
                }}
                updateData={(data) => updateFormData("details", data)}
              />
              <div className="flex justify-end mt-6">
                <Button
                  className="rounded-full"
                  onClick={() => {
                    if (templateId) {
                      handleUpdateTemplate("details");
                    } else {
                      handleCreateTemplate();
                    }
                  }}
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
                  Next: Preview
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="px-4">
              <PreviewStep
                data={formData}
                tradeObjects={tradeObjects}
                variableObjects={variableObjects}
              />
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePublishTemplate}
                  className="rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Create Template"
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
