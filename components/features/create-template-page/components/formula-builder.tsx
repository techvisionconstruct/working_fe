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
  Package,
} from "lucide-react";
import { VariableResponse } from "@/types/variables/dto";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAllVariables } from "@/api/variables/get-all-variables";
import { FormulaToken } from "../hooks/use-formula";
import { getVariables } from "@/queryOptions/variables";
import { getProducts } from "@/queryOptions/products";

interface FormulaBuilderProps {
  formulaTokens: FormulaToken[];
  setFormulaTokens: React.Dispatch<React.SetStateAction<FormulaToken[]>>;
  variables: VariableResponse[];
  updateVariables?: React.Dispatch<React.SetStateAction<VariableResponse[]>>;
  hasError?: boolean;
  onCreateVariable?: (name: string, formulaType?: "material" | "labor") => void;
  formulaType?: "material" | "labor";
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
        if (token.type === "variable" || token.type === "product") {
          return "1"; // Replace variables and products with 1 for validation
        }
        return token.text;
      })
      .join(" ");

    // Rest of validation logic
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
  formulaType,
}: FormulaBuilderProps) {
  const [formulaInput, setFormulaInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<(VariableResponse | any)[]>(
    []
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCreatingVariable, setIsCreatingVariable] = useState(false);

  // Track the cursor position for inserting variables at the right spot
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Track if this component is currently focused
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: variablesData, isLoading: variablesLoading } = useQuery(
    getVariables(1, 10, formulaInput)
  );

  const { data: productsData, isLoading } = useQuery(
    getProducts(1, 10, formulaInput)
  );

  const templateVariables = useMemo(() => {
    if (!variables) return [];
    return variables.filter(
      (variable) =>
        variable && (variable.is_global || variable.origin === "derived")
    );
  }, [variables]);

  // Ensure formulaTokens is always an array of valid tokens
  const validFormulaTokens = useMemo(() => {
    if (!Array.isArray(formulaTokens)) return [];

    return formulaTokens.filter(
      (token) =>
        token &&
        typeof token === "object" &&
        token.id !== undefined &&
        token.text !== undefined &&
        token.type !== undefined
    );
  }, [formulaTokens]);

  useEffect(() => {
    const { isValid, errorMessage } = validateFormula(validFormulaTokens);

    if (!isValid && validFormulaTokens.length > 0) {
      setValidationError(errorMessage);
    } else {
      setValidationError(null);
    }
  }, [validFormulaTokens]);

  const addFormulaToken = (
    text: string,
    displayText: string,
    tokenType: "variable" | "operator" | "number" | "function" | "product"
  ) => {
    const newToken: FormulaToken = {
      id: Date.now() + Math.random(),
      text,
      displayText,
      type: tokenType,
    };

    // Always append the token at the end for now
    const updatedTokens = [...validFormulaTokens, newToken];

    const { isValid, errorMessage } = validateFormula(updatedTokens);

    if (!isValid) {
      toast.error("Formula Error", {
        position: "top-center",
        description: errorMessage,
        icon: <AlertCircle className="w-4 h-4" />,
      });
    }

    // Update tokens regardless of validation results
    setFormulaTokens(updatedTokens);
    setFormulaInput("");
    setShowSuggestions(false);
  };

  const removeFormulaToken = (tokenId: number) => {
    const newTokens = validFormulaTokens.filter(
      (token) => token.id !== tokenId
    );
    setFormulaTokens(newTokens);
  };

  const handleAddApiVariableToFormula = (variable: VariableResponse) => {
    // Never call updateVariables with a brand new array directly
    // Instead, check if the variable exists and then add it if it doesn't
    if (
      updateVariables &&
      !templateVariables.some((v) => v.id === variable.id)
    ) {
      // Use a callback pattern to ensure access to the latest state
      updateVariables((currentVariables) => {
        // Check again to make sure this variable doesn't already exist
        if (currentVariables.some((v) => v.id === variable.id)) {
          return currentVariables; // No change needed
        }

        const updatedVariables = [...currentVariables, variable];

        toast.success("Variable automatically added", {
          position: "top-center",
          description: `"${variable.name}" was added because it's used in your formula.`,
        });

        return updatedVariables;
      });
    }

    addFormulaToken(variable.name, variable.name, "variable");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaInput(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Create variable safely with better logging
  const safeCreateVariable = (name: string) => {
    try {
      if (onCreateVariable && !isCreatingVariable) {
        setIsCreatingVariable(true);

        // Pass the formula type to indicate which formula should get the new variable
        onCreateVariable(name, formulaType);

        // Clear input after requesting variable creation
        setFormulaInput("");
        return true;
      }
    } catch (error) {
      console.error("Error calling onCreateVariable:", error);
      setIsCreatingVariable(false);
    }
    return false;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const numValue = parseFloat(formulaInput);
      if (!isNaN(numValue)) {
        addFormulaToken(formulaInput.trim(), formulaInput.trim(), "number");
        return;
      }

      if (["+", "-", "*", "/", "(", ")", "^"].includes(formulaInput.trim())) {
        addFormulaToken(formulaInput.trim(), formulaInput.trim(), "operator");
        return;
      }

      if (suggestions.length > 0) {
        const selectedItem = suggestions[selectedSuggestion];
        const isProduct = "isProduct" in selectedItem && selectedItem.isProduct;

        if (isProduct) {
          // Handle product selection
          addFormulaToken(selectedItem.id, selectedItem.title, "product");
          return;
        }

        // Handle variable selection (existing code)
        if (
          updateVariables &&
          !variables.some((v) => v.id === selectedItem.id)
        ) {
          updateVariables((currentVariables) => {
            if (currentVariables.some((v) => v.id === selectedItem.id)) {
              return currentVariables;
            }
            return [...currentVariables, selectedItem];
          });

          toast.success("Variable automatically added", {
            description: `"${selectedItem.name}" has been added to your template.`,
          });
        }
        addFormulaToken(selectedItem.name, selectedItem.name, "variable");
      } else if (
        formulaInput.trim() &&
        !variables.some(
          (v) => v.name.toLowerCase() === formulaInput.toLowerCase()
        )
      ) {
        safeCreateVariable(formulaInput.trim());
      } else if (formulaInput.trim()) {
        const exactMatch = variables.find(
          (v) => v.name.toLowerCase() === formulaInput.trim().toLowerCase()
        );
        if (exactMatch) {
          addFormulaToken(exactMatch.name, exactMatch.name, "variable");
        }
      }
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      const selectedItem = suggestions[selectedSuggestion];

      const isProduct = "isProduct" in selectedItem && selectedItem.isProduct;
      console.log("isProduct", isProduct);
      console.log("selectedItem", selectedItem);

      if (isProduct) {
        // Handle product selection
        // Add "product:" prefix to the displayText for better identification
        addFormulaToken(selectedItem.id, `product:${selectedItem.title}`, "product");
        
        return;
      }

      // Handle variable selection
      if (updateVariables && !variables.some((v) => v.id === selectedItem.id)) {
        updateVariables([...variables, selectedItem]);
        toast.success("Variable automatically added", {
          description: `"${selectedItem.name}" has been added to your template.`,
        });
      }
      addFormulaToken(selectedItem.name, selectedItem.name, "variable");
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

    const alreadyInFormula = validFormulaTokens
      .filter((token) => token.type === "variable" || token.type === "product")
      .some((token) => token.text.toLowerCase() === formulaInput.toLowerCase());

    let templateMatches = templateVariables.filter(
      (v) =>
        v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
        !validFormulaTokens.some(
          (token) =>
            token.type === "variable" &&
            token.text.toLowerCase() === v.name.toLowerCase()
        )
    );

    let apiMatches: VariableResponse[] = [];
    let productMatches: any[] = [];

    if (variablesData?.data) {
      apiMatches = (variablesData.data as VariableResponse[]).filter(
        (v) =>
          v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
          !templateMatches.some(
            (tm) => tm.name.toLowerCase() === v.name.toLowerCase()
          ) &&
          !validFormulaTokens.some(
            (token) =>
              token.type === "variable" &&
              token.text.toLowerCase() === v.name.toLowerCase()
          )
      );
    }

    if (productsData?.data) {
      productMatches = (productsData.data as any[]).filter(
        (p) =>
          p.title?.toLowerCase().includes(formulaInput.toLowerCase()) &&
          !validFormulaTokens.some(
            (token) =>
              token.type === "product" &&
              token.text.toLowerCase() === p.title?.toLowerCase()
          )
      );

      // Mark products so we can identify them in the UI
      productMatches = productMatches.map((p) => ({
        ...p,
        isProduct: true,
      }));
    }

    setSuggestions([
      ...templateMatches,
      ...apiMatches.filter((v) => v.is_global),
      ...apiMatches.filter((v) => !v.is_global),
      ...productMatches,
    ]);

    setShowSuggestions(true);
    setSelectedSuggestion(0);
  }, [
    formulaInput,
    templateVariables,
    variablesData?.data,
    productsData?.data,
    validFormulaTokens,
  ]);

  const isFormulaValid = useMemo(() => {
    return validFormulaTokens.length > 0 && !validationError;
  }, [validFormulaTokens, validationError]);

  // Reset isCreatingVariable when the component re-renders
  useEffect(() => {
    setIsCreatingVariable(false);
  }, [validFormulaTokens]);

  return (
    <>
      <div
        className={`border rounded-lg p-3 flex flex-wrap gap-2 min-h-[65px] bg-background/50 relative transition-all ${
          hasError || validationError
            ? "border-red-300 bg-red-50/50"
            : isFormulaValid && validFormulaTokens.length > 0
            ? "border-green-300 bg-green-50/50"
            : "hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {validFormulaTokens.map((token) => (
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
                : token.type === "product"
                ? "bg-gradient-to-r from-green-500/5 to-green-500/10 text-green-700 border-green-500/20 shadow-sm"
                : "bg-gray-100 text-gray-800 shadow-sm"
            }`}
          >
            {token.type === "variable" ? (
              <Variable className="w-3 h-3 mr-1" />
            ) : token.type === "operator" ? (
              <Calculator className="w-3 h-3 mr-1" />
            ) : token.type === "number" ? (
              <Hash className="w-3 h-3 mr-1" />
            ) : token.type === "product" ? (
              <Package className="w-3 h-3 mr-1" />
            ) : null}
            {token.displayText}
            <button
              type="button"
              className="h-5 w-5 rounded-full hover:bg-white/80 flex items-center justify-center ml-0.5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeFormulaToken(token.id);
              }}
              aria-label={`Remove ${token.displayText}`}
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
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(!!formulaInput.trim());
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          onClick={(e) => {
            // Update cursor position on click
            if (inputRef.current) {
              setCursorPosition(inputRef.current.selectionStart);
            }
          }}
          placeholder={
            validFormulaTokens.length
              ? "Add more..."
              : "Type variables, products, numbers, or operators..."
          }
          className="border-0 shadow-none focus:outline-none focus:ring-0 p-0 h-9 text-sm flex-1 min-w-[40px] bg-transparent"
        />

        {validationError && (
          <div className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {validationError}
          </div>
        )}

        {isFormulaValid && validFormulaTokens.length > 0 && (
          <div className="absolute -bottom-6 left-0 text-xs text-green-600 flex items-center">
            Valid formula
          </div>
        )}

        {showSuggestions && formulaInput && (
          <div className="absolute left-0 top-full mt-1 z-20 w-full bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                // Check if this is a product
                const isProduct = "isProduct" in item && item.isProduct;
                const displayName = isProduct ? item.title : item.name;

                return (
                  <div
                    key={item.id}
                    className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                      selectedSuggestion === index
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                    onClick={() => {
                      if (isProduct) {
                        addFormulaToken(item.id, item.title, "product");
                      } else {
                        addFormulaToken(item.name, item.name, "variable");
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {isProduct ? (
                          <Package className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Variable className="w-3.5 h-3.5 text-primary" />
                        )}
                        {displayName}
                      </span>
                      <div className="flex items-center gap-1">
                        {!isProduct &&
                          !templateVariables.some((v) => v.id === item.id) && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Will add to template
                            </Badge>
                          )}
                        {!isProduct && item.is_global && (
                          <Badge variant="secondary" className="text-xs">
                            Global
                          </Badge>
                        )}
                        {isProduct && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700 border-green-200"
                          >
                            Product
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : formulaInput.trim().length >= 2 ? (
              validFormulaTokens.some(
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
                  onClick={() =>
                    addFormulaToken(
                      formulaInput.trim(),
                      formulaInput.trim(),
                      "number"
                    )
                  }
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
                    addFormulaToken(
                      formulaInput.trim(),
                      formulaInput.trim(),
                      "operator"
                    )
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
                  onClick={() => safeCreateVariable(formulaInput.trim())}
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
                      Click to create this variable and add to formula
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
            onClick={() => addFormulaToken(op, op, "operator")}
            className="h-7 px-2.5 rounded-md bg-muted/30 border-muted hover:bg-muted/60 hover:text-primary transition-colors"
          >
            {op === "*" ? "×" : op === "/" ? "÷" : op}
          </Button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        Type variable names, product names, numbers, or use the operator
        buttons.
      </div>
    </>
  );
}
