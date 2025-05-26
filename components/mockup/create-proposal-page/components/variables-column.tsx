"use client";

import React, { useState } from "react";
import {
  Button,
  Label,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shared";
import { toast } from "sonner";
import { X, BracesIcon, Variable, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllVariables } from "@/api/variables/get-all-variables";
import { getAllVariableTypes } from "@/api/variable-types/get-all-variable-types";
import { createVariable } from "@/api/variables/create-variable";
import { updateVariable } from "@/api/variables/update-variable";
import { getVariables } from "@/query-options/variables";
import { VariableResponse, VariableUpdateRequest } from "@/types/variables/dto";
import EditVariableDialog from "../edit-variable-dialog";

interface VariablesColumnProps {
  variables: VariableResponse[];
  updateVariables: (variables: VariableResponse[]) => void;
}

const calculateFormulaValue = (formula: string, variables: VariableResponse[]): number | null => {
  if (!formula) return null;

  try {
    const variableValues: Record<string, number> = {};
    variables.forEach(variable => {
      if (variable.id) {
        variableValues[variable.id] = variable.value || 0;
      }
    });

    let evalFormula = formula;
    const matches = formula.match(/\{([^}]+)\}/g) || [];
    
    for (const match of matches) {
      const variableId = match.slice(1, -1);
      const variableValue = variableValues[variableId];
      
      if (variableValue !== undefined) {
        evalFormula = evalFormula.replace(match, variableValue.toString());
      } else {
        evalFormula = evalFormula.replace(match, "0");
      }
    }
    
    evalFormula = evalFormula.replace(/\*/g, '*').replace(/\//g, '/');
    
    const result = new Function(`return ${evalFormula}`)();
    return typeof result === 'number' ? result : null;
  } catch (error) {
    console.error("Error calculating formula value:", error);
    return null;
  }
};

export const VariablesColumn: React.FC<VariablesColumnProps> = ({
  variables,
  updateVariables,
}) => {
  const queryClient = useQueryClient();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const [newVarDefaultValue, setNewVarDefaultValue] = useState(0);
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarDefaultVariableType, setNewVarDefaultVariableType] = useState("");

  // Edit variable state
  const [showEditVariableDialog, setShowEditVariableDialog] = useState(false);
  const [currentVariableId, setCurrentVariableId] = useState<string | null>(null);
  const [editVariableName, setEditVariableName] = useState("");
  const [editVariableDescription, setEditVariableDescription] = useState("");
  const [editVariableValue, setEditVariableValue] = useState(0);
  const [editVariableType, setEditVariableType] = useState("");
  const [editVariableFormula, setEditVariableFormula] = useState("");
  const [isUpdatingVariable, setIsUpdatingVariable] = useState(false);

  // Inline editing state
  const [inlineEditingVariableId, setInlineEditingVariableId] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState<number>(0);

  // Queries
  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables()
  );

  const { data: apiVariableTypes, isLoading: isLoadingVariableTypes } = useQuery({
    queryKey: ["variable-types"],
    queryFn: getAllVariableTypes,
  });

  // Mutations
  const { mutate: createVariableMutation, isPending: isCreatingVariable } = useMutation({
    mutationFn: createVariable,
    onSuccess: (response) => {
      if (response && response.data) {
        const createdVariable = response.data;
        updateVariables([...variables, createdVariable]);
        
        toast.success("Variable created successfully", {
          position: "top-center",
          description: `"${createdVariable.name}" has been added.`,
        });
        
        setShowAddDialog(false);
        setNewVarName("");
        setNewVarDefaultValue(0);
        setNewVarDescription("");
        setNewVarDefaultVariableType("");
      }
    },
    onError: (error) => {
      toast.error("Failed to create variable", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  const { mutate: updateVariableMutation } = useMutation({
    mutationFn: ({ variableId, data }: { variableId: string; data: VariableUpdateRequest }) =>
      updateVariable(variableId, data),
    onSuccess: (response) => {
      if (response && response.data) {
        const updatedVariable = response.data;
        const updatedVariables = variables.map((variable) =>
          variable.id === updatedVariable.id ? updatedVariable : variable
        );
        updateVariables(updatedVariables);
        
        queryClient.invalidateQueries({ queryKey: ["variables"] });
        
        toast.success("Variable updated successfully", {
          position: "top-center",
          description: `"${updatedVariable.name}" has been updated.`,
        });
      }
      setIsUpdatingVariable(false);
    },
    onError: (error) => {
      setIsUpdatingVariable(false);
      toast.error("Failed to update variable", {
        position: "top-center",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
  });

  // Computed values
  const updateVariableWithFormulaValue = (variable: VariableResponse): VariableResponse => {
    if (variable.formula) {
      const calculatedValue = calculateFormulaValue(variable.formula, variables);
      return {
        ...variable,
        value: calculatedValue || variable.value
      };
    }
    return variable;
  };

  const filteredVariables = searchQuery.trim()
    ? variables.filter((variable) =>
        variable.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Event handlers
  const handleSelectVariable = (variable: VariableResponse) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    // Additional logic for variable selection can be added here
  };

  const handleAddVariable = () => {
    if (!newVarName.trim()) return;

    const variableData = {
      name: newVarName.trim(),
      description: newVarDescription.trim() || undefined,
      value: newVarDefaultValue,
      variable_type: newVarDefaultVariableType || undefined,
    };

    createVariableMutation(variableData);
  };

  const handleOpenEditVariableDialog = (variable: VariableResponse) => {
    setCurrentVariableId(variable.id);
    setEditVariableName(variable.name);
    setEditVariableDescription(variable.description || "");
    setEditVariableValue(variable.value || 0);
    setEditVariableType(variable.variable_type?.id || "");
    setEditVariableFormula(variable.formula || "");
    setShowEditVariableDialog(true);
  };

  const handleEditVariable = () => {
    if (!editVariableName.trim() || !currentVariableId) return;

    setIsUpdatingVariable(true);
    
    let processedFormula = editVariableFormula;
    if (editVariableFormula) {
      const namePattern = /\{([^{}]+)\}/g;
      processedFormula = editVariableFormula.replace(namePattern, (match, variableName) => {
        const exactIdMatch = variables.find(v => v.id === variableName);
        if (exactIdMatch) return match;
        
        const variable = variables.find(v => v.name === variableName);
        return variable ? `{${variable.id}}` : match;
      });
    }

    const variableData = {
      name: editVariableName.trim(),
      description: editVariableDescription.trim() || undefined,
      value: processedFormula ? undefined : editVariableValue,
      formula: processedFormula || undefined,
      variable_type: editVariableType || undefined,
    };

    updateVariableMutation({
      variableId: currentVariableId,
      data: variableData,
    });

    setShowEditVariableDialog(false);
    setCurrentVariableId(null);
  };

  const startInlineEdit = (variable: VariableResponse) => {
    setInlineEditingVariableId(variable.id);
    setInlineEditValue(variable.value || 0);
  };

  const saveInlineEdit = (variableId: string) => {
    const variableData = {
      value: inlineEditValue,
    };

    updateVariableMutation({
      variableId,
      data: variableData,
    });

    setInlineEditingVariableId(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditingVariableId(null);
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div>
        <div className="pb-3">
          <div className="text-lg flex font-bold items-center">
            <Variable size={18} className="mr-1" />
            <span>Variables</span>
          </div>
        </div>
        
        <div>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="relative w-full mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search variables..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      setIsSearchOpen(true);
                    } else {
                      setIsSearchOpen(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearchOpen(false), 200);
                  }}
                  onClick={() => {
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
                      } else if (filteredVariables.length > 0) {
                        handleSelectVariable(filteredVariables[0]);
                      }
                    }
                  }}
                  className="w-full pl-8 pr-4"
                />
                {variablesLoading && (
                  <div className="absolute right-2 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.trim() && isSearchOpen && (
                <div className="absolute z-10 w-full border rounded-md bg-background shadow-md">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-1 px-2">
                      Variables
                    </p>
                    {filteredVariables.length > 0 ? (
                      filteredVariables.map((variable) => (
                        <div
                          key={variable.id}
                          className="flex items-center justify-between w-full p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => handleSelectVariable(variable)}
                        >
                          <span>{variable.name}</span>
                          {variable.value !== undefined && (
                            <span className="text-muted-foreground">
                              {variable.value}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm">
                        {variables.some((v) =>
                          v.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ) ? (
                          <span>No matching variables found</span>
                        ) : (
                          <span>Press Enter to create "{searchQuery}"</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add Variable Dialog */}
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
                      <Label htmlFor="var-value">Default Value</Label>
                      <Input
                        id="var-value"
                        type="number"
                        placeholder="0"
                        value={newVarDefaultValue}
                        onChange={(e) => setNewVarDefaultValue(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="var-description">Description</Label>
                      <Textarea
                        id="var-description"
                        placeholder="What this variable represents (optional)"
                        value={newVarDescription}
                        onChange={(e) => setNewVarDescription(e.target.value)}
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
                      onClick={handleAddVariable}
                      disabled={isCreatingVariable || !newVarName.trim()}
                    >
                      {isCreatingVariable ? (
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
              {variables.length > 0 ? (
                <div className="space-y-2">
                  {variables.map((variable) => {
                    const variableWithFormula = updateVariableWithFormulaValue(variable);
                    
                    return (
                      <div
                        key={variable.id}
                        className="border rounded-md p-3 bg-muted/30 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm flex items-center">
                            {variable.name}
                            {variable.variable_type && (
                              <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {variable.variable_type.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {inlineEditingVariableId === variable.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={inlineEditValue}
                                  onChange={(e) => setInlineEditValue(Number(e.target.value))}
                                  className="w-16 h-6 text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      saveInlineEdit(variable.id);
                                    } else if (e.key === "Escape") {
                                      cancelInlineEdit();
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveInlineEdit(variable.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelInlineEdit}
                                  className="h-6 w-6 p-0"
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span
                                  className="text-sm cursor-pointer hover:bg-accent px-2 py-1 rounded"
                                  onClick={() => startInlineEdit(variable)}
                                >
                                  {variableWithFormula.value || 0}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenEditVariableDialog(variable)}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  ✏️
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {variable.description && (
                          <div className="text-xs mt-1 text-muted-foreground">
                            {variable.description}
                          </div>
                        )}
                        
                        {variable.formula && (
                          <div className="text-xs mt-1 font-mono bg-muted/50 p-1 rounded">
                            Formula: {variable.formula}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                  <p className="text-sm">No variables defined</p>
                  <p className="text-xs">
                    Variables help define dynamic values in your proposals
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Variable Dialog */}
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
        variableFormula={editVariableFormula}
        setVariableFormula={setEditVariableFormula}
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
        variables={variables}
        updateVariables={updateVariables}
      />
    </div>
  );
};
