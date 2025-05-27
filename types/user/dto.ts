export interface UserResponse {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  subscription?: any;
}

export interface ErrorItem {
  field: string;
  message: string;
}
