import { getAllVariables } from "@/api/variables/get-all-variables";
import { createVariable } from "@/api/variables/create-variable";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { VariableCreateRequest } from "@/types/variables/dto";

export function getVariables(page = 1, pageSize = 10, searchQuery?: string) {
  return queryOptions({
    queryKey: ["variables", page, pageSize, searchQuery],
    queryFn: () => getAllVariables(page, pageSize, searchQuery),
  });
}

export function useCreateVariableMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: VariableCreateRequest) => createVariable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variables'] });
    },
  });
}
