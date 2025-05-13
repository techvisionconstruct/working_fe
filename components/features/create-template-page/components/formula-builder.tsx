"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Badge, Input, Button } from "@/components/shared";
import {
  Variable,
  Calculator,
  Hash,
  X,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAllVariables } from "@/api/variables/get-all-variables";
import { FormulaToken } from "../hooks/use-formula";

interface FormulaBuilderProps {
  formulaTokens: FormulaToken[];
  setFormulaTokens: React.Dispatch<React.SetStateAction<FormulaToken[]>>;
  variables: VariableResponse[];
  updateVariables?: (variables: VariableResponse[]) => void;
  hasError?: boolean;
  onCreateVariable?: (name: string) => void;
}

// Function to validate a mathematical formula
function validateFormula(tokens: FormulaToken[]): {
  isValid: boolean;
  errorMessage: string;
} {
  if (tokens.length === 0) {
    return { isValid: true, errorMessage: "" };
  }

  try {
    const formula = tokens
      .map((token) => {
        if (token.type === "variable") {
          return "1";
        }
        return token.text;
      })
      .join(" ");

    const formulaStr = tokens.map((t) => t.text).join("");
    const operatorPattern = /[\+\-\*\/\^]{2,}/;
    if (operatorPattern.test(formulaStr)) {
      return {
        isValid: false,
        errorMessage: "Invalid formula: Consecutive operators are not allowed",
      };
    }

    if (
      tokens.length === 2 &&
      tokens[0].text === "(" &&
      tokens[1].text === ")"
    ) {
      return {
        isValid: false,
        errorMessage: "Invalid formula: Empty parentheses ()",
      };
    }

    if (tokens.length > 0) {
      const firstToken = tokens[0];
      const lastToken = tokens[tokens.length - 1];

      if (
        firstToken.type === "operator" &&
        ["*", "/", ")", "^"].includes(firstToken.text)
      ) {
        return {
          isValid: false,
          errorMessage: `Invalid formula: Cannot start with "${firstToken.text}"`,
        };
      }

      if (
        lastToken.type === "operator" &&
        ["+", "-", "*", "/", "(", "^"].includes(lastToken.text)
      ) {
        return {
          isValid: false,
          errorMessage: `Invalid formula: Cannot end with "${lastToken.text}"`,
        };
      }
    }

    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].text === "(" && tokens[i + 1].text === ")") {
        if (tokens.length === 2) {
          return {
            isValid: false,
            errorMessage: "Invalid formula: Empty parentheses ()",
          };
        }
      }
    }

    new Function(`return ${formula}`)();

    return { isValid: true, errorMessage: "" };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: "Invalid mathematical formula",
    };
  }
}

export function FormulaBuilder({
  formulaTokens,
  setFormulaTokens,
  variables,
  updateVariables,
  hasError = false,
  onCreateVariable,
}: FormulaBuilderProps) {
  const [formulaInput, setFormulaInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<VariableResponse[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: apiVariables } = useQuery({
    queryKey: ["variables"],
    queryFn: getAllVariables,
  });

  const templateVariables = useMemo(() => {
    if (!variables) return [];
    return variables.filter(
      (variable) =>
        variable && (variable.is_global || variable.origin === "derived")
    );
  }, [variables]);

  useEffect(() => {
    const { isValid, errorMessage } = validateFormula(formulaTokens);

    if (!isValid && formulaTokens.length > 0) {
      setValidationError(errorMessage);
    } else {
      setValidationError(null);
    }
  }, [formulaTokens]);

  const addFormulaToken = (
    text: string,
    tokenType: "variable" | "operator" | "number" | "function"
  ) => {
    const newToken: FormulaToken = {
      id: Date.now() + Math.random(),
      text,
      type: tokenType,
    };
    const updatedTokens = [...formulaTokens, newToken];

    const { isValid, errorMessage } = validateFormula(updatedTokens);

    if (!isValid) {
      toast.error("Formula Error", {
        position: "top-center",
        description: errorMessage,
        icon: <AlertCircle className="w-4 h-4" />,
      });
      setFormulaTokens(updatedTokens);
    } else {
      setFormulaTokens(updatedTokens);
    }

    setFormulaInput("");
    setShowSuggestions(false);
  };

  const removeFormulaToken = (tokenId: number) => {
    setFormulaTokens((prev) => prev.filter((token) => token.id !== tokenId));
  };

  const handleAddApiVariableToFormula = (variable: VariableResponse) => {
    if (updateVariables && !templateVariables.some((v) => v.id === variable.id)) {
      updateVariables([...variables, variable]);

      toast.success("Variable automatically added", {
        position: "top-center",
        description: `"${variable.name}" was added because it's used in your formula.`,
      });
    }

    addFormulaToken(variable.name, "variable");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const numValue = parseFloat(formulaInput);
      if (!isNaN(numValue)) {
        addFormulaToken(formulaInput.trim(), "number");
        return;
      }

      if (["+", "-", "*", "/", "(", ")", "^"].includes(formulaInput.trim())) {
        addFormulaToken(formulaInput.trim(), "operator");
        return;
      }

      if (suggestions.length > 0) {
        const selectedVar = suggestions[selectedSuggestion];
        if (
          updateVariables &&
          !variables.some((v) => v.id === selectedVar.id)
        ) {
          updateVariables([...variables, selectedVar]);
          toast.success("Variable automatically added", {
            description: `"${selectedVar.name}" has been added to your template.`,
          });
        }
        addFormulaToken(selectedVar.name, "variable");
      } else if (
        formulaInput.trim() &&
        !variables.some(
          (v) => v.name.toLowerCase() === formulaInput.toLowerCase()
        )
      ) {
        if (onCreateVariable) {
          onCreateVariable(formulaInput.trim());
          setFormulaInput("");
        }
      } else if (formulaInput.trim()) {
        const exactMatch = variables.find(
          (v) => v.name.toLowerCase() === formulaInput.trim().toLowerCase()
        );
        if (exactMatch) {
          addFormulaToken(exactMatch.name, "variable");
        }
      }
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      const selectedVar = suggestions[selectedSuggestion];
      if (updateVariables && !variables.some((v) => v.id === selectedVar.id)) {
        updateVariables([...variables, selectedVar]);
        toast.success("Variable automatically added", {
          description: `"${selectedVar.name}" has been added to your template.`,
        });
      }
      addFormulaToken(selectedVar.name, "variable");
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    if (!formulaInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const numValue = parseFloat(formulaInput);
    if (
      !isNaN(numValue) ||
      ["+", "-", "*", "/", "(", ")", "^"].includes(formulaInput.trim())
    ) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const alreadyInFormula = formulaTokens
      .filter((token) => token.type === "variable")
      .some((token) => token.text.toLowerCase() === formulaInput.toLowerCase());

    let templateMatches = templateVariables.filter(
      (v) =>
        v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
        !formulaTokens.some(
          (token) =>
            token.type === "variable" &&
            token.text.toLowerCase() === v.name.toLowerCase()
        )
    );

    let apiMatches: VariableResponse[] = [];

    if (apiVariables?.data) {
      apiMatches = (apiVariables.data as VariableResponse[]).filter(
        (v) =>
          v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
          !templateMatches.some(
            (tm) => tm.name.toLowerCase() === v.name.toLowerCase()
          ) &&
          !formulaTokens.some(
            (token) =>
              token.type === "variable" &&
              token.text.toLowerCase() === v.name.toLowerCase()
          ) &&
          (v.origin === "original" || v.is_global)
      );
    }

    setSuggestions([
      ...templateMatches,
      ...apiMatches.filter((v) => v.is_global),
      ...apiMatches.filter((v) => !v.is_global),
    ]);

    setShowSuggestions(true);
    setSelectedSuggestion(0);
  }, [formulaInput, templateVariables, apiVariables?.data, formulaTokens]);

  const isFormulaValid = useMemo(() => {
    return formulaTokens.length > 0 && !validationError;
  }, [formulaTokens, validationError]);

  return (
    <>
      <div
        className={`border rounded-lg p-3 flex flex-wrap gap-2 min-h-[65px] bg-background/50 relative transition-all ${
          hasError || validationError
            ? "border-red-300 bg-red-50/50"
            : isFormulaValid && formulaTokens.length > 0
            ? "border-green-300 bg-green-50/50"
            : "hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {formulaTokens.map((token) => (
          <Badge
            key={token.id}
            variant="outline"
            className={`gap-1.5 px-2 py-1 text-sm rounded-md transition-all duration-150 hover:shadow cursor-text ${
              token.type === "variable"
                ? "bg-gradient-to-r from-primary/5 to-primary/10 text-primary border-primary/20 shadow-sm"
                : token.type === "operator"
                ? "bg-gradient-to-r from-amber-500/5 to-amber-500/10 text-amber-700 border-amber-500/20 shadow-sm"
                : token.type === "number"
                ? "bg-gradient-to-r from-blue-500/5 to-blue-500/10 text-blue-700 border-blue-500/20 shadow-sm"
                : "bg-gray-100 text-gray-800 shadow-sm"
            }`}
          >
            {token.type === "variable" ? (
              <Variable className="w-3 h-3 mr-1" />
            ) : token.type === "operator" ? (
              <Calculator className="w-3 h-3 mr-1" />
            ) : token.type === "number" ? (
              <Hash className="w-3 h-3 mr-1" />
            ) : null}
            {token.text}
            <button
              type="button"
              className="h-5 w-5 rounded-full hover:bg-white/80 flex items-center justify-center ml-0.5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeFormulaToken(token.id);
              }}
              aria-label={`Remove ${token.text}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        <Input
          ref={inputRef}
          value={formulaInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(!!formulaInput.trim())}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={
            formulaTokens.length
              ? "Add more..."
              : "Type variables, numbers, or operators..."
          }
          className="border-0 shadow-none focus:outline-none focus:ring-0 p-0 h-9 text-sm flex-1 min-w-[40px] bg-transparent"
        />

        {validationError && (
          <div className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {validationError}
          </div>
        )}

        {isFormulaValid && formulaTokens.length > 0 && (
          <div className="absolute -bottom-6 left-0 text-xs text-green-600 flex items-center">
            Valid formula
          </div>
        )}

        {showSuggestions && formulaInput && (
          <div className="absolute left-0 top-full mt-1 z-20 w-full bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((variable, index) => (
                <div
                  key={variable.id}
                  className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    selectedSuggestion === index
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => addFormulaToken(variable.name, "variable")}
                >
                  <div className="flex items-center justify-between">
                    <span>{variable.name}</span>
                    <div className="flex items-center gap-1">
                      {!templateVariables.some((v) => v.id === variable.id) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Will add to template
                        </Badge>
                      )}
                      {variable.is_global && (
                        <Badge variant="secondary" className="text-xs">
                          Global
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : formulaInput.trim().length >= 2 ? (
              formulaTokens.some(
                (token) =>
                  token.type === "variable" &&
                  token.text.toLowerCase() === formulaInput.trim().toLowerCase()
              ) ? (
                <div className="p-3 flex items-center">
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">
                      "{formulaInput.trim()}" is already in the formula
                    </span>
                  </div>
                </div>
              ) : !isNaN(parseFloat(formulaInput)) ? (
                <div
                  className="p-3 cursor-pointer hover:bg-accent"
                  onClick={() => addFormulaToken(formulaInput.trim(), "number")}
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">
                      Use "{formulaInput.trim()}" as number
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to add this number
                    </p>
                  </div>
                </div>
              ) : ["+", "-", "*", "/", "(", ")", "^"].includes(
                  formulaInput.trim()
                ) ? (
                <div
                  className="p-3 cursor-pointer hover:bg-accent"
                  onClick={() =>
                    addFormulaToken(formulaInput.trim(), "operator")
                  }
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">
                      Use "{formulaInput.trim()}" as operator
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to add this operator
                    </p>
                  </div>
                </div>
              ) : variables.some(
                  (v) =>
                    v.name.toLowerCase() === formulaInput.trim().toLowerCase()
                ) ? (
                <div
                  className="p-3 cursor-pointer hover:bg-accent"
                  onClick={() =>
                    addFormulaToken(
                      variables.find(
                        (v) =>
                          v.name.toLowerCase() ===
                          formulaInput.trim().toLowerCase()
                      )?.name || formulaInput.trim(),
                      "variable"
                    )
                  }
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">
                      Use "{formulaInput.trim()}"
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to use this variable
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 flex items-center cursor-pointer hover:bg-accent"
                  onClick={() => {
                    if (onCreateVariable) onCreateVariable(formulaInput.trim());
                  }}
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">
                      "{formulaInput.trim()}"
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      doesn't exist
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to create a new variable
                    </p>
                  </div>
                  <PlusCircle className="h-4 w-4 text-muted-foreground ml-2" />
                </div>
              )
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {["+", "-", "*", "/", "(", ")", "^"].map((op) => (
          <Button
            key={op}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFormulaToken(op, "operator")}
            className="h-7 px-2.5 rounded-md bg-muted/30 border-muted hover:bg-muted/60 hover:text-primary transition-colors"
          >
            {op === "*" ? "×" : op === "/" ? "÷" : op}
          </Button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        Type variable names, numbers, or use the operator buttons.
      </div>
    </>
  );
}
