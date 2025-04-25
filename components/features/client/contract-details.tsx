import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { clientSignature, updateContract } from "@/api/server/contracts";
import { toast } from "sonner";

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

interface ClientContractViewProps {
  proposal: any;
}

export function ContractDetails({ proposal }: ClientContractViewProps) {
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

  // State for client details
  const [clientDetails] = useState({
    name: proposal?.contract?.clientName || proposal?.client_name || "",
    email: proposal?.contract?.clientEmail || proposal?.client_email || "",
    phone:
      proposal?.contract?.clientPhoneNumber || proposal?.phone_number || "",
    address: proposal?.contract?.clientAddress || proposal?.address || "",
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // React Query mutation for contract signing
  const signContractMutation = useMutation({
    mutationFn: (data: any) => {
      // Check if contract exists and has an ID
      if (proposal?.contract) {
        // Try to find the contract ID - check different possible properties
        const contractId =
          proposal.contract.id ||
          proposal.contract.contract_id ||
          proposal.contract.uuid;

        if (!contractId) {
          console.error("No contract ID found in the proposal object");
          throw new Error("Contract ID is missing");
        }
        return clientSignature(contractId, data);
      } else {
        throw new Error("No contract found to sign");
      }
    },
    onSuccess: (data) => {
      toast.success("Contract signed successfully!", {
        position: "top-center",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error signing contract:", error);
      toast.error(`Failed to sign contract: ${error.message}`, {
        position: "top-center",
        duration: 5000,
      });
    },
  });

  const handleSignContract = () => {
    if (!signatures.client.value) {
      toast.error("Please provide your signature before signing the contract", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    const contractData = {
      clientInitials: signatures.client.type === "text" ? signatures.client.value : null,
      clientImage: signatures.client.type === "image" ? signatures.client.value : null,
    };

    signContractMutation.mutate(contractData);
  };

  const [agreementTitle] = useState(
    proposal?.contract?.contractName || "SERVICE AGREEMENT"
  );

  // State for terms and conditions
  const [termsSections] = useState<TermSection[]>(() => {
    if (proposal?.contract?.terms) {
      return proposal.contract.terms;
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
      proposal?.contract?.clientInitials !== undefined ||
      proposal?.contract?.clientImage !== undefined ||
      proposal?.contract?.contractorInitials !== undefined ||
      proposal?.contract?.contractorImage !== undefined
    ) {
      return {
        client: getSignatureData(
          proposal.contract.clientInitials,
          proposal.contract.clientImage
        ),
        contractor: getSignatureData(
          proposal.contract.contractorInitials,
          proposal.contract.contractorImage
        ),
      };
    } else if (proposal?.contract?.signatures) {
      return proposal.contract.signatures;
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
    proposal?.contract?.clientImage || 
    (proposal?.contract?.clientInitials && proposal?.contract?.clientInitials.trim() !== "")
  );

  // Handle input changes for signature
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if this is a signature field
    if (name === "clientInitials") {
      setSignatures((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          type: "text",
          value: value,
        },
      }));
    }
  };

  const handleSignatureTypeChange = (type: "text" | "image") => {
    setSignatures((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        type: type,
        // Reset value when switching types
        value: type === "text" ? prev.client.value : "",
        file: type === "image" ? prev.client.file : null,
      },
    }));
  };

  const handleSignatureImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setSignatures((prev) => ({
          ...prev,
          client: {
            ...prev.client,
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

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalCost = () => {
    if (!proposal.project_elements || proposal.project_elements.length === 0) {
      return "N/A";
    }

    let total = 0;
    proposal.project_elements.forEach((element: any) => {
      const materialCost = parseFloat(element.material_cost || 0);
      const laborCost = parseFloat(element.labor_cost || 0);
      const markup = parseFloat(element.markup || 0) / 100;

      total += (materialCost + laborCost) * (1 + markup);
    });

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="p-6 rounded-lg border bg-muted/30 w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mt-2 mb-4 uppercase text-center">
                {agreementTitle}
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
                  Client:{" "}
                  {clientDetails.name || proposal?.client_name || "test"}, with
                  a primary address at{" "}
                  {clientDetails.address ||
                    proposal?.address ||
                    "[Client Address]"}{" "}
                  .
                </p>
              </div>
            </div>

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
                    {proposal.project_modules?.map((module: any) => (
                      <Badge
                        key={module.id}
                        variant="outline"
                        className="font-semibold uppercase text-xs"
                      >
                        {module.module?.name || "Module"}
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
                      {proposal.phone_number && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{proposal.phone_number}</p>
                        </div>
                      )}
                      {proposal.address && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p className="font-medium">{proposal.address}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contract Summary */}
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
                          {calculateTotalCost()}
                        </span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Created</span>
                          <span>
                            {proposal.created_at
                              ? formatDate(proposal.created_at)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Updated</span>
                          <span>
                            {proposal.updated_at
                              ? formatDate(proposal.updated_at)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Parameters */}
                {proposal.project_parameters &&
                  proposal.project_parameters.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold">
                        Project Parameters
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {proposal.project_parameters.map((param: any) => (
                          <div
                            key={param.id}
                            className="p-3 bg-muted/50 rounded-xl flex justify-between items-center"
                          >
                            <span className="font-medium">
                              {param.parameter?.name || "Parameter"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>{param.value}</span>
                              <span className="text-muted-foreground text-sm">
                                {param.parameter?.type || ""}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Project Elements */}
                {proposal.project_modules &&
                  proposal.project_modules.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold">Project Details</h3>
                      {proposal.project_modules.map((moduleItem: any) => (
                        <div key={moduleItem.id} className="space-y-4">
                          <h4 className="text-base font-semibold">
                            {moduleItem.module?.name || "Module"}
                          </h4>
                          {proposal.project_elements && (
                            <div className="rounded-lg border p-4 overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Element</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                      Cost
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {proposal.project_elements
                                    .filter(
                                      (element: any) =>
                                        element.project_module?.module?.id ===
                                        moduleItem.module?.id
                                    )
                                    .map((element: any) => (
                                      <TableRow key={element.id}>
                                        <TableCell className="font-medium">
                                          {element.element?.name || "Element"}
                                        </TableCell>
                                        <TableCell>
                                          {element.element?.description ||
                                            "No description available"}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
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
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      ))}
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  {/* Client Signature - Always an input field unless already signed */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Signature</h3>
                    {isContractSigned ? (
                      <div className="h-24 border rounded-lg flex items-center justify-center bg-muted/20">
                        {signatures.client.type === "text" ? (
                          <p className="font-medium text-xl">
                            {signatures.client.value}
                          </p>
                        ) : (
                          <img
                            src={signatures.client.value}
                            alt="Client signature"
                            className="max-h-full object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <div className="flex gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="clientInitialsOption"
                              name="clientSignatureType"
                              className="w-4 h-4"
                              checked={signatures.client.type === "text"}
                              onChange={() => handleSignatureTypeChange("text")}
                            />
                            <Label htmlFor="clientInitialsOption">
                              Type Initials
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="clientImageOption"
                              name="clientSignatureType"
                              className="w-4 h-4"
                              checked={signatures.client.type === "image"}
                              onChange={() => handleSignatureTypeChange("image")}
                            />
                            <Label htmlFor="clientImageOption">Upload Signature</Label>
                          </div>
                        </div>

                        {signatures.client.type === "text" ? (
                          <div className="space-y-2">
                            <Label htmlFor="clientInitials">
                              Enter your initials
                            </Label>
                            <Input
                              id="clientInitials"
                              name="clientInitials"
                              value={signatures.client.value}
                              onChange={handleInputChange}
                              placeholder="Type your initials"
                              className="font-medium"
                            />
                            {signatures.client.value && (
                              <div className="h-20 border rounded-lg flex items-center justify-center mt-2 bg-white">
                                <p className="font-medium text-xl">
                                  {signatures.client.value}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="clientSignatureImage">
                              Upload your signature
                            </Label>
                            <Input
                              id="clientSignatureImage"
                              name="clientSignatureImage"
                              type="file"
                              accept="image/*"
                              onChange={handleSignatureImageUpload}
                              className="text-sm"
                            />
                            {signatures.client.value && ( 
                              <div className="h-20 border rounded-lg flex items-center justify-center mt-2 bg-white overflow-hidden">
                                <img
                                  src={signatures.client.value}
                                  alt="Client signature"
                                  className="max-h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Date:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  
                  {/* Contractor Signature - Read-only view */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Contractor Signature
                    </h3>
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
                          Pending contractor signature
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date:{" "}
                      {proposal?.contract?.updatedAt 
                        ? formatDate(proposal.contract.updatedAt)
                        : "Pending"}
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

        {/* Client Actions - Right Side (Narrower) */}
        <div className="lg:col-span-1">
          <div className="p-4 rounded-lg border bg-muted/10 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Contract Actions</h3>
            <div className="space-y-3">
              {!isContractSigned ? (
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleSignContract}
                  disabled={signContractMutation.isPending || !signatures.client.value}
                >
                  {signContractMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing...
                    </>
                  ) : (
                    <>
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
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Sign Contract
                    </>
                  )}
                </Button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block mr-2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  You have signed this contract
                </div>
              )}
              
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => window.print()}
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
                Print Contract
              </Button>
              
              <Card className="mt-4">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm">Contract Summary</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-semibold text-foreground">
                        {calculateTotalCost()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parameters:</span>
                      <span>{proposal?.project_parameters?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modules:</span>
                      <span>{proposal?.project_modules?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-semibold ${isContractSigned ? 'text-green-600' : 'text-amber-600'}`}>
                        {isContractSigned ? 'Signed' : 'Pending Signature'}
                      </span>
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
