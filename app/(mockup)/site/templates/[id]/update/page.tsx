"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";


// Import components from create template page
import TemplateDetailsStep from "@/components/mockup/create-template-page/template-details-step";
import TradesAndElementsStep from "@/components/mockup/create-template-page/template-and-elements-step";
import PreviewStep from "@/components/mockup/create-template-page/preview-step";
import VerticalStepIndicator from "@/components/mockup/create-template-page/vertical-step-indicator";
import { Header } from "@/components/mockup/create-template-page/header";
// import StepIndicator from "@/components/mockup/create-template-page/step-indicator";

// Import types and APIs
import {
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { updateTemplate } from "@/api/templates/update-template";
import { updateVariable } from "@/api/variables/update-variable";
import { getTemplate } from "@/query-options/templates";

export default function UpdateTemplate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const templateId = Array.isArray(id) ? id[0] : (id as string);

  const [currentStep, setCurrentStep] = useState<string>("details");
  
  const [formData, setFormData] = useState<TemplateCreateRequest>({
    name: "",
    description: "",
    image: undefined,
    status: "draft",
    is_public: false,
  });

  // Track if image has been changed to know whether to send it
  const [imageChanged, setImageChanged] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>([]);

  // Fetch template data
  const {
    data: templateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
  } = useQuery(getTemplate(templateId));

  // Initialize form with template data when it's loaded
  useEffect(() => {
    if (templateData) {
      console.log("Loading template data for edit:", templateData);
      
      // Store original image URL and reset image changed flag
      setOriginalImageUrl(templateData.image);
      setImageChanged(false); // Reset on data load
      
      setFormData({
        name: templateData.name || "",
        description: templateData.description || "",
        image: templateData.image, // Keep original URL format
        status: templateData.status || "draft",
        is_public: templateData.is_public || false,
      });

      if (templateData.trades && Array.isArray(templateData.trades)) {
        console.log("Setting trades:", templateData.trades);
        setTradeObjects(templateData.trades);
      }

      if (templateData.variables && Array.isArray(templateData.variables)) {
        console.log("Setting variables:", templateData.variables);
        setVariableObjects(templateData.variables);
      }
    }
  }, [templateData]);

  const updateFormData = (data: any) => {
    console.log("Updating form data:", data);
    
    // Check if image has been changed - only mark as changed if it's different from original
    if (data.image !== undefined) {
      const newImage = data.image;
      const hasChanged = newImage !== originalImageUrl;
      setImageChanged(hasChanged);
      console.log("Image changed:", hasChanged, "Original:", originalImageUrl, "New:", newImage);
    }
    
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Validation function to check if template data is valid
  const validateTemplateData = () => {
    if (!formData.name?.trim()) {
      toast.error("Template name is required");
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error("Template description is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === "details") {
      console.log("Moving from details to trades step");
      setCurrentStep("trades");
    } else if (currentStep === "trades") {
      console.log("Moving from trades to preview step");
      setCurrentStep("preview");
    }
  };

  const handleBack = () => {
    if (currentStep === "trades") {
      console.log("Moving back from trades to details step");
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      console.log("Moving back from preview to trades step");
      setCurrentStep("trades");
    }
  };

  // Function to update variable descriptions individually
  const updateVariableDescriptions = async (variables: VariableResponse[]) => {
    const updatePromises = variables
      .filter((variable) => 
        variable.description && 
        variable.description.trim() !== "" &&
        variable.variable_type?.id
      )
      .map((variable) =>
        updateVariable(variable.id, {
          name: variable.name,
          description: variable.description,
          formula: variable.formula,
          variable_type: variable.variable_type!.id,
        })
      );

    if (updatePromises.length > 0) {
      try {
        const results = await Promise.allSettled(updatePromises);
        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length > 0) {
          console.warn(`${failed.length} variable description updates failed`);
        }
        return results;
      } catch (error) {
        console.error("Error updating variable descriptions:", error);
        throw error;
      }
    }
    return [];
  };

  const { mutate: updateTemplateMutation, isPending: isUpdatingTemplate } =
    useMutation({
      mutationFn: (data: {
        templateId: string;
        template: TemplateUpdateRequest;
      }) => updateTemplate(data.templateId, data.template),
      onSuccess: () => {
        toast.success("Template updated successfully!", {
          description: "Your template has been saved",
        });
        // Invalidate and refetch template data
        queryClient.invalidateQueries({ queryKey: ["templates", templateId] });
        handleNext();
      },
      onError: (error: any) => {
        toast.error("Failed to update template", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      },
    });

  const { mutate: publishTemplateMutation, isPending: isPublishingTemplate } =
    useMutation({
      mutationFn: (data: {
        templateId: string;
        template: TemplateUpdateRequest;
      }) => updateTemplate(data.templateId, data.template),
      onSuccess: () => {
        toast.success("Template updated successfully!", {
          description: "Your template changes have been saved",
        });
        // Invalidate queries and navigate
        queryClient.invalidateQueries({ queryKey: ["templates"] });
        router.push("/site/templates");
      },
      onError: (error: any) => {
        toast.error("Failed to update template", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      },
    });

  const handleUpdateTemplate = async (step = currentStep) => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }

    // Validate form data
    if (!validateTemplateData()) {
      return Promise.reject("Validation failed");
    }
    
    // First update any variables that have descriptions
    if (variableObjects && variableObjects.length > 0) {
      try {
        const variableUpdateResults = await updateVariableDescriptions(variableObjects);
        console.log("Variable update results:", variableUpdateResults);
      } catch (error) {
        console.error("Error updating variable descriptions:", error);
        toast.error("Some variable descriptions could not be updated");
      }
    }

    // Prepare update data - only include image if it was actually changed
    const updateData: TemplateUpdateRequest = {
      name: formData.name || "",
      description: formData.description || "",
      trades: tradeObjects.map((trade) => trade.id).filter(Boolean),
      variables: variableObjects.map((variable) => variable.id).filter(Boolean),
      status: formData.status || "draft",
      is_public: formData.is_public || false,
    };

    // Only include image in update if it was actually changed AND it's base64 data
    if (imageChanged && formData.image && formData.image.startsWith('data:')) {
      updateData.image = formData.image;
      console.log("Including changed image in update (base64)");
    } else {
      console.log("Skipping image update - not changed or not base64");
    }

    console.log("Final update data being sent:", updateData);

    updateTemplateMutation({ templateId, template: updateData });
  };

  const handlePublishTemplate = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return;
    }

    // Validate form data
    if (!validateTemplateData()) {
      return;
    }
    
    // First update any variables that have descriptions
    if (variableObjects && variableObjects.length > 0) {
      try {
        await updateVariableDescriptions(variableObjects);
      } catch (error) {
        console.error("Error updating variable descriptions:", error);
        toast.error("Some variable descriptions could not be updated");
      }
    }

    const updateData: TemplateUpdateRequest = {
      name: formData.name || "",
      description: formData.description || "",
      trades: tradeObjects.map((trade) => trade.id).filter(Boolean),
      variables: variableObjects.map((variable) => variable.id).filter(Boolean),
      status: "published",
      is_public: formData.is_public || false,
    };

    // Only include image if it was changed
    if (imageChanged && formData.image && formData.image.startsWith('data:')) {
      updateData.image = formData.image;
    }

    publishTemplateMutation({ templateId, template: updateData });
  };

  const handleSaveAsDraft = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return;
    }

    // Basic validation for drafts (less strict)
    if (!formData.name?.trim()) {
      toast.error("Template name is required");
      return;
    }
    
    // First update any variables that have descriptions
    if (variableObjects && variableObjects.length > 0) {
      try {
        await updateVariableDescriptions(variableObjects);
      } catch (error) {
        console.error("Error updating variable descriptions:", error);
        toast.error("Some variable descriptions could not be updated");
      }
    }

    const updateData: TemplateUpdateRequest = {
      name: formData.name || "",
      description: formData.description || "",
      trades: tradeObjects.map((trade) => trade.id).filter(Boolean),
      variables: variableObjects.map((variable) => variable.id).filter(Boolean),
      status: "draft",
      is_public: formData.is_public || false,
    };

    // Only include image if it was changed
    if (imageChanged && formData.image && formData.image.startsWith('data:')) {
      updateData.image = formData.image;
    }

    updateTemplateMutation({ templateId, template: updateData });
  };

  // Simple tour functionality
  const startTour = () => {
    toast.info("Tour functionality will be implemented soon!", {
      description: "This will guide you through the template update process",
    });
  };

  // Loading state
  if (isTemplateLoading) {
    return (
      <div className="flex-1 p-6 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <LoaderCircle className="h-6 w-6 animate-spin" />
            <span>Loading template...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isTemplateError) {
    return (
      <div className="flex-1 p-6 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Template not found</h2>
            <p className="text-muted-foreground mb-4">
              The template you're looking for doesn't exist or has been deleted.
            </p>
            <Button 
              onClick={() => router.push("/site/templates")}
              className="rounded-full"
            >
              Go back to templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 pt-0">
      <Header
        title="Update Template"
        description="Update your template details, trades, and elements"
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
                  onClick={startTour}
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
                updateData={(data) => updateFormData(data)}
              />
              <div className="flex justify-end mt-6">
                <Button
                  className="rounded-full"
                  onClick={() => handleUpdateTemplate("details")}
                  disabled={isUpdatingTemplate}
                >
                  {isUpdatingTemplate ? (
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
                  disabled={isUpdatingTemplate}
                >
                  Back
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => handleUpdateTemplate()}
                  disabled={isUpdatingTemplate}
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
                  disabled={isPublishingTemplate || isUpdatingTemplate}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    className="rounded-full"
                    disabled={isPublishingTemplate || isUpdatingTemplate}
                  >
                    {isUpdatingTemplate ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save as Draft"
                    )}
                  </Button>
                  <Button
                    onClick={handlePublishTemplate}
                    className="rounded-full"
                    disabled={isPublishingTemplate || isUpdatingTemplate}
                  >
                    {isPublishingTemplate ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Template"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}