import { CreatedByInfo } from "../created_by_info/dto";
import { PaginationLinks, PaginationMeta } from "../pagination/dto";

export interface ElementResponse {
  id: string;
  name: string;
  description?: string;
  origin: string;
  material_cost_formula?: string;
  material_formula_variables?: Record<string, any>[];
  labor_cost_formula?: string;
  labor_formula_variables?: Record<string, any>[];
  material_cost?: number;
  labor_cost?: number;
  markup?: number;
  created_at: string;
  updated_at: string;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
}

export interface ElementListResponse {
  success: boolean;
  message: string;
  data: ElementResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ElementDetailResponse {
  success: boolean;
  message: string;
  data?: ElementResponse;
}

export interface ElementCreateRequest {
  name: string;
  description?: string;
  material_cost_formula?: string;
  labor_cost_formula?: string;
  markup?: number;
}

export interface ElementUpdateRequest {
  name?: string;
  description?: string;
  material_cost_formula?: string;
  labor_cost_formula?: string;
  markup?: number;
}
