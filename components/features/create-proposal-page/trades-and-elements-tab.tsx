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
  const queryClient = useQueryClient();

  const [showEditVariableDialog, setShowEditVariableDialog] = useState(false);
  const [currentVariableId, setCurrentVariableId] = useState<string | null>(
    null
  );
  const [editVariableName, setEditVariableName] = useState("");
  const [editVariableDescription, setEditVariableDescription] = useState("");
  const [editVariableValue, setEditVariableValue] = useState(0);
  const [editVariableType, setEditVariableType] = useState("");
  const [isUpdatingVariable, setIsUpdatingVariable] = useState(false);

  const [inlineEditingVariableId, setInlineEditingVariableId] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState<number>(0);

  const [newVarName, setNewVarName] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] =
    useState("");
  const variables = data.variables || [];

  const [tradeSearchQuery, setTradeSearchQuery] = useState("");
  const [isTradeSearchOpen, setIsTradeSearchOpen] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");
  const [newTradeDescription, setNewTradeDescription] = useState("");
  const trades = data.trades || [];

  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  const [templateProcessed, setTemplateProcessed] = useState(false);

  useEffect(() => {
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

  const { mutate: updateElementMutation, isPending: isUpdatingElement } =
    useMutation({
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

  const filteredElements =
    elementSearchQuery === ""
      ? []
      : Array.isArray(apiElements.data)
      ? (apiElements.data as ElementResponse[]).filter((element) => {
          const matchesQuery =
            element.name
              .toLowerCase()
              .includes(elementSearchQuery.toLowerCase()) &&
            element.origin === "original";

          const currentTrade = trades.find((t) => t.id === currentTradeId);

          const isAlreadyInTrade = currentTrade?.elements?.some(
            (e) => e.id === element.id.toString()
          );

          return matchesQuery && !isAlreadyInTrade;
        })
      : [];

  const filterVariableSuggestions = (
    input: string,
    prefix: string = ""
  ): VariableResponse[] => {
    if (!input || !prefix) return [];

    const lastSpaceIndex = input.lastIndexOf(prefix);
    if (lastSpaceIndex === -1) return [];

    const currentPartial = input
      .substring(lastSpaceIndex + prefix.length)
      .trim();
    if (!currentPartial) return [];

    return variables.filter((variable) =>
      variable.name.toLowerCase().includes(currentPartial.toLowerCase())
    );
  };

  const handleMaterialFormulaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewElementMaterialFormula(value);

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

    if (value.includes("{") && !value.endsWith("}")) {
      const suggestions = filterVariableSuggestions(value, "{");
      setLaborSuggestions(suggestions);
      setShowLaborSuggestions(suggestions.length > 0);
      setSelectedLaborSuggestion(0);

      const lastBraceIndex = value.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = value.substring(lastBraceIndex + 1).trim();

        if (
          partialVarName &&
          (e.nativeEvent as InputEvent).inputType === "insertLineBreak" &&
          suggestions.length === 0
        ) {
          setPendingVariableName(partialVarName);
          setFormulaFieldSource("labor");
          setNewVarName(partialVarName);
          setShowAddDialog(true);
          setShowLaborSuggestions(false);

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
    const lastOpenBrace = formula.lastIndexOf("{");
    if (lastOpenBrace === -1) return formula;

    return formula.substring(0, lastOpenBrace) + `{${variableName}}` + " ";
  };

  const handleMaterialFormulaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
      return;
    }

    if (
      e.key === "Enter" &&
      newElementMaterialFormula.includes("{") &&
      !newElementMaterialFormula.endsWith("}")
    ) {
      e.preventDefault();

      const lastBraceIndex = newElementMaterialFormula.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = newElementMaterialFormula
          .substring(lastBraceIndex + 1)
          .trim();

        if (
          partialVarName &&
          !variables.some(
            (v) => v.name.toLowerCase() === partialVarName.toLowerCase()
          )
        ) {
          setNewVarName(partialVarName);
          setFormulaFieldSource("material");
          setPendingVariableName(partialVarName);
          setShowAddDialog(true);
        }
      }
    }
  };

  const handleLaborFormulaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
      return;
    }

    if (
      e.key === "Enter" &&
      newElementLaborFormula.includes("{") &&
      !newElementLaborFormula.endsWith("}")
    ) {
      e.preventDefault();

      const lastBraceIndex = newElementLaborFormula.lastIndexOf("{");
      if (lastBraceIndex !== -1) {
        const partialVarName = newElementLaborFormula
          .substring(lastBraceIndex + 1)
          .trim();

        if (
          partialVarName &&
          !variables.some(
            (v) => v.name.toLowerCase() === partialVarName.toLowerCase()
          )
        ) {
          setNewVarName(partialVarName);
          setFormulaFieldSource("labor");
          setPendingVariableName(partialVarName);
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

      if (templateId) {
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

    if (templateId) {
      updateTemplateMutation({
        templateId: templateId,
        data: { variables: updatedVariables.map((v) => v.id) },
      });
    }
  };

  const isZeroOrEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'number') {
      return Math.abs(value) < 0.0001; // Handle potential floating point issues
    }
    if (typeof value === 'string') {
      const numValue = parseFloat(value);
      return !isNaN(numValue) && Math.abs(numValue) < 0.0001;
    }
    return false;
  };

  useEffect(() => {
    const zeroValueVariables = variables.filter(v => isZeroOrEmpty(v.value));
    if (zeroValueVariables.length > 0 && inlineEditingVariableId === null) {
      setInlineEditingVariableId("zero-values-ready");
    }
  }, [variables]);

  const startInlineValueEdit = (variable: VariableResponse) => {
    setInlineEditingVariableId(variable.id);
    setInlineEditValue(variable.value || 0);
  };

  const saveInlineValueEdit = (variableId: string, newValue: number) => {
    if (inlineEditingVariableId === "zero-values-ready") {
      if (variableId !== "zero-values-ready") {
        setInlineEditingVariableId(variableId);
      }
      return;
    }

    const variableToUpdate = variables.find(v => v.id === variableId);
    if (!variableToUpdate) return;

    setIsUpdatingVariable(true);

    const variableData = {
      name: variableToUpdate.name,
      description: variableToUpdate.description || undefined,
      value: newValue,
      variable_type: variableToUpdate.variable_type?.id || "",
    };

    const updatedVariables = variables.map((variable) => {
      if (variable.id === variableId) {
        return {
          ...variable,
          value: newValue
        };
      }
      return variable;
    });
    updateVariables(updatedVariables);

    const elementsToUpdate: { elementId: string; data: any }[] = [];
    trades.forEach((trade) => {
      if (trade.elements) {
        trade.elements.forEach((element) => {
          let needsUpdate = false;

          if (
            element.material_formula_variables &&
            element.material_formula_variables.some(
              (v) => v.id.toString() === variableId
            )
          ) {
            needsUpdate = true;
          }

          if (
            element.labor_formula_variables &&
            element.labor_formula_variables.some(
              (v) => v.id.toString() === variableId
            )
          ) {
            needsUpdate = true;
          }

          if (needsUpdate) {
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

    const variableElementsToUpdate = elementsToUpdate;

    updateVariableMutation({
      variableId: variableId,
      data: variableData,
    });

    setTimeout(() => {
      if (variableElementsToUpdate.length > 0) {
        variableElementsToUpdate.forEach(({ elementId, data }) => {
          updateElementMutation({
            elementId,
            data,
          });
        });

        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["elements"] });
          queryClient.invalidateQueries({ queryKey: ["trades"] });
          setIsUpdatingVariable(false);
        }, 2000);
      } else {
        setIsUpdatingVariable(false);
      }
    }, 1000);

    if (isZeroOrEmpty(newValue)) {
      setInlineEditingVariableId("zero-values-ready");
    } else {
      setInlineEditingVariableId(null);
    }
  };

  const cancelInlineValueEdit = () => {
    setInlineEditingVariableId(null);
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
      origin: "derived",
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
      origin: "derived",
      labor_cost_formula: laborFormula,
      markup: data.markup,
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

    const selectedVariableType = Array.isArray((apiVariableTypes as any)?.data)
      ? (apiVariableTypes as any).data.find(
          (type: any) => type.id.toString() === editVariableType
        )
      : null;

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

    updateVariables(updatedVariables);

    const elementsToUpdate: { elementId: string; data: any }[] = [];

    trades.forEach((trade) => {
      if (trade.elements) {
        trade.elements.forEach((element) => {
          let needsUpdate = false;

          if (
            element.material_formula_variables &&
            element.material_formula_variables.some(
              (v) => v.id.toString() === currentVariableId
            )
          ) {
            needsUpdate = true;
          }

          if (
            element.labor_formula_variables &&
            element.labor_formula_variables.some(
              (v) => v.id.toString() === currentVariableId
            )
          ) {
            needsUpdate = true;
          }

          if (needsUpdate) {
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

    const variableElementsToUpdate = elementsToUpdate;

    updateVariableMutation({
      variableId: currentVariableId,
      data: variableData,
    });

    setTimeout(() => {
      if (variableElementsToUpdate.length > 0) {
        variableElementsToUpdate.forEach(({ elementId, data }) => {
          updateElementMutation({
            elementId,
            data,
          });
        });

        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["elements"] });
          queryClient.invalidateQueries({ queryKey: ["trades"] });
          toast.success(`All elements updated with new variable value`);
          setIsUpdatingVariable(false);
        }, 2000);
      } else {
        setIsUpdatingVariable(false);
      }
    }, 1000);
  };

  const handleOpenEditDialog = (element: ElementResponse) => {
    setCurrentElementId(element.id);

    setNewElementName(element.name);
    setNewElementDescription(element.description || "");
    setElementMarkup(element.markup || 0);

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Proposal Variables & Trades</h2>
        <p className="text-muted-foreground mb-6">
          Define variables for your proposal and organize elements by trade.
        </p>

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
                      className="w-full pl-8 pr-4"
                    />
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
                          <Label htmlFor="var-name">Variable Name</Label>
                          <Input
                            id="var-name"
                            placeholder="Wall Length"
                            value={newVarName}
                            onChange={(e) => setNewVarName(e.target.value)}
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
                            <Select
                              value={newVarDefaultVariableType}
                              onValueChange={setNewVarDefaultVariableType}
                            >
                              <SelectTrigger className="w-full">
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
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="var-description">Description</Label>
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
                            if (newVarName.trim()) {
                              handleAddVariable();
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
                              {inlineEditingVariableId === variable.id || 
                               (isZeroOrEmpty(variable.value) && inlineEditingVariableId === "zero-values-ready") ? (
                                <div className="flex">
                                  <Input 
                                    type="number"
                                    value={inlineEditingVariableId === variable.id ? inlineEditValue : (variable.value || 0)}
                                    onChange={(e) => {
                                      if (inlineEditingVariableId === "zero-values-ready") {
                                        setInlineEditingVariableId(variable.id);
                                        setInlineEditValue(Number(e.target.value));
                                      } else {
                                        setInlineEditValue(Number(e.target.value));
                                      }
                                    }}
                                    onFocus={(e) => {
                                      if (inlineEditingVariableId === "zero-values-ready") {
                                        setInlineEditingVariableId(variable.id);
                                        setInlineEditValue(variable.value || 0);
                                      }
                                      // Auto-select all text for easy value replacement
                                      e.target.select();
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        saveInlineValueEdit(variable.id, inlineEditValue);
                                      } else if (e.key === 'Escape') {
                                        cancelInlineValueEdit();
                                      }
                                    }}
                                    onBlur={() => {
                                      if (inlineEditingVariableId === variable.id) {
                                        saveInlineValueEdit(variable.id, inlineEditValue);
                                      }
                                    }}
                                    placeholder="0"
                                    className="h-6 text-xs py-0 w-20"
                                    autoFocus={inlineEditingVariableId === variable.id}
                                  />
                                  <span className="text-xs ml-1 flex items-center">
                                    {variable.variable_type?.unit}
                                  </span>
                                </div>
                              ) : (
                                <span 
                                  className="text-xs cursor-pointer hover:bg-muted rounded px-1"
                                  onClick={() => {
                                    startInlineValueEdit(variable);
                                  }}
                                >
                                  {variable.value === null || variable.value === undefined ? "0" : variable.value} {variable.variable_type?.unit}
                                </span>
                              )}
                            </div>
                            <div className="absolute -top-2 -right-2 flex gap-1">
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
                      className="w-full pl-8 pr-4"
                    />
                    {isLoadingTrades && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

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
