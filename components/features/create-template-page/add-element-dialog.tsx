"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/shared";
import { Element } from "./types";
import { Module } from "./types";

interface AddElementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSave: (module: Module, element: Element) => void;
}

export function AddElementDialog({
  isOpen,
  onClose,
  module,
  onSave,
}: AddElementDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [laborFormula, setLaborFormula] = useState("");
  const [markup, setMarkup] = useState("0");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [formulaError, setFormulaError] = useState("");
  const [laborFormulaError, setLaborFormulaError] = useState("");
  const [markupError, setMarkupError] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setFormula("");
      setLaborFormula("");
      setMarkup("0");
      setNameError("");
      setDescriptionError("");
      setFormulaError("");
      setLaborFormulaError("");
      setMarkupError("");
    }
  }, [isOpen]);

  const handleSave = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("Element name is required");
      hasError = true;
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      hasError = true;
    }

    if (!formula.trim()) {
      setFormulaError("Formula is required");
      hasError = true;
    }

    if (!laborFormula.trim()) {
      setLaborFormulaError("Labor formula is required");
      hasError = true;
    }

    if (!markup.trim() || parseInt(markup) < 0) {
      setMarkupError("Valid markup percentage is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (module) {
      const newElement: Element = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        formula: formula.trim(),
        labor_formula: laborFormula.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image: ""
      };

      onSave(module, newElement);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Element to {module?.name}</DialogTitle>
          <DialogDescription>
            Create a new element with formulas for material and labor calculations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              placeholder="Element name"
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <span className="text-xs text-destructive">{nameError}</span>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) setDescriptionError("");
              }}
              placeholder="Describe the element"
              className={`resize-none ${descriptionError ? "border-destructive" : ""}`}
              rows={2}
            />
            {descriptionError && (
              <span className="text-xs text-destructive">{descriptionError}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="formula" className="text-left">
              Formula
            </Label>
            <Input
              id="formula"
              value={formula}
              onChange={(e) => {
                setFormula(e.target.value);
                if (e.target.value.trim()) setFormulaError("");
              }}
              placeholder="e.g., length * width * height"
              className={formulaError ? "border-destructive" : ""}
            />
            {formulaError && (
              <span className="text-xs text-destructive">{formulaError}</span>
            )}
            <p className="text-xs text-muted-foreground">
              Formula for calculating material costs. Use parameters like length, width, etc.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="laborFormula" className="text-left">
              Labor Formula
            </Label>
            <Input
              id="laborFormula"
              value={laborFormula}
              onChange={(e) => {
                setLaborFormula(e.target.value);
                if (e.target.value.trim()) setLaborFormulaError("");
              }}
              placeholder="e.g., hours * rate"
              className={laborFormulaError ? "border-destructive" : ""}
            />
            {laborFormulaError && (
              <span className="text-xs text-destructive">{laborFormulaError}</span>
            )}
            <p className="text-xs text-muted-foreground">
              Formula for calculating labor costs.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="markup" className="text-left">
              Markup (%)
            </Label>
            <Input
              id="markup"
              type="number"
              min="0"
              max="100"
              value={markup}
              onChange={(e) => {
                setMarkup(e.target.value);
                if (e.target.value.trim() && parseInt(e.target.value) >= 0) setMarkupError("");
              }}
              placeholder="0"
              className={markupError ? "border-destructive" : ""}
            />
            {markupError && (
              <span className="text-xs text-destructive">{markupError}</span>
            )}
            <p className="text-xs text-muted-foreground">
              Percentage markup to apply to this element
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Element</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
