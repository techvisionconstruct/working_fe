import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { UserResponse } from "../user/dto";

export interface VariableTypeResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit?: string;
  is_built_in: boolean;
  created_at: string;
  updated_at: string;
  created_by?: UserResponse;
  updated_by?: UserResponse;
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
