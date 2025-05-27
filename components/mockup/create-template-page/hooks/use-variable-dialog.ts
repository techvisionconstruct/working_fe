"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVariable } from "@/api-calls/variables/create-variable";
import { VariableResponse } from "@/types/variables/dto";

interface UseVariableDialogProps {
  variables: VariableResponse[];
  updateVariables: (variables: VariableResponse[]) => void;
  pendingVariableCallback: ((newVariable: VariableResponse) => void) | null;
  setPendingVariableCallback: (callback: ((newVariable: VariableResponse) => void) | null) => void;
}

export const useVariableDialog = ({
  variables,
  updateVariables,
  pendingVariableCallback,
  setPendingVariableCallback,
}: UseVariableDialogProps) => {
  // Variable dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditVariableDialog, setShowEditVariableDialog] = useState(false);
  const [variableToEdit, setVariableToEdit] = useState<VariableResponse | null>(null);
  
  // Form state
  const [newVarName, setNewVarName] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation state
  const [variableErrors, setVariableErrors] = useState({
    name: "",
    variable_type: "",
  });
  const [variableTouched, setVariableTouched] = useState({
    name: false,
    variable_type: false,
  });

  // Variable mutation
  const { mutate: createVariableMutation } = useMutation({
    mutationFn: createVariable,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdVariable = response.data;
        const updatedVariables = [...variables, createdVariable];
        updateVariables(updatedVariables);

        // Handle pending callback
        if (pendingVariableCallback) {
          try {
            pendingVariableCallback(createdVariable);
            setPendingVariableCallback(null);
          } catch (error) {
            console.error("Error in pendingVariableCallback:", error);
          }
        }

        toast.success("Variable created successfully", {
          position: "top-center",
          description: `"${createdVariable.name}" has been added to your template.`,
        });

        // Close dialog and reset form state
        setShowAddDialog(false);
        setNewVarName("");
        setNewVarDescription("");
        setNewVarDefaultValue(0);
        setNewVarDefaultVariableType("");
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to create variable", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      setIsSubmitting(false);
      setPendingVariableCallback(null);
    },
  });

  const validateVariableForm = () => {
    const errors = { name: "", variable_type: "" };
    let isValid = true;

    if (!newVarName.trim()) {
      errors.name = "Variable name is required";
      isValid = false;
    }

    if (!newVarDefaultVariableType) {
      errors.variable_type = "Variable type is required";
      isValid = false;
    }

    setVariableErrors(errors);
    return isValid;
  };

  const handleVariableBlur = (field: "name" | "variable_type") => {
    setVariableTouched((prev) => ({ ...prev, [field]: true }));
    validateVariableForm();
  };

  const handleAddVariable = () => {
    if (!validateVariableForm()) return;

    const variableData = {
      name: newVarName.trim(),
      description: newVarDescription.trim() || undefined,
      value: newVarDefaultValue,
      is_global: false,
      variable_type: newVarDefaultVariableType,
    };
    setIsSubmitting(true);
    createVariableMutation(variableData);
  };

  const handleOpenEditVariableDialog = (variable: VariableResponse) => {
    setVariableToEdit(variable);
    setNewVarName(variable.name);
    setNewVarDescription(variable.description || "");
    setNewVarDefaultVariableType(variable.variable_type?.id?.toString() || "");
    setShowEditVariableDialog(true);
  };

  const handleEditVariable = () => {
    if (!validateVariableForm() || !variableToEdit) return;

    const updatedVariable: VariableResponse = {
      ...variableToEdit,
      name: newVarName.trim(),
      description: newVarDescription.trim() || "",
      variable_type: {
        id: newVarDefaultVariableType,
        name: variableToEdit.variable_type?.name || "",
        category: variableToEdit.variable_type?.category || "",
        unit: variableToEdit.variable_type?.unit || "",
        is_built_in: variableToEdit.variable_type?.is_built_in ?? false,
        created_at: variableToEdit.variable_type?.created_at || "",
        updated_at: variableToEdit.variable_type?.updated_at || "",
        created_by: variableToEdit.variable_type?.created_by,
        updated_by: variableToEdit.variable_type?.updated_by,
      },
    };

    const updatedVariables = variables.map((v) =>
      v.id === variableToEdit.id ? updatedVariable : v
    );
    updateVariables(updatedVariables);
    
    setShowEditVariableDialog(false);
    setVariableToEdit(null);
    setNewVarName("");
    setNewVarDescription("");
    setNewVarDefaultValue(0);
    setNewVarDefaultVariableType("");
  };

  return {
    // State
    showAddDialog,
    setShowAddDialog,
    showEditVariableDialog,
    setShowEditVariableDialog,
    variableToEdit,
    newVarName,
    setNewVarName,
    newVarDefaultValue,
    setNewVarDefaultValue,
    newVarDescription,
    setNewVarDescription,
    newVarDefaultVariableType,
    setNewVarDefaultVariableType,
    isSubmitting,
    variableErrors,
    variableTouched,
    
    // Handlers
    handleVariableBlur,
    handleAddVariable,
    handleOpenEditVariableDialog,
    handleEditVariable,
  };
};
