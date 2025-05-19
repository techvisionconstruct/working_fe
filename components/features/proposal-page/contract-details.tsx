import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createContract } from "@/api/contracts/create-contract";
import { updateContract } from "@/api/contracts/update-contract";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Input,
  Button,
  Label,
} from "@/components/shared";
import { Alert } from "@/components/shared/alert/alert";
import { AlertTitle } from "@/components/shared/alert/alert-title";
import { AlertDescription } from "@/components/shared/alert/alert-description";
import { toast } from "sonner";
import { ProposalResponse } from "@/types/proposals/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { AlertTriangle, Save, RefreshCcw } from "lucide-react";
import { ContractCreateRequest } from "@/types/contracts/dto";

interface TermSection {
  id: number;
  title: string;
  description: string;
}

interface Signature {
  type: "text" | "image";
  value: string;
  file: File | null;
}

interface ContractDetailsProps {
  proposal: ProposalResponse;
}

export function ContractDetails({ proposal }: ContractDetailsProps) {
  const [isSending, setIsSending] = useState(false);
  // Add local contract state
  const [localContract, setLocalContract] = useState(proposal.contract);
  // Use localContract if available, otherwise fallback to proposal.contract
  const contract = localContract || proposal.contract;

  const parseTermsAndConditions = (termsString: string): TermSection[] => {
    if (!termsString) return [];

    const lines = termsString.split(/\r?\n/);
    const sections: TermSection[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === "") return;

      const colonIndex = line.indexOf(":");

      if (colonIndex > 0 && colonIndex < line.length - 1) {
        const title = line.substring(0, colonIndex).trim();
        const description = line.substring(colonIndex + 1).trim();

        sections.push({
          id: sections.length + 1,
          title,
          description,
        });
      } else {
        sections.push({
          id: sections.length + 1,
          title: `Section ${sections.length + 1}`,
          description: trimmedLine,
        });
      }
    });

    return sections;
  };

  const getSignatureData = (
    initials: string | null,
    image: string | null
  ): Signature => {
    if (image) {
      return {
        type: "image",
        value: image,
        file: null,
      };
    } else {
      return {
        type: "text",
        value: initials || "",
        file: null,
      };
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionId?: number
  ) => {
    const { name, value } = e.target;

    // Check if this is a terms field
    if (name === "termsTitle" || name === "termsDescription") {
      if (sectionId) {
        setTermsSections((prev) =>
          prev.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  [name === "termsTitle" ? "title" : "description"]: value,
                }
              : section
          )
        );
      }
    }
    // Check if this is a signature field
    else if (name === "clientInitials" || name === "contractorInitials") {
      const party = name === "clientInitials" ? "client" : "contractor";
      setSignatures((prev) => ({
        ...prev,
        [party]: {
          ...prev[party as keyof typeof prev],
          type: "text",
          value: value,
        },
      }));
    }
    // Agreement title (for demonstration, just log)
    else if (name === "agreementTitle") {
      // If you want to store agreementTitle in state, add a state for it
      // For now, just log
      console.log("Agreement Title changed:", value);
    }
  };

  const handleSignatureTypeChange = (
    party: "client" | "contractor",
    type: "text" | "image"
  ) => {
    setSignatures((prev) => ({
      ...prev,
      [party]: {
        ...prev[party],
        type: type,
        // Reset value when switching types
        value: type === "text" ? prev[party].value : "",
        file: type === "image" ? prev[party].file : null,
      },
    }));
  };

  const handleSignatureImageUpload = async (
    party: "client" | "contractor",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setSignatures((prev) => ({
          ...prev,
          [party]: {
            ...prev[party],
            type: "image",
            value: base64String, // Store base64 string instead of blob URL
            file: file, // Keep the original file if needed
          },
        }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const addTermsSection = () => {
    const newId =
      termsSections.length > 0
        ? Math.max(...termsSections.map((s) => s.id)) + 1
        : 1;

    setTermsSections((prev) => [
      ...prev,
      {
        id: newId,
        title: "New Section",
        description: "Enter section content here.",
      },
    ]);
  };

  // Remove a terms section
  const removeTermsSection = (id: number) => {
    setTermsSections((prev) => prev.filter((section) => section.id !== id));
  };

  // State for terms and conditions - parse from termsAndConditions string if available
  const [termsSections, setTermsSections] = useState<TermSection[]>(() => {
    if (contract?.terms) {
      if (typeof contract.terms === "string") {
        return parseTermsAndConditions(contract.terms);
      } else {
        return contract.terms as TermSection[];
      }
    } else {
      return [
        {
          id: 1,
          title: "Payment Procedures",
          description:
            "The payment is due within 30 days of invoice receipt. Late payments are subject to a 1.5% monthly interest charge.",
        },
        {
          id: 2,
          title: "Agreement",
          description:
            "By signing this document, both parties agree to the terms and conditions outlined in this contract.",
        },
      ];
    }
  });

  // State for signatures - use contract signature data if available
  const [signatures, setSignatures] = useState<{
    client: Signature;
    contractor: Signature;
  }>(() => {
    if (
      contract?.client_initials !== undefined ||
      contract?.client_signature !== undefined ||
      contract?.contractor_initials !== undefined ||
      contract?.contractor_signature !== undefined
    ) {
      return {
        client: getSignatureData(
          contract.client_initials ?? null,
          contract.client_signature ?? null
        ),
        contractor: getSignatureData(
          contract.contractor_initials ?? null,
          contract.contractor_signature ?? null
        ),
      };
    } else {
      return {
        client: {
          type: "text",
          value: "",
          file: null,
        },
        contractor: {
          type: "text",
          value: "",
          file: null,
        },
      };
    }
  });

  // Check if contract is already signed by client
  const isContractSigned = !!(
    contract?.client_signature ||
    (contract?.client_initials && contract?.client_initials.trim() !== "")
  );

  // State to track if editing mode is active - disabled if contract is signed
  const [isEditing, setIsEditing] = useState(false);

  // Create contract mutation
  const createContractMutation = useMutation({
    mutationFn: (contractData: ContractCreateRequest) =>
      createContract(contractData),
    onSuccess: (data) => {
      toast.success("Contract created successfully!");
      setLocalContract(data); // Update local contract state
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create contract: ${error.message || "Unknown error"}`
      );
    },
  });

  // Update contract mutation
  const updateContractMutation = useMutation({
    mutationFn: ({
      id,
      contract,
    }: {
      id: string;
      contract: Partial<ContractCreateRequest>;
    }) => updateContract(id, contract),
    onSuccess: (data) => {
      toast.success("Contract updated successfully!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update contract: ${error.message || "Unknown error"}`
      );
    },
  });

  // Handle contract submit
  const handleSubmit = () => {
    const termsString = termsSections
      .map((section) => `${section.title}: ${section.description}`)
      .join("\n");
    const payload: ContractCreateRequest = {
      name: proposal?.name || "",
      description: proposal?.description || "",
      status: proposal?.contract?.status || undefined,
      contractor_initials:
        signatures.contractor.type === "text"
          ? signatures.contractor.value
          : undefined,
      contractor_signature:
        signatures.contractor.type === "image"
          ? signatures.contractor.value
          : undefined,
      terms: termsString,
      proposal_id: proposal?.id || undefined,
    };
    if (proposal.contract && proposal.contract.id) {
      updateContractMutation.mutate({
        id: proposal.contract.id,
        contract: payload,
      });
    } else {
      createContractMutation.mutate(payload);
    }
  };

  const sendProposalToClient = async () => {
    if (!proposal.id) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    setIsSending(true);
    try {
      const response = await fetch(
        `${API_URL}/v1/proposals/send/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proposal_id: proposal.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send proposal");
      }

      // Show success message
      alert("Proposal has been sent to the client successfully.");
    } catch (error) {
      console.error("Error sending proposal:", error);
      // Show error message
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the proposal."
      );
    } finally {
      setIsSending(false);
    }
  };

  // Disable editing if contract is signed
  React.useEffect(() => {
    if (isContractSigned && isEditing) {
      setIsEditing(false);
    }
  }, [isContractSigned]);

  return (
    <div className="w-full mx-auto">
      {contract == null && (
        <Alert className="mb-4 border-yellow-300 bg-yellow-50 text-yellow-900 flex items-center gap-3">
          <AlertTriangle
            color="#f0b000"
            className="h-5 w-5 mt-1.5 mr-2 flex-shrink-0"
          />
          <div className="mt-2">
            <AlertTitle>Draft Mode</AlertTitle>
            <AlertDescription>
              Contract is not yet created. This is just a draft.
            </AlertDescription>
          </div>
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="p-6 rounded-lg border bg-muted/30 w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mt-2 mb-4 uppercase text-center">
                Service Agreement
              </h1>

              <div className="space-y-0 text-muted-foreground text-center">
                <p className="text-md">
                  This Service Agreement is entered into as of April 25, 2025,
                  by and between:
                </p>
                <p className="text-md">
                  Service Provider: Simple ProjeX, with its principal place of
                  business at Irvine, California, and
                </p>
                <p className="text-md">
                  Client: {proposal.client_name || "Client Name"}, with a
                  primary address at{" "}
                  {proposal.client_address || "[Client Address]"} .
                </p>
              </div>
            </div>

            {/* Rest of the contract content */}
            <h2 className="text-2xl font-bold mb-4 text-primary uppercase tracking-wider">
              Contract Details
            </h2>

            {proposal ? (
              <div className="space-y-8 w-full">
                {/* Contract Header */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {proposal.name || "Unnamed Project"}
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {proposal.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proposal.template?.trades?.map((trade: TradeResponse) => (
                      <Badge
                        key={trade.id}
                        variant="outline"
                        className="font-semibold uppercase text-xs"
                      >
                        {trade.name || "Trade Name"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Client and Contractor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Information */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Client Name
                        </p>
                        <p className="font-medium">
                          {proposal.client_name || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {proposal.client_email || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{proposal.client_phone}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{proposal.client_address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contractor Information */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Contract Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Project Cost</span>
                        <span className="font-bold text-xl">
                          {proposal.total_cost || "N/A"}
                        </span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Created</span>
                          <span>
                            {proposal.created_at
                              ? new Date(
                                  proposal.created_at
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Updated</span>
                          <span>
                            {proposal.updated_at
                              ? new Date(
                                  proposal.updated_at
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Created By</span>
                          <span>
                            {proposal.created_by?.first_name ||
                              "Contractor First Name"}{" "}
                            {proposal.created_by?.last_name ||
                              "Contractor Last Name"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {proposal.template?.variables &&
                  proposal.template?.variables.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold">
                        Project Variables
                      </h3>
                      {(() => {
                        // Group variables by variable_type name
                        const groupedVariables: Record<
                          string,
                          VariableResponse[]
                        > = {};
                        proposal.template.variables.forEach((variable) => {
                          const typeName =
                            variable.variable_type?.name || "Other";
                          if (!groupedVariables[typeName]) {
                            groupedVariables[typeName] = [];
                          }
                          groupedVariables[typeName].push(variable);
                        });

                        return (
                          <div className="grid grid-cols-2 gap-6">
                            {Object.entries(groupedVariables).map(
                              ([typeName, variables]) => (
                                <div
                                  key={typeName}
                                  className="space-y-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="h-6 w-1 bg-primary rounded-full"></div>
                                    <h4 className="font-medium text-sm">
                                      {typeName}
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {variables.map((variable) => (
                                      <div
                                        key={variable.id}
                                        className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-md flex justify-between items-center text-sm hover:border-primary/30 transition-colors"
                                      >
                                        <span className="text-gray-600">
                                          {variable.name || "Variable Name"}
                                        </span>
                                        <span className="font-medium bg-white px-2 py-1 rounded text-primary border border-gray-100">
                                          {variable.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                {/* Project Elements */}
                {proposal.template?.trades &&
                  proposal.template?.trades.length > 0 && (
                    <div className="space-y-6 mt-4">
                      <h3 className="text-lg font-semibold">Project Details</h3>
                      <div className="grid grid-cols-1 gap-6">
                        {proposal.template?.trades.map(
                          (trade: TradeResponse) => (
                            <div
                              key={trade.id}
                              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-1 bg-primary rounded-full"></div>
                                <h4 className="font-medium">
                                  {trade.name || "Trade Name"}
                                </h4>
                              </div>

                              {trade.elements && trade.elements.length > 0 && (
                                <div className="space-y-2">
                                  {trade.elements.map((element: any) => (
                                    <div
                                      key={element.id}
                                      className="bg-gray-50 rounded-md p-3 border border-gray-100 hover:border-primary/20 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-1">
                                        <h5 className="font-medium text-sm">
                                          {element.name || "Element Name"}
                                        </h5>
                                        <span className="font-medium text-sm bg-white px-3 py-1 rounded text-primary border border-gray-100">
                                          {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                          }).format(
                                            (parseFloat(
                                              element.material_cost || 0
                                            ) +
                                              parseFloat(
                                                element.labor_cost || 0
                                              )) *
                                              (1 +
                                                parseFloat(
                                                  element.markup || 0
                                                ) /
                                                  100)
                                          )}
                                        </span>
                                      </div>

                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {element.description ||
                                          "No description available"}
                                      </p>

                                      <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded text-gray-600 border border-gray-200">
                                          Material: $
                                          {Number(
                                            element.material_cost || 0
                                          ).toFixed(2)}
                                        </span>
                                        <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded text-gray-600 border border-gray-200">
                                          Labor: $
                                          {Number(
                                            element.labor_cost || 0
                                          ).toFixed(2)}
                                        </span>
                                        <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded text-gray-600 border border-gray-200">
                                          Markup: {element.markup || 0}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Terms and Conditions */}
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-semibold">
                    Terms and Conditions
                  </h3>

                  <div className="overflow-hidden">
                    <div>
                      <div className="p-2 relative">
                        {isEditing ? (
                          <div className="space-y-2">
                            {termsSections.map((section, index) => (
                              <div
                                key={section.id}
                                className="space-y-3 pb-5 border-b border-dashed last:border-0"
                              >
                                <div className="flex justify-between items-center">
                                  <p className="text-sm font-semibold">
                                    Section {index + 1}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-destructive"
                                    onClick={() =>
                                      removeTermsSection(section.id)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`termsTitle-${section.id}`}>
                                    Section Title
                                  </Label>
                                  <Input
                                    id={`termsTitle-${section.id}`}
                                    name="termsTitle"
                                    value={section.title}
                                    onChange={(e) =>
                                      handleInputChange(e, section.id)
                                    }
                                    placeholder="Enter section title"
                                    className="font-medium border-blue-500 shadow-sm ring-2 ring-blue-300 bg-blue-50/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`termsDescription-${section.id}`}
                                  >
                                    Section Content
                                  </Label>
                                  <textarea
                                    id={`termsDescription-${section.id}`}
                                    name="termsDescription"
                                    value={section.description}
                                    onChange={(e) =>
                                      handleInputChange(e, section.id)
                                    }
                                    placeholder="Enter section content"
                                    className="w-full min-h-[100px] p-2 border rounded-md resize-y border-blue-500 shadow-sm ring-2 ring-blue-300 bg-blue-50/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                </div>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              className="w-full flex items-center gap-1"
                              onClick={addTermsSection}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus"
                              >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                              </svg>
                              Add Section
                            </Button>
                          </div>
                        ) : (
                          <div className="text-slate-800">
                            <div className="space-y-6 leading-relaxed">
                              {termsSections.map((section, index) => (
                                <div key={section.id} className="mb-6">
                                  <div className="flex items-baseline gap-3 mb-2">
                                    <div className="w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary bg-primary/5">
                                      <span className="text-xs font-bold">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <h5 className="text-base font-bold uppercase tracking-wide text-slate-700">
                                      {section.title}
                                    </h5>
                                  </div>
                                  <div className="ml-10 text-sm text-slate-600 leading-relaxed">
                                    {section.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Client Signature</h3>

                    <div className="h-24 border rounded-lg flex items-center justify-center bg-muted/20">
                      {signatures.client.value ? (
                        signatures.client.type === "text" ? (
                          <p className="font-medium text-xl">
                            {signatures.client.value}
                          </p>
                        ) : (
                          <img
                            src={signatures.client.value}
                            alt="Client signature"
                            className="max-h-full object-contain"
                          />
                        )
                      ) : (
                        <p className="text-muted-foreground">
                          Signature required
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Date: {proposal.contract?.contractor_signed_at || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Contractor Signature
                    </h3>
                    {isEditing ? (
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <div className="flex gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="contractorInitialsOption"
                              name="contractorSignatureType"
                              className="w-4 h-4"
                              checked={signatures.contractor.type === "text"}
                              onChange={() =>
                                handleSignatureTypeChange("contractor", "text")
                              }
                            />
                            <Label htmlFor="contractorInitialsOption">
                              Initials
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="contractorImageOption"
                              name="contractorSignatureType"
                              className="w-4 h-4"
                              checked={signatures.contractor.type === "image"}
                              onChange={() =>
                                handleSignatureTypeChange("contractor", "image")
                              }
                            />
                            <Label htmlFor="contractorImageOption">Image</Label>
                          </div>
                        </div>

                        {signatures.contractor.type === "text" ? (
                          <div className="space-y-2">
                            <Label htmlFor="contractorInitials">
                              Enter your initials
                            </Label>
                            <Input
                              id="contractorInitials"
                              name="contractorInitials"
                              value={signatures.contractor.value}
                              onChange={handleInputChange}
                              placeholder="Type your initials"
                              className="font-medium border-blue-500 shadow-sm ring-2 ring-blue-300 bg-blue-50/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                            {signatures.contractor.value && (
                              <div className="h-20 border rounded-lg flex items-center justify-center mt-2 bg-white">
                                <p className="font-medium text-xl">
                                  {signatures.contractor.value}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="contractorSignatureImage">
                              Upload your signature
                            </Label>
                            <Input
                              id="contractorSignatureImage"
                              name="contractorSignatureImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleSignatureImageUpload("contractor", e)
                              }
                              className="text-sm bg-blue-50/50 border-blue-500 hover:bg-blue-100/70 transition-all focus:border-blue-600 file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 cursor-pointer shadow-sm ring-2 ring-blue-300"
                            />
                            {signatures.contractor.value && (
                              <div className="h-20 border rounded-lg flex items-center justify-center mt-2 bg-white overflow-hidden">
                                <img
                                  src={signatures.contractor.value}
                                  alt="Contractor signature"
                                  className="max-h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-24 border rounded-lg flex items-center justify-center bg-muted/20">
                        {signatures.contractor.value ? (
                          signatures.contractor.type === "text" ? (
                            <p className="font-medium text-xl">
                              {signatures.contractor.value}
                            </p>
                          ) : (
                            <img
                              src={signatures.contractor.value}
                              alt="Contractor signature"
                              className="max-h-full object-contain"
                            />
                          )
                        ) : (
                          <p className="text-muted-foreground">
                            Signature required
                          </p>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Date:{" "}
                      {proposal.contract?.contractor_signed_at || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-base text-muted-foreground">
                No contract details available.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Right Side (Narrower) */}
        <div className="lg:col-span-1">
          <div className="p-4 rounded-lg border bg-muted/10 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2 mt-2"
                disabled={
                  isSending ||
                  !proposal.client_email ||
                  isContractSigned ||
                  !contract
                }
                onClick={sendProposalToClient}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send to Client
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-printer"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width="12" height="8" x="6" y="14" />
                </svg>
                Print Contract (Not Working)
              </Button>

              {!contract && (
                <Button
                  variant="default"
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                  disabled={createContractMutation.isPending}
                >
                  {createContractMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Contract
                    </>
                  )}
                </Button>
              )}
              {isEditing && contract && contract.id && (
                <Button
                  variant="default"
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                  disabled={updateContractMutation.isPending}
                >
                  {updateContractMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4" />
                      Update Contract
                    </>
                  )}
                </Button>
              )}
              <Separator className="my-2" />
              <div className="rounded-md border p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Edit Mode</span>
                  <div
                    className={`w-10 h-5 bg-muted relative rounded-full ${
                      isContractSigned
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() =>
                      isContractSigned ? null : setIsEditing(!isEditing)
                    }
                  >
                    <div
                      className={`absolute w-4 h-4 rounded-full top-0.5 transition-all ${
                        isEditing
                          ? "bg-primary right-0.5"
                          : "bg-muted-foreground left-0.5"
                      }`}
                    />
                  </div>
                </div>
                {isContractSigned && (
                  <p className="text-xs text-amber-600 mt-2">
                    Editing is disabled because this contract has been signed by
                    the client.
                  </p>
                )}
              </div>
              <Card className="mt-4">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm">Contract Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-semibold text-foreground">
                        {/* {calculateTotalCost()} */}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variables:</span>
                      <span>{proposal?.template?.variables?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trades:</span>
                      <span>{proposal?.template?.trades?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
