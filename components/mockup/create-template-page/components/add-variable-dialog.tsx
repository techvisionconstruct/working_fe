"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared";
import { BracesIcon, X, Loader2 } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";
import { createVariable } from "@/api/variables/create-variable";
import { getVariablesTypes } from "@/query-options/variable-types";

interface AddVariableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVariableCreated?: (variable: VariableResponse) => void;
  initialName?: string;
}

const AddVariableDialog: React.FC<AddVariableDialogProps> = ({
  isOpen,
  onOpenChange,
  onVariableCreated,
  initialName = "",
}) => {
  // Internal state
  const [newVarName, setNewVarName] = useState(initialName);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] = useState("");
  
  // Validation state
  const [variableErrors, setVariableErrors] = useState({
    name: "",
    variable_type: "",
  });
  const [variableTouched, setVariableTouched] = useState({
    name: false,
    variable_type: false,
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewVarName(initialName);
      setNewVarDescription("");
      setNewVarDefaultValue(0);
      setNewVarDefaultVariableType("");
      setVariableErrors({ name: "", variable_type: "" });
      setVariableTouched({ name: false, variable_type: false });
    }
  }, [isOpen, initialName]);

  // Load variable types
  const { data: apiVariableTypes, isLoading: isLoadingVariableTypes } = useQuery(
    getVariablesTypes()
  );

  // Variable creation mutation
  const { mutate: createVariableMutation, isPending: isSubmitting } = useMutation({
    mutationFn: createVariable,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdVariable = response.data;
        toast.success(`Variable "${createdVariable.name}" created successfully!`);
        onVariableCreated?.(createdVariable);
        onOpenChange(false);
      }
    },
    onError: (error: any) => {
      console.error("Error creating variable:", error);
      toast.error(error?.response?.data?.message || "Failed to create variable");
    },
  });

  // Validation functions
  const validateVariable = () => {
    const errors = { name: "", variable_type: "" };
    
    if (!newVarName.trim()) {
      errors.name = "Variable name is required";
    } else if (newVarName.length < 2) {
      errors.name = "Variable name must be at least 2 characters";
    }
    
    if (!newVarDefaultVariableType) {
      errors.variable_type = "Variable type is required";
    }
    
    setVariableErrors(errors);
    return !errors.name && !errors.variable_type;
  };

  const handleVariableBlur = (field: "name" | "variable_type") => {
    setVariableTouched(prev => ({ ...prev, [field]: true }));
    validateVariable();
  };

  // Submit handler
  const handleAddVariable = () => {
    setVariableTouched({ name: true, variable_type: true });
    
    if (!validateVariable()) {
      return;
    }

    const variableData = {
      name: newVarName.trim(),
      description: newVarDescription.trim(),
      default_value: newVarDefaultValue,
      variable_type: newVarDefaultVariableType,
    };

    createVariableMutation(variableData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Add Template Variable
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="var-name">
              Variable Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="var-name"
                placeholder="Wall Length"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
                onBlur={() => handleVariableBlur("name")}
                className={
                  variableErrors.name && variableTouched.name
                    ? "border-red-500 pr-10"
                    : "pr-10"
                }
              />
              {newVarName && (
                <button
                  type="button"
                  onClick={() => setNewVarName("")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear variable name"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
            {variableErrors.name && variableTouched.name && (
              <p className="text-xs text-red-500">{variableErrors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="var-type">
              Variable Type <span className="text-red-500">*</span>
            </Label>
            {isLoadingVariableTypes ? (
              <div className="relative">
                <Select disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Loading variable types..." />
                  </SelectTrigger>
                </Select>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Loading variable types...
                </div>
              </div>
            ) : (
              <>
                <Select
                  value={newVarDefaultVariableType}
                  onValueChange={setNewVarDefaultVariableType}
                >
                  <SelectTrigger
                    className={`w-full ${
                      variableErrors.variable_type && variableTouched.variable_type
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a variable type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray((apiVariableTypes as any)?.data) ? (
                      (apiVariableTypes as any).data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default">Default Type</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {variableErrors.variable_type && variableTouched.variable_type && (
                  <p className="text-xs text-red-500">{variableErrors.variable_type}</p>
                )}
              </>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="var-description">
              Description <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <Textarea
              id="var-description"
              placeholder="What this variable represents (optional)"
              value={newVarDescription}
              onChange={(e) => setNewVarDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddVariable}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Variable"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVariableDialog;
