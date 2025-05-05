import { ContractUpdateRequest } from "@/types/contracts/dto";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get('auth-token');

export const updateContract = async (id: string, contract: Partial<ContractUpdateRequest>) => {
  try {
    const token = getAuthToken();
    const payload: Record<string, any> = {};
    
    if (contract.name) payload.name = contract.name;
    if (contract.description) payload.description = contract.description;
    if (contract.status) payload.status = contract.status;
    if (contract.terms) payload.terms = contract.terms;
    if (contract.contractor_initials) payload.contractor_initials = contract.contractor_initials;
    
    const response = await fetch(`${API_URL}/v1/contracts/update/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update contract');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
};
