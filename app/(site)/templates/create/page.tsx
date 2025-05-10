"use client";

import React, { useState, useRef } from "react";
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
import { ElementResponse } from "@/types/elements/dto";
import { createTemplate } from "@/api/templates/create-template";
import { updateTemplate } from "@/api/templates/update-template";
import { useRouter } from "next/navigation";

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
  const [elementObjects, setElementObjects] = useState<ElementResponse[]>([]);
  const [missingVariable, setMissingVariable] = useState<string | null>(null);
  const [showMissingVariableDialog, setShowMissingVariableDialog] =
    useState(false);

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

  const validateTemplateDetails = () => {
    if (!formData.name.trim()) {
      toast.error("Fill up the Template Name");
      return false;
    }
    return true;
  };

  const validateTradesAndElements = () => {
    if (tradeObjects.length === 0 || variableObjects.length === 0) {
      toast.error("Add at least one Variables, Trades, and Elements.");
      return false;
    }
    // Check if at least one trade has at least one element
    const hasAnyElement = tradeObjects.some(
      (trade) => Array.isArray(trade.elements) && trade.elements.length > 0
    );
    if (!hasAnyElement) {
      toast.error("Add at least one Element to a Trade.");
      return false;
    }
    return true;
  };

  const handleCreateTemplate = async () => {
    if (!validateTemplateDetails()) {
      return;
    }

    setIsLoading(true); // Start loader

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
          setIsLoading(false); // Stop loader
        },
        onError: (error) => {
          reject(error);
          setIsLoading(false); // Stop loader
          toast.error("Failed to create template", {
            description:
              error instanceof Error ? error.message : "Please try again later",
          });
        },
      });
    });
  };

  // --- Update handleUpdateTemplate to check for missing variables ---
  const handleUpdateTemplate = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }

    if (!validateTradesAndElements()) {
      return;
    }

    if (!checkForMissingVariables()) {
      return;
    }

    setIsLoading(true); // Start loader

    const tradesAndVariables = {
      trades: tradeObjects.map((trade) => trade.id),
      variables: variableObjects.map((variable) => variable.id),
    };

    updateTemplateMutation.mutate(
      { templateId, template: tradesAndVariables },
      {
        onSettled: () => {
          setIsLoading(false); // Stop loader after success or error
        },
      }
    );
  };

  const handlePublishTemplate = async () => {
    if (!templateId) {
      toast.error("Template ID is missing");
      return Promise.reject("Template ID is missing");
    }

    setIsLoading(true); // Start loader

    publishTemplateMutation.mutate(
      {
        templateId,
        template: {
          status: "published",
        },
      },
      {
        onSettled: () => {
          setIsLoading(false); // Stop loader after success or error
        },
      }
    );
  };

  // Helper: Check for variables used in elements but missing from variableObjects
  const checkForMissingVariables = () => {
    // Gather all variable names used in elements' formulas
    const usedVariableNames = new Set<string>();
    tradeObjects.forEach((trade) => {
      (trade.elements || []).forEach((element) => {
        (element.material_formula_variables || []).forEach((v) =>
          usedVariableNames.add(v.name)
        );
        (element.labor_formula_variables || []).forEach((v) =>
          usedVariableNames.add(v.name)
        );
      });
    });
    // Gather all variable names in the variable list
    const variableNames = new Set(variableObjects.map((v) => v.name));
    // Find missing
    for (const name of usedVariableNames) {
      if (!variableNames.has(name)) {
        setMissingVariable(name);
        setShowMissingVariableDialog(true);
        return false;
      }
    }
    return true;
  };

  const [pendingVariableToAdd, setPendingVariableToAdd] = useState<
    string | null
  >(null);
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);

  function ensureVariablesExistInList(element: ElementResponse) {
    const usedVars = [
      ...(element.material_formula_variables || []),
      ...(element.labor_formula_variables || []),
    ];
    const missingVars = usedVars.filter(
      (v) => !variableObjects.some((obj) => obj.name === v.name)
    );
    if (missingVars.length > 0) {
      setVariableObjects((prev) => [
        ...prev,
        ...missingVars.map((v) => ({
          id: Date.now().toString() + Math.random(),
          name: v.name,
          description: "",
          value: 0,
          is_global: false,
          variable_type: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      ]);
    }
  }

  function checkAndPromptForMissingVariables(element: ElementResponse) {
    const usedVars = [
      ...(element.material_formula_variables || []),
      ...(element.labor_formula_variables || []),
    ];
    const missingVar = usedVars.find(
      (v) => !variableObjects.some((obj) => obj.name === v.name)
    );
    if (missingVar) {
      setPendingVariableToAdd(missingVar.name);
      setShowAddVariableDialog(true);
      return false; // Prevent add until user decides
    }
    return true;
  }

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

      {showMissingVariableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">
              Variable Missing from List
            </h2>
            <p>
              The variable <b>{missingVariable}</b> is currently being used in
              an element but is not in the Variable List.
            </p>
            <p className="mt-2">
              Would you like to create it or delete the variable from the
              element?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMissingVariableDialog(false);
                  // Create the variable
                  if (missingVariable) {
                    setVariableObjects([
                      ...variableObjects,
                      {
                        id: Date.now().toString(),
                        name: missingVariable,
                        description: "",
                        value: 0,
                        is_global: false,
                        variable_type: undefined,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      },
                    ]);
                  }
                }}
              >
                Create Variable
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowMissingVariableDialog(false);
                  if (missingVariable) {
                    // Try to find the variable object by name
                    const missingVarObj = variableObjects.find(
                      (v) => v.name === missingVariable
                    );
                    // Always build both patterns
                    const variableNamePattern = new RegExp(
                      `\\{\\s*${missingVariable}\\s*\\}`,
                      "g"
                    );
                    // If we have an ID, remove by ID too, otherwise try to match any {alphanumeric} that matches the missing variable's pattern
                    const variableIdPattern = missingVarObj
                      ? new RegExp(`\\{\\s*${missingVarObj.id}\\s*\\}`, "g")
                      : null;

                    // Remove both {name} and {id} from the formula string
                    const cleanFormula = (formula: string | undefined) => {
                      if (!formula) return "";
                      let cleaned = formula.replace(variableNamePattern, "");
                      // Remove any {id} pattern if possible
                      if (variableIdPattern) {
                        cleaned = cleaned.replace(variableIdPattern, "");
                      } else {
                        // Try to remove any orphaned {alphanumeric} that matches an id-like pattern
                        cleaned = cleaned.replace(
                          /\{\s*[a-zA-Z0-9\-_]+\s*\}/g,
                          ""
                        );
                      }
                      // Remove any double operators or leftover operators at the ends
                      cleaned = cleaned.replace(
                        /([+\-*/^])\s*([+\-*/^])/g,
                        "$1"
                      );
                      cleaned = cleaned.replace(
                        /^\s*([+\-*/^])\s*|\s*([+\-*/^])\s*$/g,
                        ""
                      );
                      // Remove extra spaces
                      cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
                      return cleaned;
                    };

                    // Update all trades/elements
                    const updatedTrades = tradeObjects.map((trade) => ({
                      ...trade,
                      elements: (trade.elements || []).map((element) => ({
                        ...element,
                        material_formula_variables: (
                          element.material_formula_variables || []
                        ).filter(
                          (v) =>
                            v.name !== missingVariable &&
                            v.id !== missingVarObj?.id
                        ),
                        labor_formula_variables: (
                          element.labor_formula_variables || []
                        ).filter(
                          (v) =>
                            v.name !== missingVariable &&
                            v.id !== missingVarObj?.id
                        ),
                        material_cost_formula: cleanFormula(
                          element.material_cost_formula
                        ),
                        labor_cost_formula: cleanFormula(
                          element.labor_cost_formula
                        ),
                      })),
                    }));

                    setTradeObjects(updatedTrades);

                    setElementObjects((prev) =>
                      prev.map((element) => ({
                        ...element,
                        material_formula_variables: (
                          element.material_formula_variables || []
                        ).filter(
                          (v) =>
                            v.name !== missingVariable &&
                            v.id !== missingVarObj?.id
                        ),
                        labor_formula_variables: (
                          element.labor_formula_variables || []
                        ).filter(
                          (v) =>
                            v.name !== missingVariable &&
                            v.id !== missingVarObj?.id
                        ),
                        material_cost_formula: cleanFormula(
                          element.material_cost_formula
                        ),
                        labor_cost_formula: cleanFormula(
                          element.labor_cost_formula
                        ),
                      }))
                    );

                    toast.success(
                      `Removed "${missingVariable}" from all element formulas.`
                    );
                  }
                }}
              >
                Delete Variable from Element
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddVariableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">
              Add Variable to List?
            </h2>
            <p>
              The variable <b>{pendingVariableToAdd}</b> is used in an element
              but is not in the variable list.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddVariableDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!pendingVariableToAdd) return;
                  setVariableObjects((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      name: pendingVariableToAdd,
                      description: "",
                      value: 0,
                      is_global: false,
                      variable_type: undefined,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    },
                  ]);
                  setShowAddVariableDialog(false);
                  setPendingVariableToAdd(null);
                }}
              >
                Add Variable
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center">
            <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></span>
            <span className="text-lg font-semibold text-white drop-shadow">
              Processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
