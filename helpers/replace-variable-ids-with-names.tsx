import { VariableResponse } from "@/types/variables/dto";

export const replaceVariableIdsWithNames = (
  formula: string,
  variableList: VariableResponse[],
  formulaVars: Record<string, any>[]
): string => {
  if (!formula || !formulaVars || !variableList) return formula;

  let displayFormula = formula;

  formulaVars.forEach((variable) => {
    const variableName =
      variableList.find((v) => v.id === variable.id)?.name ||
      variable.name ||
      variable.id;

    const idPattern = new RegExp(`\\{${variable.id}\\}`, "g");
    displayFormula = displayFormula.replace(idPattern, `{${variableName}}`);
  });

  return displayFormula;
};