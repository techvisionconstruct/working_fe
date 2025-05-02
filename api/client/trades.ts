import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getTrades = async () => {
  const res = await fetch(`${API_URL}/v1/trades/list/`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getTradeById = async (id: string) => {
  const res = await fetch(`${API_URL}/v1/trades/detail/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}