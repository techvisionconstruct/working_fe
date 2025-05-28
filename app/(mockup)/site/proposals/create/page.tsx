"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs, TabsContent, Button, Separator } from "@/components/shared";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

// Import our step components
import TemplateSelectionStep from "@/components/mockup/create-proposal-page/template-selection-tab";
import ProposalDetailsStep from "@/components/mockup/create-proposal-page/proposal-details-tab";
import TradesAndElementsStep from "@/components/mockup/create-proposal-page/trades-and-elements-tab";
import { CreateContract } from "@/components/mockup/create-proposal-page/create-contract";
import VerticalStepIndicator from "@/components/mockup/create-template-page/vertical-step-indicator";
import { Header } from "@/components/mockup/create-template-page/header";

import { createProposal } from "@/api-calls/proposals/create-proposal";
import { updateTemplate } from "@/api-calls/templates/update-template";
import { createContract } from "@/api-calls/contracts/create-contract";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ProposalCreateRequest, ProposalResponse } from "@/types/proposals/dto";
import { ContractCreateRequest } from "@/types/contracts/dto";
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
  const [createdProposal, setCreatedProposal] = useState<ProposalResponse>();
  const [contractId, setContractId] = useState<string>("");
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
      // Ensure isLoading is false when entering the contract/preview step
      setIsLoading(false);
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

  const createContractMutation = useMutation({
    mutationFn: (contractData: ContractCreateRequest) => createContract(contractData),
    onSuccess: (data) => {
      toast.success("Contract created successfully!");
      setContractId(data.data.id);
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
        // Proceed to contract creation step and reset loading state
        setIsLoading(false);
        setCurrentStep("preview");
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
        onSuccess: async (proposalData) => {
          try {
            // Update local state with proposal data
            setTradeObjects(proposalData.data.template.trades);
            setVariableObjects(proposalData.data.template.variables);
            setTemplate(proposalData.data.template);
            setTemplateId(proposalData.data.template.id);
            setCreatedProposal(proposalData.data);

            toast.success("Proposal created successfully!");

            // Now create a contract based on the proposal
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
                setIsLoading(false);
                handleNext();
              },
              onError: (error) => {
                setIsLoading(false);
                toast.error("Failed to create contract", {
                  description:
                    error instanceof Error
                      ? error.message
                      : "Please try again later",
                });
                // Still resolve with proposal data since proposal was created
                resolve(proposalData);
                handleNext();
              },
            });
          } catch (error) {
            setIsLoading(false);
            toast.error("Proposal created but contract creation failed");
            resolve(proposalData);
            handleNext();
          }
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

    // Ensure that we set loading to false if the mutation doesn't handle it directly
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 2000);
  };

  const [isSending, setIsSending] = useState(false);

  // Function to send the proposal/contract to the client
  const sendProposalToClient = async () => {
    if (!createdProposal?.id) {
      toast.error("No proposal to send");
      return;
    }

    setIsSending(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/v1/proposals/send/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposal_id: createdProposal.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send proposal");
      }

      toast.success("Proposal has been sent to the client successfully.");
    } catch (error) {
      console.error("Error sending proposal:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the proposal."
      );
    } finally {
      setIsSending(false);
    }
  };

  // Effect to ensure isLoading is reset when on preview/contract step
  useEffect(() => {
    if (currentStep === "preview") {
      setIsLoading(false);
    }
  }, [currentStep]);

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
              steps={["Template Selection", "Proposal Details", "Trades & Elements", "Contract Creation"]}
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
                  onClick={handleCreateProposalAndContract}
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
                      Processing...
                    </>
                  ) : (
                    "Next: Contract Creation"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="px-4">
              {createdProposal ? (
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                          Contract Creation
                        </h1>
                        <p className="text-muted-foreground">
                          You are about to create a contract based on the proposal you just created.
                        </p>
                      </div>
                      <div className="flex justify-between gap-2 mt-6">
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
                          onClick={sendProposalToClient}
                          disabled={isSending || !createdProposal?.client_email}
                        >
                          {isSending ? (
                            <>
                              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Contract to Client"
                          )}
                        </Button>

                      </div>
                    </div>
                    <Separator />
                  </div>
                  <CreateContract
                    contract_id={contractId || `new_${createdProposal.id}`}
                    proposal={createdProposal}
                  />
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-xl font-medium">Processing Proposal Data</div>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Please wait while we prepare your contract creation interface.
                  </p>
                  <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
