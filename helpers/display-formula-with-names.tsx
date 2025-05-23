export interface FormulaVariable {
  id: string;
  name?: string;
  value?: number;
  type?: string;
}

export const displayFormulaWithNames = (
  formula: string | undefined,
  formulaVariables?: FormulaVariable[]
): string => {
  if (!formula) return "";
  
  let displayFormula = formula;
  
  // Only use the formulaVariables if provided - this is the only source of truth
  if (formulaVariables && formulaVariables.length > 0) {
    formulaVariables.forEach(varInfo => {
      if (varInfo.name) {
        // If the variable already has a name in the formula variables, use it directly
        const idPattern = new RegExp(`\\{${varInfo.id}\\}`, "g");
        displayFormula = displayFormula.replace(idPattern, `{${varInfo.name}}`);
      } else {
        // If the variable doesn't have a name, just use the ID as a fallback
        const idPattern = new RegExp(`\\{${varInfo.id}\\}`, "g");
        displayFormula = displayFormula.replace(idPattern, `{${varInfo.id}}`);
      }
    });
    
    return displayFormula;
  }
  
  // If no formulaVariables provided, return the original formula
  // We're not looking up in variables or products anymore as requested
  return formula;
};

/**
 * Highlights variables and products in a formula with HTML spans and color classes
 * 
 * @param formulaWithNames - The formula string with names instead of IDs
 * @returns HTML string with colored spans for variables and products
 */
export const colorizeFormula = (formulaWithNames: string): string => {
  // Replace variables and products in curly braces with colored spans
  return formulaWithNames.replace(/\{([^{}]+)\}/g, (match, name) => {
    // You can customize these classes based on your UI framework
    return `<span class="text-blue-600">{${name}}</span>`;
  });
};

export default displayFormulaWithNames;
