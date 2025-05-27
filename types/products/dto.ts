import { CreatedByInfo } from '../created_by_info/dto';
import { PaginationLinks, PaginationMeta } from '../pagination/dto';
import { ErrorItem } from '../user/dto';

export interface ProductResponse {
  id: string;
  search_term: string;
  source_platform: string;
  title: string;
  item_id?: string;
  link?: string;
  primary_image: string;
  rating?: number;
  ratings_total?: number;
  price?: number;
  currency?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: CreatedByInfo;
  updated_by?: CreatedByInfo;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  data: ProductResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  data?: ProductResponse;
}

export interface ProductSearchRequest {
  search_term: string;
  sort_by?: string; // default: "price_low_to_high"
}

export interface HomeDepotProductSearchResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  data: ProductResponse[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
