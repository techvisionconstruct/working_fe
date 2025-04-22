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
import { Module } from "./types";

interface EditModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSave: (updatedModule: Module) => void;
}

export function EditModuleDialog({
  isOpen,
  onClose,
  module,
  onSave,
}: EditModuleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  React.useEffect(() => {
    if (module) {
      setName(module.name);
      setDescription(module.description);
      setNameError("");
    }
  }, [module, isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setNameError("Module name is required");
      return;
    }

    if (module) {
      onSave({
        ...module,
        name: name.trim(),
        description: description.trim(),
        updated_at: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            Make changes to the module name and description.
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
              placeholder="Module name"
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
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the module"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
