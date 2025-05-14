"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Badge, Input, Button } from "@/components/shared";
import { Variable, Calculator, Hash, X, PlusCircle } from "lucide-react";
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

export function FormulaBuilder({
  formulaTokens,
  setFormulaTokens,
  variables,
  updateVariables,
  hasError = false,
  onCreateVariable
}: FormulaBuilderProps) {
  const [formulaInput, setFormulaInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<VariableResponse[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Query all variables for suggestions
  const { data: apiVariables } = useQuery({
    queryKey: ["variables"],
    queryFn: getAllVariables,
  });
  
  // Filter variables to only show proposal-relevant ones
  const proposalVariables = useMemo(() => {
    return variables.filter(variable => 
      // Include proposal-specific variables (derived) and global variables
      variable && (variable.is_global || variable.origin === "derived")
    );
  }, [variables]);
  
  // Add a token to the formula
  const addFormulaToken = (text: string, tokenType: 'variable' | 'operator' | 'number' | 'function') => {
    const newToken: FormulaToken = {
      id: Date.now() + Math.random(),
      text,
      type: tokenType
    };
    setFormulaTokens(prev => [...prev, newToken]);
    setFormulaInput('');
    setShowSuggestions(false);
  };
  
  // Remove a token from the formula
  const removeFormulaToken = (tokenId: number) => {
    setFormulaTokens(prev => prev.filter(token => token.id !== tokenId));
  };
  
  // Handle variable from API that isn't in proposal variables
  const handleAddApiVariableToFormula = (variable: VariableResponse) => {
    // First, add the variable to the user's variables if not already there
    if (updateVariables && !proposalVariables.some(v => v.id === variable.id)) {
      updateVariables([...variables, variable]);
      
      toast.success("Variable automatically added", {
        position: "top-center",
        description: `"${variable.name}" was added because it's used in your formula.`,
      });
    }
    
    // Then add it as a token
    addFormulaToken(variable.name, 'variable');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaInput(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Check if input is a number first
      const numValue = parseFloat(formulaInput);
      if (!isNaN(numValue)) {
        addFormulaToken(formulaInput.trim(), 'number');
        return;
      }
      
      // Check if input is an operator
      if (['+', '-', '*', '/', '(', ')', '^'].includes(formulaInput.trim())) {
        addFormulaToken(formulaInput.trim(), 'operator');
        return;
      }
      
      // Now handle variables
      if (suggestions.length > 0) {
        const selectedVar = suggestions[selectedSuggestion];
        if (updateVariables && !proposalVariables.some(v => v.id === selectedVar.id)) {
          updateVariables([...variables, selectedVar]);
          toast.success("Variable automatically added", {
            description: `"${selectedVar.name}" has been added to your proposal.`,
          });
        }
        addFormulaToken(selectedVar.name, 'variable');
      } else if (formulaInput.trim() && !proposalVariables.some(v => v.name.toLowerCase() === formulaInput.toLowerCase())) {
        // Only suggest creating a new variable if it's not a number or operator
        if (onCreateVariable) {
          onCreateVariable(formulaInput.trim());
          setFormulaInput("");
        }
      } else if (formulaInput.trim()) {
        // Try to find exact match
        const exactMatch = proposalVariables.find(v => v.name.toLowerCase() === formulaInput.trim().toLowerCase());
        if (exactMatch) {
          addFormulaToken(exactMatch.name, 'variable');
        }
      }
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      const selectedVar = suggestions[selectedSuggestion];
      if (updateVariables && !proposalVariables.some(v => v.id === selectedVar.id)) {
        updateVariables([...variables, selectedVar]);
        toast.success("Variable automatically added", {
          description: `"${selectedVar.name}" has been added to your proposal.`,
        });
      }
      addFormulaToken(selectedVar.name, 'variable');
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : 0);
    }
  };
  
  // Filter variables based on input
  useEffect(() => {
    if (!formulaInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Don't show variable suggestions for numbers or operators
    const numValue = parseFloat(formulaInput);
    if (!isNaN(numValue) || ['+', '-', '*', '/', '(', ')', '^'].includes(formulaInput.trim())) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // First check if the input matches any existing token (to avoid duplicates)
    const alreadyInFormula = formulaTokens
      .filter(token => token.type === 'variable')
      .some(token => token.text.toLowerCase() === formulaInput.toLowerCase());
    
    // Check proposal variables first (prioritize them)
    let proposalMatches = proposalVariables
      .filter(v => 
        v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
        !formulaTokens.some(token => 
          token.type === 'variable' && token.text.toLowerCase() === v.name.toLowerCase()
        )
      );
    
    // Then check API variables, but prioritize global variables and filter out ones with same names
    let apiMatches: VariableResponse[] = [];
    
    if (apiVariables?.data) {
      apiMatches = (apiVariables.data as VariableResponse[])
        .filter(v => 
          // Include if:
          // 1. Name matches search
          v.name.toLowerCase().includes(formulaInput.toLowerCase()) &&
          // 2. Not already matched in proposal variables
          !proposalMatches.some(pm => pm.name.toLowerCase() === v.name.toLowerCase()) &&
          // 3. Not already in formula as a token
          !formulaTokens.some(token => 
            token.type === 'variable' && token.text.toLowerCase() === v.name.toLowerCase()
          ) &&
          // 4. Prioritize original and global variables
          (v.origin === "original" || v.is_global)
        );
    }
    
    // Prioritize variables: first proposal variables, then global API variables
    setSuggestions([
      ...proposalMatches, 
      ...apiMatches.filter(v => v.is_global), 
      ...apiMatches.filter(v => !v.is_global)
    ]);
    
    setShowSuggestions(true);
    setSelectedSuggestion(0);
  }, [formulaInput, proposalVariables, apiVariables?.data, formulaTokens]);
  
  // Add a clear button
  const handleClearFormula = () => {
    setFormulaTokens([]);
    setFormulaInput('');
    setShowSuggestions(false);
  };
  
  return (
    <>
      <div 
        className={`border rounded-lg p-3 flex flex-wrap gap-2 min-h-[65px] bg-background/50 relative transition-all ${hasError ? 'border-red-300 bg-red-50/50' : 'hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20'}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Render formula tokens */}
        {formulaTokens.map((token) => (
          <Badge
            key={token.id}
            variant="outline"
            className={`gap-1.5 px-2 py-1 text-sm rounded-md transition-all duration-150 hover:shadow cursor-text ${
              token.type === 'variable' 
                ? 'bg-gradient-to-r from-primary/5 to-primary/10 text-primary border-primary/20 shadow-sm' 
                : token.type === 'operator' 
                ? 'bg-gradient-to-r from-amber-500/5 to-amber-500/10 text-amber-700 border-amber-500/20 shadow-sm' 
                : token.type === 'number' 
                ? 'bg-gradient-to-r from-blue-500/5 to-blue-500/10 text-blue-700 border-blue-500/20 shadow-sm' 
                : 'bg-gray-100 text-gray-800 shadow-sm'
            }`}
          >
            {token.type === 'variable' ? <Variable className="w-3 h-3 mr-1" /> : token.type === 'operator' ? <Calculator className="w-3 h-3 mr-1" /> : token.type === 'number' ? <Hash className="w-3 h-3 mr-1" /> : null}
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
        
        {/* Formula input */}
        <Input
          ref={inputRef}
          value={formulaInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(!!formulaInput.trim())}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={formulaTokens.length ? "Add more..." : "Type variables, numbers, or operators..."}
          className="border-0 shadow-none focus:outline-none focus:ring-0 p-0 h-9 text-sm flex-1 min-w-[40px] bg-transparent"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && formulaInput && (
          <div className="absolute left-0 top-full mt-1 z-20 w-full bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((variable, index) => (
                <div
                  key={variable.id}
                  className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedSuggestion === index ? 'bg-accent text-accent-foreground' : ''}`}
                  onClick={() => addFormulaToken(variable.name, 'variable')}
                >
                  <div className="flex items-center justify-between">
                    <span>{variable.name}</span>
                    <div className="flex items-center gap-1">
                      {!proposalVariables.some(v => v.id === variable.id) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Will add to proposal
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
              formulaTokens.some(token => 
                token.type === 'variable' && 
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
                <div className="p-3 cursor-pointer hover:bg-accent" 
                     onClick={() => addFormulaToken(formulaInput.trim(), 'number')}>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Use "{formulaInput.trim()}" as number</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to add this number
                    </p>
                  </div>
                </div>
              ) : ['+', '-', '*', '/', '(', ')', '^'].includes(formulaInput.trim()) ? (
                <div className="p-3 cursor-pointer hover:bg-accent" 
                     onClick={() => addFormulaToken(formulaInput.trim(), 'operator')}>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Use "{formulaInput.trim()}" as operator</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to add this operator
                    </p>
                  </div>
                </div>
              ) : proposalVariables.some(v => 
                v.name.toLowerCase() === formulaInput.trim().toLowerCase()
              ) ? (
                <div className="p-3 cursor-pointer hover:bg-accent" 
                     onClick={() => addFormulaToken(
                       proposalVariables.find(v => v.name.toLowerCase() === formulaInput.trim().toLowerCase())?.name || 
                       formulaInput.trim(), 
                       'variable'
                     )}>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Use "{formulaInput.trim()}"</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to use this variable
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 flex items-center cursor-pointer hover:bg-accent" 
                     onClick={() => { if (onCreateVariable) onCreateVariable(formulaInput.trim())}}>
                  <div className="flex-1">
                    <span className="font-medium text-sm">"{formulaInput.trim()}"</span>
                    <span className="text-muted-foreground text-sm"> doesn't exist</span>
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
      
      {/* Operator buttons */}
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {['+', '-', '*', '/', '(', ')', '^'].map(op => (
            <Button 
              key={op}
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => addFormulaToken(op, 'operator')} 
              className="h-7 px-2.5 rounded-md bg-muted/30 border-muted hover:bg-muted/60 hover:text-primary transition-colors"
            >
              {op === '*' ? '×' : op === '/' ? '÷' : op}
            </Button>
          ))}
        </div>
        
        {formulaTokens.length > 0 && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleClearFormula}
            className="h-7 mt-1 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            Clear Formula
          </Button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mt-1">
        Type variable names, numbers, or use the operator buttons.
      </div>
    </>
  );
}
