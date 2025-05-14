"use client";

import React from "react";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { ElementDialog } from "./components/element-dialog";

// Simplify interface to match actual usage in trades-and-elements-tab.tsx
interface EditElementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditElement: (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => void;
  elementToEdit: ElementResponse | null;
  variables: VariableResponse[];
  updateVariables?: (variables: VariableResponse[]) => void;
  isUpdatingElement: boolean;
  elementMarkup: number;
  onCancel: () => void;
}

const EditElementDialog: React.FC<EditElementDialogProps> = ({
  open,
  onOpenChange,
  onEditElement,
  isUpdatingElement,
  onCancel,
  elementToEdit,
  variables = [],
  updateVariables = () => {},
  elementMarkup,
}) => {
  const handleSubmit = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => {
    if (data.name.trim()) {
      onEditElement(data);
    }
  };

  return (
    <ElementDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      elementToEdit={elementToEdit}
      variables={variables}
      updateVariables={updateVariables}
      isSubmitting={isUpdatingElement}
      dialogTitle="Edit Element"
      submitButtonText="Update Element"
      includeMarkup={true}
      initialMarkup={elementMarkup}
    />
  );
};

export default EditElementDialog;
