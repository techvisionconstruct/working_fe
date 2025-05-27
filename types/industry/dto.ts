import { CreatedByInfo } from "../created_by_info/dto";
import { PaginationLinks, PaginationMeta } from "../pagination/dto";

// Interface for user information who created/updated records

export interface IndustryCreateRequest {
  name: string;
  description?: string;
}

export interface IndustryUpdateRequest {
  name?: string;
  description?: string;
}

export interface IndustryResponse {
  id: string;
  name: string;
  description?: string;

  // Audit fields
  created_at: string; // Date as ISO string
  updated_at: string; // Date as ISO string
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
}

export interface IndustryListResponse {
  success: boolean;
  message: string;
  data: IndustryResponse[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface IndustryDetailResponse {
  success: boolean;
  message: string;
  data?: IndustryResponse;
}
