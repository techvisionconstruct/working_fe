"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Label,
  Badge,
  Input,
  Textarea,
  ScrollArea,
  Switch,
} from "@/components/shared";
import { toast } from "sonner";
import { X, BracesIcon, Search, Loader2, Calculator, PercentIcon } from "lucide-react";
import AddElementDialog from "../add-element-dialog";
import EditElementDialog from "../edit-element-dialog";
import AddTradeDialog from "../add-trade-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTrades } from "@/api/trades/get-all-trades";
import { getAllElements } from "@/api/elements/get-all-elements";
import { createTrade } from "@/api/trades/create-trade";
import { updateTrade } from "@/api/trades/update-trade";
import { createElement } from "@/api/elements/create-element";
import { updateElement } from "@/api/elements/update-element";
import { updateProposalTemplate } from "@/api/proposals/update-proposal-template";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { TradeResponse } from "@/types/trades/dto";
import { TemplateResponse } from "@/types/templates/dto";
import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";
import { replaceVariableNamesWithIds } from "@/helpers/replace-variable-names-with-ids";
import { getTrades } from "@/query-options/trades";
import { getElements } from "@/query-options/elements";
import { getVariables } from "@/query-options/variables";

interface TradesColumnProps {
  trades: TradeResponse[];
  variables: VariableResponse[];
  templateId: string | null;
  template: TemplateResponse | null;
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables: (variables: VariableResponse[]) => void;
}

const extractVariableNamesFromFormula = (formula: string): string[] => {
  if (!formula) return [];
  const variableNameRegex = /\{([^}]+)\}/g;
  const matches = formula.match(variableNameRegex);
  if (!matches) return [];
  return matches.map(match => match.substring(1, match.length - 1));
};

export const TradesColumn: React.FC<TradesColumnProps> = ({
  trades,
  variables,
  templateId,
  template,
  updateTrades,
  updateVariables,
}) => {
  const queryClient = useQueryClient();

  // State management
  const [tradeSearchQuery, setTradeSearchQuery] = useState("");
  const [isTradeSearchOpen, setIsTradeSearchOpen] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");

  const [elementSearchQuery, setElementSearchQuery] = useState("");
  const [isElementSearchOpen, setIsElementSearchOpen] = useState(false);
  const [elementSearchQueries, setElementSearchQueries] = useState<Record<string, string>>({});
  const [showAddElementDialog, setShowAddElementDialog] = useState(false);
  const [showEditElementDialog, setShowEditElementDialog] = useState(false);
  const [currentTradeId, setCurrentTradeId] = useState<string | null>(null);
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);
  const [newElementName, setNewElementName] = useState("");
  const [newElementDescription, setNewElementDescription] = useState("");
  const [newElementMaterialFormula, setNewElementMaterialFormula] = useState("");
  const [newElementLaborFormula, setNewElementLaborFormula] = useState("");
  const [elementMarkup, setElementMarkup] = useState<number>(0);

  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);

  // Global markup state
  const [isGlobalMarkupEnabled, setIsGlobalMarkupEnabled] = useState(false);
  const [globalMarkupValue, setGlobalMarkupValue] = useState<number>(0);
  const [editingMarkupElementId, setEditingMarkupElementId] = useState<string | null>(null);
  const [inlineMarkupValue, setInlineMarkupValue] = useState<number>(0);

  // Queries
  const { data: tradesData, isLoading: tradesLoading } = useQuery(
    getTrades()
  );

  const { data: elementsData, isLoading: elementsLoading } = useQuery(
    getElements()
  );

  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables()
  );

  // Mutations
  const { mutate: updateTemplateMutation } = useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: { variables?: string[]; trades?: string[] };
    }) => updateProposalTemplate(templateId, data),
    onSuccess: () => {
      toast.success("Template updated successfully", {
        position: "top-center",
        description: "Template has been updated with the latest variables and trades.",
      });
    },
    onError: (error) => {
      toast.error("Failed to update template", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  const { mutate: updateElementMutation, isPending: isUpdatingElement } = useMutation({
    mutationFn: ({ elementId, data }: { elementId: string; data: any }) =>
      updateElement(elementId, data),
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

        setShowEditElementDialog(false);
        setCurrentElementId(null);
        setNewElementName("");
        setNewElementDescription("");
        setNewElementMaterialFormula("");
        setNewElementLaborFormula("");
      }
    },
    onError: (error) => {
      toast.error("Failed to update element", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  const { mutate: createElementMutation, isPending: isCreatingElement } = useMutation({
    mutationFn: createElement,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdElement = response.data;

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
        }

        toast.success("Element created successfully", {
          position: "top-center",
          description: `"${createdElement.name}" has been added to the trade.`,
        });

        setShowAddElementDialog(false);
        setNewElementName("");
        setNewElementDescription("");
        setNewElementMaterialFormula("");
        setNewElementLaborFormula("");
      }
    },
    onError: (error) => {
      toast.error("Failed to create element", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  const { mutate: createTradeMutation, isPending: isCreatingTrade } = useMutation({
    mutationFn: createTrade,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdTrade = response.data;
        updateTrades([...trades, createdTrade]);

        toast.success("Trade created successfully", {
          position: "top-center",
          description: `"${createdTrade.name}" has been added.`,
        });

        setShowAddTradeDialog(false);
        setNewTradeName("");
        setNewTradeDescription("");
      }
    },
    onError: (error) => {
      toast.error("Failed to create trade", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  const { mutate: updateTradeMutation } = useMutation({
    mutationFn: ({ tradeId, data }: { tradeId: string; data: any }) =>
      updateTrade(tradeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
    onError: (error) => {
      toast.error("Failed to update trade", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  // Computed values
  const filteredTrades = tradeSearchQuery === ""
    ? []
    : Array.isArray(tradesData?.data)
      ? (tradesData.data as TradeResponse[]).filter(
          (trade) =>
            trade.name.toLowerCase().includes(tradeSearchQuery.toLowerCase()) &&
            !trades.some((t) => t.id === trade.id) &&
            trade.origin === "original"
        )
      : [];

  const filteredElements = elementSearchQuery === ""
    ? []
    : Array.isArray(elementsData?.data)
      ? (elementsData.data as ElementResponse[]).filter((element) => {
          const matchesQuery =
            element.name.toLowerCase().includes(elementSearchQuery.toLowerCase()) &&
            element.origin === "original";

          const currentTrade = trades.find((t) => t.id === currentTradeId);
          const isAlreadyInTrade = currentTrade?.elements?.some((e) => e.id === element.id);

          return matchesQuery && !isAlreadyInTrade;
        })
      : [];

  // Global markup effect
  const isFirstGlobalMarkupRender = useRef(true);
  useEffect(() => {
    if (isFirstGlobalMarkupRender.current) {
      isFirstGlobalMarkupRender.current = false;
      return;
    }
    
    if (trades.some(trade => (trade.elements || []).length > 0)) {
      const timer = setTimeout(() => {
        if (isGlobalMarkupEnabled) {
          applyGlobalMarkup(globalMarkupValue);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isGlobalMarkupEnabled, globalMarkupValue]);

  // Event handlers
  const applyGlobalMarkup = (markupValue: number) => {
    if (!trades.some(trade => (trade.elements || []).length > 0)) {
      return;
    }

    const loadingToast = toast.loading(`Applying ${markupValue}% markup to all elements...`, {
      position: "top-center"
    });

    const updatePromises: Promise<any>[] = [];

    trades.forEach(trade => {
      (trade.elements || []).forEach(element => {
        if (element.markup !== markupValue) {
          const elementData = {
            name: element.name,
            description: element.description || undefined,
            material_cost_formula: element.material_cost_formula,
            labor_cost_formula: element.labor_cost_formula,
            markup: markupValue,
            material_formula_variables: element.material_formula_variables,
            labor_formula_variables: element.labor_formula_variables,
          };

          updatePromises.push(
            updateElement(element.id, elementData)
              .then(response => ({
                tradeId: trade.id,
                updatedElement: response.data
              }))
              .catch(error => {
                console.error(`Error updating element ${element.id}:`, error);
                throw error;
              })
          );
        }
      });
    });

    Promise.all(updatePromises)
      .then((results) => {
        console.log(`Successfully updated ${results.length} elements with markup ${markupValue}%`);

        const updatedTrades = trades.map(trade => ({
          ...trade,
          elements: trade.elements?.map(element => {
            const result = results.find(r => 
              r.tradeId === trade.id && 
              r.updatedElement.id === element.id
            );
            return result ? result.updatedElement : element;
          }) || []
        }));

        updateTrades(updatedTrades);

        queryClient.invalidateQueries({ queryKey: ["elements"] });
        queryClient.invalidateQueries({ queryKey: ["trades"] });

        toast.dismiss(loadingToast);
        toast.success(`Applied ${markupValue}% markup to all elements`, {
          position: "top-center",
          description: `Updated ${results.length} elements with ${markupValue}% markup.`
        });
      })
      .catch(error => {
        console.error("Error applying global markup:", error);

        queryClient.invalidateQueries({ queryKey: ["elements"] });
        queryClient.invalidateQueries({ queryKey: ["trades"] });

        toast.dismiss(loadingToast);
        toast.error("Error applying global markup", {
          position: "top-center",
          description: error instanceof Error ? error.message : "Failed to update one or more elements. The original values have been restored."
        });
      });
  };

  const startEditingElementMarkup = (element: ElementResponse) => {
    setEditingMarkupElementId(element.id);
    setInlineMarkupValue(element.markup || 0);
  };

  const saveElementMarkup = (elementId: string, tradeId: string, newMarkup: number) => {
    if (isGlobalMarkupEnabled) {
      setIsGlobalMarkupEnabled(false);
    }

    const updatedTrades = trades.map(trade => {
      if (trade.id === tradeId) {
        return {
          ...trade,
          elements: (trade.elements || []).map(element => {
            if (element.id === elementId) {
              return {
                ...element,
                markup: newMarkup
              };
            }
            return element;
          })
        };
      }
      return trade;
    });
    
    updateTrades(updatedTrades);

    updateElementMutation({
      elementId,
      data: {
        markup: newMarkup
      }
    });
    
    setEditingMarkupElementId(null);
  };

  const cancelEditingMarkup = () => {
    setEditingMarkupElementId(null);
  };

  const handleSelectTrade = (trade: TradeResponse) => {
    const newTrade: TradeResponse = {
      id: trade.id.toString(),
      name: trade.name,
      description: trade.description,
      origin: trade.origin,
      elements: trade.elements,
      created_at: trade.created_at,
      updated_at: trade.updated_at,
      created_by: trade.created_by,
      updated_by: trade.updated_by,
    };

    if (!trades.some((t) => t.id === newTrade.id)) {
      updateTrades([...trades, newTrade]);
    }

    setIsTradeSearchOpen(false);
    setTradeSearchQuery("");
  };

  const handleRemoveTrade = (tradeId: string) => {
    updateTrades(trades.filter((t) => t.id !== tradeId));
  };

  const handleAddTrade = () => {
    if (!newTradeName.trim()) return;

    const tradeData = {
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || undefined,
      origin: "derived" as const,
    };

    createTradeMutation(tradeData);
  };

  const handleAddElement = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => {
    if (!data.name.trim() || !currentTradeId) return;

    let processedMaterialFormula = data.materialFormula;
    let processedLaborFormula = data.laborFormula;

    if (data.materialFormula) {
      processedMaterialFormula = replaceVariableNamesWithIds(
        data.materialFormula,
        variables
      );
    }

    if (data.laborFormula) {
      processedLaborFormula = replaceVariableNamesWithIds(
        data.laborFormula,
        variables
      );
    }

    const finalMarkup = isGlobalMarkupEnabled ? globalMarkupValue : data.markup;

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: processedMaterialFormula || undefined,
      labor_cost_formula: processedLaborFormula || undefined,
      markup: finalMarkup,
      origin: "derived" as const,
    };

    createElementMutation(elementData);
  };

  const handleEditElement = (data: {
    name: string;
    description: string;
    materialFormula: string;
    laborFormula: string;
    markup: number;
  }) => {
    if (!data.name.trim() || !currentElementId) return;

    let processedMaterialFormula = data.materialFormula;
    let processedLaborFormula = data.laborFormula;

    if (data.materialFormula) {
      processedMaterialFormula = replaceVariableNamesWithIds(
        data.materialFormula,
        variables
      );
    }

    if (data.laborFormula) {
      processedLaborFormula = replaceVariableNamesWithIds(
        data.laborFormula,
        variables
      );
    }

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: processedMaterialFormula || undefined,
      labor_cost_formula: processedLaborFormula || undefined,
      markup: data.markup,
    };

    updateElementMutation({
      elementId: currentElementId,
      data: elementData,
    });
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

  const handleOpenEditDialog = (element: ElementResponse) => {
    setCurrentElementId(element.id);

    setNewElementName(element.name);
    setNewElementDescription(element.description || "");
    
    const markupValue = isGlobalMarkupEnabled && element.markup === globalMarkupValue
      ? globalMarkupValue 
      : (element.markup || 0);
      
    setElementMarkup(markupValue);

    if (element.material_cost_formula) {
      setNewElementMaterialFormula(
        replaceVariableIdsWithNames(
          element.material_cost_formula,
          variables,
          element.material_formula_variables || []
        )
      );
    } else {
      setNewElementMaterialFormula("");
    }

    if (element.labor_cost_formula) {
      setNewElementLaborFormula(
        replaceVariableIdsWithNames(
          element.labor_cost_formula,
          variables,
          element.labor_formula_variables || []
        )
      );
    } else {
      setNewElementLaborFormula("");
    }

    setShowEditElementDialog(true);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <div>
        <div className="pb-3">
          <div className="text-lg flex items-center justify-between">
            <span className="text-lg font-bold flex items-center">
              <BracesIcon size={18} className="mr-1" />
              Trades & Elements
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="global-markup" className="text-sm font-medium">
                  Global Markup
                </Label>
                <Switch
                  id="global-markup"
                  checked={isGlobalMarkupEnabled}
                  onCheckedChange={setIsGlobalMarkupEnabled}
                />
                {isGlobalMarkupEnabled && (
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      value={globalMarkupValue}
                      onChange={(e) => setGlobalMarkupValue(Number(e.target.value))}
                      className="w-16 h-8"
                      min="0"
                      step="0.1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyGlobalMarkup(globalMarkupValue);
                        }
                      }}
                    />
                    <PercentIcon size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            {/* Trade Search */}
            <div className="relative">
              <div className="relative w-full mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (filteredTrades.length === 0 || !tradeSearchQuery.trim()) {
                        setIsTradeSearchOpen(false);
                        setShowAddTradeDialog(true);
                        setNewTradeName(tradeSearchQuery.trim());
                      } else if (filteredTrades.length > 0) {
                        handleSelectTrade(filteredTrades[0]);
                      }
                    }
                  }}
                  className="w-full pl-8 pr-4"
                />
                {tradesLoading && (
                  <div className="absolute right-2 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Trade Search Results */}
              {tradeSearchQuery.trim() && isTradeSearchOpen && (
                <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-1 px-2">Trades</p>
                    {filteredTrades.length > 0 ? (
                      filteredTrades.map((trade) => (
                        <div
                          key={trade.id}
                          className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => handleSelectTrade(trade)}
                        >
                          <span>{trade.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm">
                        <span>Press Enter to create "{tradeSearchQuery}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Trades List */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Trades ({trades.length})
              </h3>
              {trades.length > 0 ? (
                <div className="space-y-2">
                  {trades.map((trade) => (
                    <div
                      key={trade.id}
                      className="border rounded-md p-3 bg-muted/30 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm flex items-center">
                          {trade.name}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTrade(trade.id)}
                            className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {trade.description && (
                        <div className="text-xs mt-1 mb-2 line-clamp-1">
                          {trade.description}
                        </div>
                      )}

                      {trade.elements ? (
                        <div className="mt-3 border-t pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">
                              Elements ({trade.elements.length})
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCurrentTradeId(trade.id);
                                setShowAddElementDialog(true);
                              }}
                              className="h-6 text-xs px-2"
                            >
                              Add Element
                            </Button>
                          </div>

                          {/* Element Search */}
                          <div className="relative mb-2">
                            <Input
                              placeholder={`Search elements for ${trade.name}...`}
                              value={elementSearchQueries[trade.id] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setElementSearchQueries((prev) => ({
                                  ...prev,
                                  [trade.id]: value,
                                }));
                                setElementSearchQuery(value);
                                setCurrentTradeId(trade.id);
                                if (value.trim()) {
                                  setIsElementSearchOpen(true);
                                } else {
                                  setIsElementSearchOpen(false);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (filteredElements.length > 0) {
                                    handleSelectElement(filteredElements[0], trade.id);
                                  }
                                }
                              }}
                              className="text-xs h-7"
                            />

                            {/* Element Search Results */}
                            {elementSearchQuery.trim() && 
                             isElementSearchOpen && 
                             currentTradeId === trade.id && (
                              <div className="absolute z-10 w-full border rounded-md bg-background shadow-md mt-1">
                                <div className="p-2">
                                  {filteredElements.length > 0 ? (
                                    filteredElements.map((element) => (
                                      <div
                                        key={element.id}
                                        className="flex items-center justify-between w-full p-2 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                                        onClick={() => handleSelectElement(element, trade.id)}
                                      >
                                        <span>{element.name}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-2 text-xs">
                                      No matching elements found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {trade.elements.length > 0 ? (
                            <div className="space-y-1">
                              {trade.elements.map((element) => (
                                <div
                                  key={element.id}
                                  className="flex items-center justify-between p-2 text-xs bg-muted/50 rounded group cursor-pointer hover:bg-muted"
                                  onClick={() => handleOpenEditDialog(element)}
                                >
                                  <div className="flex-1">
                                    <div className="font-medium">{element.name}</div>
                                    {element.description && (
                                      <div className="text-muted-foreground text-xs line-clamp-1">
                                        {element.description}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {editingMarkupElementId === element.id ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          value={inlineMarkupValue}
                                          onChange={(e) => setInlineMarkupValue(Number(e.target.value))}
                                          className="w-12 h-5 text-xs"
                                          onKeyDown={(e) => {
                                            e.stopPropagation();
                                            if (e.key === "Enter") {
                                              saveElementMarkup(element.id, trade.id, inlineMarkupValue);
                                            } else if (e.key === "Escape") {
                                              cancelEditingMarkup();
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <span className="text-xs">%</span>
                                      </div>
                                    ) : (
                                      <div 
                                        className="flex items-center gap-1 px-1 py-0.5 rounded hover:bg-accent"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isGlobalMarkupEnabled) {
                                            startEditingElementMarkup(element);
                                          }
                                        }}
                                      >
                                        <span className="text-xs text-muted-foreground">
                                          {element.markup || 0}%
                                        </span>
                                        {isGlobalMarkupEnabled && element.markup === globalMarkupValue && (
                                          <Badge variant="secondary" className="text-xs h-4 px-1">
                                            Global
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveElement(element.id, trade.id);
                                      }}
                                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-2 text-muted-foreground">
                              <p className="text-xs">No elements in this trade</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
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

            {/* Dialogs */}
            <AddTradeDialog
              open={showAddTradeDialog}
              onOpenChange={setShowAddTradeDialog}
              onAddTrade={handleAddTrade}
              newTradeName={newTradeName}
              setNewTradeName={setNewTradeName}
              newTradeDescription={newTradeDescription}
              setNewTradeDescription={setNewTradeDescription}
              isCreatingTrade={isCreatingTrade}
            />

            <AddElementDialog
              open={showAddElementDialog}
              onOpenChange={setShowAddElementDialog}
              onAddElement={handleAddElement}
              newElementName={newElementName}
              variables={variables}
              updateVariables={updateVariables}
              isCreatingElement={isCreatingElement}
              isGlobalMarkupEnabled={isGlobalMarkupEnabled}
              globalMarkupValue={globalMarkupValue}
            />

            <EditElementDialog
              open={showEditElementDialog}
              onOpenChange={setShowEditElementDialog}
              onEditElement={handleEditElement}
              elementToEdit={
                currentElementId
                  ? trades
                      .flatMap((trade) => trade.elements || [])
                      .find((element) => element.id === currentElementId) ||
                    null
                  : null
              }
              variables={variables}
              updateVariables={updateVariables}
              isUpdatingElement={isUpdatingElement}
              elementMarkup={elementMarkup}
              onCancel={() => {
                setShowEditElementDialog(false);
                setCurrentElementId(null);
              }}
              isGlobalMarkupEnabled={isGlobalMarkupEnabled}
              globalMarkupValue={globalMarkupValue}
              onUseGlobalMarkup={() => {
                if (currentElementId) {
                  setElementMarkup(globalMarkupValue);
                  const currentElement = trades
                    .flatMap(trade => trade.elements || [])
                    .find(element => element.id === currentElementId);
                  
                  if (currentElement) {
                    const elementData = {
                      name: currentElement.name,
                      description: currentElement.description || undefined,
                      material_cost_formula: currentElement.material_cost_formula,
                      labor_cost_formula: currentElement.labor_cost_formula,
                      markup: globalMarkupValue,
                      material_formula_variables: currentElement.material_formula_variables,
                      labor_formula_variables: currentElement.labor_formula_variables,
                    };
                    
                    updateElement(currentElementId, elementData)
                      .then(() => {
                        const updatedTrades = trades.map(trade => ({
                          ...trade,
                          elements: trade.elements?.map(element => 
                            element.id === currentElementId 
                              ? { ...element, markup: globalMarkupValue } 
                              : element
                          ) || []
                        }));
                        
                        updateTrades(updatedTrades);
                        
                        toast.success(`Applied global markup of ${globalMarkupValue}% to element`, {
                          position: "top-center"
                        });
                        
                        queryClient.invalidateQueries({ queryKey: ["elements"] });
                      })
                      .catch(error => {
                        console.error("Error updating element markup:", error);
                        toast.error("Failed to apply global markup to element", {
                          position: "top-center"
                        });
                      });
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
