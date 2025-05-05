import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { ProposalResponse } from "../proposals/dto";
import { UserResponse } from "../user/dto";

export interface ContractResponse {
  id: string;
  name: string;
  description?: string;
  status: string;
  terms?: string;
  
  // Signature fields
  client_initials?: string;
  client_signature?: string;
  client_signed_at?: string;
  
  contractor_initials?: string;
  contractor_signature?: string;
  contractor_signed_at?: string;
  
  // Relationships
  proposal?: ProposalResponse;
  owner?: UserResponse;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: UserResponse;
  updated_by?: UserResponse;
}

export interface ContractListResponse {
  success: boolean;
  message: string;
  data: ContractResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ContractDetailResponse {
  success: boolean;
  message: string;
  data?: ContractResponse;
}

export interface ContractCreateRequest {
  name: string;
  description?: string;
  status?: string;
  terms?: string;
  proposal?: string;
}

export interface ContractUpdateRequest {
  name?: string;
  description?: string;
  contractor_initials?: string;
  contractor_signature?: string;
  status?: string;
  terms?: string;
}

export interface ContractSignRequest {
  client_initials?: string;
  client_signature?: string;
}
