"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
} from "@/components/shared";
import type { ProposalData, Variable } from "@/types/proposals";
import { calculateCost } from "@/helpers/calculate-cost";
import {
  PrinterIcon,
  DownloadIcon,
  MailIcon,
  CheckCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { useMemo } from "react";
import { useCreateProposal } from "@/hooks/api/proposals/create-proposal";

interface ProposalPreviewProps {
  proposal: ProposalData;
}

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const router = useRouter();
  const { createProposal, isLoading, error } = useCreateProposal();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveProposal = async () => {
    setIsSaving(true);
    
    try {
      const result = await createProposal(proposal);
      
      if (result.success) {
        alert("Success! Your proposal has been saved successfully.");
        
        // Redirect to proposals list or the new proposal page
        setTimeout(() => {
          router.push('/proposals');
        }, 1500);
      } else {
        alert(result.error || "Failed to save proposal. Please try again.");
      }
    } catch (err) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const calculatedCosts = useMemo(() => {
    return proposal.categories.map((category) => ({
      ...category,
      elements: category.elements.map((element) => {
        const materialCost = calculateCost(
          element.material_cost,
          proposal.variables
        );
        const laborCost = calculateCost(element.labor_cost, proposal.variables);
        const baseCost = materialCost + laborCost;

        // Use global markup if enabled, otherwise use element's markup (or default to 10%)
        const markupPercentage = proposal.useGlobalMarkup
          ? proposal.globalMarkupPercentage || 15
          : element.markup_percentage || 10;

        const markupAmount = baseCost * (markupPercentage / 100);

        return {
          ...element,
          calculatedMaterialCost: materialCost,
          calculatedLaborCost: laborCost,
          markupPercentage: markupPercentage,
          markupAmount: markupAmount,
          totalWithMarkup: baseCost + markupAmount,
        };
      }),
    }));
  }, [proposal]);

  const totalMaterialCost = calculatedCosts.reduce((total, category) => {
    return (
      total +
      category.elements.reduce((catTotal, element) => {
        return catTotal + (element.calculatedMaterialCost || 0);
      }, 0)
    );
  }, 0);

  const totalLaborCost = calculatedCosts.reduce((total, category) => {
    return (
      total +
      category.elements.reduce((catTotal, element) => {
        return catTotal + (element.calculatedLaborCost || 0);
      }, 0)
    );
  }, 0);

  const totalMarkupAmount = calculatedCosts.reduce((total, category) => {
    return (
      total +
      category.elements.reduce((catTotal, element) => {
        return catTotal + (element.markupAmount || 0);
      }, 0)
    );
  }, 0);

  const grandTotalWithMarkup = totalMaterialCost + totalLaborCost + totalMarkupAmount;

  return (
    <div>
      <div className="container mx-auto px-4">
        {/* Show error message if API call fails */}
        {error && (
          <div className="bg-destructive/20 border border-destructive rounded-md p-3 text-destructive mt-4">
            {error}
          </div>
        )}
        
        {/* Full-width image at the top */}
        <div className="relative w-full h-[300px] mt-6 mb-6 overflow-hidden rounded-xl">
          <Image
            src={proposal.imageUrl || "/placeholder-image.jpg"}
            alt={proposal.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="space-y-8 pb-20">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  {proposal.title}
                </h1>
                <Badge variant="outline" className="ml-2">
                  Preview
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm">
                <span>
                  Created on {new Date().toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Client: {proposal.clientName}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <PrinterIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <DownloadIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <MailIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </Button>
              <Button 
                className="gap-2" 
                onClick={handleSaveProposal}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Proposal"}
              </Button>
            </div>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Main content - left side (3 columns on medium screens and above) */}
            <div className="md:col-span-3 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-base/relaxed whitespace-pre-line">
                    {proposal.description}
                  </p>
                </div>
              </div>
              
              {/* Project categories and elements */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Project Modules</h2>
                {calculatedCosts.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="rounded-lg border p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Element</TableHead>
                            <TableHead>Material Formula</TableHead>
                            <TableHead>Labor Formula</TableHead>
                            <TableHead>Material Cost</TableHead>
                            <TableHead>Labor Cost</TableHead>
                            <TableHead>Base Total</TableHead>
                            <TableHead className="text-right">Markup %</TableHead>
                            <TableHead className="text-right">Total with Markup</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.elements.map((element) => (
                            <TableRow key={element.id}>
                              <TableCell className="font-medium">
                                {element.name}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  {element.material_cost}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  {element.labor_cost}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">
                                ${element.calculatedMaterialCost?.toFixed(2)}
                              </TableCell>
                              <TableCell className="font-mono">
                                ${element.calculatedLaborCost?.toFixed(2)}
                              </TableCell>
                              <TableCell className="font-mono">
                                ${((element.calculatedMaterialCost || 0) + (element.calculatedLaborCost || 0)).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                {element.markupPercentage}%
                                {proposal.useGlobalMarkup && (
                                  <div className="text-xs text-muted-foreground">
                                    (Global)
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-semibold font-mono">
                                ${element.totalWithMarkup?.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Variables section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Variables</h2>
                <p className="text-muted-foreground text-sm">
                  Project dimensions and parameters
                </p>
                <div className="flex flex-wrap gap-3">
                  {proposal.variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="flex justify-between w-[250px] items-center p-3 bg-muted/50 rounded-xl"
                    >
                      <span className="font-medium">{variable.name}</span>
                      <div className="flex items-center gap-2">
                        <span>{variable.value}</span>
                        <span className="text-muted-foreground">
                          {variable.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar - right side (1 column on medium screens and above) */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Client Name</p>
                    <p className="font-medium">{proposal.clientName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{proposal.clientEmail}</p>
                  </div>
                  {proposal.clientPhone && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{proposal.clientPhone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Proposal Summary Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Proposal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Total Material Cost
                      </span>
                      <span className="font-mono font-medium">
                        ${totalMaterialCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Labor Cost</span>
                      <span className="font-mono font-medium">
                        ${totalLaborCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Markup</span>
                      <span className="font-mono font-medium">
                        ${totalMarkupAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-medium">Grand Total</span>
                      <span className="text-xl font-mono font-bold">
                        ${grandTotalWithMarkup.toFixed(2)}
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
