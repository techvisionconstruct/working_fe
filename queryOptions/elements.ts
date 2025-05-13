import { getAllElements } from "@/api/elements/get-all-elements";
import { queryOptions } from "@tanstack/react-query";

export function getElements() {
  return queryOptions({
    queryKey: ["elements"],
    queryFn: () => getAllElements(),
  });
}
