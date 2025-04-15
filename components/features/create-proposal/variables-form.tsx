"use client";

import { useState, useEffect } from "react";
import { Button, Input, Label, Card, CardContent } from "@/components/shared";
import { ProposalParameters } from "@/types/create-proposal";
import { ArrowRightIcon, XCircleIcon } from "lucide-react";
import AddVariable from "./add-variable";

interface VariablesFormProps {
  parameters: ProposalParameters[];
  setParameters: (ProposalParameterss: ProposalParameters[]) => void;
  onNext: () => void;
}

export function VariablesForm({
  parameters,
  setParameters,
  onNext,
}: VariablesFormProps) {
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [newParameter, setNewParameter] = useState({
    name: "",
    type: "",
    value: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const initialValues: Record<number, string> = {};
    parameters.forEach((v) => {
      initialValues[v.id] = (v.value ?? 0).toString();
    });
    setInputValues(initialValues);
  }, [parameters.length]);

  const handleParameterChange = (id: number, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value.toString(),
    }));

    const updatedParameters = parameters.map((parameter) =>
      parameter.id === id ? { ...parameter, value: parseFloat(value) || 0 } : parameter
    );

    setParameters(updatedParameters);
  };

  const handleFocus = (id: number) => {
    if (inputValues[id] === "0") {
      setInputValues((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleBlur = (id: number) => {
    if (!inputValues[id]) {
      const newValue = "0";
      setInputValues((prev) => ({
        ...prev,
        [id]: newValue,
      }));

      const updatedParameters = parameters.map((parameters) =>
        parameters.id === id ? { ...parameters, value: parseFloat(newValue) || 0 } : parameters
      );
      setParameters(updatedParameters);
    } else {
      const currentValue = inputValues[id];
      const updatedParameters = parameters.map((parameters) =>
        parameters.id === id ? { ...parameters, value: parseFloat(currentValue) || 0 } : parameters
      );
      setParameters(updatedParameters);
    }
  };

  const handleSaveAll = () => {
    const updatedParameters = parameters.map((parameter) => ({
      ...parameter,
      value: parseFloat(inputValues[parameter.id]) || 0,
    }));

    setParameters(updatedParameters);
  };



  const handleAddParameter = () => {
    if (!newParameter.name || !newParameter.type) {
      console.error("Parameter name and type are required");
      return;
    }
    const newId =
      parameters.length > 0
        ? Math.max(...parameters.map((v) => v.id || 0)) + 1
        : 1;

    const parameterToAdd = {
      id: newId,
      name: newParameter.name,
      type: newParameter.type,
      value: parseFloat(newParameter.value) || 0,
      formula: "", // Adding the missing formula property
      parameter: null, // Adding the missing parameter property
    };

    const updatedParameters = [...parameters, parameterToAdd];
    setParameters(updatedParameters);

    setInputValues((prev) => ({
      ...prev,
      [newId]: parameterToAdd.value.toString(),
    }));

    setNewParameter({ name: "", type: "", value: "0" });
    setIsDialogOpen(false);
  };


  const handleRemoveParameter = (id: number) => {
    const updatedParameters = parameters.filter((parameter) => parameter.id !== id);
    setParameters(updatedParameters);

    const newInputValues = { ...inputValues };
    delete newInputValues[id];
    setInputValues(newInputValues);
  };

  const groupedParameters: Record<string, ProposalParameters[]> = {};
  parameters.forEach((parameter) => {
    if (!groupedParameters[parameter.type]) {
      groupedParameters[parameter.type] = [];
    }
    groupedParameters[parameter.type].push(parameter);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Set Project Variables</h3>
          <p className="text-sm text-muted-foreground">
            Define the values for each variable to calculate accurate costs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAll} className="gap-1">
            Save Values
          </Button>
          <AddVariable
            newParameter={newParameter}
            setNewParameter={setNewParameter}
            handleAddParameter={handleAddParameter}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>

      {Object.entries(groupedParameters).map(([type, vars]) => (
        <Card key={type} className="overflow-hidden">
          <CardContent>
            <h3 className="text-lg font-bold mt-4"> {type} Parameters</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vars.map((parameter) => (
                <div key={parameter.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`parameter-${parameter.id}`}
                      className="text-sm font-medium"
                    >
                      {parameter.name}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveParameter(parameter.id)}
                    >
                      <XCircleIcon className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`variable-${parameter.id}`}
                      type="text"
                      value={
                        inputValues[parameter.id] !== undefined
                          ? inputValues[parameter.id]
                          : parameter.value || "0"
                      }
                      onChange={(e) =>
                        handleParameterChange(parameter.id, e.target.value)
                      }
                      onFocus={() => handleFocus(parameter.id)}
                      onBlur={() => handleBlur(parameter.id)}
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

      {Object.keys(groupedParameters).length === 0 && (
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
        <Button
          onClick={() => {
            handleSaveAll();
            onNext();
          }}
          className="gap-2"
        >
          Review Costs <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
