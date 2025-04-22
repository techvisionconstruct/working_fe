import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getProposals = async () => {
  const res = await fetch(`${API_URL}/api/projects/project`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getProposalById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/projects/project/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}