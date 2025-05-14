import { VariableResponse } from "@/types/variables/dto";

export const replaceVariableNamesWithIds = (
  formula: string,
  variableList: VariableResponse[]
): string => {
  if (!formula || !variableList) return formula;

  let backendFormula = formula;
  const namePattern = /\{([^{}]+)\}/g;
  backendFormula = backendFormula.replace(namePattern, (match, variableName) => {
    const variable = variableList.find(v => v.name === variableName);
    return variable ? `{${variable.id}}` : match;
  });

  return backendFormula;
};