"use client";

import React from "react";
import { Card, CardContent, Button } from "@/components/shared";
import { Printer, Download, Mail } from "lucide-react";

interface ProposalPreviewProps {
  proposal: any;
}

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const { name, description, client_name, client_email, client_phone, client_address, valid_until, location } = proposal?.proposalDetails || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF
    console.log("Download PDF functionality would be implemented here");
  };

  const handleSendEmail = () => {
    // In a real application, this would open a modal to send the proposal via email
    console.log("Email sending functionality would be implemented here");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };
  // Get actual trades and elements from the proposal
  const tradesAndElements = proposal?.template?.trades || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send via Email
        </Button>
      </div>

      {/* Proposal Preview */}
      <div className="border rounded-md p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{name || "Untitled Proposal"}</h1>
            <p className="text-lg text-muted-foreground">Prepared for: {client_name || "Client Name"}</p>
            <p className="text-sm text-muted-foreground mt-2">Date: {formatDate(valid_until)}</p>
            {location && (
              <p className="text-sm text-muted-foreground">Location: {location}</p>
            )}
          </div>

          {/* Project Description */}
          {description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Description</h2>
              <Card>
                <CardContent className="p-4">
                  <p className="whitespace-pre-wrap">{description}</p>
                </CardContent>
              </Card>
            </div>
          )}          {/* Trades and Elements */}
          {tradesAndElements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Scope</h2>
              
              {tradesAndElements.map((trade: any) => (
                <div key={trade.id} className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    {trade.image && (
                      <div className="h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
                        <img 
                          src={trade.image} 
                          alt={trade.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-medium">{trade.name}</h3>
                  </div>
                  
                  {trade.description && (
                    <p className="text-sm text-muted-foreground mb-3">{trade.description}</p>
                  )}
                  
                  {trade.elements && trade.elements.length > 0 ? (
                    <div className="space-y-4">
                      {trade.elements.map((element: any) => (
                        <Card key={element.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-2">
                              {element.image && (
                                <div className="h-11 w-11 overflow-hidden rounded-md flex-shrink-0">
                                  <img 
                                    src={element.image} 
                                    alt={element.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-md font-medium">{element.name}</h4>
                                {element.description && (
                                  <p className="text-sm text-muted-foreground">{element.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">
                                  Total: ${((element.material_cost || 0) + (element.labor_cost || 0)).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Material: ${(element.material_cost || 0).toFixed(2)} | 
                                  Labor: ${(element.labor_cost || 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No elements in this trade.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Signature Section */}
          <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-medium mb-12">Client Signature:</p>
                <div className="border-b border-gray-400 w-full"></div>
                <p className="mt-2">Date: _________________</p>
              </div>
              <div>
                <p className="font-medium mb-12">Contractor Signature:</p>
                <div className="border-b border-gray-400 w-full"></div>
                <p className="mt-2">Date: _________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
