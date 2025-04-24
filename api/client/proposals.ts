import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get("auth-token");

export const getProposals = async () => {
  const token = getAuthToken();

  const res = await fetch(`${API_URL}/api/projects/project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getProposalById = async (id: number) => {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/api/projects/project/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
