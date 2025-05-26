"use client";

import React, { useState } from "react";
import {
  Button,
  Badge,
  Input,
} from "@/components/shared";
import { toast } from "sonner";
import { X, Variable, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { VariableResponse } from "@/types/variables/dto";
import { getVariables } from "@/query-options/variables";
import AddVariableDialog from "./add-variable-dialog";
import EditVariableDialog from "./edit-variable-dialog";

interface VariablesColumnProps {
  variables: VariableResponse[];
  updateVariables: (variables: VariableResponse[]) => void;
}

export const VariablesColumn: React.FC<VariablesColumnProps> = ({
  variables,
  updateVariables,
}) => {
  // Local state for search and UI
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVarName, setNewVarName] = useState("");

  // Edit variable state
  const [showEditVariableDialog, setShowEditVariableDialog] = useState(false);
  const [variableToEdit, setVariableToEdit] = useState<VariableResponse | null>(null);

  // API Query
  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables(1, 10, searchQuery)
  );

  // Filter variables that are not already selected
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

  // Event handlers
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
    }

    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleRemoveVariable = (variableId: string) => {
    const variableToRemove = variables.find((v) => v.id === variableId);
    const updatedVariables = variables.filter((v) => v.id !== variableId);
    updateVariables(updatedVariables);

    if (variableToRemove) {
      toast.success("Variable removed", {
        position: "top-center",
        description: `"${variableToRemove.name}" has been removed.`,
      });
    }
  };

  const handleOpenEditVariableDialog = (variable: VariableResponse) => {
    setVariableToEdit(variable);
    setShowEditVariableDialog(true);
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
            <div className="relative">
              <div className="relative w-full mb-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  className="w-full pl-8 pr-4 rounded-full"
                />
                {variablesLoading && (
                  <div className="absolute right-2 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

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
                          <div className="flex items-center">
                            <Variable className="mr-2 h-4 w-4" />
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
            </div>

            <div className="space-y-2">
              {variables.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {/* Group variables by variable_type */}
                  {Object.entries(
                    variables.reduce((groups, variable) => {
                      const typeName = variable.variable_type?.name || "Uncategorized";
                      if (!groups[typeName]) {
                        groups[typeName] = [];
                      }
                      groups[typeName].push(variable);
                      return groups;
                    }, {} as Record<string, typeof variables>)
                  ).map(([typeName, typeVariables]) => (
                    <div key={typeName} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {typeName} ({typeVariables.length})
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {typeVariables.map((variable) => (
                          <div
                            key={variable.id}
                            className="border rounded-md p-2 bg-muted/30 relative group hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="font-medium text-xs truncate pr-1">
                                {variable.name}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 rounded-full bg-muted/80 text-primary hover:text-primary/80"
                                  onClick={() => handleOpenEditVariableDialog(variable)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
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
                                  className="h-4 w-4 rounded-full bg-muted/80 text-destructive hover:text-destructive/80"
                                  onClick={() => handleRemoveVariable(variable.id)}
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              </div>
                            </div>
                            {variable.description && (
                              <div className="text-[10px] mt-1 line-clamp-1 text-muted-foreground">
                                {variable.description}
                              </div>
                            )}
                            <div className="text-[10px] mt-1 font-mono text-primary/70">
                              Value: {variable.value}
                            </div>
                          </div>
                        ))}
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
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddVariableDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onVariableCreated={(newVariable) => {
          const updatedVariables = [...variables, newVariable];
          updateVariables(updatedVariables);
          toast.success("Variable created successfully", {
            position: "top-center",
            description: `"${newVariable.name}" has been added.`,
          });
        }}
        initialName={newVarName}
      />

      <EditVariableDialog
        isOpen={showEditVariableDialog}
        onOpenChange={setShowEditVariableDialog}
        variable={variableToEdit}
        onVariableUpdated={(updatedVariable) => {
          const updatedVariables = variables.map((v) =>
            v.id === updatedVariable.id ? updatedVariable : v
          );
          updateVariables(updatedVariables);
          toast.success("Variable updated successfully", {
            position: "top-center",
            description: `"${updatedVariable.name}" has been updated.`,
          });
        }}
      />
    </div>
  );
};
