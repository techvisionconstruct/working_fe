'use client';

import { VerifyOtpRequest, VerifyOtpResponse } from '@/types/auth/dto';
import Cookie from 'js-cookie';

export const verifyOtp = async (verificationData: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const response = await fetch(`${apiUrl}/v1/auth/verify-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "OTP verification failed");
    }
    
    const data: VerifyOtpResponse = await response.json();
    
    // If verification is successful and we have tokens, store them
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
      
      window.dispatchEvent(new Event('auth-changed'));
    }
    
    return data;
    
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unknown error occurred during OTP verification";
    
    throw new Error(errorMessage);
  }
};
