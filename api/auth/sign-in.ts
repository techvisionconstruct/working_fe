'use client';

import { SignInRequest, SignInResponse } from '@/types/auth/dto';
import Cookie from 'js-cookie';

export const signIn = async (credentials: SignInRequest): Promise<SignInResponse> => {
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
  
    if (data.success && data.tokens) {
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
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    
    window.dispatchEvent(new Event('auth-changed'));
    
    return data;
  };