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
            <Label htmlFor="trade-name">Trade Name</Label>
            <Input
              id="trade-name"
              placeholder="Framing"
              value={newTradeName}
              onChange={(e) => setNewTradeName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trade-description">
              Description (Optional)
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newTradeName.trim()) {
                onAddTrade();
              }
            }}
            disabled={isCreatingTrade}
            type="submit"
          >
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
