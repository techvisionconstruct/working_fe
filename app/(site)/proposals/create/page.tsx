"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared";
import { TemplateSelector } from "@/components/features/create-proposal/template-selector";
import { VariablesForm } from "@/components/features/create-proposal/variables-form";
import { CostCalculation } from "@/components/features/create-proposal/cost-calculation";
import { ProposalPreview } from "@/components/features/create-proposal/proposal-review";
import ProposalDetails from "@/components/features/create-proposal/proposal-details";
import { emptyProposal } from "@/data/proposals";

export default function CreateProposalPage() {
  const [currentProposal, setCurrentProposal] =
    useState(emptyProposal);
  const [activeTab, setActiveTab] = useState("template");

  const handleTemplateSelect = (template: any) => {
    const initializedVariables = template.parameters.map((variable:any) => ({
      ...variable,
      value: 0, 
      formula: variable.formula || "",
      parameter: variable.parameter || null,
    }));

    const newProposal = {
      ...template,
      parameters: initializedVariables,
    };

    setCurrentProposal(newProposal);
    setActiveTab("details");
  };

  const updateVariables = (updatedVariables:any) => {
    setCurrentProposal((prev) => ({
      ...prev,
      parameters: updatedVariables,
    }));
  };

  const updateProposal = (updatedProposal: any) => {
    setCurrentProposal(updatedProposal);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e5e7eb] flex flex-col py-4 px-4">
      <div className="w-full max-w-8xl mx-auto flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">Create New Proposal</h1>
          <p className="text-base text-gray-500 font-light max-w-2xl mx-auto mt-2">
            Build a professional proposal for your client by following these steps.
          </p>
        </div>
        <div className="rounded-2xl shadow-md bg-white/90 backdrop-blur-md p-6 flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="flex w-full mb-6 rounded-xl bg-gray-100 p-1 h-12">
              <TabsTrigger 
                value="template" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Template
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="variables" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Variables
              </TabsTrigger>
              <TabsTrigger 
                value="costs" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Cost Calculation
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500 transition-all"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="template" className="h-full">
                <TemplateSelector
                  onSelectTemplate={handleTemplateSelect}
                  selectedTemplateId={currentProposal.id}
                />
              </TabsContent>
              <TabsContent value="details" className="h-full">
                <ProposalDetails
                  proposal={currentProposal}
                  onUpdateProposal={updateProposal}
                  onNext={() => setActiveTab("variables")}
                />
              </TabsContent>
              <TabsContent value="variables" className="h-full">
                <VariablesForm
                  parameters={currentProposal.parameters || []}
                  setParameters={updateVariables}
                  onNext={() => setActiveTab("costs")}
                />
              </TabsContent>
              <TabsContent value="costs" className="h-full">
                <CostCalculation
                  proposal={currentProposal}
                  onNext={() => setActiveTab("preview")}
                  onUpdateProposal={updateProposal}
                />
              </TabsContent>
              <TabsContent value="preview" className="h-full">
                <ProposalPreview proposal={currentProposal} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}