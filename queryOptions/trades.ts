import { getAllTrades } from "@/api/trades/get-all-trades";
import { queryOptions } from "@tanstack/react-query";

export function getTrades() {
  return queryOptions({
    queryKey: ["trades"],
    queryFn: () => getAllTrades(),
  });
}
