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
export interface ProposalData {
  id: number
  title: string
  description: string
  categories: Category[]
  variables: Variable[]
  created_at: string
  imageUrl: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  useGlobalMarkup?: boolean
  globalMarkupPercentage?: number
}
export interface Variable {
  id: number
  name: string
  type: string
  value?: string
}
export interface Element {
  id: number
  name: string
  material_cost: string
  labor_cost: string
  markup_percentage: number
  calculatedMaterialCost?: number
  calculatedLaborCost?: number
}
export interface Category {
  id: number
  name: string
  elements: ProposalElement[];
};

export type ProposalElement = {
  id: number;
  name: string;
  material_cost: string;
  labor_cost: string;
  markup_percentage: number;
};
export interface Template extends Omit<ProposalData, "variables"> {
  variables: Omit<Variable, "value">[]
}