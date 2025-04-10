import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Switch,
  Input,
  Textarea,
  Label,
} from "@/components/shared";
import { Download, Mail, Printer } from "lucide-react";
import { Proposal, ProjectElement, ProjectParameter } from "@/types/proposals";
import { calculateCost } from "@/helpers/calculate-cost";

interface ContractDetailTabProps {
  proposal: Proposal;
  totalAmount: number;
}

const convertParametersToVariables = (parameters: ProjectParameter[]) => {
  return parameters.map((param) => ({
    id: param.parameter.id,
    name: param.parameter.name,
    value: param.value.toString(),
    type: param.parameter.category,
  }));
};

const calculateMaterialCost = (
  element: ProjectElement,
  parameters: ProjectParameter[]
) => {
  const variables = convertParametersToVariables(parameters);
  return Number(calculateCost(element.formula, variables).toFixed(2));
};

const calculateLaborCost = (
  element: ProjectElement,
  parameters: ProjectParameter[]
) => {
  const variables = convertParametersToVariables(parameters);
  return Number(calculateCost(element.labor_formula, variables).toFixed(2));
};

export default function ContractDetailTab({
  proposal,
  totalAmount,
}: ContractDetailTabProps) {
  const [isEditable, setIsEditable] = useState(false);

  const [contractData, setContractData] = useState({
    title: "SERVICE AGREEMENT",
    effectiveDate: new Date().toISOString().split("T")[0],
    companyName: "[Company Name]",
    companyAddress: "[Address]",
    clientName: proposal.client_name,
    clientAddress: proposal.address || "[Client Address]",
    timeline: "[Timeline]",
    changesToScope:
      "Any changes to the scope of Services must be agreed upon in writing by both parties and may result in additional charges and timeline adjustments.",
    totalAmount: totalAmount,
    initialDeposit: (totalAmount * 0.25).toFixed(2),
    progressPayment: (totalAmount * 0.5).toFixed(2),
    finalPayment: (totalAmount * 0.25).toFixed(2),
    clientSignatureName: "",
    clientSignatureDate: "",
    contractorSignatureName: "",
    contractorSignatureDate: "",
  });

  const handleToggleEditMode = (newValue: boolean) => {
    if (isEditable && !newValue) {
    }
    setIsEditable(newValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-3 space-y-2">
        <div className="flex gap-3 mb-4 justify-end">
          <div className="flex items-center space-x-2">
            <Label htmlFor="edit-mode" className="text-sm font-medium">
              Edit Mode
            </Label>
            <Switch
              id="edit-mode"
              checked={isEditable}
              onCheckedChange={setIsEditable}
            />
          </div>
          <Button>
            <Mail className="mr-1 h-4 w-4" />
            Email Client
          </Button>
        </div>    
        <div className="flex justify-center">
        <Card className="overflow-hidden max-w-7xl">
          <CardHeader className="pb-4">
            <div className="flex justify-center items-center">
              <div>
                <CardTitle className="text-center">Contract Draft</CardTitle>
                <CardDescription className="text-center">
                  This contract is generated based on the proposal details. You
                  can edit it before finalizing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6 max-w-5xl mx-auto">
              <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditable ? (
                  <Input
                    defaultValue={contractData.title}
                    className="text-2xl font-semibold text-center"
                    onChange={(e) =>
                      setContractData({
                        ...contractData,
                        title: e.target.value,
                      })
                    }
                  />
                ) : (
                  contractData.title
                )}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-base/relaxed">
                  This Service Agreement (the "Agreement") is entered into as of{" "}
                  {isEditable ? (
                    <Input
                      type="date"
                      defaultValue={contractData.effectiveDate}
                      className="inline-block w-auto"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          effectiveDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    new Date(contractData.effectiveDate).toLocaleDateString()
                  )}{" "}
                  (the "Effective Date"), by and between:
                </p>
                <p className="text-base/relaxed mt-6">
                  <strong>Service Provider:</strong>{" "}
                  {isEditable ? (
                    <Input
                      defaultValue={contractData.companyName}
                      className="inline-block w-auto mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          companyName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.companyName
                  )}
                  , with its principal place of business at{" "}
                  {isEditable ? (
                    <Input
                      defaultValue={contractData.companyAddress}
                      className="inline-block w-auto mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          companyAddress: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.companyAddress
                  )}{" "}
                  ("Contractor"), and
                </p>
                <p className="text-base/relaxed mt-3">
                  <strong>Client:</strong>{" "}
                  {isEditable ? (
                    <Input
                      defaultValue={contractData.clientName}
                      className="inline-block w-auto mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          clientName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.clientName
                  )}
                  , with a primary address at{" "}
                  {isEditable ? (
                    <Input
                      defaultValue={contractData.clientAddress}
                      className="inline-block w-auto mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          clientAddress: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.clientAddress
                  )}{" "}
                  ("Client").
                </p>

                <h3 className="text-lg font-semibold mt-8">
                  1. SCOPE OF SERVICES
                </h3>
                <p className="text-base/relaxed">
                  Contractor agrees to provide Client with the following
                  services (the "Services") as detailed in Proposal #{" "}
                  {proposal.id} dated{" "}
                  {new Date(proposal.created_at).toLocaleDateString()}:
                </p>

                {/* Project Modules table remains the same in both edit and view modes */}
                {proposal.project_modules &&
                  proposal.project_modules.length > 0 && (
                    <div className="my-6">
                      {proposal.project_modules.map((moduleItem) => (
                        <div key={moduleItem.id} className="mb-6">
                          <h4 className="font-medium mb-2">
                            {isEditable ? (
                              <Input
                                defaultValue={moduleItem.module.name}
                                className="font-medium"
                              />
                            ) : (
                              moduleItem.module.name
                            )}
                          </h4>
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Element</TableHead>
                                  <TableHead>Material Formula</TableHead>
                                  <TableHead>Labor Formula</TableHead>
                                  <TableHead className="text-right">
                                    Material Cost
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Labor Cost
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Markup
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total with Markup
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {proposal.project_elements
                                  .filter(
                                    (element) =>
                                      element.project_module.module.id ===
                                      moduleItem.module.id
                                  )
                                  .map((element) => (
                                    <TableRow key={element.id}>
                                      <TableCell className="font-medium">
                                        {isEditable ? (
                                          <Input
                                            defaultValue={element.element.name}
                                            className="font-medium"
                                          />
                                        ) : (
                                          element.element.name
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {isEditable ? (
                                          <Input
                                            defaultValue={element.formula}
                                          />
                                        ) : (
                                          element.formula
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {isEditable ? (
                                          <Input
                                            defaultValue={element.labor_formula}
                                          />
                                        ) : (
                                          element.labor_formula
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        $
                                        {calculateMaterialCost(
                                          element,
                                          proposal.project_parameters
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        $
                                        {calculateLaborCost(
                                          element,
                                          proposal.project_parameters
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        $
                                        {(
                                          calculateMaterialCost(
                                            element,
                                            proposal.project_parameters
                                          ) +
                                          calculateLaborCost(
                                            element,
                                            proposal.project_parameters
                                          )
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {element.markup}%
                                      </TableCell>
                                      <TableCell className="text-right font-medium">
                                        $
                                        {(
                                          (calculateMaterialCost(
                                            element,
                                            proposal.project_parameters
                                          ) +
                                            calculateLaborCost(
                                              element,
                                              proposal.project_parameters
                                            )) *
                                          (1 + element.markup / 100)
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {proposal.project_parameters &&
                  proposal.project_parameters.length > 0 && (
                    <div className="my-6">
                      <h4 className="font-medium mb-2">
                        {isEditable ? (
                          <Input
                            defaultValue="Project Parameters"
                            className="font-medium"
                          />
                        ) : (
                          "Project Parameters"
                        )}
                      </h4>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Parameter</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Category</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {proposal.project_parameters.map((param) => (
                              <TableRow key={param.id}>
                                <TableCell className="font-medium">
                                  {isEditable ? (
                                    <Input
                                      defaultValue={param.parameter.name}
                                      className="font-medium"
                                    />
                                  ) : (
                                    param.parameter.name
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditable ? (
                                    <Input defaultValue={param.value} />
                                  ) : (
                                    param.value
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditable ? (
                                    <Input
                                      defaultValue={param.parameter.category}
                                    />
                                  ) : (
                                    param.parameter.category
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                <h3 className="text-lg font-semibold mt-8">2. PAYMENT TERMS</h3>
                <p className="text-base/relaxed">
                  Client agrees to pay Contractor the total sum of $
                  {isEditable ? (
                    <Input
                      type="number"
                      defaultValue={contractData.totalAmount}
                      className="inline-block w-24 mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          totalAmount: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : (
                    contractData.totalAmount
                  )}{" "}
                  for the Services.
                </p>
                <p className="text-base/relaxed mt-3">Payment schedule:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    Initial deposit: $
                    {isEditable ? (
                      <Input
                        type="number"
                        defaultValue={contractData.initialDeposit}
                        className="inline-block w-24 mx-1"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            initialDeposit: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.initialDeposit
                    )}{" "}
                    (25%) due upon signing this Agreement
                  </li>
                  <li>
                    Progress payment: $
                    {isEditable ? (
                      <Input
                        type="number"
                        defaultValue={contractData.progressPayment}
                        className="inline-block w-24 mx-1"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            progressPayment: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.progressPayment
                    )}{" "}
                    (50%) due upon completion of 50% of the project
                  </li>
                  <li>
                    Final payment: $
                    {isEditable ? (
                      <Input
                        type="number"
                        defaultValue={contractData.finalPayment}
                        className="inline-block w-24 mx-1"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            finalPayment: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.finalPayment
                    )}{" "}
                    (25%) due upon project completion
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mt-8">3. TIMELINE</h3>
                <p className="text-base/relaxed">
                  Contractor estimates that the Services will be completed
                  within{" "}
                  {isEditable ? (
                    <Input
                      defaultValue={contractData.timeline}
                      className="inline-block w-auto mx-1"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          timeline: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.timeline
                  )}{" "}
                  from the Effective Date, subject to timely receipt of Client
                  materials and approvals.
                </p>

                <h3 className="text-lg font-semibold mt-8">
                  4. CHANGES TO SCOPE
                </h3>
                <p className="text-base/relaxed">
                  {isEditable ? (
                    <Textarea
                      defaultValue={contractData.changesToScope}
                      className="min-h-[80px]"
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          changesToScope: e.target.value,
                        })
                      }
                    />
                  ) : (
                    contractData.changesToScope
                  )}
                </p>

                <div className="mt-12 border-t pt-8">
                  <p className="font-medium mb-4">
                    <strong>CLIENT:</strong>{" "}
                    {isEditable ? (
                      <Input
                        defaultValue={contractData.clientName}
                        className="inline-block w-auto mx-1"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            clientName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.clientName
                    )}
                  </p>
                  <p className="mt-6">By: _______________________________</p>
                  <p className="mt-3">
                    Name:{" "}
                    {isEditable ? (
                      <Input
                        defaultValue={contractData.clientSignatureName}
                        className="inline-block w-auto"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            clientSignatureName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.clientSignatureName ||
                      "_____________________________"
                    )}
                  </p>
                  <p className="mt-3">
                    Date:{" "}
                    {isEditable ? (
                      <Input
                        type="date"
                        className="inline-block w-auto"
                        value={contractData.clientSignatureDate}
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            clientSignatureDate: e.target.value,
                          })
                        }
                      />
                    ) : contractData.clientSignatureDate ? (
                      new Date(
                        contractData.clientSignatureDate
                      ).toLocaleDateString()
                    ) : (
                      "_____________________________"
                    )}
                  </p>

                  <p className="font-medium mt-10 mb-4">
                    <strong>CONTRACTOR:</strong>{" "}
                    {isEditable ? (
                      <Input
                        defaultValue={contractData.companyName}
                        className="inline-block w-auto mx-1"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.companyName
                    )}
                  </p>
                  <p className="mt-6">By: _______________________________</p>
                  <p className="mt-3">
                    Name:{" "}
                    {isEditable ? (
                      <Input
                        defaultValue={contractData.contractorSignatureName}
                        className="inline-block w-auto"
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            contractorSignatureName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      contractData.contractorSignatureName ||
                      "_____________________________"
                    )}
                  </p>
                  <p className="mt-3">
                    Date:{" "}
                    {isEditable ? (
                      <Input
                        type="date"
                        className="inline-block w-auto"
                        value={contractData.contractorSignatureDate}
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            contractorSignatureDate: e.target.value,
                          })
                        }
                      />
                    ) : contractData.contractorSignatureDate ? (
                      new Date(
                        contractData.contractorSignatureDate
                      ).toLocaleDateString()
                    ) : (
                      "_____________________________"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
