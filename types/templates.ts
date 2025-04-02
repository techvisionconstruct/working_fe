import { SortOption } from "./sort";

export interface TemplateGridProps {
  sortOption: SortOption;
  searchQuery?: string;
}

export interface TemplatePageProps {
  params: {
    id: string;
  };
}
