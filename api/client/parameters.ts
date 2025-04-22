import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getParameters = async () => {
  const res = await fetch(`${API_URL}/api/parameters/parameters`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getParameterById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/parameters/parameters/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}