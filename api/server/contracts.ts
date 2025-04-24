// "use server";

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function postContract(contract: any) {
  console.log(TOKEN)
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
