import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { ElementResponse } from "../elements/dto";
import { CreatedByInfo } from "../created_by_info/dto";

export interface TradeResponse {
  id: string;
  name: string;
  description?: string;
  origin: string;
  elements?: ElementResponse[];
  created_at: string;
  updated_at: string;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
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
