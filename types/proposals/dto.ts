import { ContractResponse } from '../contracts/dto';
import { PaginationLinks, PaginationMeta } from '../pagination/dto';
import { TemplateResponse } from '../templates/dto';
import { UserResponse } from '../user/dto';

export interface ProposalResponse {
  id: string;
  name: string;
  description?: string;
  status: string;
  owner?: string;
  image?: string;
  template?: TemplateResponse;
  contract?: ContractResponse;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  valid_until?: Date;
  total_material_cost?: number;
  total_labor_cost?: number;
  total_cost?: number;
  total_with_markup?: number;
  created_at: Date;
  updated_at: Date;
  created_by?: UserResponse;
  updated_by?: UserResponse;
}

export interface ProposalListResponse {
  success: boolean;
  message: string;
  data: ProposalResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ProposalDetailResponse {
  success: boolean;
  message: string;
  data?: ProposalResponse;
}

export interface ProposalCreateRequest {
  name: string;
  description?: string;
  status?: string;
  template?: string;
  image?: string;
  owner?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  valid_until?: Date;
  is_public?: boolean;
}

export interface ProposalUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  valid_until?: Date;
  is_public?: boolean;
  total_material_cost?: number;
  total_label_cost?: number;
  total_cost?: number;
  total_with_markup_cost?: number;
  image?: string;
}
