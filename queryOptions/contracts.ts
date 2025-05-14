import { getAllContracts } from "@/api/contracts/get-all-contracts";
import { getContractById } from "@/api/contracts/get-contract-by-id";
import { queryOptions } from "@tanstack/react-query";

export function getContracts() {
  return queryOptions({
    queryKey: ["contract"],
    queryFn: () => getAllContracts(),
  });
}

export function getContract(id: string) {
  return queryOptions({
    queryKey: ["contract", id],
    queryFn: () => getContractById(String(id)),
    select: (data) => data.data,
  });
}
