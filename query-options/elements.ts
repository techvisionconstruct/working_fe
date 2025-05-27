import { getAllElements } from "@/api-calls/elements/get-all-elements";
import { queryOptions } from "@tanstack/react-query";

export function getElements(page = 1, pageSize = 10, searchQuery?: string) {
  return queryOptions({
    queryKey: ["elements", page, pageSize, searchQuery],
    queryFn: () => getAllElements(page, pageSize, searchQuery),
  });
}
