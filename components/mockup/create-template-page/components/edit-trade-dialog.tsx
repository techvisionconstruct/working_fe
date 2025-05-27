"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { 
  BracesIcon, 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { TradeResponse } from "@/types/trades/dto";
import { updateTrade } from "@/api-calls/trades/update-trade";

interface EditTradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trade: TradeResponse | null;
  onTradeUpdated?: (trade: TradeResponse) => void;
}

const EditTradeDialog: React.FC<EditTradeDialogProps> = ({
  isOpen,
  onOpenChange,
  trade,
  onTradeUpdated,
}) => {
  // Internal state
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");
  const [tradeImage, setTradeImage] = useState<string | undefined>(undefined);
  
  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation state
  const [tradeErrors, setTradeErrors] = useState({
    name: "",
  });
  const [tradeTouched, setTradeTouched] = useState({
    name: false,
  });

  // Reset form when dialog opens/closes or trade changes
  useEffect(() => {
    if (isOpen && trade) {
      setNewTradeName(trade.name || "");
      setNewTradeDescription(trade.description || "");
      setTradeImage(trade.image || undefined);
      setTradeErrors({ name: "" });
      setTradeTouched({ name: false });
    }
  }, [isOpen, trade]);

  // Trade update mutation
  const { mutate: updateTradeMutation, isPending: isSubmitting } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTrade(id, data),
    onSuccess: (response) => {
      if (response && response.data) {
        const updatedTrade = response.data;
        toast.success(`Trade "${updatedTrade.name}" updated successfully!`);
        onTradeUpdated?.(updatedTrade);
        onOpenChange(false);
      }
    },
    onError: (error: any) => {
      console.error("Error updating trade:", error);
      toast.error(error?.response?.data?.message || "Failed to update trade");
    },
  });

  // Validation functions
  const validateTrade = () => {
    const errors = { name: "" };
    
    if (!newTradeName.trim()) {
      errors.name = "Trade name is required";
    } else if (newTradeName.length < 2) {
      errors.name = "Trade name must be at least 2 characters";
    }
    
    setTradeErrors(errors);
    return !errors.name;
  };

  const handleTradeBlur = (field: "name") => {
    setTradeTouched((prev) => ({ ...prev, [field]: true }));
    validateTrade();
  };

  // Image upload functions
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setTradeImage(base64String);
      setIsUploading(false);
      toast.success("Image uploaded successfully!");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setTradeImage(undefined);
  };

  const handleEditTrade = () => {
    if (!validateTrade() || !trade) return;

    const updateData = {
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || undefined,
      ...(tradeImage && { image: tradeImage }),
    };

    updateTradeMutation({
      id: trade.id,
      data: updateData,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto min-w-[600px] max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BracesIcon className="mr-2 h-4 w-4" />
            Edit Trade
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-trade-name">
                Trade Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="edit-trade-name"
                  placeholder="Framing"
                  value={newTradeName}
                  onChange={(e) => setNewTradeName(e.target.value)}
                  onBlur={() => handleTradeBlur("name")}
                  className={
                    tradeErrors.name && tradeTouched.name
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
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
              {tradeErrors.name && tradeTouched.name && (
                <p className="text-xs text-red-500">{tradeErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-trade-description">
                Description <span className="text-gray-500">&#40;Optional&#41;</span>
              </Label>
              <Textarea
                id="edit-trade-description"
                placeholder="Description of what this trade covers"
                value={newTradeDescription}
                onChange={(e) => setNewTradeDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-trade-image">
                Trade Image{" "}
                <span className="text-gray-500">&#40;Optional&#41;</span>
              </Label>

              <div className="h-[200px] w-full relative">
                {!tradeImage ? (
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleFileSelect}
                    className={`absolute inset-0 border-2 border-dashed rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer
                      ${
                        isDragging
                          ? "border-primary/70 bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="edit-trade-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <span className="text-sm font-medium">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-4">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground/70" />
                        <p className="text-sm font-medium mb-1">
                          {isDragging
                            ? "Drop to upload"
                            : "Drop image here or click to browse"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or GIF (max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <img
                        src={tradeImage}
                        alt="Trade preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-3">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center space-x-1.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-xs font-medium text-white">
                              Image uploaded
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="h-6 px-2 bg-black/30 hover:bg-black/50 text-white border-0 rounded-md text-xs font-medium"
                              onClick={handleFileSelect}
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              className="h-6 px-2 bg-black/30 hover:bg-red-600/70 text-white border-0 rounded-md text-xs font-medium flex items-center"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="edit-trade-image-update"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancel
          </Button>
          <Button onClick={handleEditTrade} disabled={isSubmitting} className="rounded-full">
            {isSubmitting ? (
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

export default EditTradeDialog;
