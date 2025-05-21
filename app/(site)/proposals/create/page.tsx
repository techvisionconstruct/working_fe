"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HelpCircle, Send, Save } from "lucide-react";

// Import tour component
import { CreateProposalTour } from "@/components/features/tour-guide/create-proposal-tour";

// Import our step components
import TemplateSelectionStep from "@/components/features/create-proposal-page/template-selection-tab";
import ProposalDetailsStep from "@/components/features/create-proposal-page/proposal-details-tab";
import TradesAndElementsStep from "@/components/features/create-proposal-page/trades-and-elements-tab";
import PreviewStep from "@/components/features/create-proposal-page/preview-tab";
import StepIndicator from "@/components/features/create-proposal-page/step-indicator";

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
import { ProposalResponse } from "@/types/proposals/dto";
import { CreateContract } from "@/components/features/create-proposal-page/create-contract";
import { createContract } from "@/api/contracts/create-contract";
import { ContractCreateRequest } from "@/types/contracts/dto";

interface ProposalDetailsProps {
  proposal?: ProposalResponse; // Make proposal optional
}

export default function CreateProposalPage({ proposal }: ProposalDetailsProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("template");
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [createdProposal, setCreatedProposal] =
    useState<ProposalResponse | null>(proposal || null); // Initialize with proposal if available
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
    name: proposal?.name || "",
    description: proposal?.description || "",
    image: proposal?.image || "",
    client_name: proposal?.client_name || "",
    client_email: proposal?.client_email || "",
    client_phone: proposal?.client_phone || "",
    client_address: proposal?.client_address || "",
    valid_until:
      proposal?.valid_until
        ? typeof proposal.valid_until === "string"
          ? proposal.valid_until
          : proposal.valid_until.toISOString()
        : "",
    location: "",
    status: proposal?.status || "draft",
    template: proposal?.template || null,
  });

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>(
    proposal?.template?.trades || []
  );
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
    proposal?.template?.variables || []
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
      setCurrentStep("contract");
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("template");
    } else if (currentStep === "trades") {
      setCurrentStep("details");
    } else if (currentStep === "contract") {
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
      },
      onError: (error: any) => {
        toast.error("Failed to update template", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      },
    });

  const handleCreateProposalAndContract = async () => {
    const templateId = formData.template ? formData.template.id : null;

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
        onSuccess: async (proposalData) => {
          try {
            // Set proposal data first
            setTradeObjects(proposalData.data.template.trades);
            setVariableObjects(proposalData.data.template.variables);
            setTemplate(proposalData.data.template);
            setTemplateId(proposalData.data.template.id);
            setCreatedProposal(proposalData.data);

            toast.success("Proposal created successfully!");

            // Now create the contract
            const contractPayload: ContractCreateRequest = {
              name: proposalData.data.name || "",
              description: proposalData.data.description || "",
              status: undefined,
              contractor_initials: undefined,
              contractor_signature: undefined,
              terms: "",
              service_agreement_content: "",
              proposal_id: proposalData.data.id,
            };

            // Create contract using the mutation
            createContractMutation.mutate(contractPayload, {
              onSuccess: (contractData) => {
                setContract(contractData);
                toast.success("Contract created successfully!");
                resolve(proposalData);
                handleNext(); // Move to trades step
              },
              onError: (contractError) => {
                // Even if contract creation fails, we still have the proposal
                toast.error("Proposal created but contract creation failed", {
                  description:
                    contractError instanceof Error
                      ? contractError.message
                      : "Contract will be created later",
                });
                resolve(proposalData);
                handleNext(); // Still move to trades step
              },
            });
          } catch (error) {
            // If anything goes wrong with contract creation, still proceed
            toast.error("Proposal created but contract creation failed");
            resolve(proposalData);
            handleNext();
          }
        },
        onError: (error) => {
          reject(error);
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

    const tradesAndVariables = {
      trades: tradeObjects.map((trade) => trade.id),
      variables: variableObjects.map((variable) => variable.id),
    };

    updateTemplateMutation({ templateId, template: tradesAndVariables });
  };

  // Update startTour function with improved class identification
  const startTour = () => {
    try {
      // First ensure we're on the template tab
      setCurrentStep("template");

      console.log("[Tour] Preparing to start proposal tour");

      // Allow tab switch to happen first
      setTimeout(() => {
        try {
          console.log("[Tour] Adding CSS classes for tour targeting");

          // Add CSS classes for steps and make elements focusable
          document.querySelectorAll('[role="tab"]').forEach((tab) => {
            try {
              const value =
                tab.getAttribute("data-value") || tab.getAttribute("value");
              if (value) {
                tab.classList.add("tab-trigger");
                tab.setAttribute("data-value", value);
                tab.setAttribute("tabindex", "0");
                console.log(`[Tour] Found tab: ${value}`);
              }
            } catch (e) {
              console.error("[Tour] Error processing tab", e);
            }
          });

          // Add classes to tab contents for targeting
          document.querySelectorAll('[role="tabpanel"]').forEach((content) => {
            try {
              const tabId =
                content.getAttribute("id") ||
                content.getAttribute("data-state");
              if (tabId) {
                const tabValue = tabId
                  .replace("content-", "")
                  .replace("-tabpanel", "");
                content.classList.add(`${tabValue}-tab-content`);
                console.log(`[Tour] Found tab content: ${tabValue}`);
              }
            } catch (e) {
              console.error("[Tour] Error processing tab content", e);
            }
          });

          // Ensure trade and variable columns are properly marked
          document
            .querySelector(".lg\\:col-span-2")
            ?.classList.add("trade-column");
          document
            .querySelector(".lg\\:col-span-2")
            ?.setAttribute("tabindex", "0");

          document
            .querySelector(".variable-column, .lg\\:col-span-1")
            ?.setAttribute("tabindex", "0");

          // If trade column wasn't found by the selector above, try more generic approach
          if (!document.querySelector(".trade-column")) {
            const columns = document.querySelectorAll(
              ".grid.grid-cols-1.lg\\:grid-cols-3 > div"
            );
            if (columns.length > 0) {
              columns[0].classList.add("trade-column");
              columns[0].setAttribute("tabindex", "0");
              console.log(
                "[Tour] Added class to trade column (alternate selector)"
              );
            }

            if (
              columns.length > 1 &&
              !document.querySelector(".variable-column")
            ) {
              columns[1].classList.add("variable-column");
              columns[1].setAttribute("tabindex", "0");
              console.log(
                "[Tour] Added class to variable column (alternate selector)"
              );
            }
          }

          console.log("[Tour] Starting proposal tour");
          setIsTourRunning(true);
        } catch (error) {
          console.error("[Tour] Error preparing tour:", error);
        }
      }, 500); // Give more time for the DOM to be ready
    } catch (error) {
      console.error("[Tour] Error in startTour:", error);
    }
  };

  const [isSending, setIsSending] = useState(false);
  const sendProposalToClient = async () => {
    const proposalToSend = createdProposal || proposal;
    if (!proposalToSend?.id) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/v1/proposals/send/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposal_id: proposalToSend.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send proposal");
      }

      alert("Proposal has been sent to the client successfully.");

      router.push('/proposals');

    } catch (error) {
      console.error("Error sending proposal:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the proposal."
      );
    } finally {
      setIsSending(false);
    }
  };

  // Safe contract initialization
  const [contract, setContract] = useState(proposal?.contract || null);

  const createContractMutation = useMutation({
    mutationFn: (contractData: ContractCreateRequest) =>
      createContract(contractData),
    onSuccess: (data) => {
      setContract(data);
      toast.success("Contract created successfully!");
      handleNext(); // Move to next step after contract creation
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create contract: ${error.message || "Unknown error"}`
      );
    },
  });

  // Function to handle contract creation (copy logic from CreateContract)
  const handleCreateContract = () => {
    const proposalToUse = createdProposal || proposal;
    if (!proposalToUse) return;

    const payload: ContractCreateRequest = {
      name: proposalToUse?.name || "",
      description: proposalToUse?.description || "",
      status: proposalToUse?.contract?.status || undefined,
      contractor_initials: undefined,
      contractor_signature: undefined,
      terms: "",
      service_agreement_content: "",
      proposal_id: proposalToUse?.id || undefined,
    };
    createContractMutation.mutate(payload);
  };

  return (
    <div className="container">
      <div className="mb-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Create New Proposal</h1>
            <p className="text-muted-foreground text-sm">
              Create a new proposal by following the steps below.
            </p>
          </div>
          {(currentStep === "trades" || currentStep === "contract") && (
            <div className="flex flex-row gap-2 justify-end mt-6">
              {currentStep === "trades" && (
                <>
                  <Button onClick={handleUpdateTemplate}>Save as Draft</Button>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={sendProposalToClient}
                    disabled={
                      isSending ||
                      (!createdProposal && !proposal) ||
                      !(createdProposal?.client_email || proposal?.client_email)
                    }
                  >
                    {isSending ? (
                      <span className="inline-flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Send Proposal to
                        Client
                      </>
                    )}
                  </Button>
                </>
              )}
              {currentStep === "contract" && (
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={sendProposalToClient}
                  disabled={
                    isSending ||
                    (!createdProposal && !proposal) ||
                    !(createdProposal?.client_email || proposal?.client_email)
                  }
                >
                  {isSending ? (
                    <span className="inline-flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Contract to Client
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Card className="w-full">
        <div className="w-full mx-auto pl-6 pr-8 py-6 border-b">
          <StepIndicator
            steps={[
              "Template Selection",
              "Proposal Details",
              "Trades & Elements",
              "Create Contract",
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
          <TabsContent value="template" className="p-6 template-tab-content">
            <TemplateSelectionStep
              data={formData.template}
              updateData={(template) => updateFormData({ template })}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>Next: Proposal Details</Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-6 details-tab-content">
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
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleCreateProposalAndContract}
                disabled={
                  createProposalMutation.isPending ||
                  createContractMutation.isPending
                }
                className="flex items-center gap-2"
              >
                {createProposalMutation.isPending ||
                createContractMutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Next: Trades & Elements"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="p-6 trades-tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 trade-column">
                {/* Trade column contents */}
              </div>
              <div className="variable-column">
                {/* Variable column contents */}
              </div>
            </div>
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
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next: Create Contract</Button>
            </div>
          </TabsContent>

          <TabsContent value="contract" className="p-6 contract-tab-content">
            {/* Only render CreateContract if we have a proposal */}
            {(createdProposal || proposal) && (
              <CreateContract proposal={(createdProposal || proposal)!} />
            )}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Tour component */}
      <CreateProposalTour
        isRunning={isTourRunning}
        setIsRunning={setIsTourRunning}
        activeTab={currentStep}
        setActiveTab={setCurrentStep}
      />

      {/* Help button to start tour */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={startTour}
          variant="secondary"
          className="rounded-full w-12 h-12 shadow-lg bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-gray-200"
          aria-label="Start tour guide"
        >
          <HelpCircle size={24} />
        </Button>
      </div>
    </div>
  );
}
