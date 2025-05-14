"use client";

import React from "react";
import { Card, CardContent } from "@/components/shared";

interface ContractPreviewProps {
  proposal: any;
}

export function ContractPreview({ proposal }: ContractPreviewProps) {
  const { name, description, client_name, client_email, client_phone, client_address, valid_until, location } = proposal?.proposalDetails || {};

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="border rounded-md p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Contract for {name || "Untitled Project"}</h1>
          <p className="text-lg text-muted-foreground">Client: {client_name || "Client Name"}</p>
          <p className="text-sm text-muted-foreground mt-2">Effective Date: {formatDate(new Date().toISOString())}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contract Terms</h2>
          <Card>
            <CardContent className="p-4">
              <p className="mb-4">This contract is entered into by and between:</p>
              <p className="mb-2"><strong>Client:</strong> {client_name || "Client Name"}</p>
              <p className="mb-2"><strong>Address:</strong> {client_address || "Client Address"}</p>
              <p className="mb-2"><strong>Email:</strong> {client_email || "Client Email"}</p>
              <p className="mb-2"><strong>Phone:</strong> {client_phone || "Client Phone"}</p>
              <p className="mb-4"><strong>Contractor:</strong> Your Company Name</p>
              
              <h3 className="text-lg font-medium my-4">1. Scope of Work</h3>
              <p className="mb-4">The Contractor agrees to perform the following services:</p>
              <p className="whitespace-pre-wrap mb-6">{description || "Project description will appear here."}</p>
              
              <h3 className="text-lg font-medium my-4">2. Payment Terms</h3>
              <p className="mb-4">Payment schedule and terms will be as follows:</p>
              <ul className="list-disc pl-5 mb-6">
                <li>50% deposit due upon signing this contract</li>
                <li>25% due upon midpoint completion</li>
                <li>25% due upon project completion</li>
              </ul>
              
              <h3 className="text-lg font-medium my-4">3. Timeline</h3>
              <p className="mb-4">The project will be completed according to the following timeline:</p>
              <ul className="list-disc pl-5 mb-6">
                <li>Start date: Upon receipt of deposit</li>
                <li>Estimated completion: Within 60 days of start date</li>
              </ul>
              
              <h3 className="text-lg font-medium my-4">4. Terms and Conditions</h3>
              <p className="mb-2">This section would contain detailed terms and conditions for the contract.</p>
            </CardContent>
          </Card>
        </div>
        
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
  );
}
