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
import { BracesIcon, Loader2 } from "lucide-react";

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
  variableTypes: { id: string; name: string }[];
  isLoadingVariableTypes: boolean;
  isUpdating: boolean;
  onCancel: () => void;
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
  variableTypes,
  isLoadingVariableTypes,
  isUpdating,
  onCancel,
}) => {
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
          <div className="grid gap-2">
            <Label htmlFor="var-value">Default Value</Label>
            <Input
              id="var-value"
              type="number"
              value={variableValue}
              onChange={(e) => setVariableValue(Number(e.target.value))}
            />
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
                onEditVariable();
              }
            }}
            type="submit"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariableDialog;
