import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get('auth-token');

export const getTemplates = async () => {
  const token = getAuthToken();
  
  const res = await fetch(`${API_URL}/api/templates/templates`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

export const getTemplateById = async (id: number) => {
  const token = getAuthToken();
  
  const res = await fetch(`${API_URL}/api/templates/templates/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}