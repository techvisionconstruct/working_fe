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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared";
import { toast } from "sonner";
import { X, BracesIcon, Variable, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllVariables } from "@/api/variables/get-all-variables";
import { getAllVariableTypes } from "@/api/variable-types/get-all-variable-types";
import { updateTrade } from "@/api/trades/update-trade";
import { getAllTrades } from "@/api/trades/get-all-trades";
import { getAllElements } from "@/api/elements/get-all-elements";
import { createVariable } from "@/api/variables/create-variable";
import { createTrade } from "@/api/trades/create-trade";
import { createElement } from "@/api/elements/create-element";
import { updateElement } from "@/api/elements/update-element";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { TradeResponse } from "@/types/trades/dto";
import { useFormula } from "./hooks/use-formula";
import { ElementDialog } from "./components/element-dialog";
import {
  Dialog as ConfirmDialog,
  DialogContent as ConfirmDialogContent,
  DialogHeader as ConfirmDialogHeader,
  DialogTitle as ConfirmDialogTitle,
  DialogFooter as ConfirmDialogFooter,
} from "@/components/shared";
import { getVariables } from "@/queryOptions/variables";
import { getTrades } from "@/queryOptions/trades";
import { getElements } from "@/queryOptions/elements";

interface TradesAndElementsStepProps {
  data: {
    trades: TradeResponse[];
    variables: VariableResponse[];
  };
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables?: (variables: VariableResponse[]) => void;
}

const TradesAndElementsStep: React.FC<TradesAndElementsStepProps> = ({
  data,
  updateTrades,
  updateVariables = () => {},
}) => {
  // =========== STATE MANAGEMENT ===========

  // Variable-related state
  const [newVarName, setNewVarName] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] =
    useState("");
  const [formulaFieldSource, setFormulaFieldSource] = useState<string | null>(
    null
  );
  const [pendingVariableName, setPendingVariableName] = useState("");
  const variables = data.variables || [];
  const [pendingVariableCallback, setPendingVariableCallback] = useState<
    ((newVariable: VariableResponse) => void) | null
  >(null);

  // Trade-related state
  const [tradeSearchQuery, setTradeSearchQuery] = useState("");
  const [isTradeSearchOpen, setIsTradeSearchOpen] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");
  const trades = data.trades || [];
  const [tradeSkeletons, setTradeSkeletons] = useState<Record<string, boolean>>(
    {}
  );

  // Element-related state
  const [elementSearchQuery, setElementSearchQuery] = useState("");
  const [isElementSearchOpen, setIsElementSearchOpen] = useState(false);
  const [elementSearchQueries, setElementSearchQueries] = useState<
    Record<string, string>
  >({});
  const [showAddElementDialog, setShowAddElementDialog] = useState(false);
  const [showEditElementDialog, setShowEditElementDialog] = useState(false);
  const [currentTradeId, setCurrentTradeId] = useState<string | null>(null);
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);
  const [elementToEdit, setElementToEdit] = useState<ElementResponse | null>(
    null
  );
  const [newElementName, setNewElementName] = useState("");
  
  // Store a local copy of variables to prevent issues with autocomplete
  const [localVariables, setLocalVariables] = useState<VariableResponse[]>([]);
  
  // Update local variables when data.variables changes
  useEffect(() => {
    if (data.variables && data.variables.length > 0) {
      setLocalVariables(data.variables);
    }
  }, [data.variables]);

  // Use our formula hook for formula management
  const { replaceVariableNamesWithIds, replaceVariableIdsWithNames } =
    useFormula();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Queries
  const { data: tradesData, isLoading: tradesLoading } = useQuery(
    getTrades(1, 10, tradeSearchQuery)
  );
  const { data: elementsData, isLoading: elementsLoading } = useQuery(
    getElements(1, 10, elementSearchQuery)
  );
  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables(1, 10, searchQuery)
  );

  const { data: apiVariableTypes = [], isLoading: isLoadingVariableTypes } =
    useQuery({
      queryKey: ["variable-types"],
      queryFn: () => getAllVariableTypes(),
    });

  // =========== MUTATIONS ===========

  const queryClient = useQueryClient();

  // Variable mutation
  const { mutate: createVariableMutation } = useMutation({
    mutationFn: createVariable,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdVariable = response.data;

        // Update both local and parent variables
        const updatedVariables = [...localVariables, createdVariable];
        setLocalVariables(updatedVariables);
        updateVariables(updatedVariables);

        // Call the pending callback if it exists, with proper error handling
        try {
          if (pendingVariableCallback) {
            console.log(
              "Calling pendingVariableCallback with variable:",
              createdVariable
            );
            pendingVariableCallback(createdVariable);
            setPendingVariableCallback(null);
          }
        } catch (error) {
          console.error("Error in pendingVariableCallback:", error);
        }

        toast.success("Variable created successfully", {
          position: "top-center",
          description: `"${createdVariable.name}" has been added to your template.`,
        });

        // Invalidate the variables query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["variables"] });

        // Close dialog and reset form state
        setShowAddDialog(false);
        setNewVarName("");
        setNewVarDescription("");
        setNewVarDefaultValue(0);
        setNewVarDefaultVariableType("");
        setIsSubmitting(false);
        setSearchQuery("");
      }
    },
    onError: (error) => {
      toast.error("Failed to create variable", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      setIsSubmitting(false);
      // Clear the callback in case of error
      setPendingVariableCallback(null);
    },
  });

  // Trade mutation
  const { mutate: createTradeMutation, isPending: isCreatingTrade } =
    useMutation({
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
          setTradeSearchQuery("");
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

  // Trade update mutation to connect elements to trades
  const { mutate: updateTradeMutation } = useMutation({
    mutationFn: ({
      tradeId,
      data,
    }: {
      tradeId: string;
      data: { elements: string[] };
    }) => updateTrade(tradeId, data),
    onSuccess: () => {
      // No need to update UI state again since we already did it in createElementMutation
    },
    onError: (error) => {
      toast.error("Failed to connect element to trade", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });

  // Element update mutation
  const { mutate: updateElementMutation, isPending: isUpdatingElement } =
    useMutation({
      mutationFn: ({ elementId, data }: { elementId: string; data: any }) =>
        updateElement(elementId, data),
      onSuccess: (response) => {
        if (response && response.data) {
          const updatedElement = response.data;

          // Update the element in all trades where it exists
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
      onError: (error) => {
        toast.error("Failed to update element", {
          position: "top-center",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      },
    });

  // Element creation mutation
  const { mutate: createElementMutation, isPending: isCreatingElement } =
    useMutation({
      mutationFn: createElement,
      onSuccess: (response) => {
        if (response && response.data) {
          const createdElement = response.data;

          // Find the trade to add this element to
          const updatedTrades = trades.map((trade) => {
            if (trade.id === currentTradeId) {
              // Add the element to this trade
              return {
                ...trade,
                elements: [...(trade.elements || []), createdElement],
              };
            }
            return trade;
          });

          // Update the UI state first
          updateTrades(updatedTrades);

          // Then update the backend to connect the element to the trade using React Query mutation
          if (currentTradeId) {
            // Find the current trade that we're adding the element to
            const currentTrade = trades.find(
              (trade) => trade.id === currentTradeId
            );
            if (currentTrade) {
              // Get all elements including the new one
              const updatedElements = [
                ...(currentTrade.elements || []),
                createdElement,
              ].map((elem) => elem.id);

              // Use the updateTradeMutation to connect element to trade
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

          // Reset form and close dialog
          setShowAddElementDialog(false);
          setElementSearchQuery("");
        }
      },
      onError: (error) => {
        toast.error("Failed to create element", {
          position: "top-center",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      },
    });

  // =========== FILTERED DATA ===========

  const filteredVariables =
    searchQuery === ""
      ? []
      : Array.isArray(variablesData?.data)
      ? (variablesData.data as VariableResponse[]).filter(
          (variable) =>
            variable.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !variables.some((v) => v.id === variable.id)
        )
      : [];

  console.log("filteredVariables", filteredVariables);

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

  // =========== EVENT HANDLERS ===========

  const handleSelectVariable = (variable: VariableResponse) => {
    // Make sure we work with local variables to prevent state loss
    const newVar: VariableResponse = {
      id: variable.id.toString(),
      name: variable.name,
      description: variable.description,
      value: variable.value,
      is_global: variable.is_global,
      variable_type: variable.variable_type,
      created_at: variable.created_at,
      updated_at: variable.updated_at,
      created_by: variable.created_by,
      updated_by: variable.updated_by,
    };

    if (!localVariables.some((v) => v.id === newVar.id)) {
      const updatedVariables = [...localVariables, newVar];
      setLocalVariables(updatedVariables);
      updateVariables(updatedVariables);
    }

    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleAddVariable = () => {
    if (!validateVariableForm()) return;

    const variableData = {
      name: newVarName.trim(),
      description: newVarDescription.trim() || undefined,
      value: newVarDefaultValue,
      is_global: false,
      variable_type: newVarDefaultVariableType,
    };
    setIsSubmitting(true);
    createVariableMutation(variableData);
  };

  const handleRemoveVariable = (variableId: string) => {
    const usedInElements = findElementsUsingVariable(variableId);
    if (usedInElements.length > 0) {
      setVariableToRemove(localVariables.find((v) => v.id === variableId) || null);
      setElementsUsingVariable(usedInElements);
      setShowRemoveVariableConfirm(true);
    } else {
      const updatedVariables = localVariables.filter((v) => v.id !== variableId);
      setLocalVariables(updatedVariables);
      updateVariables(updatedVariables);
    }
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
      // If the trade has elements, show skeleton
      if (newTrade.elements && newTrade.elements.length > 0) {
        setTradeSkeletons((prev) => ({ ...prev, [newTrade.id]: true }));
        setTimeout(() => {
          setTradeSkeletons((prev) => ({ ...prev, [newTrade.id]: false }));
        }, 1000); // 1 second
      }
    }

    setIsTradeSearchOpen(false);
    setTradeSearchQuery("");
  };

  const handleRemoveTrade = (tradeId: string) => {
    updateTrades(trades.filter((t) => t.id !== tradeId));
  };

  const handleAddTrade = () => {
    if (!validateTradeForm()) return;

    const tradeData = {
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || undefined,
    };
    createTradeMutation(tradeData);
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
  }) => {
    if (!data.name.trim() || !currentTradeId) return;

    const materialFormula = data.materialFormula.trim()
      ? replaceVariableNamesWithIds(data.materialFormula.trim(), variables)
      : undefined;

    const laborFormula = data.laborFormula.trim()
      ? replaceVariableNamesWithIds(data.laborFormula.trim(), variables)
      : undefined;

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: materialFormula,
      labor_cost_formula: laborFormula,
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
  }) => {
    if (!data.name.trim() || !currentElementId) return;

    const materialFormula = data.materialFormula.trim()
      ? replaceVariableNamesWithIds(data.materialFormula.trim(), variables)
      : undefined;

    const laborFormula = data.laborFormula.trim()
      ? replaceVariableNamesWithIds(data.laborFormula.trim(), variables)
      : undefined;

    const elementData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      material_cost_formula: materialFormula,
      labor_cost_formula: laborFormula,
    };

    updateElementMutation({
      elementId: currentElementId,
      data: elementData,
    });
  };

  // Confirm remove
  const confirmRemoveVariable = () => {
    if (variableToRemove) {
      const updatedVariables = localVariables.filter((v) => v.id !== variableToRemove.id);
      setLocalVariables(updatedVariables);
      updateVariables(updatedVariables);
      setShowRemoveVariableConfirm(false);
      setVariableToRemove(null);
      setElementsUsingVariable([]);
    }
  };

  // Cancel remove
  const cancelRemoveVariable = () => {
    setShowRemoveVariableConfirm(false);
    setVariableToRemove(null);
    setElementsUsingVariable([]);
  };

  // =========== VALIDATION STATE/FORMS ===========
  const [variableErrors, setVariableErrors] = useState({
    name: "",
    variable_type: "",
  });

  const [variableTouched, setVariableTouched] = useState({
    name: false,
    variable_type: false,
  });

  const [tradeErrors, setTradeErrors] = useState({
    name: "",
  });

  const [tradeTouched, setTradeTouched] = useState({
    name: false,
  });

  const [showRemoveVariableConfirm, setShowRemoveVariableConfirm] =
    useState(false);
  const [variableToRemove, setVariableToRemove] =
    useState<VariableResponse | null>(null);
  const [elementsUsingVariable, setElementsUsingVariable] = useState<
    ElementResponse[]
  >([]);
  const [showMissingVariableDialog, setShowMissingVariableDialog] =
    useState(false);
  const [missingVariable, setMissingVariable] = useState<string | null>(null);

  // Add validation functions
  const validateVariableForm = () => {
    const newErrors = { name: "", variable_type: "" };

    if (!newVarName.trim()) {
      newErrors.name = "Variable name is required";
    } else if (newVarName.length > 50) {
      newErrors.name = "Variable name must be less than 50 characters";
    } else if (
      variables.some((v) => v.name.toLowerCase() === newVarName.toLowerCase())
    ) {
      newErrors.name = "Variable with this name already exists";
    }

    if (!newVarDefaultVariableType) {
      newErrors.variable_type = "Variable type is required";
    }

    setVariableErrors(newErrors);
    return !newErrors.name && !newErrors.variable_type;
  };

  const handleVariableBlur = (field: any) => {
    setVariableTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateTradeForm = () => {
    const newErrors = { name: "" };

    if (!newTradeName.trim()) {
      newErrors.name = "Trade name is required";
    } else if (newTradeName.length > 50) {
      newErrors.name = "Trade name must be less than 50 characters";
    } else if (
      trades.some((t) => t.name.toLowerCase() === newTradeName.toLowerCase())
    ) {
      newErrors.name = "Trade with this name already exists";
    }

    setTradeErrors(newErrors);
    return !newErrors.name;
  };

  const handleTradeBlur = (field: any) => {
    setTradeTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Helper: Find elements using a variable
  const findElementsUsingVariable = (variableId: string) => {
    const usedIn: ElementResponse[] = [];
    trades.forEach((trade) => {
      (trade.elements || []).forEach((element) => {
        // Check both material and labor formulas for variable usage
        const materialVars = element.material_formula_variables || [];
        const laborVars = element.labor_formula_variables || [];
        if (
          materialVars.some((v) => v.id === variableId) ||
          laborVars.some((v) => v.id === variableId)
        ) {
          usedIn.push(element);
        }
      });
    });
    return usedIn;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Template Variables & Trades</h2>
        <p className="text-muted-foreground mb-6">
          Define variables for your template and organize elements by trade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variables Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Variable className="mr-2 h-5 w-5" />
                <span>Template Variables</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  {/* Search */}
                  <div className="relative w-full mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search variables..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Always show suggestions if there's content, regardless of results
                        if (e.target.value.trim()) {
                          setIsSearchOpen(true);
                        } else {
                          setIsSearchOpen(false);
                        }
                      }}
                      onFocus={() => {
                        // Always show suggestions on focus if there's content
                        if (searchQuery.trim()) {
                          setIsSearchOpen(true);
                        }
                      }}
                      onBlur={() => {
                        // Use setTimeout to allow clicks on the dropdown to register first
                        setTimeout(() => setIsSearchOpen(false), 200);
                      }}
                      onClick={() => {
                        // Also show on click if there's content
                        if (searchQuery.trim()) {
                          setIsSearchOpen(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Tab" && filteredVariables.length > 0) {
                          e.preventDefault();
                          handleSelectVariable(filteredVariables[0]);
                        } else if (e.key === "Enter") {
                          if (
                            filteredVariables.length === 0 ||
                            !searchQuery.trim()
                          ) {
                            setIsSearchOpen(false);
                            setShowAddDialog(true);
                            setNewVarName(searchQuery.trim());
                          } else if (filteredVariables.length === 1) {
                            handleSelectVariable(filteredVariables[0]);
                          }
                        }
                      }}
                      className="w-full pl-8 pr-10"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                        tabIndex={-1}
                        aria-label="Clear variable search"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    )}
                    {variablesLoading && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Variable search results dropdown */}
                  {searchQuery.trim() && isSearchOpen && (
                    <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground mb-1 px-2">
                          Variables
                        </p>
                        {filteredVariables.length > 0 ? (
                          filteredVariables
                            .filter(
                              (variable) => variable.origin === "original"
                            )
                            .map((variable) => (
                              <div
                                key={variable.id}
                                className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => handleSelectVariable(variable)}
                              >
                                <div className="flex items-center">
                                  <BracesIcon className="mr-2 h-4 w-4" />
                                  <span>{variable.name}</span>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  {variable.variable_type?.name || "Unknown"}
                                </Badge>
                              </div>
                            ))
                        ) : (
                          <div className="p-2 text-sm">
                            {variables.some((v) =>
                              v.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            ) ? (
                              <span className="text-muted-foreground">
                                Variable already added
                              </span>
                            ) : (
                              <div>
                                <span className="text-muted-foreground">
                                  "{searchQuery}" doesn't exist.
                                </span>
                                <p className="text-xs mt-1 text-primary">
                                  Press Enter to create this variable
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add variable dialog */}
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <BracesIcon className="mr-2 h-4 w-4" />
                          Add Template Variable
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="var-name">
                            Variable Name{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="var-name"
                              placeholder="Wall Length"
                              value={newVarName}
                              onChange={(e) => setNewVarName(e.target.value)}
                              onBlur={() => handleVariableBlur("name")}
                              className={
                                variableErrors.name && variableTouched.name
                                  ? "border-red-500 pr-10"
                                  : "pr-10"
                              }
                            />
                            {newVarName && (
                              <button
                                type="button"
                                onClick={() => setNewVarName("")}
                                className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                                tabIndex={-1}
                                aria-label="Clear variable name"
                              >
                                <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                              </button>
                            )}
                          </div>
                          {variableErrors.name && variableTouched.name && (
                            <p className="text-xs text-red-500">
                              {variableErrors.name}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="var-type">
                            Variable Type{" "}
                            <span className="text-red-500">*</span>
                          </Label>
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
                            <>
                              <Select
                                value={newVarDefaultVariableType}
                                onValueChange={setNewVarDefaultVariableType}
                              >
                                <SelectTrigger
                                  className={`w-full ${
                                    variableErrors.variable_type &&
                                    variableTouched.variable_type
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select a variable type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(
                                    (apiVariableTypes as any)?.data
                                  ) ? (
                                    (apiVariableTypes as any).data.map(
                                      (type: any) => (
                                        <SelectItem
                                          key={type.id}
                                          value={type.id.toString()}
                                        >
                                          {type.name}
                                        </SelectItem>
                                      )
                                    )
                                  ) : (
                                    <SelectItem value="default">
                                      Default Type
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              {variableErrors.variable_type &&
                                variableTouched.variable_type && (
                                  <p className="text-xs text-red-500">
                                    {variableErrors.variable_type}
                                  </p>
                                )}
                            </>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="var-description">
                            Description
                            <span className="text-gray-500">
                              &#40;Optional&#41;
                            </span>
                          </Label>
                          <Textarea
                            id="var-description"
                            placeholder="What this variable represents (optional)"
                            value={newVarDescription}
                            onChange={(e) =>
                              setNewVarDescription(e.target.value)
                            }
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (!validateVariableForm()) return;

                            setIsSubmitting(true);
                            const variableData = {
                              name: newVarName.trim(),
                              description:
                                newVarDescription.trim() || undefined,
                              value: newVarDefaultValue,
                              is_global: false,
                              variable_type: newVarDefaultVariableType,
                            };
                            createVariableMutation(variableData);
                          }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Add Variable"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Variables List */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    Variables ({variables.length})
                  </h3>
                  <ScrollArea className="h-[300px] pr-4 -mr-4">
                    {variables.length > 0 ? (
                      <div className="space-y-2">
                        {variables.map((variable) => (
                          <div
                            key={variable.id}
                            className="border rounded-md p-3 bg-muted/30 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm flex items-center">
                                {variable.name}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {variable.variable_type?.name}
                              </Badge>
                            </div>
                            {variable.description && (
                              <div className="text-xs mt-1 line-clamp-1">
                                {variable.description}
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-destructive hover:text-destructive/80"
                              onClick={() => handleRemoveVariable(variable.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        <p className="text-sm">No variables defined</p>
                        <p className="text-xs">
                          Variables can be used across all elements
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trades and Elements Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BracesIcon className="mr-2 h-5 w-5" />
                <span>Template Trades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  {/* Search */}
                  <div className="relative w-full mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trades..."
                      value={tradeSearchQuery}
                      onChange={(e) => {
                        setTradeSearchQuery(e.target.value);
                        // Always show suggestions if there's content, regardless of results
                        if (e.target.value.trim()) {
                          setIsTradeSearchOpen(true);
                        } else {
                          setIsTradeSearchOpen(false);
                        }
                      }}
                      onFocus={() => {
                        // Always show suggestions on focus if there's content
                        if (tradeSearchQuery.trim()) {
                          setIsTradeSearchOpen(true);
                        }
                      }}
                      onBlur={() => {
                        // Use setTimeout to allow clicks on the dropdown to register first
                        setTimeout(() => setIsTradeSearchOpen(false), 200);
                      }}
                      onClick={() => {
                        // Also show on click if there's content
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
                      className="w-full pl-8 pr-10"
                    />
                    {tradeSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTradeSearchQuery("")}
                        className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                        tabIndex={-1}
                        aria-label="Clear trade search"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    )}
                    {tradesLoading && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Trade search results dropdown */}
                  {tradeSearchQuery.trim() && isTradeSearchOpen && (
                    <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground mb-1 px-2">
                          Trades
                        </p>
                        {filteredTrades.length > 0 ? (
                          filteredTrades
                            .filter((trade) => trade.origin === "original")
                            .map((trade) => (
                              <div
                                key={trade.id}
                                className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => handleSelectTrade(trade)}
                              >
                                <div className="flex items-center">
                                  <BracesIcon className="mr-2 h-4 w-4" />
                                  <span>{trade.name}</span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="p-2 text-sm">
                            {trades.some((t) =>
                              t.name
                                .toLowerCase()
                                .includes(tradeSearchQuery.toLowerCase())
                            ) ? (
                              <span className="text-muted-foreground">
                                Trade already added
                              </span>
                            ) : (
                              <div>
                                <span className="text-muted-foreground">
                                  "{tradeSearchQuery}" doesn't exist.
                                </span>
                                <p className="text-xs mt-1 text-primary">
                                  Press Enter to create this trade
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dialog for adding a new trade */}
                  <Dialog
                    open={showAddTradeDialog}
                    onOpenChange={setShowAddTradeDialog}
                  >
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
                            Trade Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="trade-name"
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
                            <p className="text-xs text-red-500">
                              {tradeErrors.name}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="trade-description">
                            Description
                            <span className="text-gray-500">
                              &#40;Optional&#41;
                            </span>
                          </Label>
                          <Textarea
                            id="trade-description"
                            placeholder="Description of what this trade covers"
                            value={newTradeDescription}
                            onChange={(e) =>
                              setNewTradeDescription(e.target.value)
                            }
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddTradeDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddTrade}
                          disabled={isCreatingTrade}
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
                          {tradeSkeletons[trade.id] ? (
                            // Skeleton UI
                            <div className="animate-pulse space-y-2">
                              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                              <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                              <div className="h-3 bg-muted rounded w-1/4 mb-2" />
                              <div className="h-8 bg-muted rounded w-full" />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm flex items-center">
                                  {trade.name}
                                </div>
                              </div>
                              {trade.description && (
                                <div className="text-xs mt-1 mb-2 line-clamp-1">
                                  {trade.description}
                                </div>
                              )}

                              <div className="mt-3 border-t pt-2">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                                    Elements
                                  </div>
                                </div>

                                <div className="relative mb-2">
                                  <div className="relative w-full mb-1">
                                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                                    <Input
                                      placeholder="Search elements..."
                                      value={
                                        elementSearchQueries[trade.id] || ""
                                      }
                                      onChange={(e) => {
                                        setCurrentTradeId(trade.id);
                                        setElementSearchQueries((prev) => ({
                                          ...prev,
                                          [trade.id]: e.target.value,
                                        }));
                                        setElementSearchQuery(e.target.value);

                                        // Always show dropdown when there's content, regardless of results
                                        if (e.target.value.trim()) {
                                          setIsElementSearchOpen(true);
                                        } else {
                                          setIsElementSearchOpen(false);
                                        }
                                      }}
                                      onFocus={() => {
                                        setCurrentTradeId(trade.id);
                                        const tradeQuery =
                                          elementSearchQueries[trade.id] || "";
                                        setElementSearchQuery(tradeQuery);

                                        // Always show dropdown when there's content, regardless of results
                                        if (tradeQuery.trim()) {
                                          setIsElementSearchOpen(true);
                                        }
                                      }}
                                      onBlur={() => {
                                        // Use setTimeout to allow clicks on the dropdown to register first
                                        setTimeout(
                                          () => setIsElementSearchOpen(false),
                                          200
                                        );
                                      }}
                                      onClick={() => {
                                        // Update necessary state and always show dropdown when there's content
                                        setCurrentTradeId(trade.id);
                                        const tradeQuery =
                                          elementSearchQueries[trade.id] || "";
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
                                          handleSelectElement(
                                            filteredElements[0],
                                            trade.id
                                          );
                                        } else if (e.key === "Enter") {
                                          const tradeQuery =
                                            elementSearchQueries[trade.id] ||
                                            "";
                                          if (
                                            filteredElements.length === 0 ||
                                            !tradeQuery.trim()
                                          ) {
                                            setIsElementSearchOpen(false);
                                            handleOpenAddElementDialog(
                                              trade.id
                                            );
                                          } else if (
                                            filteredElements.length === 1
                                          ) {
                                            handleSelectElement(
                                              filteredElements[0],
                                              trade.id
                                            );
                                          }
                                        }
                                      }}
                                      className="w-full pl-7 pr-10 h-8 text-xs"
                                    />
                                    {elementSearchQueries[trade.id] && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setElementSearchQueries((prev) => ({
                                            ...prev,
                                            [trade.id]: "",
                                          }));
                                          setElementSearchQuery("");
                                        }}
                                        className="absolute right-2 top-2 flex items-center focus:outline-none"
                                        tabIndex={-1}
                                        aria-label="Clear element search"
                                      >
                                        <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                      </button>
                                    )}
                                    {elementsLoading && (
                                      <div className="absolute right-2 top-2">
                                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Element search results */}
                                  {(
                                    elementSearchQueries[trade.id] || ""
                                  ).trim() &&
                                    isElementSearchOpen &&
                                    currentTradeId === trade.id && (
                                      <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                                        <div className="p-2">
                                          <p className="text-xs text-muted-foreground mb-1 px-2">
                                            Elements
                                          </p>
                                          {filteredElements.length > 0 ? (
                                            filteredElements
                                              .filter(
                                                (elements) =>
                                                  elements.origin === "original"
                                              )
                                              .map((element) => (
                                                <div
                                                  key={element.id}
                                                  className="flex items-center justify-between w-full p-2 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                                                  onClick={() =>
                                                    handleSelectElement(
                                                      element,
                                                      trade.id
                                                    )
                                                  }
                                                >
                                                  <div className="flex items-center">
                                                    <BracesIcon className="mr-2 h-3 w-3" />
                                                    <span>{element.name}</span>
                                                  </div>
                                                </div>
                                              ))
                                          ) : (
                                            <div className="p-2 text-xs">
                                              {trade.elements?.some((e) =>
                                                e.name
                                                  .toLowerCase()
                                                  .includes(
                                                    (
                                                      elementSearchQueries[
                                                        trade.id
                                                      ] || ""
                                                    ).toLowerCase()
                                                  )
                                              ) ? (
                                                <span className="text-muted-foreground">
                                                  Element already added to this
                                                  trade
                                                </span>
                                              ) : (
                                                <div>
                                                  <span className="text-muted-foreground">
                                                    "
                                                    {
                                                      elementSearchQueries[
                                                        trade.id
                                                      ]
                                                    }
                                                    " doesn't exist.
                                                  </span>
                                                  <p className="text-xs mt-1 text-primary">
                                                    Press Enter to create this
                                                    element
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* Elements in trade */}
                                <div className="space-y-2">
                                  {trade.elements &&
                                  trade.elements.length > 0 ? (
                                    trade.elements.map((element) => (
                                      <div
                                        key={element.id}
                                        className="flex flex-col gap-2"
                                      >
                                        <div className="flex items-center gap-3 p-4 rounded border bg-background relative group">
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">
                                              {element.name}
                                            </div>
                                            {element.description && (
                                              <div className="text-xs text-muted-foreground line-clamp-1">
                                                {element.description}
                                              </div>
                                            )}
                                            <div className="mt-2 pt-2 border-t border-dashed">
                                              {element.material_cost_formula && (
                                                <div className="mt-1 flex flex-col">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold">
                                                      Material:
                                                    </span>
                                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                      {replaceVariableIdsWithNames(
                                                        element.material_cost_formula,
                                                        variables,
                                                        element.material_formula_variables ||
                                                          []
                                                      )}
                                                    </code>
                                                  </div>
                                                </div>
                                              )}
                                              {element.labor_cost_formula && (
                                                <div className="mt-2 flex flex-col">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold">
                                                      Labor:
                                                    </span>
                                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                      {replaceVariableIdsWithNames(
                                                        element.labor_cost_formula,
                                                        variables,
                                                        element.labor_formula_variables ||
                                                          []
                                                      )}
                                                    </code>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          <div className="absolute -top-2 -right-2 flex gap-1">
                                            {/* Edit element button */}
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-primary hover:text-primary/80"
                                              onClick={() =>
                                                handleOpenEditDialog(element)
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="11"
                                                height="11"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                              </svg>
                                            </Button>
                                            {/* Remove element button */}
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-destructive hover:text-destructive/80"
                                              onClick={() =>
                                                handleRemoveElement(
                                                  element.id,
                                                  trade.id
                                                )
                                              }
                                            >
                                              <X className="h-2.5 w-2.5" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-md">
                                      No elements in this trade
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-destructive hover:text-destructive/80"
                                onClick={() => handleRemoveTrade(trade.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Element Dialogs using the new components with robust callback */}
      <ElementDialog
        isOpen={showAddElementDialog}
        onOpenChange={setShowAddElementDialog}
        onSubmit={handleAddElement}
        initialName={newElementName}
        variables={localVariables}
        updateVariables={(updatedVariables) => {
          if (typeof updatedVariables === 'function') {
            // If it's a function, compute the new value based on current localVariables
            const newVars = updatedVariables(localVariables);
            setLocalVariables(newVars);
            updateVariables(newVars);
          } else {
            // If it's a direct value, use it directly
            setLocalVariables(updatedVariables);
            updateVariables(updatedVariables);
          }
        }}
        isSubmitting={isCreatingElement}
        dialogTitle="Add New Element"
        submitButtonText="Add Element"
        onRequestCreateVariable={(variableName, callback) => {
          try {
            console.log(`Request to create variable: ${variableName}`);

            // Set the variable name to create
            setNewVarName(variableName);

            // Store the callback to be called after creation
            const safeCallback = (newVar: VariableResponse) => {
              try {
                if (!newVar) return;
                console.log(`Variable created, running callback for: ${newVar.name}`);
                callback(newVar);
              } catch (err) {
                console.error("Error in variable creation callback:", err);
              }
            };
            setPendingVariableCallback(() => safeCallback);

            // Show the add dialog (without closing the element dialog)
            setShowAddDialog(true);
          } catch (err) {
            console.error("Error setting up variable creation:", err);
          }
        }}
      />

      <ElementDialog
        isOpen={showEditElementDialog}
        onOpenChange={setShowEditElementDialog}
        onSubmit={handleUpdateElement}
        elementToEdit={elementToEdit}
        variables={localVariables}
        updateVariables={(updatedVariables) => {
          if (typeof updatedVariables === 'function') {
            // If it's a function, compute the new value based on current localVariables
            const newVars = updatedVariables(localVariables);
            setLocalVariables(newVars);
            updateVariables(newVars);
          } else {
            // If it's a direct value, use it directly
            setLocalVariables(updatedVariables);
            updateVariables(updatedVariables);
          }
        }}
        isSubmitting={isUpdatingElement}
        dialogTitle="Edit Element"
        submitButtonText="Update Element"
        onRequestCreateVariable={(variableName, callback) => {
          try {
            console.log(`Request to create variable: ${variableName}`);

            // Set the variable name to create
            setNewVarName(variableName);

            // Store the callback to be called after creation
            const safeCallback = (newVar: VariableResponse) => {
              try {
                if (!newVar) return;
                console.log(`Variable created, running callback for: ${newVar.name}`);
                callback(newVar);
              } catch (err) {
                console.error("Error in variable creation callback:", err);
              }
            };
            setPendingVariableCallback(() => safeCallback);

            // Show the add dialog (without closing the element dialog)
            setShowAddDialog(true);
          } catch (err) {
            console.error("Error setting up variable creation:", err);
          }
        }}
      />

      {/* Confirm Remove Variable Dialog */}
      <ConfirmDialog
        open={showRemoveVariableConfirm}
        onOpenChange={setShowRemoveVariableConfirm}
      >
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>
              This variable is being used in an element
            </ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-2">
            <p>
              <b>{variableToRemove?.name}</b> is being used in the following
              elements:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              {elementsUsingVariable.map((el) => (
                <li key={el.id}>{el.name}</li>
              ))}
            </ul>
            <p className="mt-3 text-destructive">
              Deleting it might affect these elements. Would you still like to
              proceed?
            </p>
          </div>
          <ConfirmDialogFooter>
            <Button variant="outline" onClick={cancelRemoveVariable}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveVariable}>
              Yes, Remove
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>

      {/* Missing Variable Dialog */}
      <ConfirmDialog
        open={showMissingVariableDialog}
        onOpenChange={setShowMissingVariableDialog}
      >
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Variable Missing from List</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-2">
            <p>
              The variable <b>{missingVariable}</b> is currently being used in
              an element but is not in the Variable List.
            </p>
            <p className="mt-2">
              Would you like to create it or delete the variable from the
              element?
            </p>
          </div>
          <ConfirmDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMissingVariableDialog(false);
                // Optionally, trigger logic to create the variable
                if (updateVariables && missingVariable) {
                  updateVariables([
                    ...variables,
                    {
                      id: Date.now().toString(),
                      name: missingVariable,
                      description: "",
                      value: 0,
                      is_global: false,
                      variable_type: undefined,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    },
                  ]);
                }
              }}
            >
              Create Variable
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowMissingVariableDialog(false);
                // Optionally, trigger logic to remove the variable from all elements
                // (You may want to implement this logic as needed)
              }}
            >
              Delete Variable from Element
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
};

export default TradesAndElementsStep;
