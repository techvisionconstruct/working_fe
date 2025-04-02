import { SortOption } from "./sort";

export interface ProposalsGridProps {
  sortOption: SortOption;
  searchQuery?: string;
}

export interface ProposalsPageProps {
  params: {
    id: number;
  };
}
