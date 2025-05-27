import React from "react";
import { Button } from "@/components/shared";
import { SaveAll, PlusCircle, Edit, Trash2, Settings } from "lucide-react";
import Link from "next/link";

interface SaveDraftActionProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface NewTemplateActionProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface EditActionProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface DeleteActionProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface SettingsActionProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const SaveDraftAction: React.FC<SaveDraftActionProps> = ({
  onClick,
  className,
  disabled,
}) => {
  return (
    <Button 
      className={`rounded-full ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <SaveAll className="h-4 w-4" />
      Save as Draft
    </Button>
  );
};

export const NewTemplateAction: React.FC<NewTemplateActionProps> = ({
  href = "/site/templates/create",
  onClick,
  className,
  disabled,
}) => {
  const button = (
    <Button 
      className={`rounded-full ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <PlusCircle className="h-4 w-4" />
      New Template
    </Button>
  );

  if (href && !onClick) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};

export const EditAction: React.FC<EditActionProps> = ({
  href,
  onClick,
  className,
  disabled,
  label = "Edit",
  variant = "outline",
}) => {
  const button = (
    <Button 
      variant={variant}
      className={`rounded-full ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Edit className="h-4 w-4" />
      {label}
    </Button>
  );

  if (href && !onClick) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};

export const DeleteAction: React.FC<DeleteActionProps> = ({
  onClick,
  className,
  disabled,
  variant = "outline",
}) => {
  return (
    <Button 
      variant={variant}
      className={`rounded-full ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
};

export const SettingsAction: React.FC<SettingsActionProps> = ({
  href,
  onClick,
  className,
  disabled,
}) => {
  const button = (
    <Button 
      variant="ghost"
      className={`rounded-full ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Settings className="h-4 w-4" />
      Settings
    </Button>
  );

  if (href && !onClick) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};
