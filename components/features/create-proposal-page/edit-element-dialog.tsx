"use client";

import React from "react";
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
import { BracesIcon, Loader2 } from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";

interface EditElementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditElement: () => void;
  newElementName: string;
  setNewElementName: React.Dispatch<React.SetStateAction<string>>;
  newElementDescription: string;
  setNewElementDescription: React.Dispatch<React.SetStateAction<string>>;
  newElementMaterialFormula: string;
  setNewElementMaterialFormula: React.Dispatch<React.SetStateAction<string>>;
  newElementLaborFormula: string;
  setNewElementLaborFormula: React.Dispatch<React.SetStateAction<string>>;
  elementMarkup: number;
  setElementMarkup: React.Dispatch<React.SetStateAction<number>>;
  handleMaterialFormulaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLaborFormulaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaterialFormulaKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleLaborFormulaKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showMaterialSuggestions: boolean;
  setShowMaterialSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  materialSuggestions: VariableResponse[];
  selectedMaterialSuggestion: number;
  showLaborSuggestions: boolean;
  setShowLaborSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  laborSuggestions: VariableResponse[];
  selectedLaborSuggestion: number;
  isUpdatingElement: boolean;
  insertVariableInFormula: (formula: string, variableName: string) => string;
  onCancel: () => void;
}

const EditElementDialog: React.FC<EditElementDialogProps> = ({
  open,
  onOpenChange,
  onEditElement,
  newElementName,
  setNewElementName,
  newElementDescription,
  setNewElementDescription,
  newElementMaterialFormula,
  setNewElementMaterialFormula,
  newElementLaborFormula,
  setNewElementLaborFormula,
  elementMarkup,
  setElementMarkup,
  handleMaterialFormulaChange,
  handleLaborFormulaChange,
  handleMaterialFormulaKeyDown,
  handleLaborFormulaKeyDown,
  showMaterialSuggestions,
  setShowMaterialSuggestions,
  materialSuggestions,
  selectedMaterialSuggestion,
  showLaborSuggestions,
  setShowLaborSuggestions,
  laborSuggestions,
  selectedLaborSuggestion,
  isUpdatingElement,
  insertVariableInFormula,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Edit Element
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-element-name">
              Element Name
            </Label>
            <Input
              id="edit-element-name"
              placeholder="Wall Framing"
              value={newElementName}
              onChange={(e) => setNewElementName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-element-description">
              Description (Optional)
            </Label>
            <Textarea
              id="edit-element-description"
              placeholder="Description of this element"
              value={newElementDescription}
              onChange={(e) => setNewElementDescription(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-material-formula">
              Material Cost Formula (Optional)
            </Label>
            <div className="relative">
              <Input
                id="edit-material-formula"
                placeholder="e.g., {Wall Length} * {Wall Width} * 10"
                value={newElementMaterialFormula}
                onChange={handleMaterialFormulaChange}
                onKeyDown={handleMaterialFormulaKeyDown}
              />
              {showMaterialSuggestions &&
                materialSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-background border rounded-md shadow-md max-h-[120px] overflow-y-auto">
                    {materialSuggestions.map(
                      (variable, index) => (
                        <div
                          key={variable.id}
                          className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                            selectedMaterialSuggestion === index
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }`}
                          onClick={() => {
                            setNewElementMaterialFormula((prev: string) =>
                              insertVariableInFormula(
                                prev,
                                variable.name
                              )
                            );
                            setShowMaterialSuggestions(false);
                          }}
                        >
                          {variable.name}
                        </div>
                      )
                    )}
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
              Use curly braces to reference variables, e.g.,{" "}
              {"{Wall Length}"} * {"{Wall Width}"} or type {"{"}{" "}
              to see suggestions
            </div>
          </div>
          
          {/* Markup Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-markup">
              Markup Percentage (%)
            </Label>
            <Input
              id="edit-markup"
              type="number"
              min="0"
              max="100"
              placeholder="15"
              value={elementMarkup || ''}
              onChange={(e) => setElementMarkup(parseFloat(e.target.value) || 0)}
            />
            <div className="text-xs text-muted-foreground mb-2">
              Enter the percentage markup to apply to this element (e.g., 15 for 15%)
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-labor-formula">
              Labor Cost Formula (Optional)
            </Label>
            <div className="relative">
              <Input
                id="edit-labor-formula"
                placeholder="e.g., {Wall Length} * {Wall Width} * 5"
                value={newElementLaborFormula}
                onChange={handleLaborFormulaChange}
                onKeyDown={handleLaborFormulaKeyDown}
              />
              {showLaborSuggestions &&
                laborSuggestions.length > 0 && (
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
                            insertVariableInFormula(
                              prev,
                              variable.name
                            )
                          );
                          setShowLaborSuggestions(false);
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
              Use curly braces to reference variables, e.g.,{" "}
              {"{Wall Length}"} * {"{Wall Width}"} or type {"{"}{" "}
              to see suggestions
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newElementName.trim()) {
                onEditElement();
              }
            }}
            disabled={isUpdatingElement}
            type="submit"
          >
            {isUpdatingElement ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
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

export default EditElementDialog;
