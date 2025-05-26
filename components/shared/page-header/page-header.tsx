import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/shared";

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  withSeparator?: boolean;
}

interface PageHeaderContentProps {
  title: string;
  description?: string;
  className?: string;
}

interface PageHeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

const PageHeaderRoot: React.FC<PageHeaderProps> = ({
  children,
  className,
  withSeparator = true,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center justify-between">
        {children}
      </div>
      {withSeparator && <Separator />}
    </div>
  );
};

const PageHeaderContent: React.FC<PageHeaderContentProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

const PageHeaderActions: React.FC<PageHeaderActionsProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {children}
    </div>
  );
};

export const PageHeader = Object.assign(PageHeaderRoot, {
  Content: PageHeaderContent,
  Actions: PageHeaderActions,
});
