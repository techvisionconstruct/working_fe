import { CreatedByInfo } from "../created_by_info/dto";
import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { ProposalResponse } from "../proposals/dto";
import { UserResponse } from "../user/dto";

export interface ServiceAgreementResponse {
  id: string;
  title: string;
  content?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
}

export interface ContractResponse {
  id: string;
  name: string;
  description?: string;
  status: string;
  terms?: string;
  
  // Service Agreement fields
  service_agreement?: ServiceAgreementResponse;
  service_agreement_content?: string;
  
  // Signature fields
  client_initials?: string;
  client_signature?: string;
  client_signed_at?: string;
  
  contractor_initials?: string;
  contractor_signature?: string;
  contractor_signed_at?: string;
  
  // Relationships
  owner?: UserResponse;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
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
  contractor_initials?: string;
  contractor_signature?: string;
  terms?: string;
  service_agreement_id?: string;
  service_agreement_content?: string;
  proposal_id?: string;
}

export interface ContractUpdateRequest {
  name?: string;
  description?: string;
  contractor_initials?: string;
  contractor_signature?: string;
  status?: string;
  terms?: string;
  service_agreement_id?: string;
  service_agreement_content?: string;
}

export interface ContractSignRequest {
  client_initials?: string;
  client_signature?: string;
}

export interface ServiceAgreementListResponse {
  success: boolean;
  message: string;
  data: ServiceAgreementResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ServiceAgreementDetailResponse {
  success: boolean;
  message: string;
  data?: ServiceAgreementResponse;
}
