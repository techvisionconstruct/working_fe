import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { UserResponse } from "../user/dto";
import { TradeResponse } from "../trades/dto";
import { VariableResponse } from "../variables/dto";

export interface TemplateResponse {
  id: string;
  name: string;
  description?: string;
  status: string;
  origin: string;
  is_public: boolean;
  owner?: string;
  created_at: string;
  updated_at: string;
  created_by?: UserResponse;
  updated_by?: UserResponse;
  trades?: TradeResponse[];
  variables?: VariableResponse[];
}

export interface TemplateListResponse {
  success: boolean;
  message: string;
  data: TemplateResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface TemplateDetailResponse {
  success: boolean;
  message: string;
  data?: TemplateResponse;
}

export interface TemplateCreateRequest {
  name: string;
  description?: string;
  status?: string;
  origin?: string;
  source_id?: string;
  trades?: string[];
  variables?: string[];
  is_public?: boolean;
}

export interface TemplateUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  origin?: string;
  is_public?: boolean;
  source_id?: string;
  trades?: string[];
  variables?: string[];
}

export interface TemplateViewProps {
  templates: TemplateResponse[];
}