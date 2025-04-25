import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function postContract(contract: any) {
  try {
    const response = await fetch(`${API_URL}/api/contracts/contracts/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(contract),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
}

export async function updateContract(contractId: string, contract: any) {
  try {
    const response = await fetch(`${API_URL}/api/contracts/contracts/${contractId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(contract),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
}

export async function clientSignature(contractId: string, contract: any) {
  try {
    const response = await fetch(`${API_URL}/api/contracts/contracts/${contractId}/update-signature`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(contract),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
}

export async function sendContract(contractId: string) {
  try {
    const response = await fetch(`${API_URL}/api/contracts/contract/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ contract_id: contractId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending contract:", error);
    throw error;
  }
}

