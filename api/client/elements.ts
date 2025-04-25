import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getElements = async (moduleName: string) => {
  const res = await fetch(`${API_URL}/api/elements/elements?modules=${moduleName}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.json();
};

export const getElementById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/elements/elements/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.json();
};
