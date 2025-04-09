"use client";

import { useEffect, useState, use } from "react";
import { getProposalById } from "@/hooks/api/proposals/get-proposal-by-id";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Skeleton,
} from "@/components/shared";
import { ArrowLeft, Download, Printer, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { proposal, isLoading, error } = getProposalById(id);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (proposal) {
      let sum = 0;

      if (proposal.project_elements && proposal.project_elements.length > 0) {
        sum = proposal.project_elements.reduce(
          (acc, element) => acc + (element.total || 0),
          0
        );
      }

      setTotalAmount(sum);
    }
  }, [proposal]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-500">
                Error Loading Proposal
              </h2>
              <p>{error}</p>
              <Button asChild variant="outline">
                <Link href="/proposals">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Proposals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Proposal Not Found</h2>
              <p>
                The proposal you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild variant="outline">
                <Link href="/proposals">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Proposals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Image Section */}
      <div className="relative w-full h-[300px] mt-6 mb-6 overflow-hidden rounded-xl">
        <Image
          src={proposal.image || "/placeholder-image.jpg"}
          alt={proposal.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="space-y-8 pb-20">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  {proposal.name}
                </h1>
                <Badge variant="outline" className="ml-2">
                  {new Date(proposal.created_at) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ? "New"
                    : "Active"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm">
                <span>
                  Created on{" "}
                  {new Date(proposal.created_at).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Client: {proposal.client_name}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="default" size="default">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="secondary" size="default">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="default">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
          <Separator className="my-4" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-base/relaxed whitespace-pre-line">
                    {proposal.description}
                  </p>
                </div>
              </div>

              {/* Project Modules with Elements */}
              {proposal.project_modules &&
                proposal.project_modules.length > 0 && (
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
                                <TableHead className="text-right">
                                  Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                  Labor Cost
                                </TableHead>
                                <TableHead className="text-right">
                                  Markup
                                </TableHead>
                                <TableHead className="text-right">
                                  Total
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
                                      {element.element.name}
                                    </TableCell>
                                    <TableCell>
                                      {element.element.description}
                                    </TableCell>
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

              {/* Project Parameters */}
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
                          <span className="font-medium">
                            {param.parameter.name}
                          </span>
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

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Client Information */}
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
        </div>
      </div>
    </div>
  );
}
