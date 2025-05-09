"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/shared";
import { BracesIcon, Loader2, AlertCircle, X } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { FormulaBuilder } from "./formula-builder";
import { FormulaToken, useFormula } from "../hooks/use-formula";
import { toast } from "sonner";

interface ElementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
  }) => void;
  elementToEdit?: ElementResponse | null;
  initialName?: string;
  variables: VariableResponse[];
  updateVariables?: (variables: VariableResponse[]) => void;
  isSubmitting: boolean;
  dialogTitle: string;
  submitButtonText: string;
}

export function ElementDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  elementToEdit,
  initialName = "",
  variables,
  updateVariables,
  isSubmitting,
  dialogTitle,
  submitButtonText,
}: ElementDialogProps) {
  const [name, setName] = useState(elementToEdit?.name || initialName);
  const [description, setDescription] = useState(
    elementToEdit?.description || ""
  );
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);
  const [pendingVariableName, setPendingVariableName] = useState("");

  const {
    materialFormulaTokens,
    setMaterialFormulaTokens,
    laborFormulaTokens,
    setLaborFormulaTokens,
    materialFormulaError,
    laborFormulaError,
    validateFormulaTokens,
    parseFormulaToTokens,
    tokensToFormulaString,
    replaceVariableIdsWithNames,
  } = useFormula();

  // Initialize form when editing an element
  useEffect(() => {
    if (isOpen && elementToEdit) {
      setName(elementToEdit.name);
      setDescription(elementToEdit.description || "");

      if (elementToEdit.material_cost_formula) {
        const displayFormula = replaceVariableIdsWithNames(
          elementToEdit.material_cost_formula,
          variables,
          elementToEdit.material_formula_variables || []
        );
        setMaterialFormulaTokens(parseFormulaToTokens(displayFormula));
      } else {
        setMaterialFormulaTokens([]);
      }

      if (elementToEdit.labor_cost_formula) {
        const displayFormula = replaceVariableIdsWithNames(
          elementToEdit.labor_cost_formula,
          variables,
          elementToEdit.labor_formula_variables || []
        );
        setLaborFormulaTokens(parseFormulaToTokens(displayFormula));
      } else {
        setLaborFormulaTokens([]);
      }
    } else if (isOpen) {
      // For new elements, just set the name
      setName(initialName);
      setDescription("");
      setMaterialFormulaTokens([]);
      setLaborFormulaTokens([]);
    }
  }, [
    isOpen,
    elementToEdit,
    initialName,
    variables,
    parseFormulaToTokens,
    replaceVariableIdsWithNames,
  ]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Validate formulas
    if (materialFormulaTokens.length > 0) {
      const materialValidation = validateFormulaTokens(materialFormulaTokens);
      if (!materialValidation.isValid) {
        return;
      }
    }

    if (laborFormulaTokens.length > 0) {
      const laborValidation = validateFormulaTokens(laborFormulaTokens);
      if (!laborValidation.isValid) {
        return;
      }
    }

    const materialFormula = tokensToFormulaString(materialFormulaTokens);
    const laborFormula = tokensToFormulaString(laborFormulaTokens);

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      materialFormula,
      laborFormula,
    });
  };

  const handleCreateVariable = (variableName: string) => {
    if (updateVariables) {
      // Don't create variable if it's a number
      if (!isNaN(parseFloat(variableName))) {
        return;
      }

      // Check if variable already exists
      const existingVar = variables.find(
        (v) => v.name.toLowerCase() === variableName.toLowerCase()
      );

      if (existingVar) {
        // If it exists, just use it
        toast.info(`Variable "${variableName}" already exists`, {
          description: "The variable has been added to your formula",
        });
        return;
      }

      // Also check if it's an operator
      if (["+", "-", "*", "/", "(", ")", "^"].includes(variableName)) {
        return;
      }

      setPendingVariableName(variableName);
      setShowAddVariableDialog(true);
    }
  };

  // Element validation state
  const [elementErrors, setElementErrors] = useState({
    name: "",
  });

  const [elementTouched, setElementTouched] = useState({
    name: false,
  });

  useEffect(() => {
    if (elementTouched.name) {
      validateElementForm();
    }
  }, [name, elementTouched.name]);

  // Add this function to validate element form
  const validateElementForm = () => {
    const newErrors = { name: "" };

    if (!name.trim()) {
      newErrors.name = "Element name is required";
    } else if (name.length > 100) {
      newErrors.name = "Element name must be less than 100 characters";
    }

    setElementErrors(newErrors);
    return !newErrors.name;
  };

  const handleElementBlur = (field: any) => {
    setElementTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-5">
          <div className="grid gap-2">
            <Label htmlFor="element-name">
              Element Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="element-name"
                placeholder="Wall Framing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleElementBlur("name")}
                className={
                  elementErrors.name && elementTouched.name
                    ? "border-red-500 pr-10"
                    : "pr-10"
                }
              />
              {name && (
                <button
                  type="button"
                  onClick={() => setName("")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear element name"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
            {elementErrors.name && elementTouched.name && (
              <p className="text-xs text-red-500">{elementErrors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="element-description">
              Description{" "}
              <span className="text-gray-500">&#40;Optional&#41;</span>
            </Label>
            <div className="relative">
              <Textarea
                id="element-description"
                placeholder="Description of this element"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[60px] pr-10"
              />
              {description && (
                <button
                  type="button"
                  onClick={() => setDescription("")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear description"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          {/* Material Cost Formula */}
          <div className="grid gap-3">
            <Label
              htmlFor="material-formula"
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium flex items-center">
                Material Cost Formula{" "}
                <span className="text-gray-500">&#40;Optional&#41;</span>
              </span>
              {materialFormulaError && (
                <span className="text-xs text-red-500 font-normal flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{" "}
                  {materialFormulaError}
                </span>
              )}
            </Label>
            <FormulaBuilder
              formulaTokens={materialFormulaTokens}
              setFormulaTokens={setMaterialFormulaTokens}
              variables={variables}
              updateVariables={updateVariables}
              hasError={!!materialFormulaError}
              onCreateVariable={handleCreateVariable}
            />
          </div>

          {/* Labor Cost Formula */}
          <div className="grid gap-3">
            <Label
              htmlFor="labor-formula"
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium flex items-center">
                Labor Cost Formula{" "}
                <span className="text-gray-500">&#40;Optional&#41;</span>
              </span>
              {laborFormulaError && (
                <span className="text-xs text-red-500 font-normal flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {laborFormulaError}
                </span>
              )}
            </Label>
            <FormulaBuilder
              formulaTokens={laborFormulaTokens}
              setFormulaTokens={setLaborFormulaTokens}
              variables={variables}
              updateVariables={updateVariables}
              hasError={!!laborFormulaError}
              onCreateVariable={handleCreateVariable}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (
                validateElementForm() &&
                (!materialFormulaTokens.length ||
                  validateFormulaTokens(materialFormulaTokens).isValid) &&
                (!laborFormulaTokens.length ||
                  validateFormulaTokens(laborFormulaTokens).isValid)
              ) {
                handleSubmit();
              } else {
                setElementTouched({ name: true });
              }
            }}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {elementToEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
