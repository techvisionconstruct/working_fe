import { useState, useCallback } from "react";
import { VariableResponse } from "@/types/variables/dto";

// FormulaToken interface for formula builder
export interface FormulaToken {
  id: number;
  text: string;
  type: 'variable' | 'operator' | 'number' | 'function';
}

export function useFormula() {
  const [materialFormulaTokens, setMaterialFormulaTokens] = useState<FormulaToken[]>([]);
  const [laborFormulaTokens, setLaborFormulaTokens] = useState<FormulaToken[]>([]);
  const [materialFormulaError, setMaterialFormulaError] = useState<string | null>(null);
  const [laborFormulaError, setLaborFormulaError] = useState<string | null>(null);
  
  // Validate formula tokens
  const validateFormulaTokens = useCallback((tokens: FormulaToken[]): {
    errorMessage: string; isValid: boolean; error: string | null 
} => {
    if (tokens.length === 0) {
      return { isValid: true, error: null };
    }

    // Basic validation logic
    let parenthesesCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].text === "(") parenthesesCount++;
      if (tokens[i].text === ")") parenthesesCount--;
      if (parenthesesCount < 0) {
        return { isValid: false, error: "Unbalanced parentheses" };
      }
    }
    
    if (parenthesesCount > 0) {
      return { isValid: false, error: "Missing closing parenthesis" };
    }

    return { isValid: true, error: null };
  }, []);
  
  // Convert formula string to tokens
  const parseFormulaToTokens = useCallback((formula: string): FormulaToken[] => {
    if (!formula) return [];
    
    const tokens: FormulaToken[] = [];
    let currentIndex = 0;
    const variableRegex = /\{([^}]+)\}/g;
    let match;
    
    while ((match = variableRegex.exec(formula)) !== null) {
      if (match.index > currentIndex) {
        const priorText = formula.substring(currentIndex, match.index);
        const parts = priorText.trim().split(/\s+/);
        for (const part of parts) {
          if (!part) continue;
          
          if (['+', '-', '*', '/', '(', ')', '^'].includes(part)) {
            tokens.push({
              id: Date.now() + tokens.length,
              text: part,
              type: 'operator'
            });
          } else if (!isNaN(Number(part))) {
            tokens.push({
              id: Date.now() + tokens.length,
              text: part,
              type: 'number'
            });
          } else {
            tokens.push({
              id: Date.now() + tokens.length,
              text: part,
              type: 'operator'
            });
          }
        }
      }
      
      tokens.push({
        id: Date.now() + tokens.length,
        text: match[1],
        type: 'variable'
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < formula.length) {
      const remainingText = formula.substring(currentIndex);
      const parts = remainingText.trim().split(/\s+/);
      for (const part of parts) {
        if (!part) continue;
        
        if (['+', '-', '*', '/', '(', ')', '^'].includes(part)) {
          tokens.push({
            id: Date.now() + tokens.length,
            text: part,
            type: 'operator'
          });
        } else if (!isNaN(Number(part))) {
          tokens.push({
              id: Date.now() + tokens.length,
              text: part,
              type: 'number'
          });
        } else {
          tokens.push({
              id: Date.now() + tokens.length,
              text: part,
              type: 'operator'
          });
        }
      }
    }
    
    return tokens;
  }, []);

  // Convert tokens to formula string
  const tokensToFormulaString = useCallback((tokens: FormulaToken[]): string => {
    return tokens.map(token => {
      if (token.type === 'variable') {
        return `{${token.text}}`;
      }
      return token.text;
    }).join(' ');
  }, []);

  // Replace variable names with IDs in formula
  const replaceVariableNamesWithIds = useCallback((
    formula: string,
    variableList: VariableResponse[]
  ): string => {
    if (!formula || !variableList) return formula;

    let backendFormula = formula;
    const namePattern = /\{([^{}]+)\}/g;
    backendFormula = backendFormula.replace(namePattern, (match, variableName) => {
      const variable = variableList.find((v) => v.name === variableName);
      return variable ? `{${variable.id}}` : match;
    });

    return backendFormula;
  }, []);

  // Replace variable IDs with names in formula
  const replaceVariableIdsWithNames = useCallback((
    formula: string,
    variableList: VariableResponse[],
    formulaVars: Record<string, any>[] = []
  ): string => {
    if (!formula || !variableList) return formula;

    let displayFormula = formula;

    formulaVars.forEach((variable) => {
      const variableName =
        variableList.find((v) => v.id === variable.id)?.name ||
        variable.name ||
        variable.id;

      // Replace all occurrences of {id} with {name}
      const idPattern = new RegExp(`\\{${variable.id}\\}`, "g");
      displayFormula = displayFormula.replace(idPattern, `{${variableName}}`);
    });

    // Also try direct replacement if formula vars doesn't have all we need
    displayFormula = displayFormula.replace(/\{([a-zA-Z0-9_-]+)\}/g, (match, id) => {
      const variable = variableList.find((v) => v.id === id);
      return variable ? `{${variable.name}}` : match;
    });

    return displayFormula;
  }, []);

  // Check if a variable is already in the formula
  const isVariableInFormula = useCallback((
    variableName: string, 
    tokens: FormulaToken[]
  ): boolean => {
    return tokens.some(token => 
      token.type === 'variable' && 
      token.text.toLowerCase() === variableName.toLowerCase()
    );
  }, []);

  // Check if input is a number (for formula validation)
  const isNumeric = useCallback((text: string): boolean => {
    return !isNaN(parseFloat(text)) && isFinite(Number(text));
  }, []);
  
  // Check if the given text should be treated as a variable name
  const shouldBeVariable = useCallback((text: string): boolean => {
    // Not a variable if it's a number or an operator
    if (isNumeric(text) || ['+', '-', '*', '/', '(', ')', '^'].includes(text)) {
      return false;
    }
    return true;
  }, [isNumeric]);

  return {
    materialFormulaTokens,
    setMaterialFormulaTokens,
    laborFormulaTokens,
    setLaborFormulaTokens,
    materialFormulaError,
    setMaterialFormulaError,
    laborFormulaError,
    setLaborFormulaError,
    validateFormulaTokens,
    parseFormulaToTokens,
    tokensToFormulaString,
    replaceVariableNamesWithIds,
    replaceVariableIdsWithNames,
    isVariableInFormula,
    isNumeric,
    shouldBeVariable
  };
}
