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
import { Proposal } from "@/types/proposals";

interface ContractDetailTabProps {
  proposal: Proposal;
  totalAmount: number;
}

export default function ContractDetailTab({
  proposal,
  totalAmount,
}: ContractDetailTabProps) {
  const [isEditable, setIsEditable] = useState(false);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="md:col-span-2 space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-center">Contract Draft</CardTitle>
                <CardDescription className="text-center">
                  This contract is generated based on the proposal details. You can
                  edit it before finalizing.
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditable ? (
                  <Input 
                    defaultValue="SERVICE AGREEMENT" 
                    className="text-2xl font-semibold text-center" 
                  />
                ) : (
                  "SERVICE AGREEMENT"
                )}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-base/relaxed">
                  This Service Agreement (the "Agreement") is entered into as of{" "}
                  {isEditable ? (
                    <Input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                      className="inline-block w-auto"
                    />
                  ) : (
                    new Date().toLocaleDateString()
                  )}{" "}
                  (the "Effective Date"), by and between:
                </p>
                <p className="text-base/relaxed mt-6">
                  <strong>Service Provider:</strong>{" "}
                  {isEditable ? (
                    <Input 
                      defaultValue="[Company Name]" 
                      className="inline-block w-auto mx-1"
                    />
                  ) : (
                    "[Company Name]"
                  )}, with its principal place of business at {isEditable ? (
                    <Input 
                      defaultValue="[Address]" 
                      className="inline-block w-auto mx-1"
                    />
                  ) : (
                    "[Address]"
                  )} ("Contractor"), and
                </p>
                <p className="text-base/relaxed mt-3">
                  <strong>Client:</strong>{" "}
                  {isEditable ? (
                    <Input 
                      defaultValue={proposal.client_name}
                      className="inline-block w-auto mx-1"
                    />
                  ) : (
                    proposal.client_name
                  )}, with a primary address at {isEditable ? (
                    <Input 
                      defaultValue={proposal.address || "[Client Address]"}
                      className="inline-block w-auto mx-1"
                    />
                  ) : (
                    proposal.address || "[Client Address]"
                  )} ("Client").
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
                {proposal.project_modules && proposal.project_modules.length > 0 && (
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
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
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
                                          defaultValue={element.element.description}
                                        />
                                      ) : (
                                        element.element.description
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {isEditable ? (
                                        <Input 
                                          type="number"
                                          defaultValue={element.quantity}
                                          className="text-right"
                                        />
                                      ) : (
                                        element.quantity
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      ${element.total}
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
                
                {proposal.project_parameters && proposal.project_parameters.length > 0 && (
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
                                  <Input 
                                    defaultValue={param.value}
                                  />
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
                  Client agrees to pay Contractor the total sum of ${isEditable ? (
                    <Input 
                      type="number"
                      defaultValue={totalAmount}
                      className="inline-block w-24 mx-1"
                    />
                  ) : (
                    totalAmount
                  )} for the Services.
                </p>
                <p className="text-base/relaxed mt-3">Payment schedule:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    Initial deposit: ${isEditable ? (
                      <Input 
                        type="number"
                        defaultValue={(totalAmount * 0.25).toFixed(2)}
                        className="inline-block w-24 mx-1"
                      />
                    ) : (
                      (totalAmount * 0.25).toFixed(2)
                    )} (25%)
                    due upon signing this Agreement
                  </li>
                  <li>
                    Progress payment: ${isEditable ? (
                      <Input 
                        type="number"
                        defaultValue={(totalAmount * 0.5).toFixed(2)}
                        className="inline-block w-24 mx-1"
                      />
                    ) : (
                      (totalAmount * 0.5).toFixed(2)
                    )} (50%)
                    due upon completion of 50% of the project
                  </li>
                  <li>
                    Final payment: ${isEditable ? (
                      <Input 
                        type="number"
                        defaultValue={(totalAmount * 0.25).toFixed(2)}
                        className="inline-block w-24 mx-1"
                      />
                    ) : (
                      (totalAmount * 0.25).toFixed(2)
                    )} (25%)
                    due upon project completion
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mt-8">3. TIMELINE</h3>
                <p className="text-base/relaxed">
                  Contractor estimates that the Services will be completed
                  within {isEditable ? (
                    <Input 
                      defaultValue="[Timeline]"
                      className="inline-block w-auto mx-1"
                    />
                  ) : (
                    "[Timeline]"
                  )} from the Effective Date, subject to timely
                  receipt of Client materials and approvals.
                </p>

                <h3 className="text-lg font-semibold mt-8">
                  4. CHANGES TO SCOPE
                </h3>
                <p className="text-base/relaxed">
                  {isEditable ? (
                    <Textarea 
                      defaultValue="Any changes to the scope of Services must be agreed upon in writing by both parties and may result in additional charges and timeline adjustments."
                      className="min-h-[80px]"
                    />
                  ) : (
                    "Any changes to the scope of Services must be agreed upon in writing by both parties and may result in additional charges and timeline adjustments."
                  )}
                </p>

                <div className="mt-12 border-t pt-8">
                  <p className="font-medium mb-4">
                    <strong>CLIENT:</strong> {isEditable ? (
                      <Input 
                        defaultValue={proposal.client_name}
                        className="inline-block w-auto mx-1"
                      />
                    ) : (
                      proposal.client_name
                    )}
                  </p>
                  <p className="mt-6">By: _______________________________</p>
                  <p className="mt-3">Name: {isEditable ? (
                    <Input 
                      defaultValue="_____________________________"
                      className="inline-block w-auto"
                    />
                  ) : (
                    "_____________________________"
                  )}</p>
                  <p className="mt-3">Date: {isEditable ? (
                    <Input 
                      type="date"
                      className="inline-block w-auto"
                    />
                  ) : (
                    "_____________________________"
                  )}</p>

                  <p className="font-medium mt-10 mb-4">
                    <strong>CONTRACTOR:</strong>{" "}
                    {isEditable ? (
                      <Input 
                        defaultValue="[Company Name]"
                        className="inline-block w-auto mx-1"
                      />
                    ) : (
                      "[Company Name]"
                    )}
                  </p>
                  <p className="mt-6">By: _______________________________</p>
                  <p className="mt-3">Name: {isEditable ? (
                    <Input 
                      defaultValue="_____________________________"
                      className="inline-block w-auto"
                    />
                  ) : (
                    "_____________________________"
                  )}</p>
                  <p className="mt-3">Date: {isEditable ? (
                    <Input 
                      type="date"
                      className="inline-block w-auto"
                    />
                  ) : (
                    "_____________________________"
                  )}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        <div className="flex gap-3 mb-4 justify-end">
          <Button variant="outline">
            <Download className="mr-1 h-4 w-4" />
            Download Contract
          </Button>
          <Button>
            <Mail className="mr-1 h-4 w-4" />
            Email Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Proposal Reference
              </p>
              <p className="font-medium">#{proposal.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-medium">${totalAmount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Generated Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              This contract is automatically generated based on your proposal
              details. Customize the contract as needed before sending to the
              client.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
