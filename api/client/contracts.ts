import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get("auth-token");

export const getContracts = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/api/contracts/contract/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contracts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};
