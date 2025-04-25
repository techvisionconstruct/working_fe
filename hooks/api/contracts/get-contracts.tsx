import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { Contract } from "@/types/contracts";

interface GetContractsResult {
  contracts: Contract[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const getContracts = (): GetContractsResult => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = Cookies.get('auth-token');
      const response = await fetch(`${apiUrl}/api/contracts/contract`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching contracts: ${response.statusText}`);
      }

      const data = await response.json();
      setContracts(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Failed to fetch contracts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    isLoading,
    error,
    refetch: fetchContracts,
  };
};