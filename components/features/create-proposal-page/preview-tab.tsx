"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared";
import { useRouter, usePathname } from "next/navigation";
import { ProposalPreview } from "@/components/features/create-proposal-page/proposal-preview";
import { ContractPreview } from "@/components/features/create-proposal-page/contract-preview";
import { ProposalPreviewLoader } from "@/components/features/create-proposal-page/preview-loader";

interface PreviewTabProps {
  formData: {
    template: null;
    proposalDetails: {
        name: string;
        description: string;
        image: string;
        client_name: string;
        client_email: string;
        client_phone: string;
        client_address: string;
        valid_until: string;
        location: string;
    };
  };
}

const PreviewTab: React.FC<PreviewTabProps> = ({ formData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("proposal");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (pathname?.includes("/contract")) {
      setActiveTab("contract");
    } else {
      setActiveTab("proposal");
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // This mimics the URL handling in the page.tsx file
    // Actual implementation would depend on the parent route structure
    if (value === "proposal") {
      // In a real implementation, this could update the URL
      // router.push(`/proposals/preview`);
    } else if (value === "contract") {
      // In a real implementation, this could update the URL
      // router.push(`/proposals/preview/contract`);
    }
  };

  if (isLoading) {
    return <ProposalPreviewLoader />;
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="proposal" className="flex-1">
          Proposal Details
        </TabsTrigger>
        <TabsTrigger value="contract" className="flex-1">
          Contract Details
        </TabsTrigger>
      </TabsList>
      <TabsContent value="proposal">
        <ProposalPreview proposal={formData} />
      </TabsContent>
      <TabsContent value="contract">
        <ContractPreview proposal={formData} />
      </TabsContent>
    </Tabs>
  );
};

export default PreviewTab;
