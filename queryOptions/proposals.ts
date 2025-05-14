import { getAllProposals } from "@/api/proposals/get-all-proposals";
import { getProposalById } from "@/api/proposals/get-proposal-by-id";
import { queryOptions } from "@tanstack/react-query";

export function getProposals() {
  return queryOptions({
    queryKey: ["proposal"],
    queryFn: () => getAllProposals(),
  });
}

export function getProposal(id: string) {
  return queryOptions({
    queryKey: ["proposal", id],
    queryFn: () => getProposalById(String(id)),
    select: (data) => data.data,
  });
}
