import { useMutation } from "@tanstack/react-query";
import { updateTrade } from "@/api-calls/trades/update-trade";
import { toast } from "sonner";

interface TradeUpdateData {
  elements: string[];
}

interface TradeUpdateVariables {
  tradeId: string;
  data: TradeUpdateData;
}

export const useTradeUpdateMutation = () => {
  return useMutation({
    mutationFn: ({ tradeId, data }: TradeUpdateVariables) => 
      updateTrade(tradeId, data),
    onSuccess: () => {
      // No need to update UI state again since we already did it in createElementMutation
    },
    onError: (error) => {
      toast.error("Failed to connect element to trade", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};
