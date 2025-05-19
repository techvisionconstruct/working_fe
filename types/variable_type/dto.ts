import { CreatedByInfo } from "../created_by_info/dto";
import { PaginationLinks, PaginationMeta } from "../pagination/dto";

export interface VariableTypeResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit?: string;
  is_built_in: boolean;
  created_at: string;
  updated_at: string;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
}

export interface VariableTypeListResponse {
  success: boolean;
  message: string;
  data: VariableTypeResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface VariableTypeDetailResponse {
  success: boolean;
  message: string;
  data?: VariableTypeResponse;
}

export interface VariableTypeCreateRequest {
  name: string;
  description?: string;
  category: string;
  unit?: string;
  is_built_in?: boolean;
}

export interface VariableTypeUpdateRequest {
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  is_built_in?: boolean;
}
