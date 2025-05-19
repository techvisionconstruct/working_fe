import { PaginationLinks, PaginationMeta } from "../pagination/dto";
import { IndustryResponse } from "../industry/dto";
import { CreatedByInfo } from "../created_by_info/dto";

export interface ProfileResponse {
  id: string;
  avatar_url?: string;
  bio?: string;

  // Contact Information
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;

  // Professional Information
  company_name?: string;
  job_title?: string;
  industry?: IndustryResponse;
  years_of_experience?: number;

  // Audit fields
  created_by: CreatedByInfo;
  updated_by: CreatedByInfo;
  created_at: string; // Date as ISO string
  updated_at: string; // Date as ISO string
}

export interface ProfileListResponse {
  success: boolean;
  message: string;
  data: ProfileResponse[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface ProfileDetailResponse {
  success: boolean;
  message: string;
  data?: ProfileResponse;
}

export interface ProfileCreateRequest {
  avatar_url?: string;
  bio?: string;

  // Contact Information
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;

  // Professional Information
  company_name?: string;
  job_title?: string;
  industry_id?: string;
  years_of_experience?: number;
}

export interface ProfileUpdateRequest {
  avatar_url?: string;
  bio?: string;

  // Contact Information
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;

  // Professional Information
  company_name?: string;
  job_title?: string;
  industry_id?: string;
  years_of_experience?: number;
}
