"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared";
import type { Variable } from "@/types/proposals";
import { ArrowRightIcon, XCircleIcon } from "lucide-react";
import AddVariable from "./add-variable";

interface VariablesFormProps {
  variables: Variable[];
  setVariables: (variables: Variable[]) => void;
  onNext: () => void;
}

export function VariablesForm({
  variables,
  setVariables,
  onNext,
}: VariablesFormProps) {
  const [newVariable, setNewVariable] = useState({
    name: "",
    type: "",
    value: "0",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVariableChange = (id: number, value: string) => {
    const updatedVariables = variables.map((variable) =>
      variable.id === id ? { ...variable, value } : variable
    );
    setVariables(updatedVariables);
  };

  const handleAddVariable = () => {
    if (!newVariable.name || !newVariable.type) return;

    const newId =
      variables.length > 0 ? Math.max(...variables.map((v) => v.id)) + 1 : 1;

    const variableToAdd: Variable = {
      id: newId,
      name: newVariable.name,
      type: newVariable.type,
      value: newVariable.value || "0",
    };

    setVariables([...variables, variableToAdd]);
    setNewVariable({ name: "", type: "", value: "0" });
    setIsDialogOpen(false);
  };

  const handleRemoveVariable = (id: number) => {
    const updatedVariables = variables.filter((variable) => variable.id !== id);
    setVariables(updatedVariables);
  };

  const groupedVariables: Record<string, Variable[]> = {};
  variables.forEach((variable) => {
    if (!groupedVariables[variable.type]) {
      groupedVariables[variable.type] = [];
    }
    groupedVariables[variable.type].push(variable);
  });

  const uniqueTypes = Array.from(new Set(variables.map((v) => v.type)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Set Project Variables</h3>
          <p className="text-sm text-muted-foreground">
            Define the values for each variable to calculate accurate costs
          </p>
        </div>
        <AddVariable
          newVariable={newVariable}
          setNewVariable={setNewVariable}
          handleAddVariable={handleAddVariable}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      {Object.entries(groupedVariables).map(([type, vars]) => (
        <Card key={type} className="overflow-hidden">
          <CardContent>
            <h3 className="text-lg font-bold"> {type} Variables</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vars.map((variable) => (
                <div key={variable.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`variable-${variable.id}`}
                      className="text-sm font-medium"
                    >
                      {variable.name}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveVariable(variable.id)}
                    >
                      <XCircleIcon className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`variable-${variable.id}`}
                      type="text"
                      value={variable.value || "0"}
                      onChange={(e) =>
                        handleVariableChange(variable.id, e.target.value)
                      }
                      className="font-mono"
                    />
                    <span className="text-sm text-muted-foreground">
                      {type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Show a message when there are no variables */}
      {Object.keys(groupedVariables).length === 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No variables yet. Add a variable to get started.
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Variable
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} className="gap-2">
          Review Costs <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
