import { SortOption } from "./sort";

export interface TemplateProps {
  sortOption: SortOption;
  searchQuery?: string;
}

export interface TemplatePageProps {
  params: {
    id: number;
  };
}
