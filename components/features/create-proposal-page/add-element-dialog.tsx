"use client";

import React from "react";
import { VariableResponse } from "@/types/variables/dto";
import { ElementDialog } from "./components/element-dialog";

// Simplify interface to match actual usage in trades-and-elements-tab.tsx
interface AddElementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddElement: (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => void;
  newElementName: string;
  variables: VariableResponse[];
  updateVariables?: (variables: VariableResponse[]) => void;
  isCreatingElement: boolean;
}

const AddElementDialog: React.FC<AddElementDialogProps> = ({
  open,
  onOpenChange,
  onAddElement,
  newElementName,
  variables = [],
  updateVariables = () => {},
  isCreatingElement,
}) => {
  const handleSubmit = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => {
    if (data.name.trim()) {
      onAddElement(data);
    }
  };

  return (
    <ElementDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      initialName={newElementName}
      variables={variables}
      updateVariables={updateVariables}
      isSubmitting={isCreatingElement}
      dialogTitle="Add New Element"
      submitButtonText="Add Element"
      includeMarkup={true}
      initialMarkup={0}
    />
  );
};

export default AddElementDialog;
