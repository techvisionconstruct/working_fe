"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrade } from "@/api-calls/trades/create-trade";
import { updateTrade } from "@/api-calls/trades/update-trade";
import { TradeResponse } from "@/types/trades/dto";

interface UseTradeDialogProps {
  trades: TradeResponse[];
  updateTrades: (trades: TradeResponse[]) => void;
}

export const useTradeDialog = ({ trades, updateTrades }: UseTradeDialogProps) => {
  // Trade dialog state
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [showEditTradeDialog, setShowEditTradeDialog] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<TradeResponse | null>(null);
  
  // Form state
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");

  // Validation state
  const [tradeErrors, setTradeErrors] = useState({
    name: "",
  });
  const [tradeTouched, setTradeTouched] = useState({
    name: false,
  });

  // Trade mutations
  const { mutate: createTradeMutation, isPending: isCreatingTrade } = useMutation({
    mutationFn: createTrade,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdTrade = response.data;
        updateTrades([...trades, createdTrade]);
        toast.success("Trade created successfully", {
          position: "top-center",
          description: `"${createdTrade.name}" has been added to your template.`,
        });
        setShowAddTradeDialog(false);
        setNewTradeName("");
        setNewTradeDescription("");
      }
    },
    onError: (error) => {
      toast.error("Failed to create trade", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });

  const { mutate: updateTradeMutation } = useMutation({
    mutationFn: ({
      tradeId,
      data,
    }: {
      tradeId: string;
      data: { elements?: string[]; name?: string; description?: string };
    }) => updateTrade(tradeId, data),
    onSuccess: () => {
      // No need to update UI state again since we already did it
    },
    onError: (error) => {
      toast.error("Failed to update trade", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });

  const validateTradeForm = () => {
    const errors = { name: "" };
    let isValid = true;

    if (!newTradeName.trim()) {
      errors.name = "Trade name is required";
      isValid = false;
    }

    setTradeErrors(errors);
    return isValid;
  };

  const handleTradeBlur = (field: "name") => {
    setTradeTouched((prev) => ({ ...prev, [field]: true }));
    validateTradeForm();
  };

  const handleAddTrade = () => {
    if (!validateTradeForm()) return;

    const tradeData = {
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || undefined,
    };
    createTradeMutation(tradeData);
  };

  const handleOpenEditTradeDialog = (trade: TradeResponse) => {
    setTradeToEdit(trade);
    setNewTradeName(trade.name);
    setNewTradeDescription(trade.description || "");
    setShowEditTradeDialog(true);
  };

  const handleEditTrade = () => {
    if (!validateTradeForm() || !tradeToEdit) return;

    const updatedTrade: TradeResponse = {
      ...tradeToEdit,
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || "",
    };

    const updatedTrades = trades.map((trade) =>
      trade.id === tradeToEdit.id ? updatedTrade : trade
    );
    updateTrades(updatedTrades);

    const updateData: { name: string; description?: string } = {
      name: newTradeName.trim(),
    };
    
    if (newTradeDescription.trim()) {
      updateData.description = newTradeDescription.trim();
    }

    updateTradeMutation({
      tradeId: tradeToEdit.id,
      data: updateData,
    });

    setShowEditTradeDialog(false);
    setTradeToEdit(null);
    setNewTradeName("");
    setNewTradeDescription("");
  };

  return {
    // State
    showAddTradeDialog,
    setShowAddTradeDialog,
    showEditTradeDialog,
    setShowEditTradeDialog,
    tradeToEdit,
    newTradeName,
    setNewTradeName,
    newTradeDescription,
    setNewTradeDescription,
    isCreatingTrade,
    tradeErrors,
    tradeTouched,
    
    // Handlers
    handleTradeBlur,
    handleAddTrade,
    handleOpenEditTradeDialog,
    handleEditTrade,
    updateTradeMutation,
  };
};
