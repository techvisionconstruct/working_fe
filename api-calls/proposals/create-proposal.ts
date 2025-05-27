

import { ProposalCreateRequest } from "@/types/proposals/dto";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function createProposal(proposal: ProposalCreateRequest) {
  try {
    const payload: Record<string, any> = {};

    if (proposal.name) payload.name = proposal.name;
    if (proposal.description) payload.description = proposal.description;
    if (proposal.status) payload.status = proposal.status;
    if (proposal.template) payload.template = proposal.template;
    if (proposal.image) payload.image = proposal.image;
    if (proposal.owner) payload.owner = proposal.owner;
    if (proposal.client_name) payload.client_name = proposal.client_name;
    if (proposal.client_email) payload.client_email = proposal.client_email;
    if (proposal.client_phone) payload.client_phone = proposal.client_phone;
    if (proposal.client_address)
      payload.client_address = proposal.client_address;
    if (proposal.valid_until) payload.valid_until = proposal.valid_until;

    const response = await fetch(`${API_URL}/v1/proposals/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
