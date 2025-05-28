

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get("auth-token");

export const getProposalById = async (id: string) => {
    const token = getAuthToken();
  
    const res = await fetch(`${API_URL}/v1/proposals/detail/${id}/client`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();
  };
