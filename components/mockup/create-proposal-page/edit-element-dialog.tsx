"use client";

import React, { useState } from "react";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { ElementDialog } from "./components/element-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  // Global markup props
  isGlobalMarkupEnabled?: boolean;
  globalMarkupValue?: number;
  onUseGlobalMarkup?: () => void;
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
  isGlobalMarkupEnabled = false,
  globalMarkupValue = 0,
  onUseGlobalMarkup = () => {},
}) => {
  const [localElementMarkup, setElementMarkup] = useState(elementMarkup);
  const queryClient = useQueryClient();

  // Add mutation for updating element
  const updateElementMutation = useMutation({
    mutationFn: ({ elementId, data }: { elementId: string; data: any }) => {
      return fetch(`/api/elements/${elementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });

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
      initialMarkup={localElementMarkup}
      isGlobalMarkupEnabled={isGlobalMarkupEnabled}
      globalMarkupValue={globalMarkupValue}
      onUseGlobalMarkup={
        isGlobalMarkupEnabled
          ? () => {
              if (elementToEdit) {
                // Update markup in local state immediately
                setElementMarkup(globalMarkupValue);

                // Update the element directly in the backend
                updateElementMutation.mutate({
                  elementId: elementToEdit.id,
                  data: {
                    name: elementToEdit.name,
                    description: elementToEdit.description || undefined,
                    material_cost_formula: elementToEdit.material_cost_formula,
                    labor_cost_formula: elementToEdit.labor_cost_formula,
                    markup: globalMarkupValue,
                    // Include any other essential fields required by the API
                    material_formula_variables: elementToEdit.material_formula_variables,
                    labor_formula_variables: elementToEdit.labor_formula_variables,
                  },
                });

                toast.success(
                  `Applied global markup of ${globalMarkupValue}% to element`,
                  {
                    position: "top-center",
                  }
                );
              }
            }
          : undefined
      }
      onRequestCreateVariable={(variableName, callback) => {
        // Instead of creating the variable right away, we'll pass the request to the parent
        // The parent component will handle opening the Add Variable dialog
        if (window.openVariableDialog) {
          window.openVariableDialog(variableName, callback);
        } else {
          console.warn("openVariableDialog function not available on window object");
        }
      }}
    />
  );
};

export default EditElementDialog;
