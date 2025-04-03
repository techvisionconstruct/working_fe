import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
  Input,
} from "@/components/shared";
import { FormulaBuilder } from "./formula-builder";
import { ElementDialogProps } from "@/types/create-proposal";

export default function ElementDialog({
  isElementDialogOpen,
  setIsElementDialogOpen,
  newElement,
  setNewElement,
  handleAddElement,
  editingElement,
  variables,
}: ElementDialogProps) {
  return (
    <Dialog open={isElementDialogOpen} onOpenChange={setIsElementDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingElement ? "Edit Element" : "Add New Element"}
          </DialogTitle>
          <DialogDescription>
            {editingElement
              ? "Update the details for this cost element"
              : "Create a new element with material and labor cost formulas"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="element-name">Element Name</Label>
            <Input
              id="element-name"
              value={newElement.name}
              onChange={(e) =>
                setNewElement({ ...newElement, name: e.target.value })
              }
              placeholder="e.g., Wall Painting"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-cost">Material Cost Formula</Label>
            <FormulaBuilder
              variables={variables}
              value={newElement.material_cost}
              onChange={(value) =>
                setNewElement({ ...newElement, material_cost: value })
              }
              placeholder="e.g., Wall Length * Wall Width * Paint Cost"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="labor-cost">Labor Cost Formula</Label>
            <FormulaBuilder
              variables={variables}
              value={newElement.labor_cost}
              onChange={(value) =>
                setNewElement({ ...newElement, labor_cost: value })
              }
              placeholder="e.g., Wall Length * Wall Width * Hourly Rate"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsElementDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddElement}>
            {editingElement ? "Update Element" : "Add Element"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
