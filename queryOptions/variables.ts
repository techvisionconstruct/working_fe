import { getAllVariables } from "@/api/variables/get-all-variables";
import { queryOptions } from "@tanstack/react-query";

export function getVariables(page = 1, pageSize = 10, searchQuery?: string) {
  return queryOptions({
    queryKey: ["variables", page, pageSize, searchQuery],
    queryFn: () => getAllVariables(page, pageSize, searchQuery),
  });
}
