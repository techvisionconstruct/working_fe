"use client";

import React, { useState } from "react";
import {
  Button,
  Badge,
  Input,
} from "@/components/shared";
import { toast } from "sonner";
import { X, BracesIcon, Search, Loader2, ChevronRight, Plus, Pencil, Users, Package } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { VariableResponse } from "@/types/variables/dto";
import { TradeResponse } from "@/types/trades/dto";
import { ElementResponse } from "@/types/elements/dto";
import { getTrades } from "@/query-options/trades";
import { getElements } from "@/query-options/elements";
import { getVariables } from "@/query-options/variables";
import { useTradeUpdateMutation } from "@/mutation-options";
import { useElementCreateMutation, useElementUpdateMutation } from "@/mutation-options";
import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";
import { replaceVariableNamesWithIds } from "@/helpers/replace-variable-names-with-ids";
import AddTradeDialog from "./add-trade-dialog";
import EditTradeDialog from "./edit-trade-dialog";
import { ElementDialog } from "./element-dialog";

interface TradesColumnProps {
  trades: TradeResponse[];
  variables: VariableResponse[];
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables: (variables: VariableResponse[]) => void;
}

export const TradesColumn: React.FC<TradesColumnProps> = ({
  trades,
  variables,
  updateTrades,
  updateVariables,
}) => {
  // Create a wrapper function that handles both direct values and setter functions
  const handleUpdateVariables = (newVariables: React.SetStateAction<VariableResponse[]>) => {
    const updatedVariables = typeof newVariables === 'function' 
      ? newVariables(variables)
      : newVariables;
    updateVariables(updatedVariables);
  };
  // Local state for search and UI
  const [tradeSearchQuery, setTradeSearchQuery] = useState("");
  const [isTradeSearchOpen, setIsTradeSearchOpen] = useState(false);
  const [elementSearchQuery, setElementSearchQuery] = useState("");
  const [isElementSearchOpen, setIsElementSearchOpen] = useState(false);
  const [elementSearchQueries, setElementSearchQueries] = useState<Record<string, string>>({});
  const [currentTradeId, setCurrentTradeId] = useState<string | null>(null);
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>({});
  
  // Trade dialog state
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [showEditTradeDialog, setShowEditTradeDialog] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<TradeResponse | null>(null);
  const [newTradeName, setNewTradeName] = useState("");
  
  // Element dialog state
  const [showAddElementDialog, setShowAddElementDialog] = useState(false);
  const [showEditElementDialog, setShowEditElementDialog] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<ElementResponse | null>(null);
  const [newElementName, setNewElementName] = useState("");
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);

  // API Queries
  const { data: tradesData, isLoading: tradesLoading } = useQuery(
    getTrades(1, 10, tradeSearchQuery)
  );

  const { data: elementsData, isLoading: elementsLoading } = useQuery(
    getElements(1, 10, elementSearchQuery)
  );

  // API Query for variables (for auto-importing)
  const { data: variablesData } = useQuery(
    getVariables(1, 1000) // Get a large number to ensure we have all available variables
  );

  // Helper function to extract variable names from formulas
  const extractVariableNamesFromFormula = (formula: string): string[] => {
    if (!formula) return [];
    const variableNameRegex = /\{([^}]+)\}/g;
    const matches = formula.match(variableNameRegex);
    if (!matches) return [];
    return matches.map((match) => match.substring(1, match.length - 1));
  };

  // Mutations
  const { mutate: updateTradeMutation } = useTradeUpdateMutation();

  const { mutate: createElementMutation, isPending: isCreatingElement } =
    useElementCreateMutation({
      onSuccess: (response) => {
        if (response && response.data) {
          const createdElement = response.data;

          // Find the trade to add this element to
          const updatedTrades = trades.map((trade) => {
            if (trade.id === currentTradeId) {
              return {
                ...trade,
                elements: [...(trade.elements || []), createdElement],
              };
            }
            return trade;
          });

          updateTrades(updatedTrades);

          // Connect element to trade
          if (currentTradeId) {
            const currentTrade = trades.find((trade) => trade.id === currentTradeId);
            if (currentTrade) {
              const updatedElements = [
                ...(currentTrade.elements || []),
                createdElement,
              ].map((elem) => elem.id);

              updateTradeMutation({
                tradeId: currentTradeId,
                data: { elements: updatedElements },
              });
            }
          }          // Auto-import variables from element formulas
          if (variablesData?.data) {
            const variablesToAdd: VariableResponse[] = [];

            // Extract variable names from material formula
            if (createdElement.material_cost_formula) {
              const materialFormulaVariableNames = extractVariableNamesFromFormula(
                replaceVariableIdsWithNames(
                  createdElement.material_cost_formula,
                  variables,
                  createdElement.material_formula_variables || []
                )
              );

              materialFormulaVariableNames.forEach((varName) => {
                // Find in available variables but not in current variables
                const availableVariable = (variablesData.data as VariableResponse[]).find(
                  (v: VariableResponse) =>
                    v.name === varName &&
                    !variables.some((existingVar) => existingVar.name === varName)
                );

                if (
                  availableVariable &&
                  !variablesToAdd.some((v) => v.id === availableVariable.id)
                ) {
                  variablesToAdd.push(availableVariable);
                }
              });
            }

            // Extract variable names from labor formula
            if (createdElement.labor_cost_formula) {
              const laborFormulaVariableNames = extractVariableNamesFromFormula(
                replaceVariableIdsWithNames(
                  createdElement.labor_cost_formula,
                  variables,
                  createdElement.labor_formula_variables || []
                )
              );

              laborFormulaVariableNames.forEach((varName) => {
                // Find in available variables but not in current variables
                const availableVariable = (variablesData.data as VariableResponse[]).find(
                  (v: VariableResponse) =>
                    v.name === varName &&
                    !variables.some((existingVar) => existingVar.name === varName)
                );

                if (
                  availableVariable &&
                  !variablesToAdd.some((v) => v.id === availableVariable.id)
                ) {
                  variablesToAdd.push(availableVariable);
                }
              });
            }

            // Add the variables to the variables list
            if (variablesToAdd.length > 0) {
              handleUpdateVariables([...variables, ...variablesToAdd]);

              toast.success(`${variablesToAdd.length} variables automatically added`, {
                position: "top-center",
                description: `Required variables for formulas have been imported.`,
              });
            }
          }

          toast.success("Element created successfully", {
            position: "top-center",
            description: `"${createdElement.name}" has been added to the trade.`,
          });

          setShowAddElementDialog(false);
          setElementSearchQuery("");
        }
      },
    });

  const { mutate: updateElementMutation, isPending: isUpdatingElement } =
    useElementUpdateMutation({
      onSuccess: (response) => {
        if (response && response.data) {
          const updatedElement = response.data;

          const updatedTrades = trades.map((trade) => {
            if (
              trade.elements &&
              trade.elements.some((e) => e.id === updatedElement.id)
            ) {
              return {
                ...trade,
                elements: trade.elements.map((element) =>
                  element.id === updatedElement.id ? updatedElement : element
                ),
              };
            }
            return trade;
          });

          updateTrades(updatedTrades);

          toast.success("Element updated successfully", {
            position: "top-center",
            description: `"${updatedElement.name}" has been updated.`,
          });

          setShowEditElementDialog(false);
          setCurrentElementId(null);
        }
      },
    });

  // Filter trades that are not already selected
  const filteredTrades =
    tradeSearchQuery === ""
      ? []
      : Array.isArray(tradesData?.data)
        ? (tradesData.data as TradeResponse[]).filter(
          (trade) =>
            trade.name.toLowerCase().includes(tradeSearchQuery.toLowerCase()) &&
            !trades.some((t) => t.id === trade.id) &&
            trade.origin === "original"
        )
        : [];

  // Filter elements that are not already in the current trade
  const filteredElements =
    elementSearchQuery === ""
      ? []
      : Array.isArray(elementsData?.data)
        ? (elementsData.data as ElementResponse[]).filter((element) => {
          const matchesQuery =
            element.name
              .toLowerCase()
              .includes(elementSearchQuery.toLowerCase()) &&
            element.origin === "original";

          const currentTrade = trades.find((t) => t.id === currentTradeId);
          const isAlreadyInTrade = currentTrade?.elements?.some(
            (e) => e.id === element.id
          );

          return matchesQuery && !isAlreadyInTrade;
        })
        : [];

  // Event handlers
  const handleSelectTrade = (trade: TradeResponse) => {
    const newTrade: TradeResponse = {
      id: trade.id.toString(),
      name: trade.name,
      description: trade.description,
      image: trade.image,
      origin: trade.origin,
      elements: trade.elements,
      created_at: trade.created_at,
      updated_at: trade.updated_at,
      created_by: trade.created_by,
      updated_by: trade.updated_by,
    };

    if (!trades.some((t) => t.id === newTrade.id)) {
      updateTrades([...trades, newTrade]);
      // Auto-expand newly added trades
      setExpandedTrades(prev => ({
        ...prev,
        [newTrade.id]: true
      }));

      // Auto-import variables from element formulas
      if (newTrade.elements && newTrade.elements.length > 0 && variablesData?.data) {
        // Collect all variable names from element formulas
        const variablesToAdd: VariableResponse[] = [];

        newTrade.elements.forEach((element) => {
          // Extract variable names from material formula
          if (element.material_cost_formula) {
            const materialFormulaVariableNames = extractVariableNamesFromFormula(
              replaceVariableIdsWithNames(
                element.material_cost_formula,
                variables,
                element.material_formula_variables || []
              )
            );

            materialFormulaVariableNames.forEach((varName) => {
              // Find in available variables but not in current variables
              const availableVariable = (variablesData.data as VariableResponse[]).find(
                (v: VariableResponse) =>
                  v.name === varName &&
                  !variables.some((existingVar) => existingVar.name === varName)
              );

              if (
                availableVariable &&
                !variablesToAdd.some((v) => v.id === availableVariable.id)
              ) {
                variablesToAdd.push(availableVariable);
              }
            });
          }

          // Extract variable names from labor formula
          if (element.labor_cost_formula) {
            const laborFormulaVariableNames = extractVariableNamesFromFormula(
              replaceVariableIdsWithNames(
                element.labor_cost_formula,
                variables,
                element.labor_formula_variables || []
              )
            );

            laborFormulaVariableNames.forEach((varName) => {
              // Find in available variables but not in current variables
              const availableVariable = (variablesData.data as VariableResponse[]).find(
                (v: VariableResponse) =>
                  v.name === varName &&
                  !variables.some((existingVar) => existingVar.name === varName)
              );

              if (
                availableVariable &&
                !variablesToAdd.some((v) => v.id === availableVariable.id)
              ) {
                variablesToAdd.push(availableVariable);
              }
            });
          }
        });

        // Add the variables to the variables list
        if (variablesToAdd.length > 0) {
          handleUpdateVariables([...variables, ...variablesToAdd]);

          toast.success(`${variablesToAdd.length} variables automatically added`, {
            position: "top-center",
            description: `Required variables for formulas have been imported.`,
          });
        }
      }
    }

    setIsTradeSearchOpen(false);
    setTradeSearchQuery("");
  };

  const handleRemoveTrade = (tradeId: string) => {
    updateTrades(trades.filter((t) => t.id !== tradeId));
    // Remove from expanded trades
    setExpandedTrades(prev => {
      const updated = { ...prev };
      delete updated[tradeId];
      return updated;
    });
  };

  const toggleTradeExpansion = (tradeId: string) => {
    setExpandedTrades(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
  };

  const handleSelectElement = (element: ElementResponse, tradeId: string) => {
    const updatedTrades = trades.map((trade) => {
      if (trade.id === tradeId) {
        if (!trade.elements?.some((e) => e.id === element.id.toString())) {
          return {
            ...trade,
            elements: [...(trade.elements || []), element],
          };
        }
      }
      return trade;
    });

    updateTrades(updatedTrades);

    const updatedTrade = updatedTrades.find((trade) => trade.id === tradeId);
    if (updatedTrade && updatedTrade.elements) {
      const elementIds = updatedTrade.elements.map((elem) => elem.id);

      updateTradeMutation({
        tradeId: tradeId,
        data: { elements: elementIds },
      });
    }

    setIsElementSearchOpen(false);
    setElementSearchQuery("");
    setElementSearchQueries((prev) => ({
      ...prev,
      [tradeId]: "",
    }));
  };

  const handleRemoveElement = (elementId: string, tradeId: string) => {
    const updatedTrades = trades.map((trade) => {
      if (trade.id === tradeId) {
        return {
          ...trade,
          elements: (trade.elements || []).filter((e) => e.id !== elementId),
        };
      }
      return trade;
    });

    updateTrades(updatedTrades);

    const updatedTrade = updatedTrades.find((trade) => trade.id === tradeId);
    if (updatedTrade) {
      const elementIds = updatedTrade.elements?.map((elem) => elem.id) || [];

      updateTradeMutation({
        tradeId: tradeId,
        data: { elements: elementIds },
      });
    }
  };

  const handleOpenAddElementDialog = (tradeId: string) => {
    setCurrentTradeId(tradeId);
    setElementToEdit(null);
    setNewElementName(elementSearchQueries[tradeId] || "");
    setShowAddElementDialog(true);
  };

  const handleOpenEditDialog = (element: ElementResponse) => {
    setElementToEdit(element);
    setCurrentElementId(element.id);
    setShowEditElementDialog(true);
  };

  const handleAddElement = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    image?: string;
    markup?: number;
  }) => {
    if (!data.name.trim() || !currentTradeId) return;

    const materialFormula = data.materialFormula.trim()
      ? replaceVariableNamesWithIds(data.materialFormula.trim(), variables)
      : undefined;

    const laborFormula = data.laborFormula.trim()
      ? replaceVariableNamesWithIds(data.laborFormula.trim(), variables)
      : undefined;

    console.log("Element data with image:", { ...data, imagePresent: !!data.image });

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: materialFormula,
      labor_cost_formula: laborFormula,
      image: data.image,
      markup: data.markup,
    };

    createElementMutation(elementData);

    setElementSearchQueries((prev) => ({
      ...prev,
      [currentTradeId]: "",
    }));
    setElementSearchQuery("");
  };

  const handleUpdateElement = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    image?: string;
    markup?: number;
  }) => {
    if (!data.name.trim() || !currentElementId) return;

    const materialFormula = data.materialFormula.trim()
      ? replaceVariableNamesWithIds(data.materialFormula.trim(), variables)
      : undefined;

    const laborFormula = data.laborFormula.trim()
      ? replaceVariableNamesWithIds(data.laborFormula.trim(), variables)
      : undefined;

    console.log("Updating element with image data:", { 
      ...data, 
      imagePresent: !!data.image,
      imageSize: data.image ? `~${Math.round(data.image.length / 1024)} KB` : 'none',
    });

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: materialFormula,
      labor_cost_formula: laborFormula,
      image: data.image,
      markup: data.markup || 0,
    };

    updateElementMutation({
      elementId: currentElementId,
      data: elementData,
    });
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <div>
        <div className="pb-3">
          <div className="text-lg flex items-center justify-between">
            <span className="text-lg font-bold flex items-center">
              <BracesIcon size={18} className="mr-1" />
              <span>Trades</span>
            </span>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div className="relative">
              <div className="relative w-full mb-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={tradeSearchQuery}
                  onChange={(e) => {
                    setTradeSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      setIsTradeSearchOpen(true);
                    } else {
                      setIsTradeSearchOpen(false);
                    }
                  }}
                  onFocus={() => {
                    if (tradeSearchQuery.trim()) {
                      setIsTradeSearchOpen(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsTradeSearchOpen(false), 200);
                  }}
                  onClick={() => {
                    if (tradeSearchQuery.trim()) {
                      setIsTradeSearchOpen(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && filteredTrades.length > 0) {
                      e.preventDefault();
                      handleSelectTrade(filteredTrades[0]);
                    } else if (e.key === "Enter") {
                      if (
                        filteredTrades.length === 0 ||
                        !tradeSearchQuery.trim()
                      ) {
                        setIsTradeSearchOpen(false);
                        setShowAddTradeDialog(true);
                        setNewTradeName(tradeSearchQuery.trim());
                      } else if (filteredTrades.length === 1) {
                        handleSelectTrade(filteredTrades[0]);
                      }
                    }
                  }}
                  className="w-full pl-8 pr-4 rounded-full"
                />
                {tradesLoading && (
                  <div className="absolute right-2 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {tradeSearchQuery.trim() && isTradeSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute z-10 w-full border rounded-md bg-background shadow-md"
                >
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-1 px-2">
                      Trades
                    </p>
                    {filteredTrades.length > 0 && (
                      filteredTrades.map((trade, index) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.15 }}
                          className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => handleSelectTrade(trade)}
                        >
                          <div className="flex items-center">
                            <BracesIcon className="mr-2 h-4 w-4" />
                            <span>{trade.name}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                    
                    {/* Always show "Add [trade name]" as a clickable suggestion */}
                    {!trades.some((t) =>
                      t.name.toLowerCase() === tradeSearchQuery.toLowerCase()
                    ) && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: filteredTrades.length * 0.05, 
                          duration: 0.15 
                        }}
                        className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md border-t border-border/50 mt-1 pt-2"
                        onClick={() => {
                          setShowAddTradeDialog(true);
                          setNewTradeName(tradeSearchQuery.trim());
                          setIsTradeSearchOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Add "{tradeSearchQuery}"</span>
                        </div>
                      </motion.div>
                    )}
                    
                    {trades.some((t) =>
                      t.name.toLowerCase() === tradeSearchQuery.toLowerCase()
                    ) && (
                      <div className="p-2 text-sm border-t border-border/50 mt-1">
                        <span className="text-muted-foreground">
                          Trade already added
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-1">
              {trades.length > 0 ? (
                <div className="space-y-1">
                  {trades.map((trade) => {
                    const isExpanded = expandedTrades[trade.id];
                    const elementCount = trade.elements?.length || 0;
                    
                    return (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="border-l-4 border-l-primary/20 border border-border/20 bg-background hover:bg-muted/30 transition-all duration-200 overflow-hidden rounded-md"
                      >
                        {/* Trade Header - Clickable */}
                        <div 
                          className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 relative group border-b border-border/30"
                          onClick={() => toggleTradeExpansion(trade.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="flex-shrink-0"
                                >
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{trade.name}</h4>
                                    <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-primary/20 text-primary/80">
                                      {elementCount} element{elementCount !== 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                  {trade.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {trade.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {/* Edit Trade Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-background/80 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTradeToEdit(trade);
                                setShowEditTradeDialog(true);
                              }}
                              title="Edit trade"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            
                            {/* Remove Trade Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-background/80 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTrade(trade.id);
                              }}
                              title="Remove trade"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Collapsible Elements Section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ 
                                duration: 0.2, 
                                ease: "easeInOut",
                                opacity: { duration: 0.2 }
                              }}
                              className="border-t border-border bg-muted/20 overflow-hidden"
                            >
                              <div className="p-4 space-y-3">
                                {/* Trade Image (when expanded) */}
                                {isExpanded && trade.image && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05, duration: 0.2 }}
                                    className="mb-4"
                                  >
                                    <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 rounded-md overflow-hidden border shadow-sm group hover:shadow-md">
                                      <div className="w-full h-full overflow-hidden">
                                        <Image 
                                          src={trade.image || "/placeholder-image.jpg"} 
                                          alt={trade.name}
                                          fill
                                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 40vw"
                                          className="object-cover transition-all duration-300 group-hover:scale-105" 
                                          placeholder="blur"
                                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                          priority={true}
                                        />
                                      </div>
                                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="text-sm font-medium text-white">{trade.name}</div>
                                        {trade.description && (
                                          <div className="text-xs text-white/80 mt-1 line-clamp-2">{trade.description}</div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                                
                                {/* Element Search */}
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1, duration: 0.2 }}
                                  className="relative"
                                >
                                  <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" />
                                    <Input
                                      placeholder="Search or add elements..."
                                      value={elementSearchQueries[trade.id] || ""}
                                      onChange={(e) => {
                                        setCurrentTradeId(trade.id);
                                        setElementSearchQueries((prev) => ({
                                          ...prev,
                                          [trade.id]: e.target.value,
                                        }));
                                        setElementSearchQuery(e.target.value);
                                        if (e.target.value.trim()) {
                                          setIsElementSearchOpen(true);
                                        } else {
                                          setIsElementSearchOpen(false);
                                        }
                                      }}
                                      onFocus={() => {
                                        setCurrentTradeId(trade.id);
                                        const tradeQuery = elementSearchQueries[trade.id] || "";
                                        setElementSearchQuery(tradeQuery);
                                        if (tradeQuery.trim()) {
                                          setIsElementSearchOpen(true);
                                        }
                                      }}
                                      onBlur={() => {
                                        setTimeout(() => setIsElementSearchOpen(false), 200);
                                      }}
                                      onClick={() => {
                                        const tradeQuery = elementSearchQueries[trade.id] || "";
                                        setElementSearchQuery(tradeQuery);
                                        if (tradeQuery.trim()) {
                                          setIsElementSearchOpen(true);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Tab" &&
                                          filteredElements.length > 0
                                        ) {
                                          e.preventDefault();
                                          handleSelectElement(filteredElements[0], trade.id);
                                        } else if (e.key === "Enter") {
                                          const tradeQuery = elementSearchQueries[trade.id] || "";
                                          if (
                                            filteredElements.length === 0 ||
                                            !tradeQuery.trim()
                                          ) {
                                            setIsElementSearchOpen(false);
                                            handleOpenAddElementDialog(trade.id);
                                          } else if (filteredElements.length === 1) {
                                            handleSelectElement(filteredElements[0], trade.id);
                                          }
                                        }
                                      }}
                                      className="w-full pl-7 pr-4 h-8 text-xs rounded-full"
                                    />
                                    {elementsLoading && (
                                      <div className="absolute right-2 top-2">
                                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Element Search Dropdown */}
                                  <AnimatePresence>
                                    {(
                                      elementSearchQueries[trade.id] || ""
                                    ).trim() &&
                                      isElementSearchOpen &&
                                      currentTradeId === trade.id && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                          transition={{ duration: 0.15, ease: "easeOut" }}
                                          className="absolute z-10 w-full border rounded-md bg-background shadow-md mt-1"
                                        >
                                          <div className="p-2">
                                            <p className="text-xs text-muted-foreground mb-1 px-2">
                                              Elements
                                            </p>
                                            {filteredElements.length > 0 && (
                                              filteredElements.map((element, index) => (
                                                <motion.div
                                                  key={element.id}
                                                  initial={{ opacity: 0, x: -10 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ delay: index * 0.05, duration: 0.15 }}
                                                  className="flex items-center justify-between w-full p-2 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                                                  onClick={() => handleSelectElement(element, trade.id)}
                                                >
                                                  <div className="flex items-center">
                                                    <BracesIcon className="mr-2 h-3 w-3" />
                                                    <span>{element.name}</span>
                                                  </div>
                                                </motion.div>
                                              ))
                                            )}
                                            
                                            {/* Always show "Add [element name]" as a clickable suggestion */}
                                            {!trade.elements?.some((e) =>
                                              e.name.toLowerCase() === (elementSearchQueries[trade.id] || "").toLowerCase()
                                            ) && (
                                              <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ 
                                                  delay: filteredElements.length * 0.05, 
                                                  duration: 0.15 
                                                }}
                                                className="flex items-center justify-between w-full p-2 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md border-t border-border/50 mt-1 pt-2"
                                                onClick={() => {
                                                  setIsElementSearchOpen(false);
                                                  handleOpenAddElementDialog(trade.id);
                                                }}
                                              >
                                                <div className="flex items-center">
                                                  <Plus className="mr-2 h-3 w-3" />
                                                  <span>Add "{elementSearchQueries[trade.id]}"</span>
                                                </div>
                                              </motion.div>
                                            )}
                                            
                                            {trade.elements?.some((e) =>
                                              e.name.toLowerCase() === (elementSearchQueries[trade.id] || "").toLowerCase()
                                            ) && (
                                              <div className="p-2 text-xs border-t border-border/50 mt-1">
                                                <span className="text-muted-foreground">
                                                  Element already added to this trade
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </motion.div>

                                {/* Elements Grid */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.15, duration: 0.3 }}
                                >
                                  {trade.elements && trade.elements.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      <AnimatePresence>
                                        {trade.elements.map((element, index) => (
                                          <motion.div
                                            key={element.id}
                                            initial={{ opacity: 0, y: 15, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -15, scale: 0.97 }}
                                            transition={{ 
                                              delay: index * 0.03, 
                                              duration: 0.25,
                                              ease: "easeOut"
                                            }}
                                            className="p-0 rounded-md border border-border bg-background hover:shadow-md transition-all duration-200 group relative overflow-hidden cursor-pointer"
                                            onClick={() => handleOpenEditDialog(element)}
                                          >
                                            {/* Card Layout with Top Image */}
                                            <div className="flex flex-col">
                                              {/* Image Section - Full Width */}
                                              {element.image ? (
                                                <div className="w-full h-32 relative">
                                                  <Image 
                                                    src={element.image || "/placeholder-image.jpg"} 
                                                    alt={element.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                                    className="object-cover transition-all duration-300 group-hover:scale-105" 
                                                    placeholder="blur"
                                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                                  />
                                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                                                  <div className="absolute bottom-0 left-0 right-0 p-2">
                                                    <div className="font-medium text-sm text-white">{element.name}</div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="p-3 border-b border-border/50">
                                                  <div className="font-medium text-sm">{element.name}</div>
                                                </div>
                                              )}
                                              
                                              {/* Content Section */}
                                              <div className="p-3">
                                                {/* Description - Show only if there's no image or specifically even with image */}
                                                {element.description && (!element.image || true) && (
                                                  <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                    {element.description}
                                                  </div>
                                                )}
                                              
                                                {/* Formulas with Better Visual Organization */}
                                                {(element.material_cost_formula || element.labor_cost_formula) && (
                                                  <div className="space-y-2 mt-1">
                                                    {/* Formula Header */}
                                                    <div className="flex items-center">
                                                      <div className="h-0.5 bg-primary/10 flex-grow mr-2"></div>
                                                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Formulas</span>
                                                      <div className="h-0.5 bg-primary/10 flex-grow ml-2"></div>
                                                    </div>
                                                    
                                                    {/* Material Formula */}
                                                    {element.material_cost_formula && (
                                                      <div className="bg-muted/30 p-2 rounded-md border border-border/50 hover:border-primary/20 transition-colors">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                          <span className="text-xs font-medium text-primary/70 flex items-center">
                                                            <Package className="h-3 w-3 mr-0.5" />
                                                            Material
                                                          </span>
                                                        </div>
                                                        <code className="text-xs bg-muted/50 px-2 py-1 rounded text-wrap break-all block">
                                                          {replaceVariableIdsWithNames(
                                                            element.material_cost_formula,
                                                            variables,
                                                            element.material_formula_variables || []
                                                          )}
                                                        </code>
                                                      </div>
                                                    )}
                                                    
                                                    {/* Labor Formula */}
                                                    {element.labor_cost_formula && (
                                                      <div className="bg-muted/30 p-2 rounded-md border border-border/50 hover:border-primary/20 transition-colors">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                          <span className="text-xs font-medium text-primary/70 flex items-center">
                                                            <Users className="h-3 w-3 mr-0.5" />
                                                            Labor
                                                          </span>
                                                        </div>
                                                        <code className="text-xs bg-muted/50 px-2 py-1 rounded text-wrap break-all block">
                                                          {replaceVariableIdsWithNames(
                                                            element.labor_cost_formula,
                                                            variables,
                                                            element.labor_formula_variables || []
                                                          )}
                                                        </code>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            
                                            {/* Element Action Buttons */}
                                            <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-primary/20 hover:text-primary shadow-sm transition-all duration-200 border border-border/30"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOpenEditDialog(element);
                                                }}
                                              >
                                                <Pencil className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-destructive/20 hover:text-destructive shadow-sm transition-all duration-200 border border-border/30"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveElement(element.id, trade.id);
                                                }}
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </AnimatePresence>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                      <p className="text-xs">No elements in this trade</p>
                                      <p className="text-xs">Use the search above to add elements</p>
                                    </div>
                                  )}
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                  <p className="text-sm">No trades defined</p>
                  <p className="text-xs">
                    Trades help organize elements by category
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddTradeDialog
        isOpen={showAddTradeDialog}
        onOpenChange={setShowAddTradeDialog}
        onTradeCreated={(newTrade) => {
          const updatedTrades = [...trades, newTrade];
          updateTrades(updatedTrades);
          toast.success("Trade created successfully", {
            position: "top-center",
            description: `"${newTrade.name}" has been added.`,
          });
        }}
        initialName={newTradeName}
      />

      <EditTradeDialog
        isOpen={showEditTradeDialog}
        onOpenChange={setShowEditTradeDialog}
        trade={tradeToEdit}
        onTradeUpdated={(updatedTrade) => {
          const updatedTrades = trades.map((t) =>
            t.id === updatedTrade.id ? updatedTrade : t
          );
          updateTrades(updatedTrades);
          toast.success("Trade updated successfully", {
            position: "top-center",
            description: `"${updatedTrade.name}" has been updated.`,
          });
        }}
      />

      <ElementDialog
        isOpen={showAddElementDialog}
        onOpenChange={setShowAddElementDialog}
        onSubmit={handleAddElement}
        initialName={newElementName}
        variables={variables}
        updateVariables={handleUpdateVariables}
        isSubmitting={isCreatingElement}
        dialogTitle="Add New Element"
        submitButtonText="Add Element"
        onRequestCreateVariable={(variableName, callback) => {
          // This is a simplified version, so we'll just create a simple variable
          // In a real implementation, you might want to open a variable creation dialog
          console.log(`Request to create variable: ${variableName}`);
          // For now, we'll just ignore this and let the user handle variable creation
        }}
      />

      <ElementDialog
        isOpen={showEditElementDialog}
        onOpenChange={setShowEditElementDialog}
        onSubmit={handleUpdateElement}
        elementToEdit={elementToEdit}
        variables={variables}
        updateVariables={handleUpdateVariables}
        isSubmitting={isUpdatingElement}
        dialogTitle="Edit Element"
        submitButtonText="Update Element"
        onRequestCreateVariable={(variableName, callback) => {
          // This is a simplified version, so we'll just create a simple variable
          // In a real implementation, you might want to open a variable creation dialog
          console.log(`Request to create variable: ${variableName}`);
          // For now, we'll just ignore this and let the user handle variable creation
        }}
      />
    </div>
  );
};
