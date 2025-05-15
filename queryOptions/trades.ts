import { getAllTrades } from "@/api/trades/get-all-trades";
import { queryOptions } from "@tanstack/react-query";

export function getTrades(page = 1, pageSize = 10, searchQuery?: string) {
  return queryOptions({
    queryKey: ["trades", page, pageSize, searchQuery],
    queryFn: () => getAllTrades(page, pageSize, searchQuery),
  });
}
