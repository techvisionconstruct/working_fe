"use client";

import React, { useState } from "react";
import { Card, Tabs, TabsContent, Button } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

// Import our step components
import TemplateSelectionStep from "@/components/features/create-proposal-page/template-selection-tab";
import ProposalDetailsStep from "@/components/features/create-proposal-page/proposal-details-tab";
import TradesAndElementsStep from "@/components/features/create-proposal-page/trades-and-elements-tab";
import StepIndicator from "@/components/features/create-proposal-page/step-indicator";

import { createProposal } from "@/api-calls/proposals/create-proposal";
import { updateTemplate } from "@/api-calls/templates/update-template";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import {
  TemplateResponse,
  TemplateUpdateRequest,
} from "@/types/templates/dto";
import { ProposalResponse } from "@/types/proposals/dto";
import { CreateContract } from "@/components/features/create-proposal-page/create-contract";
import { createContract } from "@/api-calls/contracts/create-contract";
import { ContractCreateRequest } from "@/types/contracts/dto";

interface ProposalDetailsProps {
  proposal?: ProposalResponse; // Make proposal optional
}

export default function CreateProposalPage({ proposal }: ProposalDetailsProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("template");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string>("");
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [createdProposal, setCreatedProposal] = useState<ProposalResponse>();
  console.log("Created Proposal:", createdProposal);
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
    valid_until: proposal?.valid_until
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
      handleUpdateTemplate();
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

  const createContractMutation = useMutation({
    mutationFn: (contractData: ContractCreateRequest) =>
      createContract(contractData),
    onSuccess: () => {
      toast.success("Contract created successfully!");
      handleNext(); // Move to next step after contract creation
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create contract: ${error.message || "Unknown error"}`
      );
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
            setTradeObjects(proposalData.data.template.trades);
            setVariableObjects(proposalData.data.template.variables);
            setTemplate(proposalData.data.template);
            setTemplateId(proposalData.data.template.id);
            setCreatedProposal(proposalData.data);

            toast.success("Proposal created successfully!");

            const contractDetails = {
              name: proposalData.data.name || "",
              description: proposalData.data.description || "",
              status: proposalData.data.status || undefined,
              contractor_initials: undefined,
              contractor_signature: undefined,
              terms: undefined,
              service_agreement_content: undefined,
              service_agreement_id: undefined,
              proposal_id: proposalData.data.id || undefined,
            };
            createContractMutation.mutate(contractDetails, {
              onSuccess: (contractData) => {
                setContractId(contractData.data.id);
                toast.success("Contract created successfully!");
                resolve(proposalData);
                handleNext();
              },
              onError: (error) => {
                toast.error("Failed to create contract", {
                  description:
                    error instanceof Error
                      ? error.message
                      : "Please try again later",
                });
              },
            });
          } catch (error) {
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

      router.push("/proposals");
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
                // Update the created proposal with the new trades
                if (createdProposal && createdProposal.template && createdProposal.template.id) {
                  setCreatedProposal({
                    ...createdProposal,
                    template: {
                      ...createdProposal.template,
                      trades: trades,
                    },
                  });
                }
              }}
              updateVariables={(variables) => {
                setVariableObjects(variables);
                updateFormData({
                  variables: variables.map((variable) => variable.id),
                });
                // Update the created proposal with the new variables
                if (createdProposal && createdProposal.template && createdProposal.template.id) {
                  setCreatedProposal({
                    ...createdProposal,
                    template: {
                      ...createdProposal.template,
                      variables: variables,
                    },
                  });
                }
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
            
              <CreateContract contract_id={contractId} proposal={createdProposal} />
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
     
    </div>
  );
}
