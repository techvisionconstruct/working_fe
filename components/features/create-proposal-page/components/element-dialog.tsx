"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { BracesIcon, Loader2, AlertCircle } from "lucide-react";
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
    markup: number;
  }) => void;
  elementToEdit?: ElementResponse | null;
  initialName?: string;
  variables: VariableResponse[];
  updateVariables?: (variables: VariableResponse[]) => void;
  isSubmitting: boolean;
  dialogTitle: string;
  submitButtonText: string;
  includeMarkup?: boolean;
  initialMarkup?: number;
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
  includeMarkup = false,
  initialMarkup = 0,
}: ElementDialogProps) {
  const [name, setName] = useState(elementToEdit?.name || initialName);
  const [description, setDescription] = useState(elementToEdit?.description || "");
  const [markup, setMarkup] = useState(elementToEdit?.markup || initialMarkup);
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);
  const [pendingVariableName, setPendingVariableName] = useState("");
  
  // Filter variables to only include those relevant to this proposal
  // This ensures we're only working with variables that belong to the current proposal
  const filteredVariables = useMemo(() => {
    if (!variables) return [];
    return variables.filter(variable => 
      // Include proposal-specific variables and global variables
      variable && (variable.is_global || variable.origin === "derived")
    );
  }, [variables]);
  
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
      setMarkup(elementToEdit.markup || 0);

      if (elementToEdit.material_cost_formula) {
        const displayFormula = replaceVariableIdsWithNames(
          elementToEdit.material_cost_formula,
          filteredVariables,
          elementToEdit.material_formula_variables || []
        );
        setMaterialFormulaTokens(parseFormulaToTokens(displayFormula));
      } else {
        setMaterialFormulaTokens([]);
      }

      if (elementToEdit.labor_cost_formula) {
        const displayFormula = replaceVariableIdsWithNames(
          elementToEdit.labor_cost_formula,
          filteredVariables,
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
      setMarkup(initialMarkup);
      setMaterialFormulaTokens([]);
      setLaborFormulaTokens([]);
    }
  }, [isOpen, elementToEdit, initialName, initialMarkup, filteredVariables, parseFormulaToTokens, replaceVariableIdsWithNames]);

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
      markup
    });
  };
  
  const handleCreateVariable = (variableName: string) => {
    if (updateVariables) {
      // Don't create variable if it's a number
      if (!isNaN(parseFloat(variableName))) {
        return;
      }
      
      // Check if variable already exists
      const existingVar = filteredVariables.find(v => 
        v.name.toLowerCase() === variableName.toLowerCase()
      );
      
      if (existingVar) {
        // If it exists, just use it
        toast.info(`Variable "${variableName}" already exists`, {
          description: "The variable has been added to your formula"
        });
        return;
      }
      
      // Also check if it's an operator
      if (['+', '-', '*', '/', '(', ')', '^'].includes(variableName)) {
        return;
      }
      
      setPendingVariableName(variableName);
      setShowAddVariableDialog(true);
    }
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
            <Label htmlFor="element-name">Element Name</Label>
            <Input
              id="element-name"
              placeholder="Wall Framing"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="element-description">Description (Optional)</Label>
            <Textarea
              id="element-description"
              placeholder="Description of this element"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          {/* Material Cost Formula */}
          <div className="grid gap-3">
            <Label htmlFor="material-formula" className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                Material Cost Formula <span className="text-muted-foreground ml-1 font-normal">(Optional)</span>
              </span>
              {materialFormulaError && (
                <span className="text-xs text-red-500 font-normal flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {materialFormulaError}
                </span>
              )}
            </Label>
            <FormulaBuilder
              formulaTokens={materialFormulaTokens}
              setFormulaTokens={setMaterialFormulaTokens}
              variables={filteredVariables}
              updateVariables={updateVariables}
              hasError={!!materialFormulaError}
              onCreateVariable={handleCreateVariable}
            />
          </div>

          {/* Labor Cost Formula */}
          <div className="grid gap-3">
            <Label htmlFor="labor-formula" className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                Labor Cost Formula <span className="text-muted-foreground ml-1 font-normal">(Optional)</span>
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
              variables={filteredVariables}
              updateVariables={updateVariables}
              hasError={!!laborFormulaError}
              onCreateVariable={handleCreateVariable}
            />
          </div>

          {/* Markup Field (only if includeMarkup is true) */}
          {includeMarkup && (
            <div className="grid gap-2">
              <Label htmlFor="element-markup">
                Markup Percentage (%)
              </Label>
              <Input
                id="element-markup"
                type="number"
                min="0"
                max="100"
                placeholder="15"
                value={markup || ''}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
              />
              <div className="text-xs text-muted-foreground">
                Enter the percentage markup to apply to this element (e.g., 15 for 15%)
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
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
