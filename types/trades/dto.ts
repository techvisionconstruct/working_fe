import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { UserResponse } from "../user/dto";
import { ElementResponse } from "../elements/dto";

export interface TradeResponse {
  id: string;
  name: string;
  description?: string;
  elements?: ElementResponse[];
  created_at: string;
  updated_at: string;
  created_by?: UserResponse;
  updated_by?: UserResponse;
}

export interface TradeListResponse {
  success: boolean;
  message: string;
  data: TradeResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface TradeDetailResponse {
  success: boolean;
  message: string;
  data?: TradeResponse;
}

export interface TradeCreateRequest {
  name: string;
  description?: string;
  elements?: string[];
}

export interface TradeUpdateRequest {
  name?: string;
  description?: string;
  elements?: string[];
}
