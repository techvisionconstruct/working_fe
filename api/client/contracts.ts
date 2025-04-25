import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getContracts = async () => {
  const res = await fetch(`${API_URL}/api/contracts/contract`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getContractById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/contracts/contract/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}