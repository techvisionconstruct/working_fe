import Cookie from 'js-cookie';

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  subscription: any | null;
}

interface Tokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

interface SignInResponse {
  success: boolean;
  message: string;
  errors: string[];
  user: User;
  tokens: Tokens;
}

export const signIn = async (credentials: SignInCredentials): Promise<SignInResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const response = await fetch(`${apiUrl}/v1/auth/signin/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data: SignInResponse = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.errors?.length > 0 
      ? data.errors[0] 
      : data.message || "Authentication failed";
    throw new Error(errorMsg);
  }

  Cookie.set("auth-token", data.tokens.access_token, {
    expires: new Date(data.tokens.access_token_expires_at),
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  
  Cookie.set("refresh-token", data.tokens.refresh_token, {
    expires: new Date(data.tokens.refresh_token_expires_at),
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  
  localStorage.setItem('user', JSON.stringify(data.user));
  
  window.dispatchEvent(new Event('auth-changed'));
  
  return data;
};
