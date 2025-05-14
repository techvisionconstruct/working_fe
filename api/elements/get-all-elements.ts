import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get("auth-token");

export const getAllElements = async () => {
  const TOKEN = getAuthToken();
  const res = await fetch(`${API_URL}/v1/elements/list/`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.json();
};