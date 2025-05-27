'use client';

import { SignUpRequest, SignUpResponse } from '@/types/auth/dto';

export const signUp = async (userData: SignUpRequest): Promise<SignUpResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const response = await fetch(`${apiUrl}/v1/auth/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign up failed");
    }
    
    const data: SignUpResponse = await response.json();
    return data;
    
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unknown error occurred during sign up";
    
    throw new Error(errorMessage);
  }
};
