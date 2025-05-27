import { getAllVariableTypes } from "@/api-calls/variable-types/get-all-variable-types";
import { queryOptions } from "@tanstack/react-query";

export function getVariablesTypes() {
  return queryOptions({
    queryKey: ["variable-types"],
    queryFn: () => getAllVariableTypes(),
  });
}
