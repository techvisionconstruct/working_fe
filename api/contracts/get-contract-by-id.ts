import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get('auth-token');

export const getContractById = async (id: string) => {
  const token = getAuthToken();
  
  const res = await fetch(`${API_URL}/v1/contracts/detail/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};
