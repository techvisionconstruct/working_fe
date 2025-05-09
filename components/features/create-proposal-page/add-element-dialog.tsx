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
} from "@/components/shared";
import { BracesIcon, Loader2, X } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";

interface AddElementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddElement: () => void;
  newElementName: string;
  setNewElementName: (name: string) => void;
  newElementDescription: string;
  setNewElementDescription: (description: string) => void;
  newElementMaterialFormula: string;
  setNewElementMaterialFormula: React.Dispatch<React.SetStateAction<string>>;
  newElementLaborFormula: string;
  setNewElementLaborFormula: React.Dispatch<React.SetStateAction<string>>;
  handleMaterialFormulaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLaborFormulaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaterialFormulaKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  handleLaborFormulaKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showMaterialSuggestions: boolean;
  materialSuggestions: VariableResponse[];
  selectedMaterialSuggestion: number;
  showLaborSuggestions: boolean;
  laborSuggestions: VariableResponse[];
  selectedLaborSuggestion: number;
  isCreatingElement: boolean;
  insertVariableInFormula: (formula: string, variableName: string) => string;
}

const AddElementDialog: React.FC<AddElementDialogProps> = ({
  open,
  onOpenChange,
  onAddElement,
  newElementName,
  setNewElementName,
  newElementDescription,
  setNewElementDescription,
  newElementMaterialFormula,
  setNewElementMaterialFormula,
  newElementLaborFormula,
  setNewElementLaborFormula,
  handleMaterialFormulaChange,
  handleLaborFormulaChange,
  handleMaterialFormulaKeyDown,
  handleLaborFormulaKeyDown,
  showMaterialSuggestions,
  materialSuggestions,
  selectedMaterialSuggestion,
  showLaborSuggestions,
  laborSuggestions,
  selectedLaborSuggestion,
  isCreatingElement,
  insertVariableInFormula,
}) => {
  const [touched, setTouched] = useState({ name: false });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const errs: { name?: string } = {};
    if (!newElementName.trim()) {
      errs.name = "Element name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    setTouched({ name: true });
    if (validate()) {
      onAddElement();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Add New Element
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="element-name">
              Element Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="element-name"
                placeholder="Wall Framing"
                value={newElementName}
                onChange={(e) => {
                  setNewElementName(e.target.value);
                  setTouched((prev) => ({ ...prev, name: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                className={errors.name && touched.name ? "border-red-500" : ""}
              />
              {newElementName && (
                <button
                  type="button"
                  onClick={() => setNewElementName("")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear element name"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
            {errors.name && touched.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="element-description">Description (Optional)</Label>
            <Textarea
              id="element-description"
              placeholder="Description of this element"
              value={newElementDescription}
              onChange={(e) => setNewElementDescription(e.target.value)}
              className="min-h-[60px]"
            />
            {newElementDescription && (
              <button
                type="button"
                onClick={() => setNewElementDescription("")}
                className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                tabIndex={-1}
                aria-label="Clear element description"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-formula">
              Material Cost Formula (Optional)
            </Label>
            <div className="relative">
              <Input
                id="material-formula"
                placeholder="e.g., {Wall Length} * {Wall Width} * 10"
                value={newElementMaterialFormula}
                onChange={handleMaterialFormulaChange}
                onKeyDown={handleMaterialFormulaKeyDown}
              />
              {showMaterialSuggestions && materialSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-background border rounded-md shadow-md max-h-[120px] overflow-y-auto">
                  {materialSuggestions.map((variable, index) => (
                    <div
                      key={variable.id}
                      className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                        selectedMaterialSuggestion === index
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      onClick={() => {
                        setNewElementMaterialFormula((prev: string) =>
                          insertVariableInFormula(prev, variable.name)
                        );
                      }}
                    >
                      {variable.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementMaterialFormula((prev: string) => prev + " + ");
                }}
              >
                +
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementMaterialFormula((prev: string) => prev + " - ");
                }}
              >
                -
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementMaterialFormula((prev: string) => prev + " * ");
                }}
              >
                ×
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementMaterialFormula((prev: string) => prev + " / ");
                }}
              >
                ÷
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Use curly braces to reference variables, e.g., {"{Wall Length}"} *{" "}
              {"{Wall Width}"} or type {"{"} to see suggestions
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="labor-formula">Labor Cost Formula (Optional)</Label>
            <div className="relative">
              <Input
                id="labor-formula"
                placeholder="e.g., {Wall Length} * {Wall Width} * 5"
                value={newElementLaborFormula}
                onChange={handleLaborFormulaChange}
                onKeyDown={handleLaborFormulaKeyDown}
              />
              {showLaborSuggestions && laborSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-background border rounded-md shadow-md max-h-[120px] overflow-y-auto">
                  {laborSuggestions.map((variable, index) => (
                    <div
                      key={variable.id}
                      className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                        selectedLaborSuggestion === index
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      onClick={() => {
                        setNewElementLaborFormula((prev: string) =>
                          insertVariableInFormula(prev, variable.name)
                        );
                      }}
                    >
                      {variable.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementLaborFormula((prev: string) => prev + " + ");
                }}
              >
                +
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementLaborFormula((prev: string) => prev + " - ");
                }}
              >
                -
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementLaborFormula((prev: string) => prev + " * ");
                }}
              >
                ×
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewElementLaborFormula((prev: string) => prev + " / ");
                }}
              >
                ÷
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Use curly braces to reference variables, e.g., {"{Wall Length}"} *{" "}
              {"{Wall Width}"} or type {"{"} to see suggestions
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newElementName.trim()) {
                onAddElement();
              }
            }}
            disabled={isCreatingElement}
            type="submit"
          >
            {isCreatingElement ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Element"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddElementDialog;
