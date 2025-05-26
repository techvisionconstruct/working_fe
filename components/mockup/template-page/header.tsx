import React from 'react'
import { PageHeader, NewTemplateAction } from "@/components/shared"

interface TemplateHeaderProps {
  title: string;
  description: string;
  newTemplateHref?: string;
  onNewTemplate?: () => void;
}

export const Header: React.FC<TemplateHeaderProps> = ({ 
  title,
  description,
  newTemplateHref,
  onNewTemplate
}) => {
  return (
    <PageHeader>
      <PageHeader.Content title={title} description={description} />
      <PageHeader.Actions>
        <NewTemplateAction 
          href={newTemplateHref} 
          onClick={onNewTemplate} 
        />
      </PageHeader.Actions>
    </PageHeader>
  )
}
