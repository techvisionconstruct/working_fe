import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { UserResponse } from "../user/dto";
import { VariableTypeResponse } from "../variable_type/dto";

export interface VariableResponse {
  id: string;
  name: string;
  description?: string;
  value?: number;
  is_global: boolean;
  variable_type?: VariableTypeResponse;
  created_at: string;
  updated_at: string;
  created_by?: UserResponse;
  updated_by?: UserResponse;
}

export interface VariableListResponse {
  success: boolean;
  message: string;
  data: VariableResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface VariableDetailResponse {
  success: boolean;
  message: string;
  data?: VariableResponse;
}

export interface VariableCreateRequest {
  name: string;
  description?: string;
  value?: number;
  is_global?: boolean;
  variable_type?: string;
}

export interface VariableUpdateRequest {
  name?: string;
  description?: string;
  value?: number;
  is_global?: boolean;
  variable_type?: string;
}
