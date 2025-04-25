import React, { useState } from "react";
import { Card, Badge, Button, Input, Label } from "@/components/shared";
import { Check, X, Loader2, Save, Search, Plus } from "lucide-react";
import { Parameter } from "./types";

interface ParametersTabProps {
  parameters: {
    isLoading: boolean;
    data?: Parameter[];
  };
  selectedParameters: Parameter[];
  handleParameterToggle: (parameter: Parameter) => void;
  handleParameterValueUpdate?: (
    parameterId: number,
    value: string | number
  ) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  errors?: Record<string, string>;
}

export function ParametersTab({
  parameters,
  selectedParameters,
  handleParameterToggle,
  handleParameterValueUpdate,
  isSubmitting,
  onBack,
  onSubmit,
  errors = {},
}: ParametersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newParameters, setNewParameters] = useState<Parameter[]>([]);

  const filteredParameters = parameters.data?.filter((parameter) =>
    parameter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewParameter = () => {
    if (!searchQuery.trim()) return;

    const customParameter: Parameter = {
      id: Date.now(), // temporary ID until saved
      name: searchQuery.trim(),
      type: "text",
      value: 0, // Always default to 0
    };

    setNewParameters((prev) => [...prev, customParameter]);
    handleParameterToggle(customParameter); // Select it initially but allow unselecting
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Validation error alert */}
      {errors["selectedParameters"] && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{errors["selectedParameters"]}</p>
              <p className="text-sm mt-1">Please select at least one parameter below.</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-medium mb-2">Project Parameters</h2>
      <div className="flex justify-between items-start gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          Add parameters to customize your proposal.
        </p>
        <div className="relative w-64 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex">
            <Input
              type="text"
              placeholder="Search parameters..."
              className="pl-10 rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (filteredParameters?.length === 0 && searchQuery.trim()) {
                    handleCreateNewParameter();
                  }
                }
              }}
            />
            {searchQuery && (
              <Button
                type="button"
                size="sm"
                className="rounded-l-none h-10"
                onClick={handleCreateNewParameter}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>

          {searchQuery && filteredParameters?.length === 0 && (
            <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 overflow-hidden">
              <div className="px-4 py-3 text-sm">
                No parameters found. Press{" "}
                <kbd className="px-2 py-0.5 rounded-md bg-muted text-xs">
                  Enter
                </kbd>{" "}
                or click the Add button to create a new parameter.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {parameters.isLoading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredParameters?.length || newParameters.length ? (
          <>
            {filteredParameters?.map((parameter) => {
              const isSelected = selectedParameters.some(
                (p) => p.id === parameter.id
              );
              return (
                <Card
                  key={parameter.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleParameterToggle(parameter)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{parameter.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        <Badge variant="outline" className="text-xs mr-1">
                          {parameter.type}
                        </Badge>
                        Default: {parameter.value.toString()}
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </Card>
              );
            })}

            {newParameters
              .filter(
                (newParam) =>
                  !filteredParameters?.some((p) => p.id === newParam.id) &&
                  newParam.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((parameter) => (
                <Card
                  key={`new-parameter-${parameter.id}`}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedParameters.some((p) => p.id === parameter.id)
                      ? "ring-2 ring-primary"
                      : "hover:border-primary/50"
                  } border-dashed`}
                  onClick={() => handleParameterToggle(parameter)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {parameter.name}
                        <Badge className="ml-2" variant="outline">
                          New
                        </Badge>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        <Badge variant="outline" className="text-xs mr-1">
                          {parameter.type}
                        </Badge>
                        Default: {parameter.value.toString()}
                      </div>
                    </div>
                    {selectedParameters.some((p) => p.id === parameter.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
          </>
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            {searchQuery
              ? "No matching parameters found."
              : "No parameters available."}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-medium mb-3">Selected Parameters</h3>

        {selectedParameters.length > 0 ? (
          <div className="border rounded-lg p-4 space-y-3">
            {selectedParameters.map((param) => (
              <div
                key={param.id}
                className="flex items-center justify-between gap-3 border rounded-md p-3"
              >
                <div>
                  <span className="font-medium">{param.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {param.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs whitespace-nowrap">Value:</Label>
                  <Input
                    type={param.type === "number" ? "number" : "text"}
                    className="w-24 h-8"
                    value={param.value ? param.value.toString() : "0"}
                    onChange={(e) => {
                      const newValue =
                        param.type === "number"
                          ? parseFloat(e.target.value) || 0 // Ensure 0 if parsing fails
                          : e.target.value || "0"; // Ensure "0" if empty
                      handleParameterValueUpdate?.(param.id, newValue);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleParameterToggle(param)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            No parameters selected yet. Choose from the list above.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Modules
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Proposal
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
