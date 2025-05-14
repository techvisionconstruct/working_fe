import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function updateContract(contractId: string, contract: any) {
  try {
    const response = await fetch(
      `${API_URL}/api/contracts/contracts/${contractId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(contract),
      }
    );

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
    const token = Cookies.get("auth-token"); // Always get the latest token
    console.log("Token:", token);
    const response = await fetch(
      `${API_URL}/v1/contracts/sign/${contractId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contract),
      }
    );

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
