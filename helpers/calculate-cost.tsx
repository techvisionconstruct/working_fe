import type { ProjectParameter } from "@/types/proposals";

export function calculateCost(formula: string, parameters: any[]): number {
  let calculationFormula = formula;

  // Sort variables by name length (longest first) to avoid partial replacements
  const sortedParameters = [...parameters].sort(
    (a, b) => (b.name?.length || 0) - (a.name?.length || 0)
  );

  sortedParameters.forEach((parameter) => {
    if (!parameter.name || !parameter.value) return;

    // Use word boundary regex to ensure we're replacing whole variable names
    const regex = new RegExp(`\\b${parameter.name}\\b`, "g");
    calculationFormula = calculationFormula.replace(regex, parameter.value);
  });

  // Handle basic operations
  try {
    // Clean up the formula - remove any remaining variable names
    calculationFormula = calculationFormula.replace(
      /[A-Za-z_][A-Za-z0-9_]*/g,
      "0"
    );

    // Use Function constructor to evaluate the formula
    // Note: In a production app, you'd want a more secure approach
    const result = new Function(`return ${calculationFormula}`)();
    return typeof result === "number" ? result : 0;
  } catch (error) {
    console.error(
      "Error calculating cost:",
      error,
      "Formula:",
      calculationFormula
    );
    return 0;
  }
}

export const checkFormulaErrors = (
  formula: string,
  parameters: any[]
): boolean => {
  const variablePattern = /\b[A-Za-z_][A-Za-z0-9_ ]*[A-Za-z0-9_]\b/g;
  const matches = formula.match(variablePattern) || [];
  const validVariableNames = parameters.map((v) => v.name);
  return matches.some((match) => !validVariableNames.includes(match));
};


