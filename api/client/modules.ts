import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getModules = async () => {
  const res = await fetch(`${API_URL}/api/modules/modules`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getModuleById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/modules/modules/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}