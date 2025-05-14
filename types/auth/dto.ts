import { UserResponse } from '../user/dto';

export interface ErrorItem {
  field: string;
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username?: string | null;
}

export interface TokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  user: UserResponse | null;
  tokens: TokenResponse | null;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user: UserResponse;
}

export interface SignOutResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp_code: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  user: UserResponse | null;
  tokens: TokenResponse | null;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  errors: ErrorItem[];
  tokens: TokenResponse | null;
}
