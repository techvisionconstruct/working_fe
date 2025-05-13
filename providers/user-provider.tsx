"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { ProfileDetailResponse } from "@/types/user-profile/dto";

/**
 * User context type definition
 */
interface UserContextType {
  user: ProfileDetailResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

/**
 * Create the user context with default values
 */
export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  refetchUser: async () => {},
});

/**
 * Helper function to get the auth token from cookies
 */
const getAuthToken = (): string | undefined => Cookies.get("auth-token");

/**
 * Function to fetch the user data from the API
 */
const fetchUserData = async (): Promise<ProfileDetailResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch user data
  const userResponse = await fetch(`${API_URL}/v1/user-profiles/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!userResponse.ok) {
    if (userResponse.status === 401 || userResponse.status === 403) {
      // Clear auth token and throw specific error
      Cookies.remove("auth-token", { path: "/", sameSite: "Lax", secure: true });
      throw new Error("Unauthorized access");
    }

    const errorData = await userResponse.json();
    throw new Error(errorData.detail || "Failed to fetch user data");
  }

  // Return the user data
  return userResponse.json();
};

/**
 * User Provider component
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean>(!!getAuthToken());

  // Check for token changes
  useEffect(() => {
    const checkAuthToken = () => {
      const currentHasToken = !!getAuthToken();
      if (currentHasToken !== hasToken) {
        setHasToken(currentHasToken);
        if (currentHasToken) {
          queryClient.invalidateQueries({ queryKey: ["userData"] });
        }
      }
    };
    checkAuthToken();
    
    // Set interval for checking (every 10 seconds is more efficient than every second)
    const interval = setInterval(checkAuthToken, 10000);
    return () => clearInterval(interval);
  }, [hasToken, queryClient]);

  // Use React Query to fetch user data
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    enabled: hasToken,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message === "Unauthorized access") {
        return false;
      }
      return failureCount < 2; // Reduce retry count for better UX
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle unauthorized errors by redirecting
  useEffect(() => {
    if (error instanceof Error && error.message === "Unauthorized access") {
      window.location.href = "/signin";
    }
  }, [error]);

  // Refetch user data function for context consumers
  const refetchUser = async () => {
    await refetch();
  };

  // Create the context value
  const contextValue: UserContextType = {
    user: userData || null,
    isLoading,
    error: error instanceof Error ? error : null,
    refetchUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

/**
 * Hook to use the user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
