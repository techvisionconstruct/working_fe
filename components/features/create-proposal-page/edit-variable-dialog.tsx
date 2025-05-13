"use client";

import React, { useState, useEffect } from "react";
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
import { BracesIcon, Loader2, Calculator } from "lucide-react";
import { FormulaBuilder } from "./components/formula-builder";
import { useFormula } from "./hooks/use-formula";

interface VariableType {
  id: string;
  name: string;
}

interface EditVariableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditVariable: () => void;
  variableId: string;
  variableName: string;
  setVariableName: React.Dispatch<React.SetStateAction<string>>;
  variableDescription: string;
  setVariableDescription: React.Dispatch<React.SetStateAction<string>>;
  variableValue: number;
  setVariableValue: React.Dispatch<React.SetStateAction<number>>;
  variableType: string;
  setVariableType: React.Dispatch<React.SetStateAction<string>>;
  variableFormula: string; // This should be string not string | null
  setVariableFormula: React.Dispatch<React.SetStateAction<string>>;
  variableTypes: { id: string; name: string }[];
  isLoadingVariableTypes: boolean;
  isUpdating: boolean;
  onCancel: () => void;
  variables?: any[];
  updateVariables?: (variables: any[]) => void;
}

const EditVariableDialog: React.FC<EditVariableDialogProps> = ({
  open,
  onOpenChange,
  onEditVariable,
  variableId,
  variableName,
  setVariableName,
  variableDescription,
  setVariableDescription,
  variableValue,
  setVariableValue,
  variableType,
  setVariableType,
  variableFormula = "", // Default to empty string instead of null
  setVariableFormula,
  variableTypes,
  isLoadingVariableTypes,
  isUpdating,
  onCancel,
  variables = [],
  updateVariables = () => {},
}) => {
  const { 
    parseFormulaToTokens, 
    tokensToFormulaString,
    validateFormulaTokens,
    replaceVariableNamesWithIds,
    replaceVariableIdsWithNames,
  } = useFormula();
  
  const [formulaTokens, setFormulaTokens] = useState<any[]>([]);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [formulaError, setFormulaError] = useState<string | null>(null);
  
  // Initialize formula tokens when dialog opens
  useEffect(() => {
    if (open) {
      // If there's a formula, convert IDs to variable names first
      if (variableFormula) {
        // Convert IDs to names for user-friendly display
        const displayFormula = replaceVariableIdsWithNames(
          variableFormula,
          variables,
          []
        );
        
        setFormulaTokens(parseFormulaToTokens(displayFormula));
        setShowFormulaBuilder(true);
      } else {
        setFormulaTokens([]);
        setShowFormulaBuilder(false);
      }
    }
  }, [open, variableFormula, variables, parseFormulaToTokens, replaceVariableIdsWithNames]);
  
  // Update formula string when tokens change
  useEffect(() => {
    if (formulaTokens.length > 0) {
      const formulaString = tokensToFormulaString(formulaTokens);
      setVariableFormula(formulaString);
    } else if (showFormulaBuilder) {
      // Allow clearing the formula
      setVariableFormula("");
    }
  }, [formulaTokens, setVariableFormula, tokensToFormulaString, showFormulaBuilder]);

  // Function to convert formula with names to IDs before saving
  const prepareFormulaForSave = () => {
    if (variableFormula && variables.length > 0) {
      // Convert variable names to IDs
      return replaceVariableNamesWithIds(variableFormula, variables);
    }
    return variableFormula || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Edit Variable
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="var-name">Variable Name</Label>
            <Input
              id="var-name"
              placeholder="Wall Length"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="var-type">Variable Type</Label>
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
              <Select value={variableType} onValueChange={setVariableType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a variable type" />
                </SelectTrigger>
                <SelectContent>
                  {variableTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* Toggle between direct value and formula */}
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="var-value">Value</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="h-7 px-2"
                onClick={() => setShowFormulaBuilder(!showFormulaBuilder)}
              >
                <Calculator className="h-3.5 w-3.5 mr-1" />
                {showFormulaBuilder ? "Set Direct Value" : "Use Formula"}
              </Button>
            </div>
            
            {showFormulaBuilder ? (
              <div className="space-y-2">
                <FormulaBuilder
                  formulaTokens={formulaTokens}
                  setFormulaTokens={setFormulaTokens}
                  variables={variables}
                  updateVariables={updateVariables}
                  hasError={!!formulaError}
                  onCreateVariable={(name) => {
                    // Handle variable creation if needed
                  }}
                />
                {formulaError && (
                  <p className="text-xs text-red-500">{formulaError}</p>
                )}
              </div>
            ) : (
              <Input
                id="var-value"
                type="number"
                value={variableValue}
                onChange={(e) => setVariableValue(Number(e.target.value))}
              />
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="var-description">Description</Label>
            <Textarea
              id="var-description"
              placeholder="What this variable represents (optional)"
              value={variableDescription}
              onChange={(e) => setVariableDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (variableName.trim()) {
                if (showFormulaBuilder && formulaTokens.length > 0) {
                  const validation = validateFormulaTokens(formulaTokens);
                  if (!validation.isValid) {
                    setFormulaError(validation.error);
                    return;
                  }
                  
                  // Convert names to IDs before sending to parent component
                  const idFormula = prepareFormulaForSave();
                  setVariableFormula(idFormula);
                }
                
                onEditVariable();
              }
            }}
            type="submit"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariableDialog;
