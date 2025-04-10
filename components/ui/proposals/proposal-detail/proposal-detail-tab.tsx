import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shared";
import { Pencil, Mail } from "lucide-react";
import { Proposal } from "@/types/proposals";

interface ProposalDetailTabProps {
  proposal: Proposal;
  totalAmount: number;
}

export default function ProposalDetailTab({
  proposal,
  totalAmount,
}: ProposalDetailTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-base/relaxed whitespace-pre-line">
              {proposal.description}
            </p>
          </div>
        </div>
        {proposal.project_modules && proposal.project_modules.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold">Project Modules</h2>
            {proposal.project_modules.map((moduleItem) => (
              <div key={moduleItem.id} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {moduleItem.module.name}
                </h3>
                <div className="rounded-lg border p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Element</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Labor Cost</TableHead>
                        <TableHead className="text-right">Markup</TableHead>
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
                              {element.element.name}
                            </TableCell>
                            <TableCell>{element.element.description}</TableCell>
                            <TableCell className="text-right">
                              {element.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {element.labor_cost}
                            </TableCell>
                            <TableCell className="text-right">
                              {element.markup}%
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {element.total}
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Variables</h2>
              <p className="text-muted-foreground text-sm">
                Project dimensions and parameters
              </p>
              <div className="flex flex-wrap gap-3">
                {proposal.project_parameters.map((param) => (
                  <div
                    key={param.id}
                    className="flex justify-between w-[250px] items-center p-3 bg-muted/50 rounded-xl"
                  >
                    <span className="font-medium">{param.parameter.name}</span>
                    <div className="flex items-center gap-2">
                      <span>{param.value}</span>
                      <span className="text-muted-foreground">
                        {param.parameter.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      <div className="space-y-6">
        <div className="flex gap-3 mb-4 justify-end">
          <Button variant="outline">
            <Pencil className="mr-1 h-4 w-4" />
            Edit Proposal
          </Button>
          <Button>
            <Mail className="mr-1 h-4 w-4" />
            Email Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{proposal.client_name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{proposal.client_email}</p>
            </div>
            {proposal.phone_number && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{proposal.phone_number}</p>
              </div>
            )}
            {proposal.address && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{proposal.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposal Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Proposal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Project Cost</span>
              <span className="font-bold text-xl">{totalAmount}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Created</span>
                <span>
                  {new Date(proposal.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated</span>
                <span>
                  {new Date(proposal.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Created By</span>
                <span>{proposal.user.username}</span>
              </div>
            </div>
            <Separator />
            <Button className="w-full" variant="default">
              Accept Proposal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
