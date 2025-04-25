import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function postProposal(proposal: any) {
  console.log(TOKEN)
  try {
    const response = await fetch(`${API_URL}/api/projects/project/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(proposal),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create proposal");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
}
