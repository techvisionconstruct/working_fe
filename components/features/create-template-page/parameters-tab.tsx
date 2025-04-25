import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getParameters } from "@/api/client/parameters";
import { Parameter } from "./types";
import { Input, Card, CardContent, Button } from "@/components/shared";
import { X, AlertCircle, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { parametersSchema } from "./zod-schema";

export function ParametersTab({
  value,
  onChange,
  onPrev,
  onNext,
}: {
  value: Parameter[];
  onChange: (params: Parameter[]) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [input, setInput] = React.useState("");
  const [added, setAdded] = React.useState<Parameter[]>(value);
  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const [error, setError] = React.useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [typeHighlighted, setTypeHighlighted] = React.useState<number>(0);
  const parameterTypes = ["Linear Feet", "Square Feet", "Cube Feet", "Count"];

  function handleAdd(param: Parameter) {
    const updated = [...added, param];
    setAdded(updated);
    onChange(updated);
    setInput("");
    setHighlighted(-1);
    setTypeHighlighted(0);
    setShowTypeDropdown(false);
    setError(null);
  }

  function parseInput(input: string): { name: string; type: string | null } {
    if (input.includes("@")) {
      const [name, type] = input.split("@");
      return {
        name: name.trim(),
        type: type.trim() || null,
      };
    }
    return {
      name: input.trim(),
      type: null,
    };
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);

    if (value.includes("@")) {
      setShowTypeDropdown(true);

      const { type } = parseInput(value);
      if (type) {
        const matchingTypes = parameterTypes.filter((t) =>
          t.toLowerCase().includes(type.toLowerCase())
        );
        if (matchingTypes.length > 0) {
          setTypeHighlighted(parameterTypes.indexOf(matchingTypes[0]));
        }
      } else {
        setTypeHighlighted(0);
      }
    } else {
      setShowTypeDropdown(false);
      setHighlighted(suggestions.length > 0 ? 0 : -1);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (showTypeDropdown) {
      if (e.key === "ArrowDown") {
        setTypeHighlighted((prev) =>
          prev < parameterTypes.length - 1 ? prev + 1 : 0
        );
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setTypeHighlighted((prev) =>
          prev > 0 ? prev - 1 : parameterTypes.length - 1
        );
        e.preventDefault();
      } else if (e.key === "Enter" || e.key === "Tab") {
        // Select the highlighted type
        const { name } = parseInput(input);
        setInput(`${name} @${parameterTypes[typeHighlighted]}`);
        if (e.key === "Enter") e.preventDefault();
      } else if (e.key === "Escape") {
        setShowTypeDropdown(false);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      setHighlighted((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlighted((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (suggestions.length > 0 && highlighted >= 0) {
        handleAdd(suggestions[highlighted]);
      } else if (suggestions.length > 0) {
        handleAdd(suggestions[0]);
      } else if (input.trim()) {
        const { name, type } = parseInput(input);
        if (!name) return;

        const paramType =
          type &&
          parameterTypes.some((t) => t.toLowerCase() === type.toLowerCase())
            ? parameterTypes.find((t) => t.toLowerCase() === type.toLowerCase())
            : "Linear Feet";

        const newParam: Parameter = {
          id: Date.now(),
          name: name,
          value: 0,
          type: paramType || "Linear Feet",
        };
        handleAdd(newParam);
      }
      e.preventDefault();
    } else if (e.key === "@") {
      setShowTypeDropdown(true);
    }
  }

  const { data: parameters = [] } = useQuery({
    queryKey: ["parameters"],
    queryFn: getParameters,
  });

  const suggestions = input
    ? parameters.filter(
        (p: Parameter) =>
          p.name.toLowerCase().includes(input.toLowerCase()) &&
          !added.some((a) => a.id === p.id)
      )
    : [];

  function handleDelete(id: number) {
    const updated = added.filter((p) => p.id !== id);
    setAdded(updated);
    onChange(updated);
  }

  function handleNext() {
    const result = parametersSchema.safeParse(added);
    if (result.success) {
      setError(null);
      onNext();
    } else {
      // Extract error message from the validation result
      const errorMessage =
        result.error.errors[0]?.message || "At least one parameter is required";
      setError(errorMessage);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Parameters</h2>
        <p className="text-sm text-muted-foreground">
          Add parameters that define the variables for your template
          calculations.
        </p>
      </div>

      <div className="space-y-6">
        <form autoComplete="off" className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search for parameters or create your own..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="pr-10"
              />
              {input && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const { name, type } = parseInput(input);
                    if (!name) return;

                    // Use the parsed type or default to "Linear Feet"
                    const paramType =
                      type &&
                      parameterTypes.some(
                        (t) => t.toLowerCase() === type.toLowerCase()
                      )
                        ? parameterTypes.find(
                            (t) => t.toLowerCase() === type.toLowerCase()
                          )
                        : "Linear Feet";

                    handleAdd({
                      id: Date.now(),
                      name: name,
                      value: 0,
                      type: paramType || "Linear Feet",
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add parameter</span>
                </Button>
              )}
            </div>
          </div>

          {input && suggestions.length > 0 && (
            <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 max-h-48 overflow-auto">
              {suggestions.map((param: Parameter, idx: number) => (
                <div
                  key={param.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-muted transition-colors ${
                    highlighted === idx ? "bg-muted" : ""
                  }`}
                  onClick={() => handleAdd(param)}
                  onMouseEnter={() => setHighlighted(idx)}
                >
                  <div className="font-medium">{param.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Type: {param.type}
                  </div>
                </div>
              ))}
            </div>
          )}
          {input && suggestions.length === 0 && !showTypeDropdown && (
            <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 overflow-hidden">
              <div className="px-4 py-3 text-sm">
                No parameters found. Press{" "}
                <kbd className="px-2 py-0.5 rounded-md bg-muted text-xs">
                  Enter
                </kbd>{" "}
                or click <Plus className="inline-block h-3 w-3" /> to add "
                {input}" as a custom parameter.
              </div>
              <div className="px-4 py-2 text-sm border-t">
                Type{" "}
                <kbd className="px-2 py-0.5 rounded-md bg-muted text-xs">@</kbd>{" "}
                followed by a type (e.g. "@Count") to specify the parameter
                type.
              </div>
            </div>
          )}

          {/* Parameter Type Dropdown */}
          {showTypeDropdown && (
            <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 max-h-48 overflow-auto">
              <div className="sticky top-0 bg-muted px-4 py-2 text-xs font-medium">
                Select Parameter Type
              </div>
              {parameterTypes
                .filter((type) => {
                  const { type: inputType } = parseInput(input);
                  return (
                    !inputType ||
                    type.toLowerCase().includes(inputType.toLowerCase())
                  );
                })
                .map((type, idx) => (
                  <div
                    key={type}
                    className={`px-4 py-2 cursor-pointer hover:bg-muted transition-colors ${
                      typeHighlighted === parameterTypes.indexOf(type)
                        ? "bg-muted"
                        : ""
                    }`}
                    onClick={() => {
                      const { name } = parseInput(input);
                      setInput(`${name} @${type}`);
                      setShowTypeDropdown(false);
                    }}
                    onMouseEnter={() =>
                      setTypeHighlighted(parameterTypes.indexOf(type))
                    }
                  >
                    <div className="font-medium">{type}</div>
                  </div>
                ))}
            </div>
          )}
        </form>

        {error && (
          <div className="text-destructive flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-3">
          {added.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No parameters added yet</p>
              <p className="text-sm">
                Search or type a parameter name to add it
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {added.map((param) => (
                <Card key={param.id} className="overflow-hidden bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">{param.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {param.type}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(param.id)}
                        aria-label={`Remove ${param.name}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onPrev}
          variant="outline"
          size="lg"
          className="px-6 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} size="lg" className="px-8 font-medium">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
