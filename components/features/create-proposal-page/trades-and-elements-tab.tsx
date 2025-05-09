"use client";

import React, { useState, useEffect } from "react";
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
import AddElementDialog from "./add-element-dialog";
import EditElementDialog from "./edit-element-dialog";
import AddTradeDialog from "./add-trade-dialog";
import EditVariableDialog from "./edit-variable-dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getAllVariables } from "@/api/variables/get-all-variables";
import { getAllVariableTypes } from "@/api/variable-types/get-all-variable-types";
import { getAllTrades } from "@/api/trades/get-all-trades";
import { getAllElements } from "@/api/elements/get-all-elements";

import { createVariable } from "@/api/variables/create-variable";
import { updateVariable } from "@/api/variables/update-variable";
import { createTrade } from "@/api/trades/create-trade";
import { updateTrade } from "@/api/trades/update-trade";
import { createElement } from "@/api/elements/create-element";
import { updateElement } from "@/api/elements/update-element";
import { updateProposalTemplate } from "@/api/proposals/update-proposal-template";

import { VariableResponse, VariableUpdateRequest } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";
import { TradeResponse } from "@/types/trades/dto";

import { replaceVariableIdsWithNames } from "@/helpers/replace-variable-ids-with-names";
import { replaceVariableNamesWithIds } from "@/helpers/replace-variable-names-with-ids";
import { TemplateResponse } from "@/types/templates/dto";

interface TradesAndElementsStepProps {
  data: {
    trades: TradeResponse[];
    variables: VariableResponse[];
  };
  templateId: string | null;
  template: TemplateResponse | null;
  updateTrades: (trades: TradeResponse[]) => void;
  updateVariables?: (variables: VariableResponse[]) => void;
}

const TradesAndElementsStep: React.FC<TradesAndElementsStepProps> = ({
  data,
  templateId,
  template,
  updateTrades,
  updateVariables = () => {},
}) => {
  // Get query client for data refetching
  const queryClient = useQueryClient();

  // =========== STATE MANAGEMENT ===========

  // Variable-related state
  const [showEditVariableDialog, setShowEditVariableDialog] = useState(false);
  const [currentVariableId, setCurrentVariableId] = useState<string | null>(
    null
  );
  const [editVariableName, setEditVariableName] = useState("");
  const [editVariableDescription, setEditVariableDescription] = useState("");
  const [editVariableValue, setEditVariableValue] = useState(0);
  const [editVariableType, setEditVariableType] = useState("");
  const [isUpdatingVariable, setIsUpdatingVariable] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] =
    useState("");
  const variables = data.variables || [];

  // Trade-related state
  const [tradeSearchQuery, setTradeSearchQuery] = useState("");
  const [isTradeSearchOpen, setIsTradeSearchOpen] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");
  const trades = data.trades || [];

  // Template processing state
  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  const [templateProcessed, setTemplateProcessed] = useState(false);

  // Effect to load template trades and variables
  useEffect(() => {
    // Only process the template if it exists and hasn't been processed yet
    if (template && !templateProcessed) {
      setIsProcessingTemplate(true);
      setIsProcessingTemplate(false);
      setTemplateProcessed(true);
    }
  }, [
    template,
    templateProcessed,
    trades,
    variables,
    updateTrades,
    updateVariables,
  ]);

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
  const [newElementName, setNewElementName] = useState("");
  const [newElementDescription, setNewElementDescription] = useState("");
  const [newElementMaterialFormula, setNewElementMaterialFormula] =
    useState("");
  const [newElementLaborFormula, setNewElementLaborFormula] = useState("");
  const [elementMarkup, setElementMarkup] = useState<number>(0);

  // Formula autocomplete states
  const [materialSuggestions, setMaterialSuggestions] = useState<
    VariableResponse[]
  >([]);
  const [laborSuggestions, setLaborSuggestions] = useState<VariableResponse[]>(
    []
  );
  const [showMaterialSuggestions, setShowMaterialSuggestions] = useState(false);
  const [showLaborSuggestions, setShowLaborSuggestions] = useState(false);
  const [selectedMaterialSuggestion, setSelectedMaterialSuggestion] =
    useState<number>(0);
  const [selectedLaborSuggestion, setSelectedLaborSuggestion] =
    useState<number>(0);
  const [formulaFieldSource, setFormulaFieldSource] = useState<
    "material" | "labor" | null
  >(null);
  const [pendingVariableName, setPendingVariableName] = useState<string>("");

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: apiTrades = [],
    isLoading: isLoadingTrades,
    error: tradesError,
  } = useQuery({
    queryKey: ["trades"],
    queryFn: getAllTrades,
  });

  const {
    data: apiVariables = [],
    isLoading: isLoadingVariables,
    error: variableError,
  } = useQuery({
    queryKey: ["variables"],
    queryFn: getAllVariables,
  });

  const {
    data: apiVariableTypes = [],
    isLoading: isLoadingVariableTypes,
    error: variableTypesError,
  } = useQuery({
    queryKey: ["variable-types"],
    queryFn: getAllVariableTypes,
  });

  // Get all elements
  const {
    data: apiElements = [],
    isLoading: isLoadingElements,
    error: elementsError,
  } = useQuery({
    queryKey: ["elements"],
    queryFn: getAllElements,
  });

  const { mutate: createVariableMutation } = useMutation({
    mutationFn: createVariable,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdVariable = response.data;
        updateVariables([...variables, createdVariable]);
        if (formulaFieldSource === "material" && pendingVariableName) {
          const formula = newElementMaterialFormula;
          const lastBraceIndex = formula.lastIndexOf("{" + pendingVariableName);
          if (lastBraceIndex !== -1) {
            const newFormula =
              formula.substring(0, lastBraceIndex) +
              `{${createdVariable.name}}` +
              formula.substring(
                lastBraceIndex + pendingVariableName.length + 1
              );
            setNewElementMaterialFormula(newFormula);
          }
        } else if (formulaFieldSource === "labor" && pendingVariableName) {
          const formula = newElementLaborFormula;
          const lastBraceIndex = formula.lastIndexOf("{" + pendingVariableName);
          if (lastBraceIndex !== -1) {
            const newFormula =
              formula.substring(0, lastBraceIndex) +
              `{${createdVariable.name}}` +
              formula.substring(
                lastBraceIndex + pendingVariableName.length + 1
              );
            setNewElementLaborFormula(newFormula);
          }
        }

        setFormulaFieldSource(null);
        setPendingVariableName("");

        toast.success("Variable created successfully", {
          position: "top-center",
          description: `"${createdVariable.name}" has been added to your proposal.`,
        });

        setShowAddDialog(false);
        setNewVarName("");
        setNewVarDescription("");
        setNewVarDefaultValue(0);
        setNewVarDefaultVariableType("");
        setIsSubmitting(false);
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
    },
  });

  const { mutate: updateVariableMutation } = useMutation({
    mutationFn: ({
      variableId,
      data,
    }: {
      variableId: string;
      data: VariableUpdateRequest;
    }) => updateVariable(variableId, data),
    onSuccess: (response) => {
      toast.success("Variable updated successfully");
      setShowEditVariableDialog(false);
      setCurrentVariableId(null);
    },
    onError: (error) => {
      toast.error(`Error updating variable: ${error.message}`);
    },
  });

  const { mutate: createTradeMutation, isPending: isCreatingTrade } =
    useMutation({
      mutationFn: createTrade,
      onSuccess: (response) => {
        if (response && response.data) {
          const createdTrade = response.data;
          updateTrades([...trades, createdTrade]);
          toast.success("Trade created successfully", {
            position: "top-center",
            description: `"${createdTrade.name}" has been added to your proposal.`,
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

  const { mutate: updateTradeMutation, isPending: isUpdatingTrade } =
    useMutation({
      mutationFn: ({
        tradeId,
        data,
      }: {
        tradeId: string;
        data: { elements: string[] };
      }) => updateTrade(tradeId, data),
      onSuccess: () => {},
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

  // Template update mutation for updating the template when variables or trades change
  const { mutate: updateTemplateMutation, isPending: isUpdatingTemplate } =
    useMutation({
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
          description:
            "Template has been updated with the latest variables and trades.",
        });
      },
      onError: (error) => {
        toast.error("Failed to update template", {
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

          // Reset form and close dialog
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
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      },
    });

  const { mutate: createElementMutation, isPending: isCreatingElement } =
    useMutation({
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
            const currentTrade = trades.find(
              (trade) => trade.id === currentTradeId
            );
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
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      },
    });

  const filteredVariables =
    searchQuery === ""
      ? []
      : Array.isArray(apiVariables.data)
      ? (apiVariables.data as VariableResponse[]).filter(
          (variable) =>
            variable.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            variable.origin === "original"
        )
      : [];

  // Filtered trades for search results
  const filteredTrades =
    tradeSearchQuery === ""
      ? []
      : Array.isArray(apiTrades.data)
      ? (apiTrades.data as TradeResponse[]).filter(
          (trade) =>
            trade.name.toLowerCase().includes(tradeSearchQuery.toLowerCase()) &&
            !trades.some((t) => t.id === trade.id.toString()) &&
            trade.origin === "original"
        )
      : [];

  // Filtered elements for search results
  const filteredElements =
    elementSearchQuery === ""
      ? []
      : Array.isArray(apiElements.data)
      ? (apiElements.data as ElementResponse[]).filter((element) => {
          // Check if the element matches the search query
          const matchesQuery =
            element.name
              .toLowerCase()
              .includes(elementSearchQuery.toLowerCase()) &&
            element.origin === "original";

          // Find the current trade
          const currentTrade = trades.find((t) => t.id === currentTradeId);

          // Check if the element is already in the trade
          const isAlreadyInTrade = currentTrade?.elements?.some(
            (e) => e.id === element.id.toString()
          );

          return matchesQuery && !isAlreadyInTrade;
        })
      : [];

  // Helper functions for formula autocomplete
  const filterVariableSuggestions = (
    input: string,
    prefix: string = ""
  ): VariableResponse[] => {
    if (!input || !prefix) return [];

    // Find the current word being typed after the last space
    const lastSpaceIndex = input.lastIndexOf(prefix);
    if (lastSpaceIndex === -1) return [];

    // Get current partial variable name being typed
    const currentPartial = input
      .substring(lastSpaceIndex + prefix.length)
      .trim();
    if (!currentPartial) return [];

    // Filter variables that match the partial input
    return variables.filter((variable) =>
      variable.name.toLowerCase().includes(currentPartial.toLowerCase())
    );
  };

  const handleMaterialFormulaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewElementMaterialFormula(value);

    // Check if we're typing a variable reference
    if (value.includes("{") && !value.endsWith("}")) {
      const suggestions = filterVariableSuggestions(value, "{");
      setMaterialSuggestions(suggestions);
      setShowMaterialSuggestions(suggestions.length > 0);
      setSelectedMaterialSuggestion(0);
    } else {
      setShowMaterialSuggestions(false);
    }
  };

  const handleLaborFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewElementLaborFormula(value);

    // Check if we're typing a variable reference
    if (value.includes("{") && !value.endsWith("}")) {
      const suggestions = filterVariableSuggestions(value, "{");
      setLaborSuggestions(suggestions);
      setShowLaborSuggestions(suggestions.length > 0);
      setSelectedLaborSuggestion(0);

      // Extract what the user is typing as a potential variable name
      const lastBraceIndex = value.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = value.substring(lastBraceIndex + 1).trim();

        // If user has typed something meaningful and pressed Enter with no matches
        if (
          partialVarName &&
          (e.nativeEvent as InputEvent).inputType === "insertLineBreak" &&
          suggestions.length === 0
        ) {
          // Open the add variable dialog with the partial variable name
          setPendingVariableName(partialVarName);
          setFormulaFieldSource("labor");
          setNewVarName(partialVarName);
          setShowAddDialog(true);
          setShowLaborSuggestions(false);

          // Prevent adding the newline character to the formula
          setNewElementLaborFormula(value.replace(/\n/g, ""));
        }
      }
    } else {
      setShowLaborSuggestions(false);
    }
  };

  const insertVariableInFormula = (
    formula: string,
    variableName: string
  ): string => {
    // Find the last opening brace to replace everything from there to cursor with the variable name
    const lastOpenBrace = formula.lastIndexOf("{");
    if (lastOpenBrace === -1) return formula;

    return formula.substring(0, lastOpenBrace) + `{${variableName}}` + " ";
  };

  const handleMaterialFormulaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // If we have suggestions, handle keyboard navigation
    if (showMaterialSuggestions && materialSuggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedMaterialSuggestion((prev) =>
            prev < materialSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedMaterialSuggestion((prev) =>
            prev > 0 ? prev - 1 : materialSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (materialSuggestions[selectedMaterialSuggestion]) {
            const selectedVar = materialSuggestions[selectedMaterialSuggestion];
            setNewElementMaterialFormula((prev) =>
              insertVariableInFormula(prev, selectedVar.name)
            );
            setShowMaterialSuggestions(false);
          }
          break;
        case "Escape":
          setShowMaterialSuggestions(false);
          break;
      }
      return; // Exit early if we're handling suggestions
    }

    // Handle creating a new variable when Enter is pressed while typing in braces
    if (
      e.key === "Enter" &&
      newElementMaterialFormula.includes("{") &&
      !newElementMaterialFormula.endsWith("}")
    ) {
      e.preventDefault();

      // Extract variable name being typed
      const lastBraceIndex = newElementMaterialFormula.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = newElementMaterialFormula
          .substring(lastBraceIndex + 1)
          .trim();

        // If there's a name typed and it doesn't match existing variables
        if (
          partialVarName &&
          !variables.some(
            (v) => v.name.toLowerCase() === partialVarName.toLowerCase()
          )
        ) {
          // Set the variable name in the add dialog
          setNewVarName(partialVarName);
          // Track which formula field triggered the dialog
          setFormulaFieldSource("material");
          setPendingVariableName(partialVarName);
          // Open the dialog
          setShowAddDialog(true);
        }
      }
    }
  };

  const handleLaborFormulaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // If we have suggestions, handle keyboard navigation
    if (showLaborSuggestions && laborSuggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedLaborSuggestion((prev) =>
            prev < laborSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedLaborSuggestion((prev) =>
            prev > 0 ? prev - 1 : laborSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (laborSuggestions[selectedLaborSuggestion]) {
            const selectedVar = laborSuggestions[selectedLaborSuggestion];
            setNewElementLaborFormula((prev) =>
              insertVariableInFormula(prev, selectedVar.name)
            );
            setShowLaborSuggestions(false);
          }
          break;
        case "Escape":
          setShowLaborSuggestions(false);
          break;
      }
      return; // Exit early if we're handling suggestions
    }

    // Handle creating a new variable when Enter is pressed while typing in braces
    if (
      e.key === "Enter" &&
      newElementLaborFormula.includes("{") &&
      !newElementLaborFormula.endsWith("}")
    ) {
      e.preventDefault();

      // Extract variable name being typed
      const lastBraceIndex = newElementLaborFormula.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = newElementLaborFormula
          .substring(lastBraceIndex + 1)
          .trim();

        // If there's a name typed and it doesn't match existing variables
        if (
          partialVarName &&
          !variables.some(
            (v) => v.name.toLowerCase() === partialVarName.toLowerCase()
          )
        ) {
          // Set the variable name in the add dialog
          setNewVarName(partialVarName);
          // Track which formula field triggered the dialog
          setFormulaFieldSource("labor");
          setPendingVariableName(partialVarName);
          // Open the dialog
          setShowAddDialog(true);
        }
      }
    }
  };

  const handleSelectVariable = (variable: VariableResponse) => {
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

    if (!variables.some((v) => v.id === newVar.id)) {
      const updatedVariables = [...variables, newVar];
      updateVariables(updatedVariables);

      // If template exists and we're adding a variable, update the template variables
      if (templateId) {
        // Update the template with the new variable
        updateTemplateMutation({
          templateId: templateId,
          data: { variables: updatedVariables.map((v) => v.id) },
        });
      }
    }

    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleAddVariable = () => {
    if (!newVarName.trim()) return;
    const variableData = {
      name: newVarName.trim(),
      description: newVarDescription.trim() || undefined,
      origin: "derived",
      value: newVarDefaultValue,
      is_global: false,
      variable_type: newVarDefaultVariableType,
    };
    setIsSubmitting(true);
    createVariableMutation(variableData);
  };

  const handleRemoveVariable = (variableId: string) => {
    const updatedVariables = variables.filter((v) => v.id !== variableId);
    updateVariables(updatedVariables);

    // If template exists, update the template's variables
    if (templateId) {
      // Update the template with the reduced variable list
      updateTemplateMutation({
        templateId: templateId,
        data: { variables: updatedVariables.map((v) => v.id) },
      });
    }
  };

  // Trade handling functions
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

  // Function to handle adding a new trade manually
  const handleAddTrade = () => {
    if (!newTradeName.trim()) return;

    // Create trade data according to TradeCreateRequest format
    const tradeData = {
      name: newTradeName.trim(),
      description: newTradeDescription.trim() || undefined,
      origin: "derived",
      // No elements included as requested
    };

    // Call the mutation to create the trade in the backend
    createTradeMutation(tradeData);

    // Success handling is done in the mutation's onSuccess callback
  };

  // Element handling functions
  const handleSelectElement = (element: ElementResponse, tradeId: string) => {
    // Find the trade to add this element to
    const updatedTrades = trades.map((trade) => {
      if (trade.id === tradeId) {
        // Add the element to this trade if not already present
        if (!trade.elements?.some((e) => e.id === element.id.toString())) {
          return {
            ...trade,
            elements: [...(trade.elements || []), element],
          };
        }
      }
      return trade;
    });

    // Update trades state for immediate UI feedback
    updateTrades(updatedTrades);

    // Update the backend through trade mutation
    // Find the updated trade with the new element
    const updatedTrade = updatedTrades.find((trade) => trade.id === tradeId);
    if (updatedTrade && updatedTrade.elements) {
      // Get all element IDs
      const elementIds = updatedTrade.elements.map((elem) => elem.id);

      // Call update trade mutation
      updateTradeMutation({
        tradeId: tradeId,
        data: { elements: elementIds },
      });
    }

    // Reset search state
    setIsElementSearchOpen(false);

    // Clear both the global search query and the trade-specific search query
    setElementSearchQuery("");
    setElementSearchQueries((prev) => ({
      ...prev,
      [tradeId]: "",
    }));
  };

  const handleRemoveElement = (elementId: string, tradeId: string) => {
    // Find the trade and remove the element from it
    const updatedTrades = trades.map((trade) => {
      if (trade.id === tradeId) {
        return {
          ...trade,
          elements: (trade.elements || []).filter((e) => e.id !== elementId),
        };
      }
      return trade;
    });

    // Update trades state for immediate UI feedback
    updateTrades(updatedTrades);

    // Update the backend through trade mutation
    // Find the updated trade with the element removed
    const updatedTrade = updatedTrades.find((trade) => trade.id === tradeId);
    if (updatedTrade) {
      // Get all remaining element IDs
      const elementIds = updatedTrade.elements?.map((elem) => elem.id) || [];

      // Call update trade mutation
      updateTradeMutation({
        tradeId: tradeId,
        data: { elements: elementIds },
      });
    }
  };

  const handleAddElement = () => {
    if (!newElementName.trim() || !currentTradeId) return;

    // Convert formula variable names to IDs for backend submission
    const materialFormula = newElementMaterialFormula.trim()
      ? replaceVariableNamesWithIds(newElementMaterialFormula.trim(), variables)
      : undefined;

    const laborFormula = newElementLaborFormula.trim()
      ? replaceVariableNamesWithIds(newElementLaborFormula.trim(), variables)
      : undefined;

    // Prepare element data with ID-based formulas
    const elementData = {
      name: newElementName.trim(),
      description: newElementDescription.trim() || undefined,
      material_cost_formula: materialFormula,
      origin: "derived",
      labor_cost_formula: laborFormula,
    };

    // Create the element
    createElementMutation(elementData);

    // Success handling is done in the mutation's onSuccess callback
  };

  const handleEditElement = () => {
    if (!newElementName.trim() || !currentElementId) return;

    // Convert formula variable names to IDs for backend submission
    const materialFormula = newElementMaterialFormula.trim()
      ? replaceVariableNamesWithIds(newElementMaterialFormula.trim(), variables)
      : undefined;

    const laborFormula = newElementLaborFormula.trim()
      ? replaceVariableNamesWithIds(newElementLaborFormula.trim(), variables)
      : undefined;

    // Prepare element data with ID-based formulas
    const elementData = {
      name: newElementName.trim(),
      description: newElementDescription.trim() || undefined,
      material_cost_formula: materialFormula,
      labor_cost_formula: laborFormula,
      markup: elementMarkup,
    };

    // Update the element
    updateElementMutation({
      elementId: currentElementId,
      data: elementData,
    });

    // Success handling is done in the mutation's onSuccess callback
  };

  const handleOpenEditVariableDialog = (variable: VariableResponse) => {
    setCurrentVariableId(variable.id);
    setEditVariableName(variable.name);
    setEditVariableDescription(variable.description || "");
    setEditVariableValue(variable.value || 0);
    setEditVariableType(variable.variable_type?.id || "");
    setShowEditVariableDialog(true);
  };

  const handleEditVariable = () => {
    if (!editVariableName.trim() || !currentVariableId) return;

    setIsUpdatingVariable(true);

    const variableData = {
      name: editVariableName.trim(),
      description: editVariableDescription.trim() || undefined,
      value: editVariableValue,
      variable_type: editVariableType,
    };

    // Find the selected variable type from the API data
    const selectedVariableType = Array.isArray((apiVariableTypes as any)?.data)
      ? (apiVariableTypes as any).data.find(
          (type: any) => type.id.toString() === editVariableType
        )
      : null;

    // Update local state immediately to provide instant UI feedback
    const updatedVariables = variables.map((variable) => {
      if (variable.id === currentVariableId) {
        return {
          ...variable,
          name: editVariableName.trim(),
          description: editVariableDescription.trim() || "",
          value: editVariableValue,
          variable_type: selectedVariableType || variable.variable_type,
        } as VariableResponse;
      }
      return variable;
    });

    // Update the parent component's state
    updateVariables(updatedVariables);

    // Find and update all elements that use this variable in their formulas
    const elementsToUpdate: { elementId: string; data: any }[] = [];

    trades.forEach((trade) => {
      if (trade.elements) {
        trade.elements.forEach((element) => {
          let needsUpdate = false;

          // Check if this variable is used in material cost formula
          if (
            element.material_formula_variables &&
            element.material_formula_variables.some(
              (v) => v.id.toString() === currentVariableId
            )
          ) {
            needsUpdate = true;
          }

          // Check if this variable is used in labor cost formula
          if (
            element.labor_formula_variables &&
            element.labor_formula_variables.some(
              (v) => v.id.toString() === currentVariableId
            )
          ) {
            needsUpdate = true;
          }

          if (needsUpdate) {
            // Use the existing formulas to trigger a recalculation
            elementsToUpdate.push({
              elementId: element.id,
              data: {
                material_cost_formula: element.material_cost_formula,
                labor_cost_formula: element.labor_cost_formula,
              },
            });
          }
        });
      }
    });

    // Store the elements to update in a variable that will be accessible in the onSuccess callback
    const variableElementsToUpdate = elementsToUpdate;

    // Send variable update to server first
    updateVariableMutation({
      variableId: currentVariableId,
      data: variableData,
    });

    // We'll use a setTimeout to ensure the variable update completes before updating elements
    // This ensures proper ordering of updates without needing to modify the mutation function
    setTimeout(() => {
      // Update all affected elements after the variable update is processed
      if (variableElementsToUpdate.length > 0) {
        // Update each element one by one
        variableElementsToUpdate.forEach(({ elementId, data }) => {
          updateElementMutation({
            elementId,
            data,
          });
        });

        // Add another timeout to refresh the data after all elements are updated
        setTimeout(() => {
          // Invalidate both elements and trades queries to refetch fresh data
          queryClient.invalidateQueries({ queryKey: ["elements"] });
          queryClient.invalidateQueries({ queryKey: ["trades"] });
          toast.success(`All elements updated with new variable value`);
          setIsUpdatingVariable(false);
        }, 2000); // Wait for element updates to complete
      } else {
        setIsUpdatingVariable(false);
      }
    }, 1000); // 1 second delay to ensure variable update completes first
  };

  const handleOpenEditDialog = (element: ElementResponse) => {
    // Set the current element ID
    setCurrentElementId(element.id);

    // Pre-fill the form with the element's data
    setNewElementName(element.name);
    setNewElementDescription(element.description || "");
    setElementMarkup(element.markup || 0);

    // Convert formula IDs back to names for display
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

    // Open the edit dialog
    setShowEditElementDialog(true);
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Proposal Variables & Trades</h2>
        <p className="text-muted-foreground mb-6">
          Define variables for your proposal and organize elements by trade.
        </p>

        {/* Template loading indicator */}
        {isProcessingTemplate && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-muted rounded-md text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading template data...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Variable className="mr-2 h-5 w-5" />
                <span>Proposal Variables</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="relative w-full mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search variables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (
                          searchQuery.trim() &&
                          filteredVariables.length > 0
                        ) {
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
                          } else if (filteredVariables.length > 0) {
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
                    {isLoadingVariables && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {searchQuery.trim() && filteredVariables.length > 0 && (
                    <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground mb-1 px-2">
                          Variables
                        </p>
                        {filteredVariables.map((variable) => (
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
                        ))}
                      </div>
                    </div>
                  )}

                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <BracesIcon className="mr-2 h-4 w-4" />
                          Add Proposal Variable
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="var-name">
                            Variable Name<span className="text-red-500">*</span>
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
                            <p className="text-red-500 text-xs mt-1">
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
                            Description{" "}
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
                            if (validateVariableForm()) {
                              handleAddVariable();
                            } else {
                              setVariableTouched({
                                name: true,
                                variable_type: true,
                              });
                            }
                          }}
                          disabled={isSubmitting}
                          type="submit"
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    Variables ({variables.length})
                  </h3>

                  <ScrollArea className="h-[750px] pr-4 -mr-4">
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
                            <div className="flex items-center mt-1">
                              <span className="text-xs font-medium mr-1">
                                Value:
                              </span>
                              <span className="text-xs">
                                {variable.value} {variable.variable_type?.unit}
                              </span>
                            </div>
                            <div className="absolute -top-2 -right-2 flex gap-1">
                              {/* Edit variable button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-primary hover:text-primary/80"
                                onClick={() =>
                                  handleOpenEditVariableDialog(variable)
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
                              {/* Remove variable button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-destructive hover:text-destructive/80"
                                onClick={() =>
                                  handleRemoveVariable(variable.id)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
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

        {/* Right Column: Trades (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BracesIcon className="mr-2 h-5 w-5" />
                <span>Proposal Trades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="relative w-full mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trades..."
                      value={tradeSearchQuery}
                      onChange={(e) => setTradeSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (
                          tradeSearchQuery.trim() &&
                          filteredTrades.length > 0
                        ) {
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
                    {isLoadingTrades && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Trade search results dropdown */}
                  {tradeSearchQuery.trim() && filteredTrades.length > 0 && (
                    <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground mb-1 px-2">
                          Trades
                        </p>
                        {filteredTrades.map((trade) => (
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
                        ))}
                      </div>
                    </div>
                  )}
                  <EditVariableDialog
                    open={showEditVariableDialog}
                    onOpenChange={setShowEditVariableDialog}
                    onEditVariable={handleEditVariable}
                    variableId={currentVariableId || ""}
                    variableName={editVariableName}
                    setVariableName={setEditVariableName}
                    variableDescription={editVariableDescription}
                    setVariableDescription={setEditVariableDescription}
                    variableValue={editVariableValue}
                    setVariableValue={setEditVariableValue}
                    variableType={editVariableType}
                    setVariableType={setEditVariableType}
                    variableTypes={
                      Array.isArray((apiVariableTypes as any)?.data)
                        ? (apiVariableTypes as any).data
                        : []
                    }
                    isLoadingVariableTypes={isLoadingVariableTypes}
                    isUpdating={isUpdatingVariable}
                    onCancel={() => {
                      setShowEditVariableDialog(false);
                      setCurrentVariableId(null);
                    }}
                  />
                  {/* Dialog for adding a new trade */}
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

                  {/* Dialog for adding a new element */}
                  <AddElementDialog
                    open={showAddElementDialog}
                    onOpenChange={setShowAddElementDialog}
                    onAddElement={handleAddElement}
                    newElementName={newElementName}
                    setNewElementName={setNewElementName}
                    newElementDescription={newElementDescription}
                    setNewElementDescription={setNewElementDescription}
                    newElementMaterialFormula={newElementMaterialFormula}
                    setNewElementMaterialFormula={setNewElementMaterialFormula}
                    newElementLaborFormula={newElementLaborFormula}
                    setNewElementLaborFormula={setNewElementLaborFormula}
                    handleMaterialFormulaChange={handleMaterialFormulaChange}
                    handleLaborFormulaChange={handleLaborFormulaChange}
                    handleMaterialFormulaKeyDown={handleMaterialFormulaKeyDown}
                    handleLaborFormulaKeyDown={handleLaborFormulaKeyDown}
                    showMaterialSuggestions={showMaterialSuggestions}
                    materialSuggestions={materialSuggestions}
                    selectedMaterialSuggestion={selectedMaterialSuggestion}
                    showLaborSuggestions={showLaborSuggestions}
                    laborSuggestions={laborSuggestions}
                    selectedLaborSuggestion={selectedLaborSuggestion}
                    isCreatingElement={isCreatingElement}
                    insertVariableInFormula={insertVariableInFormula}
                  />

                  {/* Dialog for editing an element */}
                  <EditElementDialog
                    open={showEditElementDialog}
                    onOpenChange={setShowEditElementDialog}
                    onEditElement={handleEditElement}
                    newElementName={newElementName}
                    setNewElementName={setNewElementName}
                    newElementDescription={newElementDescription}
                    setNewElementDescription={setNewElementDescription}
                    newElementMaterialFormula={newElementMaterialFormula}
                    setNewElementMaterialFormula={setNewElementMaterialFormula}
                    newElementLaborFormula={newElementLaborFormula}
                    setNewElementLaborFormula={setNewElementLaborFormula}
                    elementMarkup={elementMarkup}
                    setElementMarkup={setElementMarkup}
                    handleMaterialFormulaChange={handleMaterialFormulaChange}
                    handleLaborFormulaChange={handleLaborFormulaChange}
                    handleMaterialFormulaKeyDown={handleMaterialFormulaKeyDown}
                    handleLaborFormulaKeyDown={handleLaborFormulaKeyDown}
                    showMaterialSuggestions={showMaterialSuggestions}
                    setShowMaterialSuggestions={setShowMaterialSuggestions}
                    materialSuggestions={materialSuggestions}
                    selectedMaterialSuggestion={selectedMaterialSuggestion}
                    showLaborSuggestions={showLaborSuggestions}
                    setShowLaborSuggestions={setShowLaborSuggestions}
                    laborSuggestions={laborSuggestions}
                    selectedLaborSuggestion={selectedLaborSuggestion}
                    isUpdatingElement={isUpdatingElement}
                    insertVariableInFormula={insertVariableInFormula}
                    onCancel={() => {
                      setShowEditElementDialog(false);
                      setCurrentElementId(null);
                    }}
                  />
                </div>

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
                            </div>
                          </div>
                          {trade.description && (
                            <div className="text-xs mt-1 mb-2 line-clamp-1">
                              {trade.description}
                            </div>
                          )}

                          {trade.elements ? (
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
                                    value={elementSearchQueries[trade.id] || ""}
                                    onChange={(e) => {
                                      setCurrentTradeId(trade.id);
                                      setElementSearchQueries((prev) => ({
                                        ...prev,
                                        [trade.id]: e.target.value,
                                      }));
                                      // Also update the global query for filter function compatibility
                                      setElementSearchQuery(e.target.value);
                                    }}
                                    onFocus={() => {
                                      setCurrentTradeId(trade.id);
                                      const tradeQuery =
                                        elementSearchQueries[trade.id] || "";
                                      setElementSearchQuery(tradeQuery);
                                      if (
                                        tradeQuery.trim() &&
                                        filteredElements.length > 0
                                      ) {
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
                                          elementSearchQueries[trade.id] || "";
                                        if (
                                          filteredElements.length === 0 ||
                                          !tradeQuery.trim()
                                        ) {
                                          setIsElementSearchOpen(false);
                                          setShowAddElementDialog(true);
                                          setCurrentTradeId(trade.id);
                                          setNewElementName(tradeQuery.trim());
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
                                    className="w-full pl-7 pr-4 h-8 text-xs"
                                  />
                                  {elementSearchQueries[trade.id] && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setElementSearchQueries((prev) => ({
                                          ...prev,
                                          [trade.id]: "",
                                        }))
                                      }
                                      className="absolute right-2 top-2.5 flex items-center focus:outline-none"
                                      tabIndex={-1}
                                      aria-label="Clear element search"
                                    >
                                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                    </button>
                                  )}
                                  {isLoadingElements && (
                                    <div className="absolute right-2 top-2">
                                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {(
                                  elementSearchQueries[trade.id] || ""
                                ).trim() &&
                                  currentTradeId === trade.id && (
                                    <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                                      <div className="p-2">
                                        <p className="text-xs text-muted-foreground mb-1 px-2">
                                          Elements
                                        </p>
                                        {filteredElements.map((element) => (
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
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              <div className="space-y-2">
                                {trade.elements.map((element) => (
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
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs font-semibold">
                                                    Material Cost Formula:
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
                                                {element.material_cost !==
                                                  undefined && (
                                                  <div className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">
                                                    = $
                                                    {Number(
                                                      element.material_cost
                                                    ).toFixed(2)}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {element.labor_cost_formula && (
                                            <div className="mt-2 flex flex-col">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs font-semibold">
                                                    Labor Cost Formula:
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
                                                {element.labor_cost !==
                                                  undefined && (
                                                  <div className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded text-primary">
                                                    = $
                                                    {Number(
                                                      element.labor_cost
                                                    ).toFixed(2)}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Display element markup */}
                                          {element.markup !== undefined && (
                                            <div className="mt-2 flex flex-col">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs font-semibold">
                                                    Markup:
                                                  </span>
                                                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                    {element.markup}%
                                                  </code>
                                                </div>
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
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground mt-3 border-t pt-2">
                              No elements in this trade
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 bg-muted/80 text-destructive hover:text-destructive/80"
                            onClick={() => handleRemoveTrade(trade.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
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
    </div>
  );
};

export default TradesAndElementsStep;
