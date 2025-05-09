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
import { BracesIcon, Loader2, X } from "lucide-react";

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrade: () => void;
  newTradeName: string;
  setNewTradeName: React.Dispatch<React.SetStateAction<string>>;
  newTradeDescription: string;
  setNewTradeDescription: React.Dispatch<React.SetStateAction<string>>;
  isCreatingTrade: boolean;
}

const AddTradeDialog: React.FC<AddTradeDialogProps> = ({
  open,
  onOpenChange,
  onAddTrade,
  newTradeName,
  setNewTradeName,
  newTradeDescription,
  setNewTradeDescription,
  isCreatingTrade,
}) => {
  const [touched, setTouched] = React.useState({ name: false });
  const [errors, setErrors] = React.useState<{ name?: string }>({});

  const validate = () => {
    const errs: { name?: string } = {};
    if (!newTradeName.trim()) {
      errs.name = "Trade name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    setTouched({ name: true });
    if (validate()) {
      onAddTrade();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Add New Trade
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trade-name">
              Trade Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="trade-name"
                placeholder="Framing"
                value={newTradeName}
                onChange={(e) => {
                  setNewTradeName(e.target.value);
                  setTouched((prev) => ({ ...prev, name: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                className={errors.name && touched.name ? "border-red-500" : ""}
              />
              {newTradeName && (
                <button
                  type="button"
                  onClick={() => setNewTradeName("")}
                  className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                  tabIndex={-1}
                  aria-label="Clear trade name"
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
            <Label htmlFor="trade-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="trade-description"
              placeholder="Description of what this trade covers"
              value={newTradeDescription}
              onChange={(e) => setNewTradeDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isCreatingTrade} type="submit">
            {isCreatingTrade ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Trade"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddTradeDialog;
