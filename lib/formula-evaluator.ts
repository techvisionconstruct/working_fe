/**
 * Evaluates a formula string by substituting parameter values and calculating the result.
 * Example: evaluateFormula("length * width * 10", [{name: "length", value: 5}, {name: "width", value: 3}]) = 150
 */
export function evaluateFormula(
  formula: string | undefined | null, 
  parameters: Array<{ name: string; value: string | number }>
): number {
  // Return 0 if formula is empty/undefined
  if (!formula) return 0;
  
  try {
    // Create a copy of the formula to work with
    let evaluableFormula = formula;
    
    // Replace all parameter references with their values
    parameters.forEach(param => {
      // Replace all instances of parameter name with its value
      // Using regex with word boundaries to ensure we match whole parameter names
      const paramRegex = new RegExp(`\\b${param.name}\\b`, 'g');
      evaluableFormula = evaluableFormula.replace(paramRegex, param.value.toString());
    });
    
    // Safety check: make sure we've replaced all parameters
    const remainingParamMatch = evaluableFormula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
    if (remainingParamMatch) {
      console.warn(`Formula contains undefined parameters: ${remainingParamMatch.join(', ')}`);
      return 0;
    }
    
    // Use Function constructor to safely evaluate the mathematical expression
    // This is a controlled environment since we've already sanitized the formula
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${evaluableFormula}`)();
    
    // Make sure the result is a valid number
    return isNaN(result) ? 0 : Number(result);
  } catch (error) {
    console.error("Error evaluating formula:", error);
    return 0;
  }
}
