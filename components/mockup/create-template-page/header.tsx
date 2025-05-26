import React from "react";
import { PageHeader, SaveDraftAction } from "@/components/shared";

interface TemplateHeaderProps {
  title: string;
  description: string;
  onSaveDraft?: () => void;
}

export const Header: React.FC<TemplateHeaderProps> = ({
  title,
  description,
  onSaveDraft,
}) => {
  return (
    <PageHeader>
      <PageHeader.Content title={title} description={description} />
      <PageHeader.Actions>
        <SaveDraftAction onClick={onSaveDraft} />
      </PageHeader.Actions>
    </PageHeader>
  );
};
