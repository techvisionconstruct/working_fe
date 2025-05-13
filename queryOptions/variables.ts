import { getAllVariables } from "@/api/variables/get-all-variables";
import { queryOptions } from "@tanstack/react-query";

export function getVariables() {
  return queryOptions({
    queryKey: ["variables"],
    queryFn: () => getAllVariables(),
  });
}
